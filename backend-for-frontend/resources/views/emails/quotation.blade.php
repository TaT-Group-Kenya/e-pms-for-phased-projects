<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quotation {{ $quotation->quotation_number }}</title>
</head>
<body>
    <p>Dear {{ $recipientName }},</p>

    <p>
        Please find attached quotation <strong>{{ $quotation->quotation_number }}</strong>
        @if($projectName)
            for <strong>{{ $projectName }}</strong>
        @endif
        from {{ $fromName }}.
    </p>

    <p>
        The quotation outlines the proposed scope of work and associated costs.
        Should you have any questions or require further clarification, please do not hesitate to contact us.
    </p>

    <p>Kind regards,<br>
    {{ $fromName }}</p>
</body>
</html>
