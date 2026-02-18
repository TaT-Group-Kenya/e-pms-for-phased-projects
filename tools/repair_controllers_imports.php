<?php
// Repair controllers: remove placeholder use-lines containing '$', add proper use statements,
// and unescape any '\$' occurrences left in method bodies.

$root = dirname(__DIR__);
$dir = $root . '/app/Http/Controllers/Api';
if (!is_dir($dir)) {
    echo "Controllers directory not found: $dir\n";
    exit(1);
}

$files = glob($dir . '/*.php');
foreach ($files as $path) {
    $content = file_get_contents($path);

    // remove any use-lines that contain a literal '$'
    $content = preg_replace('/^\s*use\s+[^;]*\$[^;]*;\s*$/m', "", $content);

    // unescape any '\$' sequences left in the file
    $content = str_replace('\\$', '$', $content);

    // find class name and model name
    if (preg_match('/class\s+(\w+)/', $content, $m)) {
        $class = $m[1];
    } else {
        echo "Skipping (no class found): $path\n";
        continue;
    }

    $model = $class;
    if (substr($model, -10) === 'Controller') {
        $model = substr($model, 0, -10);
    }

    // Prepare canonical use statements
    $uses = [];
    $uses[] = "use App\\Http\\Controllers\\Controller;";
    $uses[] = "use App\\Models\\$model;";
    $uses[] = "use App\\Services\\{$model}Service;";
    $uses[] = "use App\\Http\\Resources\\{$model}Resource;";
    $uses[] = "use App\\Http\\Requests\\{$model}StoreRequest;";
    $uses[] = "use App\\Http\\Requests\\{$model}UpdateRequest;";
    $uses[] = "use Illuminate\\Http\\Request;";

    // Insert a consolidated, de-duplicated use block between namespace and class
    $nsLine = "namespace App\\Http\\Controllers\\Api;";
    $nsPos = strpos($content, $nsLine);
    if ($nsPos !== false) {
        $afterNsPos = $nsPos + strlen($nsLine);
        // find position of class declaration
        $classPos = strpos($content, "class ", $afterNsPos);
        if ($classPos === false) {
            echo "Skipping (no class pos): $path\n";
            continue;
        }

        // extract existing uses between namespace and class
        $between = substr($content, $afterNsPos, $classPos - $afterNsPos);
        preg_match_all('/^\s*use\s+([^;]+);/m', $between, $existingUsesMatches);
        $existing = [];
        if (!empty($existingUsesMatches[1])) {
            foreach ($existingUsesMatches[1] as $eu) {
                $existing[] = 'use ' . trim($eu) . ';';
            }
        }

        // merge canonical uses with existing (preserve existing order first)
        $finalUses = $existing;
        foreach ($uses as $u) {
            if (!in_array($u, $finalUses, true)) {
                $finalUses[] = $u;
            }
        }

        // build block
        $useBlock = "\n" . implode("\n", $finalUses) . "\n\n";

        // replace the region between namespace line end and classPos with the useBlock
        $content = substr($content, 0, $afterNsPos) . $useBlock . substr($content, $classPos);
    }

    // Ensure store method has a request parameter named $request
    $storePattern = '/public function store\s*\(([^)]*)\)/';
    $content = preg_replace_callback($storePattern, function($m) use ($model) {
        $params = trim($m[1]);
        if (strpos($params, '\$request') !== false) {
            return $m[0]; // already has request param
        }
        return 'public function store(' . $model . 'StoreRequest $request)';
    }, $content, 1);

    // write back
    file_put_contents($path, $content);
    echo "Repaired: " . basename($path) . "\n";
}

echo "repair_controllers_imports complete.\n";
