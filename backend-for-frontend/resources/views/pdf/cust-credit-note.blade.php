<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Credit Note {{ $creditNote->credit_note_number }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo { flex: 0 0 auto; }
        .logo img { height: 48px; width: auto; }
        .brand-name { font-size: 20px; font-weight: 700; color: #111827; }
        .muted { color: #6b7280; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .badge-status { background-color: #dbeafe; color: #1d4ed8; }
        h1 { font-size: 22px; margin: 0 0 4px 0; }
        h2 { font-size: 14px; margin: 0 0 4px 0; }
        h3 { font-size: 13px; margin: 0 0 4px 0; }
        .section { margin-bottom: 18px; }
        .two-col { display: flex; justify-content: space-between; gap: 24px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th, td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        th { background-color: #f9fafb; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
        tfoot td { border-top: 1px solid #e5e7eb; font-size: 12px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-sm { font-size: 11px; }
        .font-semibold { font-weight: 600; }
        .mt-2 { margin-top: 8px; }
        .mt-1 { margin-top: 4px; }
        .summary-row { padding: 3px 0; }
        .summary-label { color: #4b5563; }
        .summary-total { font-size: 14px; font-weight: 700; color: #111827; }
        .notes { font-size: 11px; color: #4b5563; line-height: 1.5; }
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

    @if($creditNote->status === 'refunded')
        <div style="position: fixed; top: 40%; left: 10%; width: 80%; text-align: center; font-size: 140px; font-weight: 700; color: #a7abb1; opacity: 0.12; transform: rotate(-30deg); z-index: 0;">
            REFUNDED
        </div>
    @endif

    <div class="header">
        <table>
            <tr>
                <td class="logo">
                    @if($logoData)
                        <img src="data:image/png;base64,{{ $logoData }}" alt="Company Logo">
                    @else
                        <div class="brand-name">{{ $senderName }}</div>
                    @endif
                </td>
                <td style="text-align:right;">
                    <h1>Customer Credit Note</h1>
                    <div class="muted">Credit Note #: {{ $creditNote->credit_note_number }}</div>
                    <div class="muted">Date: {{ optional($creditNote->created_at)->format('d/m/Y') }}</div>
                    <div class="badge badge-status mt-2">{{ $creditNote->status_label ?? ucfirst($creditNote->status) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section two-col" style="gap: 40px;">
        <div class="card" style="min-width: 260px;">
            <h2>Credit Note Details</h2>
            <div class="summary-row"><span class="summary-label">Credit Note #:</span> {{ $creditNote->credit_note_number }}</div>
            <div class="summary-row"><span class="summary-label">Date:</span> {{ optional($creditNote->created_at)->format('d/m/Y') }}</div>
            <div class="summary-row"><span class="summary-label">Status:</span> {{ $creditNote->status_label ?? ucfirst($creditNote->status) }}</div>
            <div class="summary-row"><span class="summary-label">Currency:</span> {{ $creditNote->currency }}</div>
            @if($creditNote->invoice && $creditNote->invoice->customer)
                <div class="summary-row"><span class="summary-label">Customer:</span> {{ $creditNote->invoice->customer->name }}</div>
            @endif
        </div>
        <div class="card" style="min-width: 260px; margin-top: 25px;">
            <h2>Invoice</h2>
            @if($creditNote->invoice)
                <div class="summary-row"><span class="summary-label">Invoice #:</span> {{ $creditNote->invoice->invoice_number ?? '-' }}</div>
                <div class="summary-row"><span class="summary-label">Date:</span> {{ $creditNote->invoice->invoice_date ?? '-' }}</div>
                <div class="summary-row"><span class="summary-label">Customer:</span> {{ $creditNote->invoice->customer->name ?? '-' }}</div>
                @if($creditNote->invoice->project)
                    <div class="summary-row"><span class="summary-label">Project:</span> {{ $creditNote->invoice->project->name }}</div>
                @endif
            @else
                <div class="summary-row">No invoice linked.</div>
            @endif
        </div>
    </div>

    <div class="section">
        <h2>Items</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price ({{ $creditNote->currency }})</th>
                    <th>Tax ({{ $creditNote->currency }})</th>
                    <th>Total ({{ $creditNote->currency }})</th>
                </tr>
            </thead>
            <tbody>
                @foreach($creditNote->items as $i => $item)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $item->item_description }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format($item->unit_price, 2) }}</td>
                        <td>{{ number_format($item->tax_amount, 2) }}</td>
                        <td>{{ number_format($item->total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section two-col">
        <div class="card">
            <h3>Notes</h3>
            <div class="notes">{{ $creditNote->notes_to_customer ?? '-' }}</div>
        </div>
        <div class="card" style="margin-top: 25px;">
            <h3>Financial Summary</h3>
            <div class="summary-row"><span class="summary-label">Subtotal:</span> {{ $creditNote->currency }} {{ number_format($creditNote->subtotal_amount, 2) }}</div>
            <div class="summary-row"><span class="summary-label">Tax:</span> {{ $creditNote->currency }} {{ number_format($creditNote->tax_amount, 2) }}</div>
            <div class="summary-row summary-total"><span class="summary-label">Total:</span> {{ $creditNote->currency }} {{ number_format($creditNote->total_amount, 2) }}</div>
            @php
                $ledgerRows = $creditNote->ledgerRows ?? collect();
                $refundSum = $ledgerRows->sum(function($row) {
                    return is_array($row) ? (float) ($row['amount'] ?? 0) : (float) ($row->amount ?? 0);
                });
                $balance = (float) $creditNote->total_amount - $refundSum;
            @endphp
            @if($ledgerRows->count() > 0)
                <div class="summary-row mt-2"><span class="summary-label">Refund Transactions:</span> {{ $ledgerRows->count() }}</div>
                <table class="text-sm mt-1" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Narration</th>
                            <th class="text-right">Amount ({{ $creditNote->currency }})</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($ledgerRows as $row)
                            <tr>
                                <td>
                                    @php
                                        $date = is_array($row) ? ($row['transaction_date'] ?? null) : ($row->transaction_date ?? null);
                                    @endphp
                                    {{ $date ? \Carbon\Carbon::parse($date)->format('d/m/Y') : '-' }}
                                </td>
                                <td>
                                    @php
                                        $narr = is_array($row) ? ($row['narration'] ?? $row['description'] ?? '') : ($row->narration ?? $row->description ?? '');
                                    @endphp
                                    {{ $narr }}
                                </td>
                                <td class="text-right">
                                    @php
                                        $amt = is_array($row) ? ($row['amount'] ?? 0) : ($row->amount ?? 0);
                                    @endphp
                                    {{ number_format($amt, 2) }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
            <div class="summary-row mt-2 font-semibold">
                <span class="summary-label">Balance:</span>
                {{ $creditNote->currency }} {{ number_format($balance, 2) }}
            </div>
        </div>
    </div>

    <div class="footer">
        Credit Note {{ $creditNote->credit_note_number }} &middot; Generated by {{ $senderName }}
    </div>
</body>
</html>
