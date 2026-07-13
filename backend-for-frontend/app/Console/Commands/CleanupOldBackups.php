<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\FileList;

class CleanupOldBackups extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:cleanup
        {--days= : Number of days to keep backups (default from config)}
        {--dry-run : Show what would be deleted without deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove old backups from local storage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysToKeep = $this->option('days') ?: config('backup.keep_backups', 10);
        $dryRun = $this->option('dry-run');

        $this->info("Cleaning up local backups older than {$daysToKeep} days...");
        
        if ($dryRun) {
            $this->info("Dry run mode - no files will be deleted");
        }

        $backupPath = storage_path('app/backup-temp');
        
        if (!file_exists($backupPath)) {
            $this->info("No backup directory found.");
            return Command::SUCCESS;
        }

        // Find and delete old backup files
        $backupFiles = glob($backupPath . '/backup_*.sql.gz');
        
        if (empty($backupFiles)) {
            $this->info("No backup files found in storage/app/backup-temp/");
            return Command::SUCCESS;
        }

        $this->info("Found " . count($backupFiles) . " backup files in storage/app/backup-temp/");

        $deletedCount = 0;
        $totalSize = 0;

        foreach ($backupFiles as $file) {
            $fileSize = filesize($file);
            $totalSize += $fileSize;
            $fileAge = time() - filemtime($file);
            $daysOld = $fileAge / 86400;

            if ($daysOld > $daysToKeep) {
                if ($dryRun) {
                    $this->info("[DRY-RUN] Would delete: " . basename($file) . " ({$daysOld} days old)");
                } else {
                    unlink($file);
                    $this->info("Deleted: " . basename($file) . " ({$daysOld} days old)");
                }
                $deletedCount++;
            }
        }

        if ($deletedCount > 0) {
            $sizeMB = round($totalSize / (1024 * 1024), 2);
            $this->info("Successfully cleaned up {$deletedCount} old backup(s).");
            if (!$dryRun) {
                $this->info(" Freed up approximately {$sizeMB} MB");
            }
        } else {
            $this->info("No old backups to delete. Keeping backups less than {$daysToKeep} days old.");
        }

        return Command::SUCCESS;
    }
}
