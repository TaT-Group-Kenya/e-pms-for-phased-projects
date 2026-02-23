<?php

$resourcesPath = __DIR__ . '/../app/Http/Resources';
$files = glob($resourcesPath . '/*.php');
$cleanedCount = 0;

foreach ($files as $file) {
    $filename = basename($file);
    if ($filename === 'BaseResource.php') {
        continue;
    }

    $content = file_get_contents($file);
    $original = $content;

    // Remove duplicate timestamp lines at the end of arrays
    // Pattern: look for ]; and remove any created_at/updated_at lines immediately before it
    
    // Find all lines in the return array
    $lines = explode("\n", $content);
    $newLines = [];
    $seenInArray = [];
    $inArray = false;
    $closingBracketIndex = -1;

    // Find where the array is
    for ($i = 0; $i < count($lines); $i++) {
        if (strpos($lines[$i], 'return [') !== false) {
            $inArray = true;
            $seenInArray = [];
        }
        if ($inArray && strpos($lines[$i], '];') !== false) {
            $inArray = false;
            $closingBracketIndex = $i;
        }
    }

    // Now do the cleanup: remove duplicate created_at/updated_at before ];
    for ($i = 0; $i < count($lines); $i++) {
        $line = $lines[$i];
        
        // Check if this is within the array section
        if ($i >= 0 && $closingBracketIndex > 0 && $i < $closingBracketIndex) {
            // Check for timestamp fields
            if (preg_match("/'(created_at|updated_at)'\s*=>/", $line, $matches)) {
                $field = $matches[1];
                $isTimestampAndDuplicate = false;
                
                // Look if this same field exists earlier in the array
                for ($j = $i - 1; $j >= 0; $j--) {
                    if (preg_match("/'$field'\s*=>/", $lines[$j])) {
                        // Found earlier occurrence, check if current line is near the end
                        if ($i > $closingBracketIndex - 3) {
                            $isTimestampAndDuplicate = true;
                        }
                        break;
                    }
                }
                
                if ($isTimestampAndDuplicate) {
                    continue; // Skip this duplicate line
                }
            }
        }
        
        $newLines[] = $line;
    }

    $newContent = implode("\n", $newLines);
    
    if ($newContent !== $original) {
        file_put_contents($file, $newContent);
        $cleanedCount++;
        echo "Cleaned duplicates: $filename\n";
    }
}

echo "\nDone! Cleaned $cleanedCount files.\n";
?>
