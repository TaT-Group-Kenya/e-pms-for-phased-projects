<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Email Backup Configuration
    |--------------------------------------------------------------------------
    |
    | This file stores the configuration for email backup integration.
    | All sensitive credentials should be stored in .env file.
    |
    */

    // Recipient email address for backup notifications
    'email_to' => env('BACKUP_EMAIL_TO'),

    // Sender email address (optional, defaults to mail.from.address)
    'email_from' => env('BACKUP_EMAIL_FROM'),

    // Sender email name (optional, defaults to mail.from.name)
    'email_from_name' => env('BACKUP_EMAIL_FROM_NAME'),

    // Number of backups to keep in local storage
    'keep_backups' => env('BACKUP_KEEP_COUNT', 10),

    // Enable/disable backup uploads
    'enabled' => env('BACKUP_ENABLED', true),
];
