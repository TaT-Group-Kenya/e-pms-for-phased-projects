@php
	$creditNote = $creditNote ?? null;
@endphp

<p>Dear {{ $recipientName ?? 'Company' }},</p>

<p>Please find attached your company credit note{{ isset($projectName) ? ' for project ' . $projectName : '' }}.</p>

@if($creditNote)
	<ul>
		<li><strong>Credit Note Number:</strong> {{ $creditNote->credit_note_number }}</li>
		<li><strong>Date:</strong> {{ optional($creditNote->created_at)->format('d/m/Y') }}</li>
		<li><strong>Status:</strong> {{ $creditNote->status_label ?? ucfirst($creditNote->status) }}</li>
		@if($creditNote->invoice && $creditNote->invoice->company)
			<li><strong>Company:</strong> {{ $creditNote->invoice->company->name }}</li>
		@endif
		<li><strong>Total Amount:</strong> {{ $creditNote->currency }} {{ number_format($creditNote->total_amount, 2) }}</li>
	</ul>
	@if($creditNote->notes_to_customer)
		<p><strong>Notes:</strong><br>{{ $creditNote->notes_to_customer }}</p>
	@endif
@endif

<p>If you have any questions, please contact us at {{ $senderEmail ?? config('mail.from.address', 'no-reply@example.com') }}.</p>

<p>Best regards,<br>{{ $fromName ?? config('app.name', 'EPMS') }}</p>
