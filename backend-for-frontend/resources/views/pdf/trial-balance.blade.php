<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Trial Balance {{ $run->run_number }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 11px; color: #111827; }
        .header { width: 100%; margin-bottom: 16px; }
        .header > div:last-child { float: right; text-align: right; }
        .header-image { width: 100%; margin-bottom: 16px; }
        .header-image img { width: 100%; height: auto; display: block; }
        .muted { color: #6b7280; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .badge-balanced { background-color: #dcfce7; color: #15803d; }
        .badge-unbalanced { background-color: #fee2e2; color: #b91c1c; }
        h1 { font-size: 20px; margin: 0 0 4px 0; }
        h2 { font-size: 13px; margin: 14px 0 6px 0; }
        .section { margin-bottom: 14px; }
        .meta-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .meta-table th, .meta-table td { text-align: left; padding: 4px 8px; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        .data-table th, .data-table td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
        .data-table th { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; text-align: left; }
        .data-table th.r, .data-table td.r { text-align: right; }
        .data-table td.cat { font-weight: 700; }
        .totals-row td { font-weight: 700; border-top: 2px solid #111827; border-bottom: none; }
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
@php
    $headerImage = file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null;
    $balanced = abs($totals['debit_kes'] - $totals['credit_kes']) < 0.01;
@endphp

<div class="header-image">
    @if($headerImage)
        <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents($headerImage)) }}" alt="Header Image">
    @endif
</div>

<div class="header">
    <div style="text-align: right;">
        <h1>Trial Balance</h1>
        <div class="muted">Run #: {{ $run->run_number }}</div>
        <div class="muted">As at: {{ optional($run->as_at_date)->format('d/m/Y') }}</div>
        <div class="muted">Forex rate (USD → KES): {{ number_format((float) $run->forex_rate, 6) }}</div>
        <div class="badge {{ $balanced ? 'badge-balanced' : 'badge-unbalanced' }} mt-2">
            {{ $balanced ? 'BALANCED' : 'OUT OF BALANCE' }}
        </div>
    </div>
</div>

<div class="section">
    <table class="meta-table">
        <tr>
            <th>Generated</th>
            <th>Base currency</th>
            <th>Fx application</th>
        </tr>
        <tr>
            <td>{{ optional($run->created_at)->format('d/m/Y H:i') }}</td>
            <td>{{ $run->base_currency }}</td>
            <td>USD bank balances at run rate · ledger rows at recorded rates</td>
        </tr>
    </table>
</div>

<h2>Trial Balance (KES)</h2>
<table class="data-table">
    <thead>
        <tr>
            <th class="r">#</th>
            <th>Type</th>
            <th>Code</th>
            <th>Account</th>
            <th class="r">Debit (KES)</th>
            <th class="r">Credit (KES)</th>
        </tr>
    </thead>
    <tbody>
        @php $i = 0; @endphp
        @foreach($lines as $line)
            @php $i++; @endphp
        <tr>
            <td class="r">{{ $i }}</td>
            <td>{{ $line->category }}</td>
            <td>{{ $line->account_name }}</td>
            <td class="r">{{ number_format($line->debit_kes, 2) }}</td>
            <td class="r">{{ number_format($line->credit_kes, 2) }}</td>
        </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr class="totals-row">
            <td colspan="3">TOTAL</td>
            <td></td>
            <td class="r">{{ number_format($totals['debit_kes'], 2) }}</td>
            <td class="r">{{ number_format($totals['credit_kes'], 2) }}</td>
        </tr>
    </tfoot>
</table>

<div class="section">
    <div class="muted" style="font-size: 10px; margin-top: 8px;">
        @if($balanced)
            Balanced: total debits equal total credits.
        @else
            Out of balance by {{ number_format($totals['debit_kes'] - $totals['credit_kes'], 2) }} KES.
        @endif
    </div>
</div>

<div class="footer">
    {{ config('app.name', 'EPMS') }} — Trial Balance {{ $run->run_number }}
</div>
</body>
</html>
