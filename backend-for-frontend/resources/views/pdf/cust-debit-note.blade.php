<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Debit Note {{ $debitNote->debit_note_number }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
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
        .text-right { text-align: right; }
        .text-sm { font-size: 11px; }
        .font-semibold { font-weight: 600; }
        .mt-2 { margin-top: 8px; }
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
            @if($senderAddress)<div class="muted">{{ $senderAddress }}</div>@endif
            @if($senderEmail)<div class="muted">{{ $senderEmail }}</div>@endif
            @if($senderPhone)<div class="muted">{{ $senderPhone }}</div>@endif
        </div>
        <div style="text-align:right;">
            <h1>Customer Debit Note</h1>
            <div class="muted">Debit Note #: {{ $debitNote->debit_note_number }}</div>
            <div class="muted">Date: {{ optional($debitNote->created_at)->format('d/m/Y') }}</div>
            <div class="badge badge-status mt-2">{{ ucfirst($debitNote->status) }}</div>
        </div>
    </div>

    <div class="section two-col" style="gap: 40px;">
        <div class="card" style="min-width: 260px;">
            <h2>Debit Note Details</h2>
            <div class="summary-row"><span class="summary-label">Debit Note #:</span> {{ $debitNote->debit_note_number }}</div>
            <div class="summary-row"><span class="summary-label">Date:</span> {{ optional($debitNote->created_at)->format('d/m/Y') }}</div>
            <div class="summary-row"><span class="summary-label">Status:</span> {{ ucfirst($debitNote->status) }}</div>
            <div class="summary-row"><span class="summary-label">Currency:</span> {{ $debitNote->currency }}</div>
            @if($debitNote->invoice && $debitNote->invoice->customer)
                <div class="summary-row"><span class="summary-label">Customer:</span> {{ $debitNote->invoice->customer->name }}</div>
            @endif
        </div>
        <div class="card" style="min-width: 260px; margin-top: 25px;">
            <h2>Invoice</h2>
            @if($debitNote->invoice)
                <div class="summary-row"><span class="summary-label">Invoice #:</span> {{ $debitNote->invoice->invoice_number ?? '-' }}</div>
                <div class="summary-row"><span class="summary-label">Customer:</span> {{ $debitNote->invoice->customer->name ?? '-' }}</div>
                @if($debitNote->invoice->project)
                    <div class="summary-row"><span class="summary-label">Project:</span> {{ $debitNote->invoice->project->name }}</div>
                @endif
            @else
                <div class="summary-row">No invoice linked.</div>
            @endif
        </div>
    </div>

    <div class="section">
        <h2>{{ $debitNote->title }}</h2>
        @if($debitNote->description)<p class="muted">{{ $debitNote->description }}</p>@endif
    </div>

    <div class="section">
        <h2>Items</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th class="text-right">Unit Price ({{ $debitNote->currency }})</th>
                    <th class="text-right">Tax ({{ $debitNote->currency }})</th>
                    <th class="text-right">Line Total ({{ $debitNote->currency }})</th>
                </tr>
            </thead>
            <tbody>
                @foreach($debitNote->items as $i => $item)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>
                            {{ $item->item_name }}
                            @if($item->item_description)<br><span class="muted text-sm">{{ $item->item_description }}</span>@endif
                            @if($item->custom_note)<br><span class="muted text-sm"><em>{{ $item->custom_note }}</em></span>@endif
                        </td>
                        <td>{{ $item->quantity }}</td>
                        <td class="text-right">{{ number_format((float) $item->item_amount, 2) }}</td>
                        <td class="text-right">{{ $item->is_taxable ? number_format((float) $item->tax_amount, 2) : 'Not taxable' }}</td>
                        <td class="text-right">{{ number_format((float) $item->total + (float) $item->tax_amount, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section two-col">
        <div class="card">
            <h3>Notes</h3>
            <div class="notes">{{ $debitNote->notes_to_customer ?? '-' }}</div>
        </div>
        <div class="card" style="margin-top: 25px;">
            <h3>Financial Summary</h3>
            <div class="summary-row"><span class="summary-label">Subtotal:</span> {{ $debitNote->currency }} {{ number_format((float) $debitNote->subtotal_amount, 2) }}</div>
            <div class="summary-row"><span class="summary-label">Tax:</span> {{ $debitNote->currency }} {{ number_format((float) $debitNote->tax_amount, 2) }}</div>
            <div class="summary-row summary-total"><span class="summary-label">Total due:</span> {{ $debitNote->currency }} {{ number_format((float) $debitNote->total_amount, 2) }}</div>
        </div>
    </div>

    <div class="footer">
        Debit Note {{ $debitNote->debit_note_number }} &middot; Additional amount due against invoice {{ $debitNote->invoice?->invoice_number ?? '-' }} &middot; Generated by {{ $senderName }}
    </div>
</body>
</html>
