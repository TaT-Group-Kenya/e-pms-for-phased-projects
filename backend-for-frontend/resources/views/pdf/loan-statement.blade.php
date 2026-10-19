<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Loan Statement - {{ $loan->lender_name }}</title>
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
            padding: 2px 0;
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
        .section-title {
            font-size: 11px;
            font-weight: 600;
            margin: 14px 0 4px 0;
        }
        .header-image { width: 100%; margin-bottom: 20px; }
        .header-image img { width: 100%; height: auto; display: block; }
    </style>
</head>
<body>
    @php
        $headerImage = file_exists(public_path('header-01-portrait.jpeg')) ? public_path('header-01-portrait.jpeg') : (file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null);
        $currency = $loan->currency ?? 'KES';
        $terms = $loan->interest_type === 'none'
            ? 'No interest'
            : ucfirst($loan->interest_type).' @ '.number_format((float) $loan->interest_rate, 2).'% p.a. · '.$loan->tenure_months.' × '.$loan->repayment_frequency;
    @endphp
    <div class="header-image">
        @if($headerImage && file_exists($headerImage))
            <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents($headerImage)) }}" alt="Header Image">
        @endif
    </div>
    <div class="header">
        <div>
            <div class="brand-name">{{ $senderName }}</div>
            <div class="brand-sub">{{ $senderEmail }}</div>
        </div>
        <div style="text-align:right;">
            <div class="statement-title">Loan Statement</div>
            <div class="statement-subtitle">
                Generated {{ $generatedAt->format('d M Y H:i') }}
            </div>
        </div>
    </div>

    <div class="meta-row">
        <div class="meta-block">
            <div class="meta-label">Loan</div>
            <div class="meta-value">
                <strong>{{ $loan->lender_name }}</strong><br>
                Account: {{ $loan->account->name }} ({{ $loan->account->code }})<br>
                Terms: {{ $terms }}<br>
                Currency: {{ $currency }} · Status: {{ str_replace('_', ' ', $loan->status) }}
            </div>
        </div>
        <div class="meta-block" style="text-align:right;">
            <div class="meta-label">Summary</div>
            <div class="meta-value">
                <span class="pill pill-primary">
                    Outstanding: {{ $currency }} {{ number_format($summary['loan_balance'], 2) }}
                </span><br>
                <span class="pill pill-muted">
                    Repaid: {{ number_format($summary['total_repaid'], 2) }} ·
                    Interest paid: {{ number_format($summary['interest_repaid'], 2) }}
                </span>
            </div>
        </div>
    </div>

    <div class="summary-grid">
        <div class="summary-row">
            <div class="summary-label">Principal (borrowed amount)</div>
            <div class="summary-value">{{ $currency }} {{ number_format($summary['principal'] ?? $loan->principal, 2) }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Installed installment</div>
            <div class="summary-value">
                {{ number_format($loan->installment_amount ?? 0, 2) }}
            </div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Interest fallen due (uncollected)</div>
            <div class="summary-value">{{ number_format($summary['accrued_interest'], 2) }}</div>
        </div>
        <div class="summary-row">
            <div class="summary-label">Next payment due</div>
            <div class="summary-value">
                {{ $summary['next_due_date'] ? \Carbon\Carbon::parse($summary['next_due_date'])->format('d/m/Y').' · '.number_format($summary['next_due_amount'], 2) : '-' }}
            </div>
        </div>
    </div>

    <div class="section-title">Repayment Schedule</div>
    <table class="statement">
        <thead>
            <tr>
                <th>#</th>
                <th>Due Date</th>
                <th class="text-right">Principal</th>
                <th class="text-right">Interest</th>
                <th class="text-right">Total</th>
                <th class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($loan->schedule as $row)
                <tr>
                    <td>{{ $row->installment_number }}</td>
                    <td>{{ $row->due_date ? $row->due_date->format('d/m/Y') : '-' }}</td>
                    <td class="text-right">{{ number_format((float) $row->expected_principal, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $row->expected_interest, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $row->expected_principal + (float) $row->expected_interest, 2) }}</td>
                    <td class="text-center">{{ $row->status }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center text-muted">No schedule available.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">Repayments History</div>
    <table class="statement">
        <thead>
            <tr>
                <th>Date</th>
                <th>Paid From</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Principal</th>
                <th class="text-right">Interest</th>
                <th class="text-right">Balance After</th>
                <th>Reference</th>
            </tr>
        </thead>
        <tbody>
            @forelse($loan->repayments as $row)
                <tr>
                    <td>{{ $row->payment_date ? $row->payment_date->format('d/m/Y') : '-' }}</td>
                    <td>{{ $row->paidFromAccount ? $row->paidFromAccount->name.' ('.$row->paidFromAccount->code.')' : '-' }}</td>
                    <td class="text-right">{{ number_format((float) $row->amount_paid, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $row->principal_component, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $row->interest_component, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $row->balance_after, 2) }}</td>
                    <td>{{ $row->payment_reference ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center text-muted">No repayments recorded yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>