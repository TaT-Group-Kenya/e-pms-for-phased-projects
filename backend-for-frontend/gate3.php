<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
DB::beginTransaction();
$user = App\Models\User::where('is_active', true)->first();
Auth::login($user);
DB::table('user_groups')->insertOrIgnore(['user_id' => $user->id, 'sys_group_id' => 2, 'is_deleted' => false, 'created_at' => now()]);

Log::info('GATE TEST START');

echo "gate->forUser->AccountPolicy update: ";
echo \Gate::forUser($user)->check('update', App\Models\Account::class) ? 'A' : 'D';
echo "\n";
Log::info('GATE TEST END');

DB::table('user_groups')->where('user_id', $user->id)->where('sys_group_id', 2)->delete();
DB::rollBack();
