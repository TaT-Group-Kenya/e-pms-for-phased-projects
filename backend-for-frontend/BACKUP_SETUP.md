# Database Backup via Email Setup Guide

This document explains how to set up automated database backups sent via email for your Laravel application.

## Prerequisites

- PHP 8.2 or higher
- MySQL database
- Working email configuration in Laravel
- `mysqldump` utility installed

## Why Email Backup?

Email backup is ideal for:
- **Simple setup** - No external services required
- **Immediate access** - Get backup directly in your inbox
- **No storage quota issues** - Not limited by Google Drive quotas
- **Easy verification** - Download and verify backup immediately

## Installation

### 1. Install Dependencies

Run the following command to install the required packages:

```bash
composer update
```

### 2. Configure Email

Ensure your Laravel email configuration is set up in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourserver.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-from-email@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Configure Backup Email Settings

Add the following to your `.env` file:

```env
# Email Backup Configuration
BACKUP_EMAIL_TO=your-email@example.com
# Optional: Set sender email (defaults to mail.from.address)
# BACKUP_EMAIL_FROM=backup@example.com
# Optional: Set sender name (defaults to mail.from.name)
# BACKUP_EMAIL_FROM_NAME="Database Backup"
```

## Usage

### Manual Backup

Run the Artisan command manually:

```bash
php artisan backup:email
```

Options:
- `--no-cleanup`: Keep local backup files after sending
- `--log-only`: Only create backup without sending email

Or use the standalone script:

```bash
php tools/backup-to-google-drive.php
```

### Automated Backup (Cron Job)

Add the following to your crontab to run backups daily:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2:00 AM)
0 2 * * * /usr/bin/php /path/to/your/project/artisan backup:email >> /var/log/backup.log 2>&1
```

Or use the standalone script in cron:

```bash
# Add this line to run backup daily at 3:00 AM
0 3 * * * /usr/bin/php /path/to/your/project/tools/backup-to-google-drive.php >> /var/log/backup.log 2>&1
```

### View Backup Log

Check the backup log file:

```bash
cat storage/app/backup-temp/backup.log
```

## Configuration Options

### Keep Only Recent Backups

To automatically remove old local backups, you can add a cleanup script:

```bash
# Remove backups older than 7 days
find storage/app/backup-temp -name "backup_*.sql.gz" -mtime +7 -delete
```

### Backup Frequency

Adjust the cron schedule based on your needs:

- **Daily**: `0 2 * * *` (2:00 AM daily)
- **Weekly**: `0 2 * * 0` (2:00 AM Sunday)
- **Hourly**: `0 * * * *` (every hour)

## Email Content

The email includes:
- Database name
- Backup file name
- Backup size
- Backup timestamp
- The backup file as an attachment

## Security Notes

- Never commit `.env` file with credentials to version control
- Store backup files securely
- Use a dedicated email account for backups
- Monitor backup logs for failures
- Verify backup files periodically

## Troubleshooting

### Email Not Sending

If emails are not being sent:

1. Verify email configuration in `.env`
2. Test email sending: `php artisan tinker` then `Mail::raw('Test', function($m) { $m->to('test@example.com')->subject('Test'); });`
3. Check Laravel logs: `storage/logs/laravel.log`

### mysqldump Not Found

Install mysqldump or ensure it's in your PATH:

```bash
# macOS
brew install mysql

# Ubuntu/Debian
sudo apt-get install mysql-client

# CentOS/RHEL
sudo yum install mysql
```

### Large Database Issues

For large databases, increase PHP memory limit and timeout:

```ini
memory_limit = 512M
max_execution_time = 300
```

## Advanced: Combined Backup and Cleanup

Create a script `tools/backup-with-cleanup.sh`:

```bash
#!/bin/bash
cd /path/to/backend-for-frontend

# Run backup
php artisan backup:email

# Cleanup old backups (older than 7 days)
find storage/app/backup-temp -name "backup_*.sql.gz" -mtime +7 -delete
```

