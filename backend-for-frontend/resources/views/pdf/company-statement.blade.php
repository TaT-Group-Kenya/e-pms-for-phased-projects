<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Statement of account - {{ $account->name }} ({{ $account->code }})</title>
    <style>
        @page { margin: 24mm 18mm; }
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 11px;
            color: #111827;
        }
        .center { text-align: center; }
        .header-logo { margin-bottom: 6px; }
        .title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .sub { font-size: 10px; color:#6B7280; margin-bottom: 8px; }
        .addresses { display:flex; justify-content:space-between; margin-bottom:12px; }
        .addr { width:48%; font-size:10px; }
        .addr .label { font-weight:600; color:#6B7280; text-transform:uppercase; letter-spacing:.06em; }
        table.statement { width:100%; border-collapse:collapse; margin-top:6px; }
        table.statement th, table.statement td { padding:6px 4px; border-bottom:1px solid #E5E7EB; font-size:10px; }
        table.statement thead tr { background:#F9FAFB; }
        table.statement th { text-transform:uppercase; color:#6B7280; font-size:9px; text-align:left; }
        .text-right{ text-align:right; }
        .text-center{ text-align:center; }
        .muted{ color:#6B7280; font-size:9px; }
        .small{ font-size:9px; }
        .mt-6{ margin-top:18px; }
    </style>
</head>
<body>
    <div class="center header-logo">
        @if(!empty($logoUrl))
            <img src="{{ $logoUrl }}" alt="Logo" style="max-height:64px; object-fit:contain;" />
        @endif
    </div>

    <div class="center">
        <div class="title">Statement of account</div>
        <div class="sub">tatement for {{ $meta['company_name'] ?? '' }}</div>
    </div>

    <div class="addresses">
        <div class="addr">
            <div class="label">From</div>
            <div class="small">
                <strong>{{ $senderName }}</strong><br>
                {{ $senderAddressLine1 ?? '' }}<br>
                @if(!empty($senderCity)){{ $senderCity }}@endif @if(!empty($senderCountry)) · {{ $senderCountry }}@endif<br>
                @if(!empty($senderPhone)) Tel: {{ $senderPhone }}@endif @if(!empty($senderEmail)) · {{ $senderEmail }}@endif
            </div>
        </div>

        <div class="addr" style="text-align:right;">
            <div class="label">To</div>
            <div class="small">
                <strong>{{ $meta['company_name'] ?? ($account->name ?? '') }}</strong><br>
                Code: {{ $account->code ?? '' }}<br>
                {{ $meta['transaction_currency'] ?? ($account->currency ?? 'KES') }}
            </div>
        </div>
    </div>

    <table class="statement">
        <thead>
            <tr>
                <th>Date</th>
                <th>Posted</th>
                <th>Job Ref</th>
                <th>Document #</th>
                <th>Description</th>
                <th class="text-right">Debit</th>
                <th class="text-right">Credit</th>
                <th class="text-right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ !empty($row['transaction_date']) ? \Carbon\Carbon::parse($row['transaction_date'])->format('d/m/Y') : (!empty($row['date']) ? \Carbon\Carbon::parse($row['date'])->format('d/m/Y') : '-') }}</td>
                    <td>{{ !empty($row['posted_date']) ? \Carbon\Carbon::parse($row['posted_date'])->format('d/m/Y') : '-' }}</td>
                    <td>{{ $row['job_reference'] ?? '-' }}</td>
                    <td>{{ $row['document_number'] ?? $row['transaction_number'] ?? '-' }}</td>
                    <td>{{ $row['description'] ?? $row['narration'] ?? '-' }}</td>
                    <td class="text-right">{{ number_format($row['debit_base'] ?? $row['debit_amount'] ?? 0, 2) }}</td>
                    <td class="text-right">{{ number_format($row['credit_base'] ?? $row['credit_amount'] ?? 0, 2) }}</td>
                    <td class="text-right">{{ number_format($row['running_balance_base'] ?? $row['balance'] ?? 0, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center muted">No transactions available for this period.</td>
                </tr>
            @endforelse
        </tbody>
        @if(!empty($totals))
            <tfoot>
                <tr style="background:#F9FAFB;">
                    <td colspan="5" class="text-right small"><strong>Totals</strong></td>
                    <td class="text-right"><strong>{{ number_format($totals['total_debit'] ?? $meta['total_debit_base'] ?? 0, 2) }}</strong></td>
                    <td class="text-right"><strong>{{ number_format($totals['total_credit'] ?? $meta['total_credit_base'] ?? 0, 2) }}</strong></td>
                    <td class="text-right"><strong>{{ number_format($totals['balance'] ?? $meta['closing_balance_base'] ?? 0, 2) }}</strong></td>
                </tr>
                <tr>
                    <td colspan="7" class="text-right small">Closing balance</td>
                    <td class="text-right"><strong>{{ number_format($totals['balance'] ?? $meta['closing_balance_base'] ?? 0, 2) }}</strong></td>
                </tr>
            </tfoot>
        @endif
    </table>

    <div class="mt-6" style="text-align:right; font-size:9px; color:#6B7280;">Date: {{ $generatedAt->format('d/m/Y') }}</div>

    <div class="center muted mt-6">From: {{ $meta['from'] ?? 'Beginning' }} To: {{ $meta['to'] ?? 'Today' }}</div>

    <div class="mt-6 muted small">Statement generated from EPMS ledger and transactional data.</div>
</body>
</html>
