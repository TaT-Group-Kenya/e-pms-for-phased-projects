<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>General Ledger Report</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo img { height: 40px; width: auto; }
        .brand-name { font-size: 18px; font-weight: 700; color: #111827; }
        .muted { color: #6b7280; }
        h1 { font-size: 20px; margin: 0 0 4px 0; }
        .section { margin-bottom: 16px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .table th, .table td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        .table th { background-color: #f3f4f6; font-weight: 600; }
        .magic-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
        .header-image { width: 100%; margin-bottom: 20px; }
        .header-image img { width: 100%; height: auto; display: block; }
    </style>
</head>
<body>
@php
        $logoData = file_exists($instanceLogo) ? base64_encode(file_get_contents($instanceLogo)) : null;
        $headerImage = file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null;
@endphp

<div class="header-image">
    @if($headerImage && file_exists($headerImage))
        <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents($headerImage)) }}" alt="Header Image">
    @endif
</div>

<div class="header">
    <table class="magic-table">
        <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                <div class="logo">
                    @if($logoData)
                    <img src="data:image/png;base64,{{ $logoData }}" alt="Company Logo">
                    @else
                    <div class="brand-name">{{ $senderName ?? 'Company' }}</div>
                    @endif


                </div>
            </td>
            <td style="width: 50%; vertical-align: top; text-align: right;">
                <h1>General Ledger Report</h1>
                <div class="muted">Generated on {{ $generatedAt->format('d M Y H:i') }}</div>
            </td>
        </tr>
    </table>
</div>
<div class="section">
    <h2>Receivables</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Transaction #</th>
                <th>Project</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Tax</th>
                <th>Net</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
        @foreach($data['receivables'] as $payment)
            <tr>
                <td>{{ $payment->transaction_number ?? '' }}</td>
                <td>{{ $payment->project_name ?? '' }}</td>
                <td>{{ $payment->customer_name ?? '' }}</td>
                <td>{{ number_format((float) $payment->amount_paid ?? 0, 2) }}</td>
                <td>{{ $payment->currency ?? 'KES' }}</td>
                <td>{{ number_format((float) $payment->tax_amount ?? 0, 2) }}</td>
                <td>{{ number_format((float) $payment->net_amount ?? 0, 2) }}</td>
                <td>{{ $payment->date }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <br>
    <div class="section">
        <strong>Total Receivables:</strong> {{ number_format((float) $data['totals']['receivables']['total'], 2) }}<br>
        <strong>Receivables Taxes:</strong> {{ number_format((float) $data['totals']['receivables']['taxes'], 2) }}<br>
        <strong>Receivables Net:</strong> {{ number_format((float) $data['totals']['receivables']['net'], 2) }}
    </div>
</div>

<div class="section">
    <h2>Payables</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Transaction #</th>
                <th>Project</th>
                <th>Company</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Tax</th>
                <th>Net</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
        @foreach($data['payables'] as $payment)
            <tr>
                <td>{{ $payment->transaction_number ?? '' }}</td>
                <td>{{ $payment->project_name ?? '' }}</td>
                <td>{{ $payment->company_name ?? '' }}</td>
                <td>{{ number_format((float) $payment->amount_paid ?? 0, 2) }}</td>
                <td>{{ $payment->currency ?? 'KES' }}</td>
                <td>{{ number_format((float) $payment->tax_amount ?? 0, 2) }}</td>
                <td>{{ number_format((float) $payment->net_amount ?? 0, 2) }}</td>
                <td>{{ $payment->date }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <br>
    <div class="section">
        <strong>Total Payables:</strong> {{ number_format((float) $data['totals']['payables']['total'], 2) }}<br>
        <strong>Payables Taxes:</strong> {{ number_format((float) $data['totals']['payables']['taxes'], 2) }}<br>
        <strong>Payables Net:</strong> {{ number_format((float) $data['totals']['payables']['net'], 2) }}
    </div>
</div>

<div class="footer">
    Generated by {{ $senderName ?? 'Company' }} &middot; {{ $senderEmail ?? '' }}
</div>
</body>
</html>