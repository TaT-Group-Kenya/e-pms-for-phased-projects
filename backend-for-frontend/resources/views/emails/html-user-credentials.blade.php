<!DOCTYPE html>
<html>
<head>
    <title>Your Account Credentials</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .credentials { background: white; border: 1px solid #e5e7eb; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{ config('app.name') }}</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $user_name }},</h2>
            
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials">
                <p><strong>Email (Username):</strong> {{ $user_email }}</p>
                <p><strong>Password:</strong> <span style="font-family: monospace; background: #f3f4f6; padding: 3px 6px; border-radius: 3px;">{{ $password }}</span></p>
            </div>
            
            <p>{{ $password_note }}</p>
            
            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/sign-in" class="button">
                    Login to Your Account
                </a>
            </div>
            
            <p>If you need any assistance, please contact our support team.</p>
            
            <p>Thanks,<br>{{ config('app.name') }} Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>