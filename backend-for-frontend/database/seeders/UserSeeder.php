<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'System',
                'middle_name' => null,
                'last_name' => 'Admin',
                'password' => Hash::make('password123'),
                'email_verified_at' => Carbon::now(),
                'updated_by' => 1,
                'created_by' => 1,
                'remember_token' => Str::random(10),
                'avatar_pic' => 'https://cdn-icons-png.freepik.com/256/12225/12225881.png',
                'category' => 'internal',
                'is_active' => true,
                'company_id' => null,
                'customer_id' => null,
            ]
        );
    }
}
