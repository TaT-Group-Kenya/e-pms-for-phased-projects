<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order {{ $order->order_number }}</title>
</head>
<body>
    <p>Dear {{ $recipientName }},</p>

    <p>
        Please find attached order <strong>{{ $order->order_number }}</strong>
        @if($projectName)
            for <strong>{{ $projectName }}</strong>
        @endif
        from {{ $fromName }}.
    </p>

    <p>
        The order outlines the agreed scope of work and associated costs.
        Should you have any questions or require further clarification, please do not hesitate to contact us.
    </p>

    <p>Kind regards,<br>
    {{ $fromName }}</p>
</body>
</html>
