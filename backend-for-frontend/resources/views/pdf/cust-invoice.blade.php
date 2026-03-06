<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
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

    @if($invoice->status === 'paid')
        <div style="position: fixed; top: 40%; left: 10%; width: 80%; text-align: center; font-size: 240px; font-weight: 700; color: #a7abb1; opacity: 0.12; transform: rotate(-30deg); z-index: 0;">
            PAID
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
                    <h1>Invoice</h1>
                    <div class="muted">Invoice #: {{ $invoice->invoice_number }}</div>
                    <div class="muted">Date: {{ optional($invoice->created_at)->format('d M Y') }}</div>
                    <div class="badge badge-status mt-2">{{ $invoice->status_label ?? ucfirst($invoice->status) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <!-- Sender on the left, without card borders/padding -->
                <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                    <div style="margin-top: 16px;">
                        <h2>Invoice Sender</h2>
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

                <!-- Bill To on the far right, text left-aligned inside -->
                <td style="width: 50%; vertical-align: top; padding-left: 8px; text-align: right;">
                    <div style="margin-top: 16px; display: inline-block; text-align: left;">
                        <h2>Bill To</h2>
                        <div class="text-sm">
                            @if($invoice->customer)
                                <span class="font-semibold">{{ $invoice->customer->name }}</span>
                            @else
                                N/A
                            @endif
                        </div>
                        @if($invoice->customer)
                            @if(!empty($invoice->customer->address))
                                <div class="text-sm mt-1">{{ $invoice->customer->address }}</div>
                            @endif
                            @if(!empty($invoice->customer->city) || !empty($invoice->customer->state) || !empty($invoice->customer->country))
                                <div class="text-sm mt-1">
                                    {{ trim(($invoice->customer->city ?? '') . (isset($invoice->customer->city, $invoice->customer->state) ? ', ' : '') . ($invoice->customer->state ?? '')) }}
                                    @if(!empty($invoice->customer->country))
                                        {{ isset($invoice->customer->city) || isset($invoice->customer->state) ? ', ' : '' }}{{ $invoice->customer->country }}
                                    @endif
                                </div>
                            @endif
                            @if(!empty($invoice->customer->phone))
                                <div class="text-sm mt-1">Phone: {{ $invoice->customer->phone }}</div>
                            @endif
                            @if(!empty($invoice->customer->email))
                                <div class="text-sm mt-1">Email: {{ $invoice->customer->email }}</div>
                            @endif
                        @endif
                    </div>
                </td>
            </tr>
        </table>
    </div>

    @if($invoice->project)
        <div class="section card">
            <h2>Project</h2>
            <div class="text-sm"> <span class="font-semibold">{{ $invoice->project->code ?? '' }} {{ $invoice->project->name ?? '' }}</span></div>
        </div>
    @endif


    @if($invoice->description)
        <div class="section card">
            <h2>Summary</h2>
            <div class="text-sm">{{ $invoice->description }}</div>
        </div>
    @endif

    <div class="section">
        <h2>Line Items</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 40%;">Description</th>
                    <th style="width: 15%;" class="text-right">Tax</th>
                    <th style="width: 10%;" class="text-right">Qty</th>
                    <th style="width: 17%;" class="text-right">Unit Price</th>
                    <th style="width: 18%;" class="text-right">Line Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($invoice->invoiceItems as $item)
                    <tr>
                        <td>
                            <div class="font-semibold">{{ $item->item_name }}</div>
                            @if($item->item_description)
                                <div class="text-sm muted">{{ $item->item_description }}</div>
                            @endif
                        </td>
                        <td class="text-right text-sm">
                            @if(!empty($item->is_taxable))
                                <div>
                                    <div class="mt-1">
                                        <span class="badge" style="background-color: #eff6ff; color: #1d4ed8; text-transform: uppercase; font-size: 10px;">
                                            <span class="font-semibold">{{ $item->tax_item_name ?? 'Tax' }}</span>
                                            @if($item->item_type)
                                                &nbsp;&middot;&nbsp;
                                                @if($item->item_type === 'percent')
                                                    Percent
                                                @elseif($item->item_type === 'fixed')
                                                    Fixed
                                                @else
                                                    {{ ucfirst($item->item_type) }}
                                                @endif
                                            @endif
                                        </span>
                                    </div>

                                    @if($item->item_value !== null)
                                        <div class="text-sm mt-1 muted">
                                            @if($item->item_type === 'percent')
                                                {{ number_format((float) $item->item_value, 2) }}%
                                            @else
                                                {{ $invoice->currency }} {{ number_format((float) $item->item_value, 2) }}
                                            @endif
                                        </div>
                                    @endif

                                    @if($item->tax_amount !== null && (float) $item->tax_amount > 0)
                                        <div class="text-sm mt-1">
                                            Tax amount: {{ $invoice->currency }} {{ number_format((float) $item->tax_amount, 2) }}
                                        </div>
                                    @endif
                                </div>
                            @else
                                <span class="text-sm muted">Not taxable</span>
                            @endif
                        </td>
                        <td class="text-right">{{ number_format((float) ($item->quantity ?? 1), 0) }}</td>
                        <td class="text-right">{{ $invoice->currency }} {{ number_format((float) $item->item_amount, 2) }}</td>
                        <td class="text-right">{{ $invoice->currency }} {{ number_format((float) ($item->total ?? ($item->item_amount * ($item->quantity ?? 1))), 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-sm muted">No line items captured for this invoice.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @php
        $hasTaxItems = $invoice->taxitems && $invoice->taxitems->count() > 0;
        $itemsSubtotal = (float) $invoice->subtotal_amount;
        $discountAmount = (float) $invoice->discount_amount;
        $computedTaxLines = [];
        $computedTotalTax = 0.0;

        if ($hasTaxItems) {
            foreach ($invoice->taxitems as $taxItem) {
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

        $effectiveTaxAmount = $hasTaxItems ? $computedTotalTax : (float) $invoice->tax_amount;
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
                                            {{ $invoice->currency }} {{ number_format((float) $taxLine['value'], 2) }}
                                        @else
                                            &mdash;
                                        @endif
                                    </td>
                                    <td class="text-right text-sm">{{ $invoice->currency }} {{ number_format($taxLine['amount'], 2) }}</td>
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
                <span class="summary-label" style="float: right;">{{ $invoice->currency }} {{ number_format($itemsSubtotal, 2) }}</span>
            </div>

            @if($hasTaxItems || $effectiveTaxAmount > 0)
                <div class="summary-row">
                    <span class="summary-label">Tax</span>
                    <span class="summary-label" style="float: right;">{{ $invoice->currency }} {{ number_format($effectiveTaxAmount, 2) }}</span>
                </div>
            @endif

            @if($discountAmount > 0)
                <div class="summary-row">
                    <span class="summary-label">Discount</span>
                    <span class="summary-label" style="float: right;">- {{ $invoice->currency }} {{ number_format($discountAmount, 2) }}</span>
                </div>
            @endif

            <div class="summary-row" style="margin-top: 6px;">
                <span class="summary-total">Total</span>
                <span class="summary-total" style="float: right;">{{ $invoice->currency }} {{ number_format($effectiveTotal, 2) }}</span>
            </div>

            @if(isset($paymentsTotal) && $paymentsTotal > 0)
                <div class="summary-row" style="margin-top: 6px;">
                    <span class="summary-label">Payments Made</span>
                    <span class="summary-label" style="float: right;">- {{ $invoice->currency }} {{ number_format($paymentsTotal, 2) }}</span>
                </div>

                <div class="summary-row">
                    <span class="summary-total">Outstanding Balance</span>
                    <span class="summary-total" style="float: right;">{{ $invoice->currency }} {{ number_format($outstandingBalance ?? max($effectiveTotal - $paymentsTotal, 0), 2) }}</span>
                </div>
            @endif
        </div>
    </div>

    @if(isset($payments) && $payments->count() > 0)
        <div class="section card" style="margin-top: 8px;">
            <h3>Payments / Installments</h3>
            <table style="margin-top: 8px;">
                <thead>
                    <tr>
                        <th style="width: 18%;">Date</th>
                        <th style="width: 20%;">Method</th>
                        <th style="width: 25%;">Reference</th>
                        <th style="width: 17%;" class="text-right">Amount</th>
                        <th style="width: 20%;" class="text-right">Running Balance</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $runningTotal = (float) ($invoice->total_amount ?? $effectiveTotal);
                    @endphp
                    @foreach($payments as $payment)
                        @php
                            $amount = (float) $payment->amount_paid;
                            $runningTotal = max($runningTotal - $amount, 0);
                        @endphp
                        <tr>
                            <td class="text-sm">{{ optional($payment->payment_date)->format('d M Y') }}</td>
                            <td class="text-sm">{{ ucfirst($payment->payment_method ?? '-') }}</td>
                            <td class="text-sm">
                                @if(!empty($payment->receipt_number))
                                    Receipt: {{ $payment->receipt_number }}
                                @elseif(!empty($payment->transaction_reference))
                                    Ref: {{ $payment->transaction_reference }}
                                @else
                                    &mdash;
                                @endif
                            </td>
                            <td class="text-right text-sm">{{ $invoice->currency }} {{ number_format($amount, 2) }}</td>
                            <td class="text-right text-sm">{{ $invoice->currency }} {{ number_format($runningTotal, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    @if($invoice->payment_terms || $invoice->notes_to_customer)
        <div class="section card" style="margin-top: 8px;">
            <h3>Additional Information</h3>
            @if($invoice->payment_terms)
                <div class="notes mt-1"><strong>Payment Terms:</strong> {{ $invoice->payment_terms }}</div>
            @endif
            @if($invoice->notes_to_customer)
                <div class="notes mt-1"><strong>Notes:</strong> {{ $invoice->notes_to_customer }}</div>
            @endif
        </div>
    @endif

    <div class="footer">
        Invoice {{ $invoice->invoice_number }} &middot; Generated by {{ $senderName }}
    </div>
</body>
</html>
