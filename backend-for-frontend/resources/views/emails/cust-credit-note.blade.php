@php
    $creditNote = $creditNote ?? null;
@endphp

<p>Dear {{ $recipientName ?? 'Customer' }},</p>

<p>Please find attached your credit note{{ isset($projectName) ? ' for project ' . $projectName : '' }}.</p>

@if($creditNote)
    <ul>
        <li><strong>Credit Note Number:</strong> {{ $creditNote->credit_note_number }}</li>
        <li><strong>Date:</strong> {{ optional($creditNote->created_at)->format('d M Y') }}</li>
        <li><strong>Status:</strong> {{ $creditNote->status_label ?? ucfirst($creditNote->status) }}</li>
        @if($creditNote->invoice && $creditNote->invoice->customer)
            <li><strong>Customer:</strong> {{ $creditNote->invoice->customer->name }}</li>
        @endif
        <li><strong>Total Amount:</strong> {{ $creditNote->currency }} {{ number_format($creditNote->total_amount, 2) }}</li>
    </ul>
@endif

<p>If you have any questions, please contact us.</p>

<p>Best regards,<br>{{ $fromName ?? config('app.name', 'EPMS') }}</p>
