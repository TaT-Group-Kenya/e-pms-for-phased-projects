<p>Dear {{ $recipientName ?? 'Customer' }},</p>

<p>Please find attached debit note {{ $debitNote->debit_note_number }}{{ $projectName ? ' for project '.$projectName : '' }}.</p>

<ul>
    <li><strong>Related invoice:</strong> {{ $debitNote->invoice?->invoice_number ?? '-' }}</li>
    <li><strong>Date:</strong> {{ optional($debitNote->created_at)->format('d/m/Y') }}</li>
    <li><strong>Total due:</strong> {{ $debitNote->currency }} {{ number_format((float) $debitNote->total_amount, 2) }}</li>
</ul>

<p>If you have any questions, please contact us.</p>

<p>Best regards,<br>{{ $fromName ?? config('app.name', 'EPMS') }}</p>
