<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order {{ $order->order_number }}</title>
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
        $logoData = file_exists($instanceLogo) ? base64_encode(file_get_contents($instanceLogo)) : null;
    @endphp

    @if($order->status === 'approved')
        <div style="position: fixed; top: 40%; left: 10%; width: 80%; text-align: center; font-size: 150px; font-weight: 700; color: #a7abb1; opacity: 0.12; transform: rotate(-30deg); z-index: 0;">
            APPROVED
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
                <td style="text-align: right;">
                    <h1>Order</h1>
                    <div class="muted">Order #: {{ $order->order_number }}</div>
                    <div class="muted">Date: {{ optional($order->created_at)->format('d/m/Y') }}</div>
                    <div class="badge badge-status mt-2">{{ ucfirst($order->status) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                    <div class="card" style="margin-top: 16px; border-radius: 0; padding: 0; border: none;">
                        <h2>Order Sender</h2>
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
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 8px; text-align: right;">
                    <div class="card" style="margin-top: 16px; border-radius: 0; padding: 0; border: none; display: inline-block; text-align: left;">
                        <h2>Bill To</h2>
                        <div class="text-sm">
                            @if($order->customer)
                                <span class="font-semibold">{{ $order->customer->name }}</span>
                            @else
                                N/A
                            @endif
                        </div>
                        @if($order->customer)
                            @if(!empty($order->customer->address))
                                <div class="text-sm mt-1">{{ $order->customer->address }}</div>
                            @endif
                            @if(!empty($order->customer->city) || !empty($order->customer->state) || !empty($order->customer->country))
                                <div class="text-sm mt-1">
                                    {{ trim(($order->customer->city ?? '') . (isset($order->customer->city, $order->customer->state) ? ', ' : '') . ($order->customer->state ?? '')) }}
                                    @if(!empty($order->customer->country))
                                        {{ isset($order->customer->city) || isset($order->customer->state) ? ', ' : '' }}{{ $order->customer->country }}
                                    @endif
                                </div>
                            @endif
                            @if(!empty($order->customer->phone))
                                <div class="text-sm mt-1">Phone: {{ $order->customer->phone }}</div>
                            @endif
                            @if(!empty($order->customer->email))
                                <div class="text-sm mt-1">Email: {{ $order->customer->email }}</div>
                            @endif
                        @endif
                    </div>
                </td>
            </tr>
        </table>
    </div>

    @if($order->project)
        <div class="section card">
            <h2>Project</h2>
            <div class="text-sm"> <span class="font-semibold">{{ $order->project->code ?? '' }} {{ $order->project->name ?? '' }}</span></div>
        </div>
    @endif


    @if($order->description)
        <div class="section card">
            <h2>Summary</h2>
            <div class="text-sm">{{ $order->description }}</div>
        </div>
    @endif

    <div class="section">
        <h2>Line Items</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 40%;">Item</th>
                    <th style="width: 10%;" class="text-right">Qty</th>
                    <th style="width: 17%;" class="text-right">Unit Price({{ $order->currency }})</th>
                    <th style="width: 18%;" class="text-right">Tax({{ $order->currency }})</th>
                    <th style="width: 15%;" class="text-right">Subtotal({{ $order->currency }})</th>
                </tr>
            </thead>
            <tbody>
                @forelse($order->orderItems as $item)
                    @php
                        $quantity = (float) ($item->quantity ?? 1);
                        $unitPrice = (float) $item->order_amount;
                        $lineTotal = (float) ($item->total ?? ($unitPrice * $quantity));
                        $isTaxable = (bool) ($item->is_taxable ?? false);
                        $type = $item->item_type ?? null;
                        $value = $item->item_value ?? null;
                        $taxAmount = $item->item_amount !== null ? (float) $item->item_amount : null;
                    @endphp
                    <tr>
                        <td>
                            <div class="font-semibold">{{ $item->item_name }}</div>
                            @if($item->item_description)
                                <div class="text-sm muted">{{ $item->item_description }}</div>
                            @endif
                        </td>
                        <td class="text-right">{{ number_format($quantity, 0) }}</td>
                        <td class="text-right"> {{ number_format($unitPrice, 2) }}</td>
                        <td class="text-right text-sm">
                            @if($isTaxable && $taxAmount !== null)
                                @if($type === 'percent' && $value !== null)
                                    {{ number_format($taxAmount, 2) }}
                                @else
                                    {{ number_format($taxAmount, 2) }}
                                @endif
                            @else
                                <span class="muted">Not taxable</span>
                            @endif
                        </td>
                        <td class="text-right">{{ number_format($lineTotal, 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-sm muted">No line items captured for this order.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @php
        $hasTaxItems = $order->taxitems && $order->taxitems->count() > 0;
        $itemsSubtotal = (float) $order->subtotal_amount;
        $discountAmount = (float) $order->discount_amount;
        $computedTaxLines = [];
        $computedTotalTax = 0.0;

        if ($hasTaxItems) {
            foreach ($order->taxitems as $taxItem) {
                $name = $taxItem->item_name;
                $type = $taxItem->item_type;
                $value = $taxItem->item_value;
                $amount = $taxItem->item_amount;

                if ($amount === null) {
                    $baseValue = $value !== null ? (float) $value : 0.0;
                    if ($type === 'fixed') {
                        $amount = $baseValue;
                    } elseif ($type === 'percent') {
                        $amount = $itemsSubtotal * ($baseValue / 100.0);
                    } else {
                        $amount = 0.0;
                    }
                }

                $computedTotalTax += (float) $amount;
                $computedTaxLines[] = [
                    'name'   => $name,
                    'type'   => $type,
                    'value'  => $value,
                    'amount' => (float) $amount,
                ];
            }
        }

        $effectiveTaxAmount = $hasTaxItems ? $computedTotalTax : (float) $order->tax_amount;
        $effectiveTotal = $itemsSubtotal + $effectiveTaxAmount - $discountAmount;
    @endphp

    <div class="section two-col">
        <div style="flex: 1; padding-right: 18px;">
            @if($hasTaxItems)
                <div class="section mt-2">
                    <h3>Tax Breakdown</h3>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 45%;">Tax Name</th>
                                <th style="width: 20%;" class="text-right">Type</th>
                                <th style="width: 15%;" class="text-right">Value</th>
                                <th style="width: 20%;" class="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($computedTaxLines as $taxLine)
                                <tr>
                                    <td>{{ $taxLine['name'] }}</td>
                                    <td class="text-right text-sm">{{ ucfirst($taxLine['type']) }}</td>
                                    <td class="text-right text-sm">
                                        @if($taxLine['type'] === 'percent' && $taxLine['value'] !== null)
                                            {{ number_format((float) $taxLine['value'], 2) }}%
                                        @elseif($taxLine['value'] !== null)
                                            {{ $order->currency }} {{ number_format((float) $taxLine['value'], 2) }}
                                        @else
                                            &mdash;
                                        @endif
                                    </td>
                                    <td class="text-right text-sm">{{ $order->currency }} {{ number_format($taxLine['amount'], 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
        <div class="card" style="flex: 0 0 40%;">
            <h3>Financial Summary</h3>
            <div class="summary-row">
                <span class="summary-label">Items Subtotal</span>
                <span class="summary-label" style="float: right;">{{ $order->currency }} {{ number_format($itemsSubtotal, 2) }}</span>
            </div>

            @if($hasTaxItems || $effectiveTaxAmount > 0)
                <div class="summary-row">
                    <span class="summary-label">Tax</span>
                    <span class="summary-label" style="float: right;">{{ $order->currency }} {{ number_format($effectiveTaxAmount, 2) }}</span>
                </div>
            @endif

            @if($discountAmount > 0)
                <div class="summary-row">
                    <span class="summary-label">Discount{{ (float) $order->discount_percentage > 0 ? ' ('.(float) $order->discount_percentage.'%)' : '' }}</span>
                    <span class="summary-label" style="float: right;">-{{ $order->currency }} {{ number_format($discountAmount, 2) }}</span>
                </div>
            @endif

            <div class="summary-row" style="margin-top: 6px; border-top: 1px solid #e5e7eb; padding-top: 6px;">
                <span class="summary-total">Total</span>
                <span class="summary-total" style="float: right;">{{ $order->currency }} {{ number_format($effectiveTotal, 2) }}</span>
            </div>
        </div>
    </div>

    @if($order->payment_terms || $order->notes_to_customer)
        <div class="section card">
            <h3>Additional Information</h3>
            @if($order->payment_terms)
                <div class="notes mt-1"><strong>Payment Terms:</strong> {{ $order->payment_terms }}</div>
            @endif
            @if($order->notes_to_customer)
                <div class="notes mt-1"><strong>Notes:</strong> {{ $order->notes_to_customer }}</div>
            @endif
        </div>
    @endif

    <div class="section">
        <h3>Notes</h3>
        <p class="notes">
            Please review the details of this order carefully. If you wish to proceed,
            kindly confirm in writing or via the system. This order is subject to the
            terms and conditions of {{ $senderName }}.
        </p>
    </div>

    <div class="footer">
        Generated on {{ $generatedAt->format('d M Y H:i') }} by {{ $senderName }} &middot; {{ $senderEmail }}
    </div>
</body>
</html>
