<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quotation {{ $quotation->quotation_number }}</title>
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
    </style>
</head>
<body>
    @php
        $logoPath = public_path('logo.png');
        $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : null;
    @endphp
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
                <td style="text-align: right;">
                    <h1>Quotation</h1>
                    <div class="muted">Quote #: {{ $quotation->quotation_number }}</div>
                    <div class="muted">Date: {{ $quotation->created_at->format('d M Y') }}</div>
                    <div class="badge badge-status mt-2">{{ ucfirst($quotation->status) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section two-col">
        <div class="card" style="flex: 1; margin-top: 16px;">
            <h2>Quote Recipient</h2>
            <div class="text-sm">
                @if($quotation->customer)
                    <span class="font-semibold">{{ $quotation->customer->name }}</span>
                @else
                    N/A
                @endif
            </div>
            @if($quotation->customer)
                @if(!empty($quotation->customer->address))
                    <div class="text-sm mt-1">{{ $quotation->customer->address }}</div>
                @endif
                @if(!empty($quotation->customer->city) || !empty($quotation->customer->state) || !empty($quotation->customer->country))
                    <div class="text-sm mt-1">
                        {{ trim(($quotation->customer->city ?? '') . (isset($quotation->customer->city, $quotation->customer->state) ? ', ' : '') . ($quotation->customer->state ?? '')) }}
                        @if(!empty($quotation->customer->country))
                            {{ isset($quotation->customer->city) || isset($quotation->customer->state) ? ', ' : '' }}{{ $quotation->customer->country }}
                        @endif
                    </div>
                @endif
                @if(!empty($quotation->customer->phone))
                    <div class="text-sm mt-1">Phone: {{ $quotation->customer->phone }}</div>
                @endif
                @if(!empty($quotation->customer->email))
                    <div class="text-sm mt-1">Email: {{ $quotation->customer->email }}</div>
                @endif
            @endif
            @if($quotation->project)
                <div class="text-sm mt-1">Project: <span class="font-semibold">{{ $quotation->project->code ?? '' }} {{ $quotation->project->name ?? '' }}</span></div>
            @endif
        </div>
        <div class="card" style="flex: 1; margin-top: 16px;">
            <h2>Quote Sender</h2>
            <div class="text-sm"><span class="font-semibold">{{ $senderName }}</span></div>
            @if(!empty($senderAddressLine1))
                <div class="text-sm mt-1">{{ $senderAddressLine1 }}</div>
            @endif
            @if(!empty($senderCity) || !empty($senderState) || !empty($senderCountry))
                <div class="text-sm">
                    {{ trim(($senderCity ?? '') . (isset($senderCity, $senderState) ? ', ' : '') . ($senderState ?? '')) }}
                    @if(!empty($senderCountry))
                        {{ isset($senderCity) || isset($senderState) ? ', ' : '' }}{{ $senderCountry }}
                    @endif
                </div>
            @endif
            @if(!empty($senderPhone))
                <div class="text-sm mt-1">Phone: {{ $senderPhone }}</div>
            @endif
            @if(!empty($senderEmail))
                <div class="text-sm mt-1">Email: {{ $senderEmail }}</div>
            @endif
            @if(!empty($senderWebsite))
                <div class="text-sm mt-1">Website: {{ $senderWebsite }}</div>
            @endif
            <div class="text-sm mt-1">Generated: {{ $generatedAt->format('d M Y H:i') }}</div>
        </div>
    </div>

    @if($quotation->description)
        <div class="section card">
            <h2>Summary</h2>
            <div class="text-sm">{{ $quotation->description }}</div>
        </div>
    @endif

    <div class="section">
        <h2>Line Items</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 36%;">Description</th>
                    <th style="width: 18%;" class="text-right">Phase</th>
                    <th style="width: 12%;" class="text-right">Qty</th>
                    <th style="width: 17%;" class="text-right">Unit Price</th>
                    <th style="width: 17%;" class="text-right">Line Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($quotation->quoteItems as $item)
                    <tr>
                        <td>
                            <div class="font-semibold">{{ $item->phase_name }}</div>
                            @if($item->phase_description)
                                <div class="text-sm muted">{{ $item->phase_description }}</div>
                            @endif
                        </td>
                        <td class="text-right text-sm">
                            @if($item->projectPhase)
                                {{ $item->projectPhase->code ?? '' }} {{ $item->projectPhase->name ?? '' }}
                            @else
                                &mdash;
                            @endif
                        </td>
                        <td class="text-right">{{ number_format((float) ($item->quantity ?? 1), 0) }}</td>
                        <td class="text-right">{{ $quotation->currency }} {{ number_format((float) $item->quoted_amount, 2) }}</td>
                        <td class="text-right">{{ $quotation->currency }} {{ number_format((float) ($item->total ?? ($item->quoted_amount * ($item->quantity ?? 1))), 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-sm muted">No line items captured for this quotation.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section two-col">
        <div class="card" style="flex: 0 0 40%; margin-left: auto;">
            <h3>Financial Summary</h3>
            <div class="summary-row">
                <span class="summary-label">Items Subtotal</span>
                <span class="summary-label" style="float: right;">{{ $quotation->currency }} {{ number_format((float) $quotation->subtotal_amount, 2) }}</span>
            </div>
            @if($quotation->taxitems && $quotation->taxitems->count() > 0)
                @foreach($quotation->taxitems as $taxItem)
                    <div class="summary-row">
                        <span class="summary-label">{{ $taxItem->item_name }}</span>
                        <span class="summary-label" style="float: right;">{{ $quotation->currency }} {{ number_format((float) $taxItem->item_amount, 2) }}</span>
                    </div>
                @endforeach
            @elseif((float) $quotation->tax_amount > 0)
                <div class="summary-row">
                    <span class="summary-label">Tax</span>
                    <span class="summary-label" style="float: right;">{{ $quotation->currency }} {{ number_format((float) $quotation->tax_amount, 2) }}</span>
                </div>
            @endif
            @if((float) $quotation->discount_percentage > 0)
                <div class="summary-row">
                    <span class="summary-label">Discount ({{ (float) $quotation->discount_percentage }}%)</span>
                    <span class="summary-label" style="float: right;">-{{ $quotation->currency }} {{ number_format((float) $quotation->discount_amount, 2) }}</span>
                </div>
            @endif
            <div class="summary-row" style="margin-top: 6px; border-top: 1px solid #e5e7eb; padding-top: 6px;">
                <span class="summary-total">Total</span>
                <span class="summary-total" style="float: right;">{{ $quotation->currency }} {{ number_format((float) $quotation->total_amount, 2) }}</span>
            </div>
        </div>
    </div>

    @if($quotation->payment_terms || $quotation->notes_to_customer)
        <div class="section">
            <h3>Additional Information</h3>
            @if($quotation->payment_terms)
                <div class="notes mt-1"><strong>Payment Terms:</strong> {{ $quotation->payment_terms }}</div>
            @endif
            @if($quotation->notes_to_customer)
                <div class="notes mt-1"><strong>Notes:</strong> {{ $quotation->notes_to_customer }}</div>
            @endif
        </div>
    @endif

    <div class="section">
        <h3>Acceptance</h3>
        <p class="notes">
            Please review the details of this quotation carefully. If you wish to proceed,
            kindly confirm in writing or via the system. This quotation is subject to the
            terms and conditions of {{ $senderName }}.
        </p>
    </div>

    <div class="footer">
        Generated on {{ $generatedAt->format('d M Y H:i') }} by {{ $senderName }} &middot; {{ $senderEmail }}
    </div>
</body>
</html>
