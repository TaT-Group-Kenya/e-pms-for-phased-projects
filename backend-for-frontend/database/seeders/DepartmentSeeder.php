<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'office expenses msa', 'description' => 'office expenses msa'],
            ['name' => 'Transport', 'description' => 'Trucking'],
            ['name' => 'Marketing', 'description' => 'Marketing'],
            ['name' => 'Operations', 'description' => 'Operations'],
        ];

        foreach ($departments as $department) {
            Department::firstOrCreate(
                ['name' => $department['name']],
                [
                    'description' => $department['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                    'created_by' => 1,
                    'updated_by' => 1,
                    'is_deleted' => false,
                ]
            );
        }
    }
}
