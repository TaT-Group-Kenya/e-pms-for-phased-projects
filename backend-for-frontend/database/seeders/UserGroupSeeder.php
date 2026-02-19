<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SysGroup;
use App\Models\User;

use Illuminate\Support\Facades\DB;

class UserGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get a system group for the seeded user
        $group = SysGroup::firstOrCreate(
            ['name' => 'Administrators'], 
            ['description' => null],
        );

        // Find the seeded user
        $user = User::where('email', 'admin@example.com')->first();
        if ($user) {
            // Attach the user to the group via pivot
            $group->users()->syncWithoutDetaching([$user->id]);
        }
    }
}
