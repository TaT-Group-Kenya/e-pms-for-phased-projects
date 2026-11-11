<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$class = App\Http\Controllers\Api\TrialBalanceController::class;
$ref = new ReflectionClass($class);
echo "resolved file: ".$ref->getFileName()."\n";
$src = file_get_contents($ref->getFileName());
preg_match_all('/function (\w+)\(/', $src, $m);
echo "src functions: ".implode(', ', $m[1])."\n";
$m = $ref->hasMethod('chartLines') ? 'yes' : 'no';
echo "reflection chartLines: $m\n";
