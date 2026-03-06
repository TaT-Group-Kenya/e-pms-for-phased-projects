<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SysGroup;
use Illuminate\Support\Facades\DB;

class SysGroupSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        SysGroup::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        SysGroup::insert([
            [
                'name' => 'Administrators',
                'description' => 'System administrators',
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'name' => 'Finance Admins',
                'description' => 'Finance administrators',
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'name' => 'Project Admins',
                'description' => 'Project administrators',
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'name' => 'Account Admins',
                'description' => 'Account administrators',
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => 1,
                'updated_by' => 1,
            ],
        ]);
    }
}
