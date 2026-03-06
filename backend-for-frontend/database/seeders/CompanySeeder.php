<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use Carbon\Carbon;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        
        $companies = [
            [
                'name' => 'Tech Solutions Ltd',
                'description' => 'A leading technology solutions provider specializing in software development and IT consulting',
                'email' => 'info@techsolutions.com',
                'phone' => '+254700123456',
                'contact_person_name' => 'John Doe',
                'logo' => '3310.png',
                'address' => '123 Tech Park, Westlands',
                'city' => 'Nairobi',
                'state' => 'Nairobi County',
                'country' => 'Kenya',
                'kra_pin' => 'P051234567K',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'is_deleted' => false,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            [
                'name' => 'Global Enterprises Ltd',
                'description' => 'International business solutions and logistics company serving clients across East Africa',
                'email' => 'contact@globalenterprises.com',
                'phone' => '+254711987654',
                'contact_person_name' => 'Jane Smith',
                'logo' => '3310.png',
                'address' => '456 Business District, Upper Hill',
                'city' => 'Nairobi',
                'state' => 'Nairobi County',
                'country' => 'Kenya',
                'kra_pin' => 'P059876543K',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'is_deleted' => false,
                'deleted_at' => null,
                'deleted_by' => null,
            ]
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }

        $this->copyImage('3310.png', 'logos');
        $this->copyImage('3311.png', 'logos');
    }

     /**
     * Ensure directory exists in storage
     */
    private function ensureDirectoryExists(string $path): void
    {
        $fullPath = storage_path('app/' . $path);
        
        if (!\File::exists($fullPath)) {
            \File::makeDirectory($fullPath, 0755, true);
            $this->command->info("Created directory: {$fullPath}");
        }
    }

    /**
     * Copy image from public to storage and return the storage path
     */
    private function copyImage(string $filename, string $subdirectory = 'logos'): string
    {
        $publicPath = public_path($filename);
        $storagePath = 'public/' . $subdirectory . '/' . $filename;
        
        // Check if source file exists
        if (!\File::exists($publicPath)) {
            $this->command->error("Source image not found: {$publicPath}");
            return $subdirectory . '/' . $filename; // Return path even if file doesn't exist
        }
        
        // Copy the file to storage
        try {
            \File::copy(
                $publicPath, 
                storage_path('app/' . $storagePath)
            );
            $this->command->info("Copied image: {$filename} to storage");
        } catch (\Exception $e) {
            $this->command->error("Failed to copy image {$filename}: " . $e->getMessage());
        }
        
        // Return the path that should be stored in database
        return $subdirectory . '/' . $filename;
    }
}