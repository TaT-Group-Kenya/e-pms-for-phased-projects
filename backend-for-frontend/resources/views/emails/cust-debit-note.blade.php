@php
    $debitNote = $debitNote ?? null;
@endphp

<p>Dear {{ $recipientName ?? 'Customer' }},</p>

<p>Please find attached your debit note{{ isset($projectName) ? ' for project ' . $projectName : '' }}.</p>

@if($debitNote)
    <ul>
        <li><strong>Debit Note Number:</strong> {{ $debitNote->debit_note_number }}</li>
        <li><strong>Date:</strong> {{ optional($debitNote->created_at)->format('d/m/Y') }}</li>
        <li><strong>Status:</strong> {{ ucfirst($debitNote->status) }}</li>
        @if($debitNote->invoice && $debitNote->invoice->customer)
            <li><strong>Customer:</strong> {{ $debitNote->invoice->customer->name }}</li>
        @endif
        <li><strong>Related Invoice:</strong> {{ $debitNote->invoice?->invoice_number ?? '-' }}</li>
        <li><strong>Total Amount:</strong> {{ $debitNote->currency }} {{ number_format($debitNote->total_amount, 2) }}</li>
    </ul>
@endif

<p>If you have any questions, please contact us.</p>

<p>Best regards,<br>{{ $fromName ?? config('app.name', 'EPMS') }}</p>
