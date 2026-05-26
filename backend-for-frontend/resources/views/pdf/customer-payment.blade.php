<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customer Payment {{ $payment->transaction_number ?? ('CUST-PAYMENT-' . $payment->id) }}</title>
    <style>
        @page { margin: 40px 40px 60px 40px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo img { height: 40px; width: auto; }
        .brand-name { font-size: 18px; font-weight: 700; color: #111827; }
        .muted { color: #6b7280; }
        h1 { font-size: 20px; margin: 0 0 4px 0; }
        h2 { font-size: 14px; margin: 0 0 4px 0; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .table th, .table td { border: 0px solid #e5e7eb; padding: 8px; text-align: left; }
        .table th { background-color: #f3f4f6; font-weight: 600; }
        .magic-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .section { margin-bottom: 16px; }
        .two-col { display: flex; justify-content: space-between; gap: 24px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .label { color: #4b5563; font-size: 11px; }
        .value { font-size: 12px; }
        .text-sm { font-size: 11px; }
        .font-semibold { font-weight: 600; }
        .mt-1 { margin-top: 4px; }
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
@php
        $logoData = file_exists($instanceLogo) ? base64_encode(file_get_contents($instanceLogo)) : null;
    $number = $payment->transaction_number ?? ('CUST-PAYMENT-' . $payment->id);
    $currency = $payment->currency ?? '';
@endphp

<div class="header">
    <table class="magic-table">
        <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                <div class="logo">
@if($logoData)
            <img src="data:image/png;base64,{{ $logoData }}" alt="Company Logo">
        @else
            <div class="brand-name">{{ $senderName }}</div>
        @endif
                </div>
            </td>
            <td style="width: 50%; vertical-align: top; text-align: right;">
<h1>Customer Payment Receipt</h1>
        <div class="muted">Payment Ref: {{ $number }}</div>
        <div class="muted">Date: {{ optional($payment->payment_date ?? $payment->created_at)->format('d M Y') }}</div>
        @if($payment->payment_status)
            <div class="text-sm mt-1">Status: <span class="font-semibold">{{ ucfirst($payment->payment_status) }}</span></div>
        @endif
            </td>
        </tr>
    </table>
</div>

<div class="section two-col">
    <div class="card" style="flex: 1;">
        <h2>Customer &amp; Project</h2>
        <div class="row">
            <div class="label">Customer</div>
            <div class="value">
                @if($primaryInvoice && $primaryInvoice->customer)
                    <span class="font-semibold">{{ $primaryInvoice->customer->name }}</span>
                @else
                    -
                @endif
            </div>
        </div>
        <div class="row">
            <div class="label">Project</div>
            <div class="value">
                @if($primaryInvoice && $primaryInvoice->project)
                    {{ $primaryInvoice->project->name ?? $primaryInvoice->project->title ?? $primaryInvoice->project->code ?? '-' }}
                @else
                    -
                @endif
            </div>
        </div>
        <div class="row mt-1">
            <div class="label">Invoice</div>
            <div class="value">
                @if($invoices->count())
                    {{ $invoices->pluck('invoice_number')->filter()->implode(', ') }}
                @else
                    -
                @endif
            </div>
        </div>
    </div>
    <br>
    <div class="card" style="flex: 1;">
        <h2>Payment Details</h2>
        <table class="table">
            <tr>
                <td class="label">
                    <!-- Left -->
                    <div class="row">
                        <div class="label">Amount Paid</div>
                        <div class="value font-semibold">{{ $currency }} {{ number_format((float) $payment->amount_paid, 2) }}</div>
                    </div>
                    @if(!is_null($payment->tax_amount))
                        <div class="row">
                            <div class="label">Tax Amount</div>
                            <div class="value">{{ $currency }} {{ number_format((float) $payment->tax_amount, 2) }}</div>
                        </div>
                    @endif
                    @if(!is_null($payment->net_amount))
                        <div class="row">
                            <div class="label">Net Amount</div>
                            <div class="value font-semibold">{{ $currency }} {{ number_format((float) $payment->net_amount, 2) }}</div>
                        </div>
                    @endif
                    <div class="row mt-1">
                        <div class="label">Method</div>
                        <div class="value">{{ $payment->payment_method ?? '-' }}</div>
                    </div>
                </td>
                <td class="value">
                    <!-- Right -->
                    <div class="row">
                        <div class="label">Receipt #</div>
                        <div class="value">{{ $payment->receipt_number ?? '-' }}</div>
                    </div>
                    <div class="row">
                        <div class="label">Bank</div>
                        <div class="value">{{ $payment->bank_name ?? '-' }}</div>
                    </div>
                    <div class="row">
                        <div class="label">Cheque #</div>
                        <div class="value">{{ $payment->check_number ?? '-' }}</div>
                    </div>
                    <div class="row">
                        <div class="label">Reference</div>
                        <div class="value">{{ $payment->transaction_reference ?? '-' }}</div>
                    </div>
                </td>
            </tr>
        </table>
        
    </div>
</div>

@if($payment->reconciled)
    <div class="section card">
        <h2>Reconciliation</h2>
        <div class="row">
            <div class="label">Reconciled?</div>
            <div class="value">Yes</div>
        </div>
        <div class="row">
            <div class="label">Reconciliation Date</div>
            <div class="value">{{ optional($payment->reconciliation_date)->format('d M Y') ?? '-' }}</div>
        </div>
    </div>
@endif

<div class="section card">
    <h2>Prepared By</h2>
    <div class="text-sm">
        <span class="font-semibold">{{ $senderName }}</span><br>
        @if(!empty($senderAddressLine1))
            {{ $senderAddressLine1 }}<br>
        @endif
        @if(!empty($senderCity) || !empty($senderState) || !empty($senderCountry))
            {{ trim(($senderCity ?? '') . (isset($senderCity, $senderState) ? ', ' : '') . ($senderState ?? '')) }}@if(!empty($senderCountry)), {{ $senderCountry }}@endif<br>
        @endif
        @if(!empty($senderPhone))
            Phone: {{ $senderPhone }}<br>
        @endif
        @if(!empty($senderEmail))
            Email: {{ $senderEmail }}<br>
        @endif
        @if(!empty($senderWebsite))
            Website: {{ $senderWebsite }}
        @endif
    </div>
</div>

<div class="footer">
    Generated on {{ $generatedAt->format('d M Y H:i') }} by {{ $senderName }} &middot; {{ $senderEmail }}
</div>
</body>
</html>
