<!DOCTYPE html>
<html lang="en">
<head>

    @php
        $logoData = file_exists($instanceLogo) ? base64_encode(file_get_contents($instanceLogo)) : null;
    @endphp

    <meta charset="UTF-8">
    <title>Statement of account - {{ $meta['company_name'] ?? '' }}</title>
    <style>
        @page { margin: 24mm 18mm; }
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 13px;
            color: #111827;
        }
        .center { text-align: center; }
        .title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .sub { font-size: 13px; color:#6B7280; margin-bottom: 8px; }
        .addresses { display:flex; justify-content:space-between; margin-bottom:12px; }
        .addr { width:48%; font-size:13px; }
        .addr .label { font-weight:600; color:#6B7280; text-transform:uppercase; letter-spacing:.06em; }
        table.statement { width:100%; border-collapse:collapse; margin-top:6px; }
        table.statement th, table.statement td { padding:6px 4px; border-bottom:1px solid #E5E7EB; font-size:11px; }
        table.statement thead tr { background:#F9FAFB; }
        table.statement th { text-transform:none; color:#6B7280; font-size:13px; text-align:left; }
        .text-right{ text-align:right; }
        .text-center{ text-align:center; }
        .muted{ color:#6B7280; font-size:13px; }
        .small{ font-size:13px; }
        .mt-6{ margin-top:18px; }
        .section { margin-bottom: 18px; }
        .text-center { text-align: center; }
        .text-sm { font-size: 13px; }
        .font-semibold { font-weight: 600; }
        .logo { flex: 0 0 auto; }
        .logo img { height: 48px; width: auto; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="center logo" style="margin-bottom: 12px;">
        @if($logoData)
            <img src="data:image/png;base64,{{ $logoData }}" alt="Company Logo">
        @else
            <div class="brand-name">{{ $meta['company_name'] }}</div>
        @endif
    </div>

    <div class="center">
        <div class="title">Vendor Statement of Account</div>
    </div>

    <div class="section">
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
            <tr>
                <!-- From -->
                <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                    <div style="margin-top: 16px;">
                        <h2>From:</h2>
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
                    </div>
                </td>

                <!-- Bill To on the far right, text left-aligned inside -->
                <td style="width: 50%; vertical-align: top; padding-left: 8px; text-align: right;">
                    <div style="margin-top: 16px;">
                        <h2>To:</h2>
                        <div class="text-sm">
                            @if($meta['company_name'])
                                <span class="font-semibold">{{ $meta['company_name'] }}</span>
                            @else
                                -
                            @endif
                        </div>
                        @if($meta['company'])
                            @if(!empty($meta['company']['address']))
                                <div class="text-sm mt-1">{{ $meta['company']['address'] }}</div>
                            @endif
                            @if(!empty($meta['company']['city']) || !empty($meta['company']['state']) || !empty($meta['company']['country']))
                                <div class="text-sm mt-1">
                                    {{ trim(($meta['company']['city'] ?? '') . (isset($meta['company']['city'], $meta['company']['state']) ? ', ' : '') . ($meta['company']['state'] ?? '')) }}
                                    @if(!empty($meta['company']['country']))
                                        {{ isset($meta['company']['city']) || isset($meta['company']['state']) ? ', ' : '' }}{{ $meta['company']['country'] }}
                                    @endif
                                </div>
                            @endif
                            @if(!empty($meta['company']['phone']))
                                <div class="text-sm mt-1">Phone: {{ $meta['company']['phone'] }}</div>
                            @endif
                            @if(!empty($meta['company']['email']))
                                <div class="text-sm mt-1">Email: {{ $meta['company']['email'] }}</div>
                            @endif
                        @endif
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <table class="statement">
        <thead>
            <tr>
                <th>Date</th>
                <th>Job Ref</th>
                <th>Document #</th>
                <th>Details</th>
                <th class="text-right">Debit Amount({{ $account->currency ?? 'KES' }})</th>
                <th class="text-right">Credit Amount({{ $account->currency ?? 'KES' }})</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ !empty($row['transaction_date']) ? \Carbon\Carbon::parse($row['transaction_date'])->format('d/m/Y') : (!empty($row['date']) ? \Carbon\Carbon::parse($row['date'])->format('d/m/Y') : '-') }}</td>
                    <td>{{ $row['job_reference'] ?? '-' }}</td>
                    <td>{{ $row['document_number'] ?? $row['transaction_number'] ?? '-' }}</td>
                    <td>{{ $row['description'] ?? $row['narration'] ?? '-' }}</td>
                    <td class="text-right">{{ number_format($row['debit_base'] ?? $row['debit_amount'] ?? 0, 2) }}</td>
                    <td class="text-right">{{ number_format($row['credit_base'] ?? $row['credit_amount'] ?? 0, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center muted">No transactions available for this period.</td>
                </tr>
            @endforelse
        </tbody>
        @if(!empty($totals))
            <tfoot>
                <tr style="background:#F9FAFB;">
                    <td colspan="4" class="text-left small"><strong>Totals</strong></td>
                    <td class="text-right"><strong>{{ number_format($totals['total_debit'] ?? $meta['total_debit_base'] ?? 0, 2) }}</strong></td>
                    <td class="text-right"><strong>{{ number_format($totals['total_credit'] ?? $meta['total_credit_base'] ?? 0, 2) }}</strong></td>
                </tr>
                <tr>
                    <td colspan="5" class="text-left small"><strong>Balance</strong></td>
                    <td class="text-right"><strong>{{ number_format($totals['balance'] ?? $meta['closing_balance_base'] ?? 0, 2) }}</strong></td>
                </tr>
            </tfoot>
        @endif
    </table>

    <div class="mt-6" style="text-align:right; font-size:13px; color:#6B7280;">Date: {{ $generatedAt->format('d/m/Y') }}</div>

    <div class="center muted mt-6">From: {{ $meta['from'] ?? 'Beginning' }} To: {{ $meta['to'] ?? 'Today' }}</div>

    <!-- <div class="mt-6 muted small">Statement generated from EPMS ledger and transactional data.</div> -->
</body>
</html>
