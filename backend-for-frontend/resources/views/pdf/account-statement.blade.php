<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Account Statement - {{ $account->name }} ({{ $account->code }})</title>
    <style>
        @page { margin: 24mm 18mm; }
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 11px;
            color: #111827;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 8px;
        }
        .brand-name {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: #111827;
        }
        .brand-sub {
            font-size: 10px;
            color: #6B7280;
        }
        .statement-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .statement-subtitle {
            font-size: 10px;
            color: #6B7280;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0 12px 0;
        }
        .meta-block {
            font-size: 10px;
        }
        .meta-label {
            font-weight: 600;
            letter-spacing: .06em;
            text-transform: uppercase;
            color: #6B7280;
        }
        .meta-value {
            margin-top: 2px;
            color: #111827;
        }
        .pill {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 9999px;
            font-size: 9px;
            font-weight: 600;
        }
        .pill-primary {
            background-color: #EEF2FF;
            color: #4338CA;
        }
        .pill-muted {
            background-color: #F3F4F6;
            color: #4B5563;
        }
        .summary-grid {
            width: 100%;
            border: 1px solid #E5E7EB;
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 12px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
        }
        .summary-label {
            color: #6B7280;
        }
        .summary-value {
            font-weight: 600;
            color: #111827;
        }
        table.statement {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }
        table.statement thead tr {
            background-color: #F9FAFB;
        }
        table.statement th,
        table.statement td {
            border-bottom: 1px solid #E5E7EB;
            padding: 4px 3px;
        }
        table.statement th {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .06em;
            text-align: left;
            color: #6B7280;
            white-space: nowrap;
        }
        table.statement td {
            font-size: 9px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-muted { color: #6B7280; }
        .text-xs { font-size: 8px; }
        .mt-4 { margin-top: 12px; }
        .header-image { width: 100%; margin-bottom: 20px; }
        .header-image img { width: 100%; height: auto; display: block; }
    </style>
</head>
<body>
    @php
        $headerImage = file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null;
    @endphp
    <div class="header-image">
        @if($headerImage && file_exists($headerImage))
            <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents($headerImage)) }}" alt="Header Image">
        @endif
    </div>
    <div class="header">
        <div>
            <div class="brand-name">{{ $senderName }}</div>
            <div class="brand-sub">
                {{ $senderAddressLine1 }}
                @if($senderCity) · {{ $senderCity }}@endif
                @if($senderCountry) · {{ $senderCountry }}@endif
            </div>
            <div class="brand-sub">
                @if($senderPhone) Tel: {{ $senderPhone }} · @endif
                @if($senderEmail) {{ $senderEmail }} @endif
                @if($senderWebsite) · {{ $senderWebsite }} @endif
            </div>
        </div>
        <div style="text-align:right;">
            <div class="statement-title">Account Statement</div>
            <div class="statement-subtitle">
                Generated {{ $generatedAt->format('d M Y H:i') }}
            </div>
            <div class="statement-subtitle">
                @if(!empty($meta['from']) || !empty($meta['to']))
                    Period:
                    {{ $meta['from'] ?: 'Beginning' }} - {{ $meta['to'] ?: 'Today' }}
                @else
                    Full history
                @endif
            </div>
        </div>
    </div>

    <div class="meta-row">
        <div class="meta-block">
            <div class="meta-label">Account</div>
            <div class="meta-value">
                <strong>{{ $account->name }}</strong><br>
                Code: {{ $account->code }}<br>
                Type: {{ $account->type }} · Group: {{ $account->group }}<br>
                Currency: {{ $account->currency ?? 'KES' }}
            </div>
        </div>
        <div class="meta-block" style="text-align:right;">
            <div class="meta-label">Summary</div>
            <div class="meta-value">
                <span class="pill pill-primary">
                    Closing Balance: {{ $account->currency ?? 'KES' }}
                    {{ number_format($meta['closing_balance_base'] ?? 0, 2) }}
                </span><br>
                <span class="pill pill-muted">
                    Debits: {{ number_format($meta['total_debit_base'] ?? 0, 2) }} ·
                    Credits: {{ number_format($meta['total_credit_base'] ?? 0, 2) }}
                </span>
            </div>
        </div>
    </div>

    <div class="summary-grid">
        <div class="summary-row">
            <div class="summary-label">Opening balance (approx.)</div>
            <div class="summary-value">
                {{ $account->currency ?? 'KES' }}
                {{ number_format(($meta['closing_balance_base'] ?? 0) - (($meta['total_credit_base'] ?? 0) - ($meta['total_debit_base'] ?? 0)), 2) }}
            </div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Net movement in period</div>
            <div class="summary-value">
                {{ $account->currency ?? 'KES' }}
                {{ number_format((($meta['total_credit_base'] ?? 0) - ($meta['total_debit_base'] ?? 0)), 2) }}
            </div>
        </div>
    </div>

    <table class="statement">
        <thead>
            <tr>
                <th>Date</th>
                <th>Posted</th>
                <th>Ref</th>
                <th>Customer</th>
                <th>Company</th>
                <th>Description</th>
                <th class="text-right">Debit</th>
                <th class="text-right">Credit</th>
                <th class="text-right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ $row['transaction_date'] ? \Carbon\Carbon::parse($row['transaction_date'])->format('d/m/Y') : '-' }}</td>
                    <td>{{ $row['posted_date'] ? \Carbon\Carbon::parse($row['posted_date'])->format('d/m/Y') : '-' }}</td>
                    <td>{{ $row['transaction_number'] ?? '-' }}</td>
                    <td>{{ $row['customer_name'] ?? '-' }}</td>
                    <td>{{ $row['company_name'] ?? '-' }}</td>
                    <td>{{ $row['narration'] ?? '-' }}</td>
                    <td class="text-right">
                        {{ number_format($row['debit_base'] ?? 0, 2) }}
                    </td>
                    <td class="text-right">
                        {{ number_format($row['credit_base'] ?? 0, 2) }}
                    </td>
                    <td class="text-right">
                        {{ number_format($row['running_balance_base'] ?? 0, 2) }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center text-muted">
                        No transactions available for this account.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="mt-4 text-xs text-muted">
        Statement is generated from ledger and transaction data recorded in EPMS.
    </div>
</body>
</html>
