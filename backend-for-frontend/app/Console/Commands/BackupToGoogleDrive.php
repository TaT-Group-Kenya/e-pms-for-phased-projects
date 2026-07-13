<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class BackupToGoogleDrive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:email
        {--no-cleanup : Do not delete local backup files after sending}
        {--log-only : Only log backup info without sending email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create database backup and send via email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $backupName = 'backup_' . date('Y-m-d_H-i-s') . '.sql.gz';
        $backupPath = storage_path('app/backup-temp/' . $backupName);
        $localBackupPath = storage_path('app/backup-temp');

        // Create backup directory if it doesn't exist
        if (!file_exists($localBackupPath)) {
            mkdir($localBackupPath, 0755, true);
        }

        // Get database configuration
        $dbConfig = config('database.connections.mysql');
        $dbName = $dbConfig['database'];
        $dbUser = $dbConfig['username'];
        $dbPassword = $dbConfig['password'];
        $dbHost = $dbConfig['host'];
        $dbPort = $dbConfig['port'];

        $this->info("Starting database backup...");
        $this->info("Database: {$dbName}");

        // Create database backup using mysqldump
        // --single-transaction: Consistent backup without locking tables
        // --quick: Retrieves rows one at a time (good for large tables)
        // --add-drop-table: Add DROP TABLE before CREATE
        // --complete-insert: Include column names in INSERT statements
        // --skip-lock-tables: Don't lock tables
        // --no-tablespaces: Skip tablespace information (requires PROCESS privilege)
        $dumpCommand = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password=%s --single-transaction --quick --add-drop-table --complete-insert --skip-lock-tables --no-tablespaces %s | gzip > %s',
            escapeshellarg($dbHost),
            escapeshellarg($dbPort),
            escapeshellarg($dbUser),
            escapeshellarg($dbPassword),
            escapeshellarg($dbName),
            escapeshellarg($backupPath)
        );

        $exitCode = 0;
        exec($dumpCommand, $output, $exitCode);

        if ($exitCode !== 0) {
            $this->error("Database backup failed!");
            $this->error("Output: " . implode("\n", $output));
            return Command::FAILURE;
        }

        $this->info("Database backup created: {$backupName}");

        // Check if only logging
        if ($this->option('log-only')) {
            $this->info("Log-only mode: Backup file created but not sent");
            $this->info("Backup file: {$backupPath}");
            return Command::SUCCESS;
        }

        // Send email with backup attachment
        try {
            $this->info("Sending email with backup attachment...");

            // Get email configuration from environment
            $toEmail = env('BACKUP_EMAIL_TO');
            $fromEmail = env('BACKUP_EMAIL_FROM', config('mail.from.address'));
            $fromName = env('BACKUP_EMAIL_FROM_NAME', config('mail.from.name'));

            if (!$toEmail) {
                $this->error("BACKUP_EMAIL_TO not configured in .env");
                $this->error("Please set BACKUP_EMAIL_TO with the recipient email address");
                return Command::FAILURE;
            }

            // Send email with attachment
            Mail::send('emails.backup-notification', [
                'backupName' => $backupName,
                'backupPath' => $backupPath,
                'dbName' => $dbName,
                'backupSize' => filesize($backupPath)
            ], function ($message) use ($toEmail, $fromEmail, $fromName, $backupPath, $backupName, $dbName) {
                $message->to($toEmail)
                        ->from($fromEmail, $fromName)
                        ->subject('Database Backup: ' . $dbName . ' - ' . date('Y-m-d H:i:s'))
                        ->attach($backupPath, [
                            'as' => $backupName,
                            'mime' => 'application/gzip'
                        ]);
            });

            $this->info("Email sent successfully to: {$toEmail}");

            // Clean up local backup file if not disabled
            if (!$this->option('no-cleanup')) {
                unlink($backupPath);
                $this->info("Local backup file deleted.");
            } else {
                $this->info("Local backup file retained at: {$backupPath}");
            }

            // Log the backup
            $this->logBackup($toEmail, $backupName);

            $this->info("\nBackup completed successfully!");
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            $this->error("Trace: " . $e->getTraceAsString());

            // Clean up on error
            if (file_exists($backupPath) && !$this->option('no-cleanup')) {
                unlink($backupPath);
            }

            return Command::FAILURE;
        }
    }

    /**
     * Log backup information to a file
     */
    private function logBackup(string $toEmail, string $fileName): void
    {
        $logPath = storage_path('app/backup-temp/backup.log');

        $logEntry = sprintf(
            "[%s] Backup: %s (Sent to: %s)\n",
            date('Y-m-d H:i:s'),
            $fileName,
            $toEmail
        );

        file_put_contents($logPath, $logEntry, FILE_APPEND);
    }
}
