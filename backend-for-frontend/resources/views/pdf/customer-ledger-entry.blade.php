<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customer Ledger {{ $entry->transaction_number ?? ('CUST-LEDGER-' . $entry->id) }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { width: 100%; margin-bottom: 20px; }
        .header > div:last-child { float: right; text-align: right; }
        .logo img { height: 40px; width: auto; }
        .brand-name { font-size: 18px; font-weight: 700; color: #111827; }
        .muted { color: #6b7280; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .badge-status { background-color: #dbeafe; color: #1d4ed8; }
        h1 { font-size: 20px; margin: 0 0 4px 0; }
        h2 { font-size: 14px; margin: 0 0 4px 0; }
        h3 { font-size: 13px; margin: 0 0 4px 0; }
        .section { margin-bottom: 12px; clear: both; }
        .two-col { width: 100%; }
        .two-col .card { display: block; width: 100%; margin-bottom: 8px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 8px; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        table.meta-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        table.meta-table th,
        table.meta-table td { padding: 3px 4px; text-align: left; }
        table.meta-table th { color: #4b5563; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
        table.meta-table td { font-size: 11px; }
        .text-sm { font-size: 11px; }
        .font-semibold { font-weight: 600; }
        .mt-1 { margin-top: 4px; }
        .mt-2 { margin-top: 8px; }
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
        .header-image { width: 100%; margin-bottom: 20px; }
        .header-image img { width: 100%; height: auto; display: block; }
    </style>
</head>
<body>
@php
        $headerImage = file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null;
    $number = $entry->transaction_number ?? ('CUST-LEDGER-' . $entry->id);
@endphp

<div class="header-image">
    @if($headerImage && file_exists($headerImage))
        <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents($headerImage)) }}" alt="Header Image">
    @endif
</div>

<div class="header">
    <div style="text-align: right;">
        <h1>Customer Ledger Entry</h1>
        <div class="muted">Entry #: {{ $number }}</div>
        <div class="muted">Date: {{ optional($entry->transaction_date ?? $entry->created_at)->format('d/m/Y') }}</div>
        @if($entry->transaction_status)
            <div class="badge badge-status mt-2">{{ ucfirst($entry->transaction_status) }}</div>
        @endif
    </div>
</div>

<div class="section two-col">
    <div class="card">
        <h2>Customer</h2>
        <table class="meta-table">
            <tr>
                <th>Name</th>
                <th>Payment Ref</th>
                <th>Source</th>
                <th>Related Entry</th>
            </tr>
            <tr>
                <td>
                    @if($entry->customer)
                        <span class="font-semibold">{{ $entry->customer->name }}</span>
                    @else
                        -
                    @endif
                </td>
                <td>
                    @if($entry->payment)
                        {{ $entry->payment->transaction_number ?? $entry->payment->id }}
                    @else
                        -
                    @endif
                </td>
                <td>
                    {{ $entry->source_type ?? '-' }} @if($entry->source_id) #{{ $entry->source_id }} @endif
                </td>
                <td>
                    @if($entry->relatedTransaction)
                        {{ $entry->relatedTransaction->transaction_number ?? ('CUST-LEDGER-' . $entry->relatedTransaction->id) }}
                    @else
                        -
                    @endif
                </td>
            </tr>
        </table>
    </div>
    <div class="card">
        <h2>Amounts</h2>
        <table class="meta-table">
            <tr>
                <th>Transaction Amount</th>
                <th>Base Amount</th>
                <th>Exchange Rate</th>
                <th>Tax (Txn)</th>
                <th>Tax (Base)</th>
                <th>Net (Txn)</th>
                <th>Net (Base)</th>
            </tr>
            <tr>
                <td class="font-semibold">
                    {{ $entry->transaction_currency ?? '' }} {{ number_format((float) $entry->amount, 2) }}
                </td>
                <td class="font-semibold">
                    {{ $entry->base_currency ?? '' }} {{ number_format((float) $entry->converted_amount, 2) }}
                </td>
                <td>{{ number_format((float) ($entry->exchange_rate ?? 1), 4) }}</td>
                <td>{{ number_format((float) $entry->tax_amount, 2) }}</td>
                <td>{{ number_format((float) ($entry->converted_tax_amount ?? 0), 2) }}</td>
                <td class="font-semibold">{{ number_format((float) $entry->net_amount, 2) }}</td>
                <td class="font-semibold">{{ number_format((float) ($entry->converted_net_amount ?? 0), 2) }}</td>
            </tr>
        </table>
    </div>
</div>

<div class="section two-col">
    <div class="card">
        <h2>Classification</h2>
        <table class="meta-table">
            <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Fiscal Year</th>
                <th>Accounting Period</th>
            </tr>
            <tr>
                <td>{{ $entry->transaction_type ?? '-' }}</td>
                <td>{{ $entry->category ?? '-' }}</td>
                <td>{{ $entry->fiscal_year ?? '-' }}</td>
                <td>{{ $entry->accounting_period ?? '-' }}</td>
            </tr>
        </table>
    </div>
    <div class="card">
        <h2>Accounts & Channel</h2>
        <table class="meta-table">
            <tr>
                <th>Debit Account</th>
                <th>Credit Account</th>
                <th>Bank Account</th>
                <th>Cheque #</th>
                <th>Recurring?</th>
                <th>Adjusting?</th>
            </tr>
            <tr>
                <td>
                    @if($entry->debitAccount)
                        {{ $entry->debitAccount->code }} - {{ $entry->debitAccount->name }}
                    @else
                        {{ $entry->account_debit ?? '-' }}
                    @endif
                </td>
                <td>
                    @if($entry->creditAccount)
                        {{ $entry->creditAccount->code }} - {{ $entry->creditAccount->name }}
                    @else
                        {{ $entry->account_credit ?? '-' }}
                    @endif
                </td>
                <td>{{ $entry->bank_account ?? '-' }}</td>
                <td>{{ $entry->check_number ?? '-' }}</td>
                <td>{{ $entry->is_recurring ? 'Yes' : 'No' }}</td>
                <td>{{ $entry->is_adjusting_entry ? 'Yes' : 'No' }}</td>
            </tr>
        </table>
    </div>
</div>

@if($entry->narration)
    <div class="section card">
        <h2>Narration</h2>
        <p class="text-sm mt-1">{{ $entry->narration }}</p>
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
