<?php

/**
 * Database Backup Script - Sends Email with Attachment
 * 
 * This script creates a MySQL database backup and sends it via email.
 * It's designed to run as a cron job.
 * 
 * Usage: php tools/backup-to-google-drive.php
 */

require __DIR__.'/../vendor/autoload.php';

use Illuminate\Support\Facades\Mail;

// Load Laravel application
$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Configuration
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

echo "Starting database backup...\n";
echo "Database: $dbName\n";

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
    echo "Error: Database backup failed!\n";
    echo "Output: " . implode("\n", $output) . "\n";
    exit(1);
}

echo "Database backup created: $backupName\n";

// Send email with backup attachment
try {
    echo "Sending email with backup attachment...\n";
    
    // Get email configuration from environment
    $toEmail = env('BACKUP_EMAIL_TO');
    $fromEmail = env('BACKUP_EMAIL_FROM', config('mail.from.address'));
    $fromName = env('BACKUP_EMAIL_FROM_NAME', config('mail.from.name'));
    
    if (!$toEmail) {
        echo "Error: BACKUP_EMAIL_TO not configured in .env\n";
        echo "Please set BACKUP_EMAIL_TO with the recipient email address\n";
        exit(1);
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
    
    echo "Email sent successfully to: $toEmail\n";
    
    // Clean up local backup file
    unlink($backupPath);
    echo "Local backup file deleted.\n";
    
    // Log the backup
    logBackup($toEmail, $backupName);
    
    echo "\nBackup completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    
    // Clean up on error
    if (file_exists($backupPath)) {
        unlink($backupPath);
    }
    
    exit(1);
}

/**
 * Log backup information to a file
 */
function logBackup(string $toEmail, string $fileName): void
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
