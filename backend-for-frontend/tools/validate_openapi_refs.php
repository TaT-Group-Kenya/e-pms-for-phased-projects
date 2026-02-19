<?php
$openapiPath = __DIR__ . '/../public/swagger-ui/openapi.json';
if (!is_file($openapiPath)) { echo "openapi.json not found\n"; exit(1); }
$doc = json_decode(file_get_contents($openapiPath), true);
if ($doc === null) { echo "Failed to parse openapi.json\n"; exit(1); }

$schemaKeys = array_keys($doc['components']['schemas'] ?? []);
$refs = [];

$it = new RecursiveIteratorIterator(new RecursiveArrayIterator($doc));
foreach ($it as $key => $val) {
    if ($key === '$ref' && is_string($val)) {
        if (strpos($val, '#/components/schemas/') === 0) {
            $refs[] = substr($val, strlen('#/components/schemas/'));
        }
    }
}

$refs = array_unique($refs);
$missing = [];
foreach ($refs as $r) {
    if (!in_array($r, $schemaKeys)) $missing[] = $r;
}

if (empty($missing)) {
    echo "All schema $refs resolved. Total references: " . count($refs) . "\n";
    exit(0);
}

echo "Missing schema definitions (" . count($missing) . "):\n";
foreach ($missing as $m) echo " - $m\n";
exit(2);
