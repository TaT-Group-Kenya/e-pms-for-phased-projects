# Database Backup System (Email)

This directory contains tools for database backup and management using email delivery.

## Available Scripts

### 1. Backup to Email

#### Artisan Command (Recommended)
```bash
php artisan backup:email
```

Options:
- `--no-cleanup`: Keep local backup files after sending
- `--log-only`: Only create backup without sending email

#### Standalone Script
```bash
php tools/backup-to-google-drive.php
```

### 2. Cleanup Old Backups

Remove backups older than specified days:
```bash
php artisan backup:cleanup --days=10
```

Options:
- `--dry-run`: Show what would be deleted without deleting
- `--days=N`: Number of days to keep (default: 10)

## Setup Instructions

1. **Configure Email in Laravel**
   - Ensure your `.env` has proper mail configuration
   - Test email sending works

2. **Configure Backup Email**
   - Add to your `.env` file:
   ```env
   BACKUP_EMAIL_TO=your-email@example.com
   ```

3. **Set Up Cron Job**
   
   Edit crontab:
   ```bash
   crontab -e
   ```
   
   Add backup schedule (example: daily at 2 AM):
   ```bash
   0 2 * * * /usr/bin/php /path/to/artisan backup:email >> /path/to/storage/logs/backup.log 2>&1
   ```

## Configuration

### Config File
Location: `config/backup.php`

Key settings:
- `email_to`: Recipient email address
- `email_from`: Sender email (optional)
- `email_from_name`: Sender name (optional)
- `keep_backups`: Number of backups to retain (default: 10)

### Environment Variables
- `BACKUP_EMAIL_TO`: Recipient email address (required)
- `BACKUP_EMAIL_FROM`: Sender email (optional, defaults to mail.from.address)
- `BACKUP_EMAIL_FROM_NAME`: Sender name (optional, defaults to mail.from.name)
- `BACKUP_KEEP_COUNT`: Number of backups to keep
- `BACKUP_ENABLED`: Enable/disable backups

## Monitoring

### View Backup Log
```bash
cat storage/app/backup-temp/backup.log
```

### Check Recent Backups
```bash
ls -la storage/app/backup-temp/
```

### Test Backup Manually
```bash
php artisan backup:email
```

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Verify email configuration in `.env`
   - Check Laravel logs: `storage/logs/laravel.log`
   - Test email sending manually

2. **mysqldump Not Found**
   - Install MySQL client: `brew install mysql` (macOS) or `apt-get install mysql-client` (Linux)
   - Or add to PATH

3. **Large Database Issues**
   - Increase PHP memory: `memory_limit = 512M`
   - Increase execution time: `max_execution_time = 300`

4. **Permission Denied**
   - Check file permissions on backup directory

## Security

- Never commit `.env` with credentials to version control
- Store backup files securely
- Monitor backup logs regularly
- Verify backup files periodically

## Advanced Usage

### Custom Backup Schedule

Edit crontab:
```bash
crontab -e
```

Examples:
- Daily at 2 AM: `0 2 * * *`
- Weekly on Sunday: `0 2 * * 0`
- Every 6 hours: `0 */6 * * *`

### Manual Cleanup
```bash
php artisan backup:cleanup --days=7 --dry-run
php artisan backup:cleanup --days=7
```

### Combined Backup and Cleanup

Create a script `tools/backup-with-cleanup.sh`:
```bash
#!/bin/bash
cd /path/to/backend-for-frontend
php artisan backup:email
find storage/app/backup-temp -name "backup_*.sql.gz" -mtime +7 -delete
```

## Support

For detailed setup instructions, see `BACKUP_SETUP.md`
