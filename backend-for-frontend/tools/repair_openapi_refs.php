<?php
$openapiPath = __DIR__ . '/../public/swagger-ui/openapi.json';
$doc = json_decode(file_get_contents($openapiPath), true);
if ($doc === null) { echo "Failed to parse openapi.json\n"; exit(1); }
$schemas = $doc['components']['schemas'] ?? [];
$schemaKeys = array_keys($schemas);

// collect all $refs
$refs = [];
$it = new RecursiveIteratorIterator(new RecursiveArrayIterator($doc));
foreach ($it as $key => $val) {
    if ($key === '$ref' && is_string($val) && strpos($val, '#/components/schemas/') === 0) {
        $refs[] = $val;
    }
}
$refs = array_unique($refs);
$missing = [];
foreach ($refs as $ref) {
    $name = substr($ref, strlen('#/components/schemas/'));
    if (!in_array($name, $schemaKeys)) $missing[] = $name;
}
if (empty($missing)) { echo "No missing refs to repair.\n"; exit(0); }

echo "Found missing refs: \n";
foreach ($missing as $m) echo " - $m\n";

// helper to add alias if possible
function try_alias(&$doc, $missing, $schemaKeys) {
    // handle patterns
    // 1. replace 'ys' -> 'ies'
    if (preg_match('/^(.*)ys$/', $missing, $p)) {
        $candidate = $p[1] . 'ies';
        if (in_array($candidate, $schemaKeys)) return $candidate;
    }
    // 2. remove duplicate s at end: 'Itemss' -> 'Items'
    if (preg_match('/^(.*)ss$/', $missing, $p)) {
        $candidate = $p[1] . 's';
        if (in_array($candidate, $schemaKeys)) return $candidate;
    }
    // 3. simple lowercase match
    foreach ($schemaKeys as $k) {
        if (strtolower($k) === strtolower($missing)) return $k;
    }
    // 4. levenshtein small
    $best = null; $bestScore = 999;
    foreach ($schemaKeys as $k) {
        $d = levenshtein(strtolower($k), strtolower($missing));
        if ($d < $bestScore) { $bestScore = $d; $best = $k; }
    }
    if ($bestScore <= 2) return $best;
    return null;
}

$addedAliases = [];
foreach ($missing as $m) {
    // handle example refs specially
    if (strpos($m, '/example') !== false) {
        list($schemaName, $junk) = explode('/example', $m, 2);
        if (isset($schemas[$schemaName]['example'])) {
            // we need to replace all occurrences of $ref: '#/components/schemas/{m}' with inline example
            $exampleVal = $schemas[$schemaName]['example'];
            // walk doc and replace
            $replaced = 0;
            $walker = function (&$node) use (&$walker, $m, $exampleVal, &$replaced) {
                if (is_array($node)) {
                    foreach ($node as $k => &$v) {
                        if ($k === '$ref' && $v === '#/components/schemas/' . $m) {
                            // replace parent reference: we need to replace the whole parent structure that held $ref with example value
                            // cannot modify parent easily here; signal replacement by setting to special marker
                            $v = null; // mark
                            // Not straightforward; we'll do a second pass: replace occurrences of {"$ref": "#..."} pattern using json string replace later
                            $replaced++;
                        } else {
                            $walker($v);
                        }
                    }
                }
            };
            // Instead of deep array replace, do string replace on JSON
            $json = json_encode($doc, JSON_UNESCAPED_SLASHES);
            $search = json_encode(['$ref' => '#/components/schemas/' . $m], JSON_UNESCAPED_SLASHES);
            if (strpos($json, $search) !== false) {
                $replacement = json_encode($exampleVal, JSON_UNESCAPED_SLASHES);
                $json = str_replace($search, $replacement, $json);
                $doc = json_decode($json, true);
                echo "Replaced $search with inline example for $m\n";
            }
            continue;
        }
    }

    $candidate = try_alias($doc, $m, $schemaKeys);
    if ($candidate) {
        // copy schema under missing name
        $doc['components']['schemas'][$m] = $doc['components']['schemas'][$candidate];
        $schemaKeys[] = $m;
        $addedAliases[] = [$m => $candidate];
        echo "Added alias: $m -> $candidate\n";
    } else {
        echo "No alias found for $m\n";
    }
}

// write back
file_put_contents($openapiPath, json_encode($doc, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "Repair completed. Added aliases: " . count($addedAliases) . "\n";
