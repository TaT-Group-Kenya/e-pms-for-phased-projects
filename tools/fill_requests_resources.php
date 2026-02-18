<?php
// Scan migrations to extract table columns, then fill generated FormRequests and Resources.

$root = dirname(__DIR__);
$migrationsDir = $root . '/database/migrations';
$modelsDir = $root . '/app/Models';
$requestsDir = $root . '/app/Http/Requests';
$resourcesDir = $root . '/app/Http/Resources';

if (!is_dir($migrationsDir)) {
    echo "Migrations directory not found.\n";
    exit(1);
}

$migrationFiles = scandir($migrationsDir);
$tables = [];
foreach ($migrationFiles as $file) {
    if (substr($file, -4) !== '.php') continue;
    $content = file_get_contents($migrationsDir . '/' . $file);
    // find Schema::create('tablename'
    if (preg_match("/Schema::create\(\'([a-z0-9_]+)\'/i", $content, $m)) {
        $table = $m[1];
        $tables[$table] = [];
        // extract $table->... lines inside closure
        if (preg_match("/Schema::create\('[^']+', function \(Blueprint \$table\) \{(.*?)\}\);/is", $content, $m2)) {
            $body = $m2[1];
            // match column definitions
            if (preg_match_all("/\$table->([a-zA-Z_]+)\(\'([a-z0-9_]+)\'(?:,\s*([^\)]+))?\)(?:->([a-zA-Z_]+)\(.*?\))*/is", $body, $cols, PREG_SET_ORDER)) {
                foreach ($cols as $c) {
                    $type = $c[1];
                    $col = $c[2];
                    $extra = isset($c[3]) ? $c[3] : null;
                    $nullable = (strpos($body, "->nullable()") !== false) ? true : false;
                    // check nullable specifically for this column
                    $pattern = "/\$table->" . preg_quote($type, '/') . "\('" . preg_quote($col, '/') . "'[^\)]*\)(?:->[a-zA-Z_]+\([^\)]*\))*\s*;?/i";
                    if (preg_match($pattern, $body, $mcol)) {
                        $nullable = strpos($mcol[0], '->nullable') !== false;
                    }
                    $tables[$table][$col] = [
                        'type' => $type,
                        'nullable' => $nullable,
                        'raw' => $extra,
                    ];
                }
            }
        }
    }
}

// helper to map model class to table name
function modelTableName($modelFile)
{
    $content = file_get_contents($modelFile);
    if (preg_match('/protected\s+\$table\s*=\s*\'([a-z0-9_]+)\'/i', $content, $m)) {
        return $m[1];
    }
    // fallback: plural snake_case of class name
    $class = pathinfo($modelFile, PATHINFO_FILENAME);
    $snake = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $class));
    return $snake . 's';
}

$modelFiles = scandir($modelsDir);
$models = [];
foreach ($modelFiles as $mf) {
    if (substr($mf, -4) !== '.php') continue;
    $models[] = $modelsDir . '/' . $mf;
}

foreach ($models as $mf) {
    $class = pathinfo($mf, PATHINFO_FILENAME);
    $table = modelTableName($mf);
    $cols = $tables[$table] ?? [];

    // build validation rules
    $rules = [];
    foreach ($cols as $col => $meta) {
        if (in_array($col, ['id','created_at','updated_at','deleted_at'])) continue;
        $r = [];
        if (!$meta['nullable']) $r[] = 'required';
        else $r[] = 'nullable';
        switch ($meta['type']) {
            case 'string':
            case 'text':
            case 'longText':
                $r[] = 'string';
                break;
            case 'integer':
            case 'bigInteger':
            case 'unsignedBigInteger':
            case 'unsignedInteger':
                $r[] = 'integer';
                break;
            case 'decimal':
            case 'float':
                $r[] = 'numeric';
                break;
            case 'boolean':
                $r[] = 'boolean';
                break;
            case 'enum':
                // try extract values from raw
                if (preg_match('/enum\((.*)\)/i', $meta['raw'] ?? '', $me)) {
                    $vals = $me[1];
                    $r[] = 'in:' . str_replace([' ',"'"], '', $vals);
                } else {
                    $r[] = 'string';
                }
                break;
            case 'date':
            case 'timestamp':
                $r[] = 'date';
                break;
            default:
                $r[] = 'string';
        }
        $rules[$col] = implode('|', $r);
    }

    // write StoreRequest
    $storeRequest = $requestsDir . '/' . $class . 'StoreRequest.php';
    $updateRequest = $requestsDir . '/' . $class . 'UpdateRequest.php';
    $resourceFile = $resourcesDir . '/' . $class . 'Resource.php';

    if (!is_dir($requestsDir)) mkdir($requestsDir, 0755, true);
    if (!is_dir($resourcesDir)) mkdir($resourcesDir, 0755, true);

    $storeTpl = "<?php\n\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass {$class}StoreRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return true;\n    }\n\n    public function rules(): array\n    {\n        return [\n";
    foreach ($rules as $col => $r) {
        $storeTpl .= "            '{$col}' => '{$r}',\n";
    }
    $storeTpl .= "        ];\n    }\n}\n";
    file_put_contents($storeRequest, $storeTpl);
    echo "Updated request: $storeRequest\n";

    // Update UpdateRequest (use sometimes)
    $updateTpl = "<?php\n\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass {$class}UpdateRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return true;\n    }\n\n    public function rules(): array\n    {\n        return [\n";
    foreach ($rules as $col => $r) {
        // convert required to sometimes|required
        $r2 = str_replace('required', 'sometimes|required', $r);
        $updateTpl .= "            '{$col}' => '{$r2}',\n";
    }
    $updateTpl .= "        ];\n    }\n}\n";
    file_put_contents($updateRequest, $updateTpl);
    echo "Updated request: $updateRequest\n";

    // Resource
    $resTpl = "<?php\n\nnamespace App\\Http\\Resources;\n\nuse Illuminate\\Http\\Resources\\Json\\JsonResource;\n\nclass {$class}Resource extends JsonResource\n{\n    public function toArray(\$request): array\n    {\n        return [\n";
    foreach ($cols as $col => $meta) {
        $resTpl .= "            '{$col}' => \$this->{$col},\n";
    }
    $resTpl .= "        ];\n    }\n}\n";
    file_put_contents($resourceFile, $resTpl);
    echo "Updated resource: $resourceFile\n";
}

// create routes/api.php registering apiResource for each model
$apiRoutes = $root . '/routes/api.php';
$routeTpl = "<?php\n\nuse Illuminate\Http\Request;\nuse Illuminate\Support\Facades\Route;\n\n";
foreach ($models as $mf) {
    $class = pathinfo($mf, PATHINFO_FILENAME);
    $uri = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $class));
    $routeTpl .= "Route::apiResource('{$uri}s', App\\Http\\Controllers\\Api\\{$class}Controller::class);\n";
}
file_put_contents($apiRoutes, $routeTpl);
echo "Wrote routes: $apiRoutes\n";

// create Generic Policy and AuthServiceProvider
$policyPath = $root . '/app/Policies/ModelPolicy.php';
if (!file_exists($policyPath)) {
    $policy = <<<PHP
<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ModelPolicy
{
    use HandlesAuthorization;

    public function view(User \$user, \$model)
    {
        return true;
    }

    public function create(User \$user)
    {
        return true;
    }

    public function update(User \$user, \$model)
    {
        return true;
    }

    public function delete(User \$user, \$model)
    {
        return true;
    }
}
PHP;
    file_put_contents($policyPath, $policy);
    echo "Created policy: $policyPath\n";
}

$authProv = $root . '/app/Providers/AuthServiceProvider.php';
$modelsList = [];
foreach ($models as $mf) {
    $modelsList[] = 'App\\\\Models\\\\' . pathinfo($mf, PATHINFO_FILENAME) . '::class';
}

$authTpl2 = "<?php\n\nnamespace App\\Providers;\n\nuse Illuminate\\Support\\ServiceProvider;\nuse Illuminate\\Support\\Facades\\Gate;\nuse App\\Policies\\ModelPolicy;\n\nclass AuthServiceProvider extends ServiceProvider\n{\n    public function register(): void\n    {\n        //\n    }\n\n    public function boot(): void\n    {\n        // register ModelPolicy for all models\n";
foreach ($models as $mf) {
    $cls = 'App\\Models\\' . pathinfo($mf, PATHINFO_FILENAME);
    $authTpl2 .= "\n        Gate::policy({$cls}::class, ModelPolicy::class);";
}
$authTpl2 .= "\n    }\n}\n";
file_put_contents($authProv, $authTpl2);
echo "Wrote AuthServiceProvider: $authProv\n";

echo "fill_requests_resources complete.\n";
