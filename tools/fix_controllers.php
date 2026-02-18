<?php
// Fix generated API controllers: replace placeholder 'use' lines and normalize method signatures/bodies.

$root = dirname(__DIR__);
$controllersDir = $root . '/app/Http/Controllers/Api';
if (!is_dir($controllersDir)) {
    echo "Controllers directory not found: $controllersDir\n";
    exit(1);
}

$files = scandir($controllersDir);
foreach ($files as $file) {
    if (substr($file, -4) !== '.php') continue;
    $path = $controllersDir . '/' . $file;
    $content = file_get_contents($path);
    $class = pathinfo($file, PATHINFO_FILENAME);
    $model = str_replace('Controller', '', $class);

    // remove bad placeholder use-lines (e.g. use App\Services$serviceClass;)
    $content = preg_replace('/^use\s+App\\[^;]*\$[^;]*;\s*$/m', '', $content);

    // ensure model and helper uses are present immediately after namespace
    $uses = [];
    $uses[] = "use App\\Models\\$model;";
    $uses[] = "use App\\Services\\{$model}Service;";
    $uses[] = "use App\\Http\\Resources\\{$model}Resource;";
    $uses[] = "use App\\Http\\Requests\\{$model}StoreRequest;";
    $uses[] = "use App\\Http\\Requests\\{$model}UpdateRequest;";
    $uses[] = "use Illuminate\\Http\\Request;";

    // insert uses after namespace declaration
    $content = preg_replace_callback('/namespace\s+App\\Http\\Controllers\\Api;\s*/', function($m) use ($uses) {
        return $m[0] . "\n" . implode("\n", $uses) . "\n\n";
    }, $content, 1);

    // normalize constructor to use the proper service class
    $content = preg_replace('/public function __construct\s*\(([^)]*)\)\s*\{/', 'public function __construct('.$model.'Service $service) {', $content, 1);

    // normalize store method: ensure it uses StoreRequest and returns Resource
    $content = preg_replace_callback('/public function store\s*\([^\)]*\)\s*\{[^{]*?\n\s*\}/s', function($m) use ($model) {
        return "public function store({$model}StoreRequest $request)\n    {\n        \$model = \$this->service->create(\$request->validated());\n        return new {$model}Resource(\$model);\n    }";
    }, $content, 1);

    // normalize show method
    $content = preg_replace_callback('/public function show\s*\([^\)]*\)\s*\{.*?\n\s*\}/s', function($m) use ($model) {
        return "public function show($model \$".lcfirst($model).")\n    {\n        \$this->authorize('view', \\$".lcfirst($model).");\n\n        return new {$model}Resource(\$".lcfirst($model).");\n    }";
    }, $content, 1);

    // normalize update method
    $content = preg_replace_callback('/public function update\s*\([^\)]*\)\s*\{.*?\n\s*\}/s', function($m) use ($model) {
        return "public function update({$model}UpdateRequest \$request, $model \$".lcfirst($model).")\n    {\n        \$this->authorize('update', \\$".lcfirst($model).");\n\n        \$updated = \$this->service->update(\$".lcfirst($model)."->id, \$request->validated());\n        return new {$model}Resource(\$updated);\n    }";
    }, $content, 1);

    // normalize destroy method
    $content = preg_replace_callback('/public function destroy\s*\([^\)]*\)\s*\{.*?\n\s*\}/s', function($m) use ($model) {
        return "public function destroy($model \$".lcfirst($model).")\n    {\n        \$this->authorize('delete', \\$".lcfirst($model).");\n\n        \$this->service->delete(\$".lcfirst($model)."->id);\n        return response()->noContent();\n    }";
    }, $content, 1);

    // write back
    file_put_contents($path, $content);
    echo "Fixed controller: $file\n";
}

echo "fix_controllers complete.\n";
