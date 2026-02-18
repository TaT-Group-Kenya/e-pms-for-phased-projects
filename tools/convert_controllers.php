<?php
// Convert API controllers to use route-model binding and add authorization checks.

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
    $modelFQN = "App\\Models\\$model";

    // replace show(int $id) or show($id)
    $content = preg_replace_callback(
        '/public function show\s*\(([^)]*)\)/',
        function ($m) use ($model, $modelFQN) {
            return 'public function show(' . $modelFQN . ' $' . lcfirst($model) . ')';
        },
        $content
    );

    // replace update(Request $request, int $id) or update($request, $id)
    $content = preg_replace_callback(
        '/public function update\s*\(([^)]*)\)/',
        function ($m) use ($model, $modelFQN) {
            // replace last param with model type-hint
            $params = $m[1];
            // if already has model, skip
            if (strpos($params, $model) !== false) return $m[0];
            // split by comma
            $parts = array_map('trim', explode(',', $params));
            if (count($parts) >= 2) {
                array_pop($parts);
                $newLast = $modelFQN . ' $' . lcfirst($model);
                $new = implode(', ', $parts) . ', ' . $newLast;
            } else {
                $new = $params;
            }
            return 'public function update(' . $new . ')';
        },
        $content
    );

    // replace destroy(int $id)
    $content = preg_replace_callback(
        '/public function destroy\s*\(([^)]*)\)/',
        function ($m) use ($model, $modelFQN) {
            return 'public function destroy(' . $modelFQN . ' $' . lcfirst($model) . ')';
        },
        $content
    );

    // add authorize calls inside methods: show/update/destroy
    // show: insert authorize after opening brace
    $content = preg_replace_callback(
        '/public function show\s*\([^\)]*\)\s*\{\s*/',
        function ($m) use ($model) {
            $v = lcfirst($model);
            $authLine = "\n        \$this->authorize('view', \$" . $v . ");\n\n        ";
            return $m[0] . $authLine;
        },
        $content
    );

    $content = preg_replace_callback(
        '/public function update\s*\([^\)]*\)\s*\{\s*/',
        function ($m) use ($model) {
            $v = lcfirst($model);
            $authLine = "\n        \$this->authorize('update', \$" . $v . ");\n\n        ";
            return $m[0] . $authLine;
        },
        $content
    );

    $content = preg_replace_callback(
        '/public function destroy\s*\([^\)]*\)\s*\{\s*/',
        function ($m) use ($model) {
            $v = lcfirst($model);
            $authLine = "\n        \$this->authorize('delete', \$" . $v . ");\n\n        ";
            return $m[0] . $authLine;
        },
        $content
    );

    file_put_contents($path, $content);
    echo "Converted controller: $path\n";
}

echo "convert_controllers complete.\n";
