<?php

// Usage: php tools/generate_requests_resources.php
// Scans app/Models, excluding Transaction.php, and generates
// - app/Http/Resources/<Model>Resource.php
// - app/Http/Requests/<Model>StoreRequest.php
// - app/Http/Requests/<Model>UpdateRequest.php

$base = __DIR__ . '/../';
$modelsDir = $base . 'app/Models/';
$resourcesDir = $base . 'app/Http/Resources/';
$requestsDir = $base . 'app/Http/Requests/';

if (!is_dir($modelsDir)) {
    echo "Models directory not found: $modelsDir\n";
    exit(1);
}

if (!is_dir($resourcesDir)) mkdir($resourcesDir, 0755, true);
if (!is_dir($requestsDir)) mkdir($requestsDir, 0755, true);

$files = glob($modelsDir . '*.php');

// Scan migrations for enum definitions: build map table => field => values
$enumMap = [];
$migFiles = glob($base . 'database/migrations/*.php');
foreach ($migFiles as $mf) {
    $mcont = file_get_contents($mf);
    if (!$mcont) continue;
    // find table name in Schema::create('table', function
    if (preg_match("/Schema::create\(\s*'([a-z0-9_]+)'/i", $mcont, $mt)) {
        $tableName = $mt[1];
        // find enum(...) occurrences
        if (preg_match_all("/->enum\(\s*'([a-z0-9_]+)'\s*,\s*\[([^\]]*)\]/i", $mcont, $me, PREG_SET_ORDER)) {
            foreach ($me as $em) {
                $field = $em[1];
                $valsRaw = $em[2];
                // extract quoted values
                preg_match_all("/'([^']+)'/", $valsRaw, $vv);
                if (!empty($vv[1])) {
                    $enumMap[$tableName][$field] = $vv[1];
                }
            }
        }
    }
}

function camelToSnake($input) {
    $pattern = '/(?<!^)[A-Z]/';
    $res = preg_replace($pattern, '_$0', $input);
    return strtolower($res);
}

foreach ($files as $file) {
    $basename = basename($file);
    if ($basename === 'Transaction.php') continue; // skip transaction (already done)

    $contents = file_get_contents($file);
    if (!$contents) continue;

    // class name
    if (!preg_match('/class\s+(\w+)/', $contents, $m)) continue;
    $class = $m[1];

    // extract $fillable array content
    $fillable = [];
    if (preg_match('/protected\s+\$fillable\s*=\s*\[([^\]]*)\]/s', $contents, $m2)) {
        $raw = $m2[1];
        // match quoted strings
        preg_match_all('/' . "'([^']+)'.?" . '/s', $raw, $m3);
        if (!empty($m3[1])) $fillable = $m3[1];
    }

    // detect relationships: method names that reference belongsTo/hasMany/hasOne/belongsToMany
    $relations = [];
    if (preg_match_all('/function\s+(\w+)\s*\([^)]*\)\s*\{([^}]*)\}/s', $contents, $m4, PREG_SET_ORDER)) {
        foreach ($m4 as $fn) {
            $method = $fn[1];
            $body = $fn[2];
            if (stripos($body, 'belongsTo(') !== false || stripos($body, 'hasMany(') !== false || stripos($body, 'hasOne(') !== false || stripos($body, 'belongsToMany(') !== false) {
                $relations[] = $method;
            }
        }
    }

    $table = camelToSnake($class) . 's'; // naive pluralization
    $routeParam = camelToSnake($class);

    // Build Resource class
    $resourcePath = $resourcesDir . $class . 'Resource.php';
    $resourceContent = "<?php\n\nnamespace App\\Http\\Resources;\n\nuse Illuminate\\Http\\Resources\\Json\\JsonResource;\n\nclass {$class}Resource extends JsonResource\n{\n    public function toArray(\$request): array\n    {\n        return [\n            'id' => \$this->id,\n";
    // include other fillable fields (skip id if present)
    foreach ($fillable as $field) {
        if ($field === 'id') continue;
        // apply some heuristics for casting
        if (preg_match('/^is_/', $field) || preg_match('/^has_/', $field)) {
            $resourceContent .= "            '{$field}' => (bool) \$this->{$field},\n";
        } elseif (preg_match('/(_date|_at|date)$/', $field)) {
            $resourceContent .= "            '{$field}' => \$this->{$field}?->toISOString(),\n";
        } elseif (preg_match('/(amount|price|total|rate|exchange|tax|net|converted)/', $field)) {
            $resourceContent .= "            '{$field}' => (float) \$this->{$field},\n";
        } else {
            $resourceContent .= "            '{$field}' => \$this->{$field},\n";
        }
    }

    // relations
    foreach ($relations as $rel) {
        $camel = ucfirst($rel);
        $resourceContent .= "\n            '{$rel}' => new {$camel}Resource(\$this->whenLoaded('{$rel}')),\n";
    }

    // timestamps
    $resourceContent .= "\n            'created_at' => \$this->created_at?->toISOString(),\n            'updated_at' => \$this->updated_at?->toISOString(),\n        ];\n    }\n}\n";

    file_put_contents($resourcePath, $resourceContent);

    // Build StoreRequest
    $storePath = $requestsDir . $class . 'StoreRequest.php';
    $storeContent = "<?php\n\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\nuse Illuminate\\Validation\\Rule;\n\nclass {$class}StoreRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return true;\n    }\n\n    public function rules(): array\n    {\n        return [\n";

    foreach ($fillable as $field) {
        // choose rule based on name heuristics
        // check enums from migrations first
        if (isset($enumMap[$table]) && isset($enumMap[$table][$field])) {
            $vals = $enumMap[$table][$field];
            $valsList = "['" . implode("','", $vals) . "']";
            $storeContent .= "            '{$field}' => ['required', Rule::in({$valsList})],\n";
        } elseif (preg_match('/^(created_by|updated_by)$/', $field)) {
            // enforce that the provided user id exists
            $storeContent .= "            '{$field}' => ['nullable', 'exists:users,id'],\n";
        } elseif ($field === 'email' || preg_match('/_email$/', $field)) {
            $storeContent .= "            '{$field}' => ['required', 'email', 'max:255'],\n";
        } elseif ($field === 'website' || $field === 'url' || preg_match('/_url$/', $field)) {
            $storeContent .= "            '{$field}' => ['required', 'url', 'max:255'],\n";
        } elseif (preg_match('/_id$/', $field)) {
            $refTable = preg_replace('/_id$/', '', $field) . 's';
            $storeContent .= "            '{$field}' => ['nullable', 'exists:{$refTable},id'],\n";
        } elseif (preg_match('/^is_/', $field) || preg_match('/^has_/', $field)) {
            $storeContent .= "            '{$field}' => ['required', 'boolean'],\n";
        } elseif (preg_match('/(_date|_at|date)$/', $field)) {
            $storeContent .= "            '{$field}' => ['required', 'date'],\n";
        } elseif (preg_match('/(amount|price|total|rate|exchange|tax|net|converted)/', $field)) {
            $storeContent .= "            '{$field}' => ['required', 'numeric', 'min:0'],\n";
        } elseif (preg_match('/(status|type|category)/', $field)) {
            // if an enum exists this was handled above
            $storeContent .= "            '{$field}' => ['required', 'string', 'max:255'],\n";
        } else {
            $storeContent .= "            '{$field}' => ['required', 'string', 'max:255'],\n";
        }
    }

    $storeContent .= "        ];\n    }\n\n    public function messages(): array\n    {\n        return [\n            // Add custom messages here if needed\n        ];\n    }\n}\n";

    file_put_contents($storePath, $storeContent);

    // Build UpdateRequest
    $updatePath = $requestsDir . $class . 'UpdateRequest.php';
    $updateContent = "<?php\n\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\nuse Illuminate\\Validation\\Rule;\n\nclass {$class}UpdateRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return true;\n    }\n\n    public function rules(): array\n    {\n        return [\n";

    foreach ($fillable as $field) {
        // enums from migrations
        if (isset($enumMap[$table]) && isset($enumMap[$table][$field])) {
            $vals = $enumMap[$table][$field];
            $valsList = "['" . implode("','", $vals) . "']";
            $updateContent .= "            '{$field}' => ['sometimes', 'required', Rule::in({$valsList})],\n";
        } elseif ($field === 'email' || preg_match('/_email$/', $field)) {
            $updateContent .= "            '{$field}' => ['sometimes', 'required', 'email', 'max:255'],\n";
        } elseif ($field === 'website' || $field === 'url' || preg_match('/_url$/', $field)) {
            $updateContent .= "            '{$field}' => ['sometimes', 'required', 'url', 'max:255'],\n";
        } elseif (preg_match('/^(created_by|updated_by)$/', $field)) {
            $updateContent .= "            '{$field}' => ['nullable', 'exists:users,id'],\n";
        } elseif (preg_match('/_id$/', $field)) {
            $refTable = preg_replace('/_id$/', '', $field) . 's';
            $updateContent .= "            '{$field}' => ['nullable', 'exists:{$refTable},id'],\n";
        } elseif (preg_match('/^is_/', $field) || preg_match('/^has_/', $field)) {
            $updateContent .= "            '{$field}' => ['sometimes', 'required', 'boolean'],\n";
        } elseif (preg_match('/(_date|_at|date)$/', $field)) {
            $updateContent .= "            '{$field}' => ['sometimes', 'required', 'date'],\n";
        } elseif (preg_match('/(amount|price|total|rate|exchange|tax|net|converted)/', $field)) {
            $updateContent .= "            '{$field}' => ['sometimes', 'required', 'numeric', 'min:0'],\n";
        } elseif (preg_match('/(status|type|category)/', $field)) {
            $updateContent .= "            '{$field}' => ['sometimes', 'required', 'string', 'max:255'],\n";
        } else {
            // attempt to add unique rule for *_number or name-like fields
            if (preg_match('/(number|code|email)$/', $field)) {
                $updateContent .= "            '{$field}' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('{$table}')->ignore(
                    \$this->route('{$routeParam}')
                )],\n";
            } else {
                $updateContent .= "            '{$field}' => ['sometimes', 'required', 'string', 'max:255'],\n";
            }
        }
    }

    $updateContent .= "        ];\n    }\n\n    public function messages(): array\n    {\n        return [\n            // Add custom messages here if needed\n        ];\n    }\n}\n";

    file_put_contents($updatePath, $updateContent);

    echo "Generated for model: {$class}\n";
}

echo "Done.\n";
