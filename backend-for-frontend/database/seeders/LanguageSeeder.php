<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Language;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = ['EN' => 'English'];
        
        foreach ($languages as $key => $value) {
            Language::firstOrCreate([
                'code' => $key,
                'name' => $value, 
                'description' => $value,
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ]);
        }
    }
}
