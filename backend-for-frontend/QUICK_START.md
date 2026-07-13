# Quick Start - Database Backup via Email

## Setup in 3 Steps

### Step 1: Configure Email in Laravel
Ensure your `.env` has proper mail configuration:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourserver.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-from-email@example.com
```

### Step 2: Configure Backup Email
Add to your `.env`:
```env
BACKUP_EMAIL_TO=your-email@example.com
```

### Step 3: Test the Backup
```bash
php artisan backup:email
```

## Cron Setup (Optional)
```bash
crontab -e
# Add: 0 2 * * * /usr/bin/php /path/to/artisan backup:email >> /path/to/storage/logs/backup.log 2>&1
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `php artisan backup:email` | Create and email backup |
| `php artisan backup:cleanup --days=10` | Remove old backups |
| `php artisan backup:cleanup --dry-run` | Preview cleanup |

## Files Created
- `tools/backup-to-google-drive.php` - Standalone script
- `app/Console/Commands/BackupToGoogleDrive.php` - Artisan command
- `app/Console/Commands/CleanupOldBackups.php` - Cleanup command
- `config/backup.php` - Configuration
- `resources/views/emails/backup-notification.blade.php` - Email template
- `BACKUP_SETUP.md` - Detailed guide
- `tools/README.md` - Tools documentation

## Why Email Backup?
- ✅ No external services required
- ✅ No storage quota issues
- ✅ Immediate access to backup
- ✅ Easy verification
- ✅ Simple setup
