<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Transaction {{ $transaction->transaction_number ?? ('TXN-' . $transaction->id) }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo img { height: 40px; width: auto; }
        .brand-name { font-size: 18px; font-weight: 700; color: #111827; }
        .muted { color: #6b7280; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .badge-status { background-color: #dbeafe; color: #1d4ed8; }
        h1 { font-size: 20px; margin: 0 0 4px 0; }
        h2 { font-size: 14px; margin: 0 0 4px 0; }
        h3 { font-size: 13px; margin: 0 0 4px 0; }
        .section { margin-bottom: 16px; }
        .two-col { display: flex; justify-content: space-between; gap: 24px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .label { color: #4b5563; font-size: 11px; }
        .value { font-size: 12px; }
        .text-sm { font-size: 11px; }
        .font-semibold { font-weight: 600; }
        .mt-1 { margin-top: 4px; }
        .mt-2 { margin-top: 8px; }
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
@php
        $logoData = file_exists($instanceLogo) ? base64_encode(file_get_contents($instanceLogo)) : null;
    $number = $transaction->transaction_number ?? ('TXN-' . $transaction->id);
@endphp

<div class="header">
    <table class="magic-table">
        <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                <div class="logo">
        @if($logoData)
            <img src="data:image/png;base64,{{ $logoData }}" alt="Company Logo">
        @else
            <div class="brand-name">{{ $senderName }}</div>
        @endif
                </div>
            </td>
            <td style="width: 50%; vertical-align: top; text-align: right;">
    <h1>Transaction Summary</h1>
        <div class="muted">Transaction #: {{ $number }}</div>
        <div class="muted">Date: {{ optional($transaction->transaction_date ?? $transaction->created_at)->format('d/m/Y') }}</div>
        @if($transaction->transaction_status)
            <div class="badge badge-status mt-2">{{ ucfirst($transaction->transaction_status) }}</div>
        @endif
            </td>
        </tr>
    </table>
</div>

<div class="section two-col">
    <div class="card" style="flex: 1;">
        <h2>Amount & Currency</h2>
        <div class="row">
            <div class="label">Base Amount</div>
            <div class="value font-semibold">
                {{ $transaction->base_currency ?? '' }} {{ number_format((float) $transaction->amount, 2) }}
            </div>
        </div>
        <div class="row">
            <div class="label">Exchange Rate</div>
            <div class="value">{{ number_format((float) ($transaction->exchange_rate ?? 1), 4) }}</div>
        </div>
        <div class="row">
            <div class="label">Converted Amount</div>
            <div class="value font-semibold">{{ number_format((float) $transaction->converted_amount, 2) }}</div>
        </div>
        <div class="row mt-1">
            <div class="label">Tax Amount</div>
            <div class="value">{{ number_format((float) $transaction->tax_amount, 2) }}</div>
        </div>
        <div class="row">
            <div class="label">Net Amount</div>
            <div class="value font-semibold">{{ number_format((float) $transaction->net_amount, 2) }}</div>
        </div>
    </div>
    <div class="card" style="flex: 1;">
        <h2>Classification</h2>
        <div class="row">
            <div class="label">Type</div>
            <div class="value">{{ $transaction->transaction_type ?? '-' }}</div>
        </div>
        <div class="row">
            <div class="label">Category</div>
            <div class="value">{{ $transaction->category ?? '-' }}</div>
        </div>
        <div class="row">
            <div class="label">Payment Method</div>
            <div class="value">{{ optional($transaction->paymentMethod)->name ?? $transaction->payment_method ?? '-' }}</div>
        </div>
        <div class="row">
            <div class="label">Cost Center</div>
            <div class="value">{{ optional($transaction->costCenter)->name ?? '-' }}</div>
        </div>
        <div class="row mt-1">
            <div class="label">Fiscal Year</div>
            <div class="value">{{ $transaction->fiscal_year ?? '-' }}</div>
        </div>
        <div class="row">
            <div class="label">Accounting Period</div>
            <div class="value">{{ $transaction->accounting_period ?? '-' }}</div>
        </div>
    </div>
</div>

<div class="section two-col">
    <div class="card" style="flex: 1;">
        <h2>Parties</h2>
        <div class="row">
            <div class="label">Customer</div>
            <div class="value">
                @if($transaction->customer)
                    <span class="font-semibold">{{ $transaction->customer->name }}</span>
                @else
                    -
                @endif
            </div>
        </div>
        <div class="row">
            <div class="label">Company</div>
            <div class="value">
                @if($transaction->company)
                    <span class="font-semibold">{{ $transaction->company->name }}</span>
                @else
                    -
                @endif
            </div>
        </div>
        <div class="row mt-1">
            <div class="label">Source</div>
            <div class="value">{{ $transaction->source_type ?? '-' }} @if($transaction->source_id) #{{ $transaction->source_id }} @endif</div>
        </div>
        <div class="row">
            <div class="label">Related Transaction</div>
            <div class="value">
                @if($transaction->relatedTransaction)
                    {{ $transaction->relatedTransaction->transaction_number ?? ('TXN-' . $transaction->relatedTransaction->id) }}
                @else
                    -
                @endif
            </div>
        </div>
    </div>
    <div class="card" style="flex: 1;">
        <h2>Accounts & Channel</h2>
        <div class="row">
            <div class="label">Debit Account</div>
            <div class="value">{{ $transaction->account_debit ?? '-' }}</div>
        </div>
        <div class="row">
            <div class="label">Credit Account</div>
            <div class="value">{{ $transaction->account_credit ?? '-' }}</div>
        </div>
        <div class="row mt-1">
            <div class="label">Bank Account</div>
            <div class="value">{{ $transaction->bank_account ?? '-' }}</div>
        </div>
        <div class="row">
            <div class="label">Cheque #</div>
            <div class="value">{{ $transaction->check_number ?? '-' }}</div>
        </div>
        <div class="row mt-1">
            <div class="label">Recurring?</div>
            <div class="value">{{ $transaction->is_recurring ? 'Yes' : 'No' }}</div>
        </div>
        <div class="row">
            <div class="label">Adjusting Entry?</div>
            <div class="value">{{ $transaction->is_adjusting_entry ? 'Yes' : 'No' }}</div>
        </div>
    </div>
</div>

@if($transaction->narration)
    <div class="section card">
        <h2>Narration</h2>
        <p class="text-sm mt-1">{{ $transaction->narration }}</p>
    </div>
@endif

<div class="section card">
    <h2>Prepared By</h2>
    <div class="text-sm">
        <span class="font-semibold">{{ $senderName }}</span><br>
        @if(!empty($senderAddressLine1))
            {{ $senderAddressLine1 }}<br>
        @endif
        @if(!empty($senderCity) || !empty($senderState) || !empty($senderCountry))
            {{ trim(($senderCity ?? '') . (isset($senderCity, $senderState) ? ', ' : '') . ($senderState ?? '')) }}@if(!empty($senderCountry)), {{ $senderCountry }}@endif<br>
        @endif
        @if(!empty($senderPhone))
            Phone: {{ $senderPhone }}<br>
        @endif
        @if(!empty($senderEmail))
            Email: {{ $senderEmail }}<br>
        @endif
        @if(!empty($senderWebsite))
            Website: {{ $senderWebsite }}
        @endif
    </div>
</div>

<div class="footer">
    Generated on {{ $generatedAt->format('d M Y H:i') }} by {{ $senderName }} &middot; {{ $senderEmail }}
</div>
</body>
</html>
