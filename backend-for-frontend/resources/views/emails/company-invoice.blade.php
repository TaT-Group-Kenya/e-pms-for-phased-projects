<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Company Invoice {{ $invoice->invoice_number }}</title>
</head>
<body>
    <p>Dear {{ $recipientName }},</p>

    <p>
        Please find attached company invoice <strong>{{ $invoice->invoice_number }}</strong>
        @if($projectName)
            for <strong>{{ $projectName }}</strong>
        @endif
        from {{ $fromName }}.
    </p>

    <p>
        The invoice details the amounts payable for the project work completed.
        Should you have any questions or require further clarification, please do not hesitate to contact us.
    </p>

    <p>Kind regards,<br>
    {{ $fromName }}</p>
</body>
</html>
