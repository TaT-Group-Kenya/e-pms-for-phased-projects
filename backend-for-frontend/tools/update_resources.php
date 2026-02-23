<?php

$resourcesPath = __DIR__ . '/../app/Http/Resources';
$files = glob($resourcesPath . '/*.php');

foreach ($files as $file) {
    $filename = basename($file);
    if ($filename === 'BaseResource.php') {
        continue;
    }

    $content = file_get_contents($file);
    
    // Skip if already updated
    if (strpos($content, 'extends BaseResource') !== false) {
        echo "Skipped (already updated): $filename\n";
        continue;
    }
    
    // Skip if doesn't extend JsonResource
    if (strpos($content, 'extends JsonResource') === false) {
        echo "Skipped (no JsonResource): $filename\n";
        continue;
    }

    // Remove the use statement
    $content = str_replace(
        "use Illuminate\\Http\\Resources\\Json\\JsonResource;\n\n",
        "",
        $content
    );
    
    $content = str_replace(
        "use Illuminate\\Http\\Resources\\Json\\JsonResource;",
        "",
        $content
    );

    // Change extends JsonResource to extends BaseResource
    $content = str_replace(
        'extends JsonResource',
        'extends BaseResource',
        $content
    );

    // Replace ?->toISOString() with formatTimestamp()
    // Pattern: $this->field_name?->toISOString()
    $content = preg_replace(
        '/\$this->([a-z_]+)\?->toISOString\(\)/',
        '$this->formatTimestamp($this->$1)',
        $content
    );

    // Clean up extra blank lines
    $content = preg_replace("/\n\n\n+/", "\n\n", $content);

    file_put_contents($file, $content);
    echo "Updated: $filename\n";
}

echo "\nDone!\n";
?>
