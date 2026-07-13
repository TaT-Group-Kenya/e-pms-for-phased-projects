<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Database Backup Notification</title>
</head>
<body>
    <h2>Database Backup Completed</h2>
    
    <p>Your database backup has been completed successfully.</p>
    
    <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px 0;">
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Database Name:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $dbName }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Backup File:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $backupName }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Backup Size:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ number_format($backupSize / 1024, 2) }} KB</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Backup Time:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ date('Y-m-d H:i:s') }}</td>
        </tr>
    </table>
    
    <p>The backup file is attached to this email as a gzipped SQL file.</p>
    
    <p><strong>Important:</strong> Please verify the backup file and store it securely.</p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    
    <p style="font-size: 12px; color: #666;">
        This is an automated message from your Laravel application.<br>
        Please do not reply to this email.
    </p>
</body>
</html>
