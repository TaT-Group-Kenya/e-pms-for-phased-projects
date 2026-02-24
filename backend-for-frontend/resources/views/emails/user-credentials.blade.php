@component('mail::message')
# Welcome to PMS System

Hello {{ $user_name }},

Your account has been successfully created. Here are your login credentials:

**Email (Username):** {{ $user_email }}

**Password:** {{ $password }}

{{ $password_note }}

@component('mail::button', ['url' => config('app.url') . '/sign-in'])
Login to Your Account
@endcomponent

If you need any assistance, please contact our support team.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
