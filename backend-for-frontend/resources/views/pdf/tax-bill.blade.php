<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tax Bill {{ $bill->bill_number }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo { height: 48px; width: auto; }
        .brand-name { font-size: 18px; font-weight: 700; color: #111827; }
        .muted { color: #6b7280; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .badge-status { background-color: #dcfce7; color: #15803d; }
        .badge-pending { background-color: #fef9c3; color: #a16207; }
        h1 { font-size: 20px; margin: 0 0 4px 0; }
        h3 { font-size: 12px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
        .section { margin-bottom: 18px; }
        .two-col { display: flex; justify-content: space-between; gap: 24px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th, td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        th { background-color: #f9fafb; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
        tfoot td { border-top: 2px solid #111827; font-size: 12px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-sm { font-size: 10px; }
        .font-semibold { font-weight: 600; }
        .mt-2 { margin-top: 8px; }
        .summary-label { color: #4b5563; }
        .notes { font-size: 11px; color: #4b5563; line-height: 1.5; }
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
        .header-image { width: 100%; margin-bottom: 20px; }
        .header-image img { width: 100%; height: auto; display: block; }
        .logo { height: 48px; width: auto; }
    </style>
</head>
<body>
    @php
        $periodLabel = \Carbon\Carbon::create($bill->period_year, $bill->period_month, 1)->format('F Y');
        $headerImage = file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null;
        $isPaid = $bill->status === 'paid';
    @endphp

    @php
        $headerImage = file_exists(public_path('header-01-landscape.jpeg')) ? public_path('header-01-landscape.jpeg') : null;
    @endphp
    <div class="header-image">
        @if($headerImage && file_exists($headerImage))
            <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents($headerImage)) }}" alt="Header Image">
        @endif
    </div>

    @if($isPaid)
        <div style="position: fixed; top: 40%; left: 10%; width: 80%; text-align: center; font-size: 200px; font-weight: 700; color: #a7abb1; opacity: 0.12; transform: rotate(-30deg); z-index: 0;">
            PAID
        </div>
    @endif

    <div class="header">
        <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <h1>Tax Invoice (VAT Bill) {{ $bill->bill_number }}</h1>
                    <div class="muted">VAT period: {{ $periodLabel }}</div>
                    @if($isPaid)
                        <span class="badge badge-status">PAID {{ $bill->paid_date ? \Carbon\Carbon::parse($bill->paid_date)->format('d/m/Y') : '' }}</span>
                    @else
                        <span class="badge badge-pending">PENDING PAYMENT</span>
                    @endif
                </td>
                <td class="text-right">
                    <div class="brand-name">{{ $senderName }}</div>
                    <div class="muted text-sm">
                        @if($senderAddress){{ $senderAddress }}<br>@endif
                        @if($senderCity){{ $senderCity }}@if($senderCountry), {{ $senderCountry }}@endif<br>@endif
                        @if($senderPhone)Phone: {{ $senderPhone }}<br>@endif
                        @if($senderEmail)Email: {{ $senderEmail }}@endif
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section two-col">
        <div class="card" style="flex: 1;">
            <h3>Recipient</h3>
            <div class="font-semibold">Kenya Revenue Authority</div>
            <div class="muted text-sm">
                Domestic Taxes Department<br>
                Tax Agency (Sales Tax) — VAT remittance
            </div>
            <h3 class="mt-2">Remitter</h3>
            <div class="muted text-sm">
                {{ $senderName }}<br>
                @if($senderAddress){{ $senderAddress }}, @endif@if($senderCity){{ $senderCity }}, @endif{{ $senderCountry }}
            </div>
        </div>
        <div class="card" style="flex: 1;">
            <h3>Bill Summary</h3>
            <table width="100%" cellspacing="0" cellpadding="0">
                <tr><td class="summary-label">Bill date</td><td class="text-right">{{ $bill->created_at ? \Carbon\Carbon::parse($bill->created_at)->format('d/m/Y') : '—' }}</td></tr>
                <tr><td class="summary-label">Period</td><td class="text-right">{{ $periodLabel }}</td></tr>
                <tr><td class="summary-label">Output VAT (VAT OUT)</td><td class="text-right">KES {{ number_format((float) $bill->vat_out, 2) }}</td></tr>
                <tr><td class="summary-label">Recoverable VAT (VAT IN)</td><td class="text-right">KES {{ number_format((float) $bill->vat_in, 2) }}</td></tr>
                <tr><td class="summary-label">Net VAT liability</td><td class="text-right font-semibold">KES {{ number_format((float) $bill->vat_liability, 2) }}</td></tr>
                @if($isPaid)
                    <tr>
                        <td class="summary-label">Paid from</td>
                        <td class="text-right">{{ $fundingAccount ?? '—' }} on {{ $bill->paid_date ? \Carbon\Carbon::parse($bill->paid_date)->format('d/m/Y') : '—' }}</td>
                    </tr>
                    <tr>
                        <td class="summary-label">Settled against this period</td>
                        <td class="text-right">KES {{ number_format((float) $bill->settled_for_period, 2) }}</td>
                    </tr>
                    @if((float) $bill->carried_forward > 0)
                        <tr>
                            <td class="summary-label">Carried forward to later bills</td>
                            <td class="text-right">KES {{ number_format((float) $bill->carried_forward, 2) }}</td>
                        </tr>
                    @endif
                @endif
            </table>
        </div>
    </div>

    <div class="section">
        <h3>Bill Details</h3>
        <table width="100%" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Bill No.</th>
                    <th>Particulars</th>
                    <th>Name</th>
                    <th class="text-right">Amount</th>
                    <th class="text-right">Paid</th>
                    <th class="text-right">Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>{{ $bill->created_at ? \Carbon\Carbon::parse($bill->created_at)->format('d/m/Y') : '—' }}</td>
                    <td>{{ $bill->bill_number }}</td>
                    <td>{{ $bill->label() }}</td>
                    <td>Tax Agency (Sales Tax)</td>
                    <td class="text-right">{{ number_format((float) $bill->amount, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $bill->paid_amount, 2) }}</td>
                    <td class="text-right">{{ number_format((float) $bill->balance, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section notes">
        <p>
            This bill was generated from the VAT ledger snapshot for {{ $periodLabel }}.
            Output VAT (VAT OUT) is the tax declared on sales; recoverable input VAT (VAT IN) is
            the tax held on purchases; the net figure is the amount remittable to the revenue
            authority. Remittance is due per the applicable statutory deadline.
        </p>
        @if($isPaid)
            <p>
                Settled in one installment of KES {{ number_format((float) $bill->paid_amount, 2) }}
                from {{ $fundingAccount ?? 'the selected account' }}
                on {{ $bill->paid_date ? \Carbon\Carbon::parse($bill->paid_date)->format('d/m/Y') : '—' }}.
            </p>
        @endif
    </div>

    <div class="footer">
        Generated {{ now()->format('d/m/Y H:i') }} · {{ $senderWebsite ?? '' }}
    </div>
</body>
</html>
