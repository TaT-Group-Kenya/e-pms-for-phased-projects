<?php
// Simple CRUD scaffolder: generates API Controller, Service, Requests, and Resource
// Usage: php tools/generate_crud.php --models=all

$root = dirname(__DIR__);

function files_in_dir($dir) {
    $files = [];
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($it as $f) {
        if ($f->isFile() && $f->getExtension() === 'php') $files[] = $f->getPathname();
    }
    return $files;
}

$modelsDir = $root . '/app/Models';
if (!is_dir($modelsDir)) {
    echo "Models directory not found: $modelsDir\n";
    exit(1);
}

$files = scandir($modelsDir);
$models = [];
foreach ($files as $f) {
    if (substr($f, -4) === '.php') {
        $models[] = pathinfo($f, PATHINFO_FILENAME);
    }
}

if (empty($models)) {
    echo "No models found in app/Models.\n";
    exit(1);
}

// Ensure directories
$dirs = [
    $root . '/app/Http/Controllers/Api',
    $root . '/app/Services',
    $root . '/app/Http/Requests',
    $root . '/app/Http/Resources',
];
foreach ($dirs as $d) {
    if (!is_dir($d)) mkdir($d, 0755, true);
}

foreach ($models as $model) {
    $modelClass = $model;
    $serviceClass = $modelClass . 'Service';
    $controllerClass = $modelClass . 'Controller';
    $resourceClass = $modelClass . 'Resource';
    $storeRequest = $modelClass . 'StoreRequest';
    $updateRequest = $modelClass . 'UpdateRequest';

    $modelFQN = "App\\Models\\$modelClass";

    // Service
    $servicePath = $root . "/app/Services/$serviceClass.php";
    if (!file_exists($servicePath)) {
        $serviceTpl = <<<PHP
<?php

namespace App\Services;

use $modelFQN;

class $serviceClass
{
    public function index(
        array \$filters = [],
        int \$perPage = 15,
        array \$with = []
    ) {
        // optimized query: apply eager loading and simple filters
        \$query = $modelClass::query();
        if (!empty(\$with)) {
            \$query->with(\$with);
        }
        foreach (\$filters as \$key => \$value) {
            \$query->where(\$key, \$value);
        }
        return \$query->paginate(\$perPage);
    }

    public function find(int \$id, array \$with = [])
    {
        \$query = $modelClass::query();
        if (!empty(\$with)) \$query->with(\$with);
        return \$query->findOrFail(\$id);
    }

    public function create(array \$data)
    {
        return $modelClass::create(\$data);
    }

    public function update(int \$id, array \$data)
    {
        \$model = $modelClass::findOrFail(\$id);
        \$model->update(\$data);
        return \$model;
    }

    public function delete(int \$id)
    {
        return $modelClass::destroy(\$id);
    }
}
PHP;
        file_put_contents($servicePath, $serviceTpl);
        echo "Created service: $servicePath\n";
    }

    // Controller
    $controllerPath = $root . "/app/Http/Controllers/Api/$controllerClass.php";
    if (!file_exists($controllerPath)) {
        $controllerTpl = <<<PHP
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\$serviceClass;
use App\Http\Resources\$resourceClass;
use App\Http\Requests\$storeRequest;
use App\Http\Requests\$updateRequest;
use Illuminate\Http\Request;

class $controllerClass extends Controller
{
    protected \$service;

    public function __construct($serviceClass \$service)
    {
        \$this->service = \$service;
    }

    public function index(Request \$request)
    {
        \$perPage = (int) (\$request->get('per_page', 15));
        \$data = \$this->service->index(\$request->all(), \$perPage);
        return $resourceClass::collection(\$data);
    }

    public function store($storeRequest \$request)
    {
        \$model = \$this->service->create(\$request->validated());
        return new $resourceClass(\$model);
    }

    public function show(int \$id)
    {
        \$model = \$this->service->find(\$id);
        return new $resourceClass(\$model);
    }

    public function update($updateRequest \$request, int \$id)
    {
        \$model = \$this->service->update(\$id, \$request->validated());
        return new $resourceClass(\$model);
    }

    public function destroy(int \$id)
    {
        \$this->service->delete(\$id);
        return response()->noContent();
    }
}
PHP;
        file_put_contents($controllerPath, $controllerTpl);
        echo "Created controller: $controllerPath\n";
    }

    // Requests
    $storePath = $root . "/app/Http/Requests/$storeRequest.php";
    if (!file_exists($storePath)) {
        $storeTpl = <<<PHP
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class $storeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // TODO: customize validation rules for $modelClass
        return [
            // 'name' => 'required|string',
        ];
    }
}
PHP;
        file_put_contents($storePath, $storeTpl);
        echo "Created request: $storePath\n";
    }

    $updatePath = $root . "/app/Http/Requests/$updateRequest.php";
    if (!file_exists($updatePath)) {
        $updateTpl = <<<PHP
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class $updateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // TODO: customize validation rules for $modelClass
        return [
            // 'name' => 'sometimes|required|string',
        ];
    }
}
PHP;
        file_put_contents($updatePath, $updateTpl);
        echo "Created request: $updatePath\n";
    }

    // Resource
    $resourcePath = $root . "/app/Http/Resources/$resourceClass.php";
    if (!file_exists($resourcePath)) {
        $resourceTpl = <<<PHP
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class $resourceClass extends JsonResource
{
    public function toArray(\$request): array
    {
        // TODO: customize output fields
        return parent::toArray(\$request);
    }
}
PHP;
        file_put_contents($resourcePath, $resourceTpl);
        echo "Created resource: $resourcePath\n";
    }

}

echo "Scaffold generation complete.\n";
