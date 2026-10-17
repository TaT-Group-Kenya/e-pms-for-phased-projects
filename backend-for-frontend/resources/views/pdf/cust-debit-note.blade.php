<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Debit Note {{ $debitNote->debit_note_number }}</title>
    <style>
        @page { margin: 36px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 20px; }
        .brand { font-size: 18px; font-weight: 700; }
        .muted { color: #6b7280; }
        .right { text-align: right; }
        .row { width: 100%; }
        .column { width: 49%; display: inline-block; vertical-align: top; }
        h1 { font-size: 22px; margin: 0 0 6px; }
        h2 { font-size: 14px; margin: 0 0 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #f3f4f6; color: #4b5563; font-size: 10px; text-transform: uppercase; }
        .amount { text-align: right; white-space: nowrap; }
        .summary { width: 42%; margin: 18px 0 0 auto; }
        .summary td { border: 0; padding: 4px 8px; }
        .total { border-top: 2px solid #111827 !important; font-size: 14px; font-weight: bold; }
        .notes { margin-top: 24px; padding: 12px; border: 1px solid #e5e7eb; }
        .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; color: #6b7280; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header row">
        <div class="column">
            <div class="brand">{{ $senderName }}</div>
            @if($senderAddress)<div class="muted">{{ $senderAddress }}</div>@endif
            @if($senderEmail)<div class="muted">{{ $senderEmail }}</div>@endif
            @if($senderPhone)<div class="muted">{{ $senderPhone }}</div>@endif
        </div>
        <div class="column right">
            <h1>Customer Debit Note</h1>
            <div><strong>No:</strong> {{ $debitNote->debit_note_number }}</div>
            <div><strong>Date:</strong> {{ optional($debitNote->created_at)->format('d/m/Y') }}</div>
            <div><strong>Status:</strong> {{ ucfirst($debitNote->status) }}</div>
        </div>
    </div>

    <div class="row">
        <div class="column">
            <h2>Bill to</h2>
            <div>{{ $debitNote->invoice?->customer?->name ?? 'Customer' }}</div>
            <div class="muted">{{ $debitNote->invoice?->customer?->email }}</div>
        </div>
        <div class="column right">
            <h2>Related invoice</h2>
            <div>{{ $debitNote->invoice?->invoice_number ?? '-' }}</div>
            <div>{{ $debitNote->invoice?->title ?? '' }}</div>
            @if($debitNote->invoice?->project)
                <div class="muted">{{ $debitNote->invoice->project->name }}</div>
            @endif
        </div>
    </div>

    <h2 style="margin-top: 24px;">{{ $debitNote->title }}</h2>
    @if($debitNote->description)<p class="muted">{{ $debitNote->description }}</p>@endif

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th class="amount">Quantity</th>
                <th class="amount">Unit price ({{ $debitNote->currency }})</th>
                <th class="amount">Tax ({{ $debitNote->currency }})</th>
                <th class="amount">Line total ({{ $debitNote->currency }})</th>
            </tr>
        </thead>
        <tbody>
            @foreach($debitNote->items as $item)
                <tr>
                    <td>{{ $item->item_name }}@if($item->item_description)<br><span class="muted">{{ $item->item_description }}</span>@endif</td>
                    <td class="amount">{{ $item->quantity }}</td>
                    <td class="amount">{{ number_format((float) $item->item_amount, 2) }}</td>
                    <td class="amount">{{ number_format((float) $item->tax_amount, 2) }}</td>
                    <td class="amount">{{ number_format((float) $item->total + (float) $item->tax_amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="summary">
        <tr><td>Subtotal</td><td class="amount">{{ $debitNote->currency }} {{ number_format((float) $debitNote->subtotal_amount, 2) }}</td></tr>
        <tr><td>Tax</td><td class="amount">{{ $debitNote->currency }} {{ number_format((float) $debitNote->tax_amount, 2) }}</td></tr>
        <tr><td class="total">Total due</td><td class="amount total">{{ $debitNote->currency }} {{ number_format((float) $debitNote->total_amount, 2) }}</td></tr>
    </table>

    @if($debitNote->notes_to_customer)
        <div class="notes"><strong>Notes</strong><br>{{ $debitNote->notes_to_customer }}</div>
    @endif

    <div class="footer">This debit note records an additional amount due against invoice {{ $debitNote->invoice?->invoice_number ?? '-' }}.</div>
</body>
</html>
