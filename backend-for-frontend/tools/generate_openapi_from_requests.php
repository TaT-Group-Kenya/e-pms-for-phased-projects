<?php
// Usage: php tools/generate_openapi_from_requests.php
// Scans app/Models, app/Http/Requests and migrations to generate components.schemas
// and updates public/swagger-ui/openapi.json (overwrites components.schemas only).

$base = __DIR__ . '/../';
$modelsDir = $base . 'app/Models/';
$requestsDir = $base . 'app/Http/Requests/';
$openapiPath = $base . 'public/swagger-ui/openapi.json';
$migrationsDir = $base . 'database/migrations/';

if (!is_dir($modelsDir)) {
    echo "Models dir not found\n";
    exit(1);
}
if (!is_file($openapiPath)) {
    echo "OpenAPI file not found: $openapiPath\n";
    exit(1);
}

// helpers
function camelToSnake($input) {
    return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $input));
}

function pluralize($word) {
    // If the model name already looks plural (ends with 's'), leave it as-is.
    if (preg_match('/s$/i', $word)) return $word;

    // basic English pluralization rules sufficient for our model names
    if (preg_match('/(s|x|z|ch|sh)$/i', $word)) {
        return $word . 'es';
    }
    if (preg_match('/[^aeiou]y$/i', $word)) {
        return preg_replace('/y$/i', 'ies', $word);
    }
    return $word . 's';
}

// build enumMap from migrations
$enumMap = [];
foreach (glob($migrationsDir . '*.php') as $mf) {
    $mcont = file_get_contents($mf);
    if (!$mcont) continue;
    if (preg_match("/Schema::create\(\s*'([a-z0-9_]+)'/i", $mcont, $mt)) {
        $tableName = $mt[1];
        if (preg_match_all("/->enum\(\s*'([a-z0-9_]+)'\s*,\s*\[([^\]]*)\]/i", $mcont, $me, PREG_SET_ORDER)) {
            foreach ($me as $em) {
                $field = $em[1];
                $valsRaw = $em[2];
                preg_match_all("/'([^']+)'/", $valsRaw, $vv);
                if (!empty($vv[1])) {
                    $enumMap[$tableName][$field] = $vv[1];
                }
            }
        }
    }
}

$manualPluralMap = [
    'Country' => 'Countries',
    'Currency' => 'Currencies',
    'OrderTaxItem' => 'OrderTaxItem',
    'OrderTaxItem' => 'OrderTaxItem',
    'ProjectCategory' => 'ProjectCategories',
    'Tax' => 'Taxes',
];

$schemas = [];

foreach (glob($modelsDir . '*.php') as $mf) {
    $mcont = file_get_contents($mf);
    if (!$mcont) continue;
    if (!preg_match('/class\s+(\w+)/', $mcont, $mc)) continue;
    $class = $mc[1];
    // extract fillable
    $fillable = [];
    if (preg_match('/protected\s+\$fillable\s*=\s*\[([^\]]*)\]/s', $mcont, $mfills)) {
        preg_match_all("/'([^']+)'/", $mfills[1], $fvals);
        if (!empty($fvals[1])) $fillable = $fvals[1];
    }
    $table = camelToSnake($class) . 's';

    // parse StoreRequest rules if exists
    $storeRules = [];
    $storePath = $requestsDir . $class . 'StoreRequest.php';
    if (is_file($storePath)) {
        $scont = file_get_contents($storePath);
        if (preg_match('/return\s*\[([\s\S]*?)\];/m', $scont, $sr)) {
            $rulesBlock = $sr[1];
            // find entries
            if (preg_match_all("/'([^']+)'\s*=>\s*\[([^\]]*)\]/m", $rulesBlock, $rkeys, PREG_SET_ORDER)) {
                foreach ($rkeys as $r) {
                    $key = $r[1];
                    $arr = $r[2];
                    $storeRules[$key] = $arr;
                }
            }
        }
    }

    // build properties
    $props = [];
    $required = [];
    $example = [];
    // always include id and timestamps
    $props['id'] = ['type' => 'integer'];
    $example['id'] = 1;

    foreach ($fillable as $field) {
        if ($field === 'id') continue;
        $prop = [];
        // enum check
        if (isset($enumMap[$table]) && isset($enumMap[$table][$field])) {
            $prop['type'] = 'string';
            $prop['enum'] = $enumMap[$table][$field];
            $example[$field] = $enumMap[$table][$field][0] ?? null;
        } elseif (preg_match('/(_date|_at|date)$/', $field)) {
            $prop['type'] = 'string';
            $prop['format'] = 'date';
            $example[$field] = date('Y-m-d');
        } elseif (preg_match('/(amount|price|total|rate|exchange|tax|net|converted)/', $field)) {
            $prop['type'] = 'number';
            $prop['format'] = 'float';
            $example[$field] = 0.0;
        } elseif (preg_match('/^(is_|has_)/', $field)) {
            $prop['type'] = 'boolean';
            $example[$field] = false;
        } elseif (preg_match('/_id$/', $field)) {
            $prop['type'] = 'integer';
            $prop['nullable'] = true;
            $example[$field] = null;
        } elseif ($field === 'email' || preg_match('/_email$/', $field)) {
            $prop['type'] = 'string';
            $prop['format'] = 'email';
            $example[$field] = 'user@example.com';
        } elseif ($field === 'website' || $field === 'url' || preg_match('/_url$/', $field)) {
            $prop['type'] = 'string';
            $prop['format'] = 'uri';
            $example[$field] = 'https://example.com';
        } else {
            $prop['type'] = 'string';
            $example[$field] = '';
        }

        // determine required from storeRules
        if (isset($storeRules[$field])) {
            $arr = $storeRules[$field];
            if (strpos($arr, "'required'") !== false || strpos($arr, 'required') !== false) {
                // if rule contains nullable, don't add required
                if (strpos($arr, 'nullable') === false) {
                    $required[] = $field;
                }
            }
            // if store rule contains 'exists:users,id' around created_by/updated_by, it's nullable per generator but we'll keep as not required
        }

        $props[$field] = $prop;
    }

    // add common timestamps and created_by/updated_by if not present
    if (!isset($props['created_by'])) { $props['created_by'] = ['type' => 'integer', 'nullable' => true]; $example['created_by'] = null; }
    if (!isset($props['updated_by'])) { $props['updated_by'] = ['type' => 'integer', 'nullable' => true]; $example['updated_by'] = null; }
    if (!isset($props['created_at'])) { $props['created_at'] = ['type' => 'string', 'format' => 'date-time']; $example['created_at'] = date('c'); }
    if (!isset($props['updated_at'])) { $props['updated_at'] = ['type' => 'string', 'format' => 'date-time']; $example['updated_at'] = date('c'); }

    if (isset($manualPluralMap[$class])) {
        $schemaName = $manualPluralMap[$class];
    } else {
        $schemaName = pluralize($class);
    }
    $schemas[$schemaName] = [
        'type' => 'object',
        'properties' => $props,
        'example' => $example,
    ];

    // Create schema
    $createProps = [];
    $createRequired = [];
    foreach ($props as $k => $v) {
        if (in_array($k, ['id','created_at','updated_at'])) continue;
        $createProps[$k] = $v;
        if (in_array($k, $required)) $createRequired[] = $k;
    }
    $schemas[$schemaName . 'Create'] = [
        'type' => 'object',
        'properties' => $createProps,
    ];
    if (!empty($createRequired)) $schemas[$schemaName . 'Create']['required'] = array_values($createRequired);
    $schemas[$schemaName . 'Create']['example'] = $example;

    // Update schema - leave flexible
    $schemas[$schemaName . 'Update'] = [
        'type' => 'object',
        'additionalProperties' => true,
    ];
}

// load openapi
$openapi = json_decode(file_get_contents($openapiPath), true);
if ($openapi === null) {
    echo "Failed to decode OpenAPI JSON\n";
    exit(1);
}

// Ensure server base URL matches application base so Swagger "Try it" hits correct endpoint
$openapi['servers'] = [
    [ 'url' => '/e-pms/api/v1' ]
];

$openapi['components']['schemas'] = $schemas;
// Fix $ref pointers in paths to point to corrected schema names when generator pluralization changed them
$schemaKeys = array_keys($schemas);

function correctSchemaName($name, $keys) {
    if (in_array($name, $keys)) return $name;
    // common corrections
    if (substr($name, -2) === 'ys') {
        $c = substr($name, 0, -2) . 'ies';
        if (in_array($c, $keys)) return $c;
    }
    if (substr($name, -2) === 'ss') {
        $c = substr($name, 0, -1);
        if (in_array($c, $keys)) return $c;
    }
    if (substr($name, -1) === 's') {
        $c = substr($name, 0, -1);
        if (in_array($c, $keys)) return $c;
    }
    // some explicit rules
    $replacements = [
        'Currencys' => 'Currencies',
        'Taxs' => 'Taxes',
        'ProjectCategorys' => 'ProjectCategories',
        'OrderTaxItems' => 'OrderTaxItem'
    ];
    if (isset($replacements[$name]) && in_array($replacements[$name], $keys)) return $replacements[$name];
    return null;
}

// walk paths and replace $ref where needed
$walker = function (&$node) use (&$walker, $schemaKeys) {
    if (is_array($node)) {
        foreach ($node as $k => &$v) {
            if ($k === '$ref' && is_string($v) && strpos($v, '#/components/schemas/') === 0) {
                $refName = substr($v, strlen('#/components/schemas/'));
                if (!in_array($refName, $schemaKeys)) {
                    // handle Create/Update/example suffixes
                    $suffixes = ['Create', 'Update', '/example', 'example'];
                    $found = false;
                    foreach ($suffixes as $suf) {
                        if (str_ends_with($refName, $suf)) {
                            $base = substr($refName, 0, -strlen($suf));
                            $correctBase = correctSchemaName($base, $schemaKeys);
                            if ($correctBase) {
                                $v = '#/components/schemas/' . $correctBase . $suf;
                                $found = true;
                                break;
                            }
                        }
                    }
                    if (!$found) {
                        $corrected = correctSchemaName($refName, $schemaKeys);
                        if ($corrected) {
                            $v = '#/components/schemas/' . $corrected;
                        }
                    }
                }
            } else {
                $walker($v);
            }
        }
    }
};

if (isset($openapi['paths'])) {
    $walker($openapi['paths']);
}

file_put_contents($openapiPath, json_encode($openapi, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "Updated OpenAPI components.schemas with " . count($schemas) . " schemas.\n";
