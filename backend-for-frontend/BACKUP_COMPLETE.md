# Database Backup via Email - Setup Complete

## Summary

I've successfully set up a database backup system for your Laravel application that:
1. Creates MySQL database backups
2. Sends them via email with the backup file as an attachment
3. Can run as a cron job for automation

## Files Created/Modified

### New Files
1. **`tools/backup-to-google-drive.php`** - Standalone backup script (renamed, now sends email)
2. **`app/Console/Commands/BackupToGoogleDrive.php`** - Artisan command for backups (renamed, now sends email)
3. **`app/Console/Commands/CleanupOldBackups.php`** - Command to clean old backups
4. **`config/backup.php`** - Backup configuration file
5. **`resources/views/emails/backup-notification.blade.php`** - Email notification template
6. **`BACKUP_SETUP.md`** - Detailed setup guide
7. **`tools/README.md`** - Tools documentation
8. **`crontab.example`** - Cron job examples
9. **`.env.sample`** - Updated with email configuration variables

### Modified Files
- **`.env.sample`** - Added email backup environment variables

## Dependencies

No additional dependencies required - uses Laravel's built-in Mail functionality.

## Usage

### Manual Backup

Using Artisan command:
```bash
php artisan backup:email
```

Options:
- `--no-cleanup` - Keep local backup files
- `--log-only` - Only create backup without sending email

Using standalone script:
```bash
php tools/backup-to-google-drive.php
```

### Cleanup Old Backups

```bash
php artisan backup:cleanup --days=10
```

Options:
- `--dry-run` - Show what would be deleted
- `--days=N` - Number of days to keep (default: 10)

### Automated Backup (Cron Job)

Edit crontab:
```bash
crontab -e
```

Add this line (runs daily at 2:00 AM):
```bash
0 2 * * * /usr/bin/php /Users/juma/Gigs/e-pms-for-phased-projects/backend-for-frontend/artisan backup:email >> /Users/juma/Gigs/e-pms-for-phased-projects/backend-for-frontend/storage/logs/backup.log 2>&1
```

## Configuration Required

Add these to your `.env` file:

```env
# Email Backup Configuration
BACKUP_EMAIL_TO=your-email@example.com
# Optional: Set sender email (defaults to mail.from.address)
# BACKUP_EMAIL_FROM=backup@example.com
# Optional: Set sender name (defaults to mail.from.name)
# BACKUP_EMAIL_FROM_NAME="Database Backup"
```

## Setup Steps

1. **Configure Email in Laravel**
   - Ensure your `.env` has proper mail configuration
   - Test email sending works

2. **Configure Backup Email**
   - Add `BACKUP_EMAIL_TO` to your `.env`

3. **Test the Backup**
   ```bash
   php artisan backup:email
   ```

## Notes

- Backups are compressed with gzip to save space
- Backup files are stored in `storage/app/backup-temp/`
- A log file is maintained at `storage/app/backup-temp/backup.log`
- The cleanup command helps manage storage by removing old backups

## Troubleshooting

If you encounter issues:
1. Check the backup log: `storage/app/backup-temp/backup.log`
2. Verify email configuration in `.env`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Ensure `mysqldump` is installed and in PATH

For detailed troubleshooting, see `BACKUP_SETUP.md`
