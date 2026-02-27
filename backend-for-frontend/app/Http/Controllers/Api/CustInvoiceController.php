<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\Order;
use App\Models\CustInvoice;
use App\Models\CustPayment;
use App\Models\CustPaymentAllocation;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CustInvoiceService;
use App\Services\OrderToCustInvoiceService;
use App\Http\Resources\CustInvoiceResource;
use App\Http\Requests\CustInvoiceStoreRequest;
use App\Http\Requests\CustInvoiceUpdateRequest;

class CustInvoiceController extends Controller
{
    protected $service;
    protected $orderToCustInvoiceService;

    public function __construct(CustInvoiceService $service, OrderToCustInvoiceService $orderToCustInvoiceService) {
        $this->service = $service;
        $this->orderToCustInvoiceService = $orderToCustInvoiceService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoice::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustInvoiceResource::collection($data);
    }

    public function store(CustInvoiceStoreRequest $request)
    {
        $this->authorize('create', CustInvoice::class);

        $data = $request->validated();

        $order = Order::with('custInvoices')->findOrFail($data['order_id']);

        if ($order->status !== 'approved') {
            return response()->json([
                'message' => 'Invoice can only be created from approved orders.',
                'errors'  => [
                    'status' => ['Order must be approved before creating an invoice.'],
                ],
            ], 422);
        }

        if ($order->custInvoices()->exists()) {
            return response()->json([
                'message' => 'An invoice already exists for this order.',
                'errors'  => [
                    'order_id' => ['Only one customer invoice is allowed per order.'],
                ],
            ], 422);
        }

        $overrides = [
            'title'            => $data['title'] ?? null,
            'description'      => $data['description'] ?? null,
            'payment_terms'    => $data['payment_terms'] ?? null,
            'notes_to_customer'=> $data['notes_to_customer'] ?? null,
        ];

        $invoice = DB::transaction(function () use ($request, $order, $overrides) {
            return $this->orderToCustInvoiceService->createInvoiceFromOrder(
                $order,
                $request->user()?->id,
                $overrides
            );
        });

        return new CustInvoiceResource($invoice);
    }

    public function show(CustInvoice $custInvoice)
    {
        $this->authorize('view', $custInvoice);

        $custInvoice->loadMissing([
            'order',
            'project',
            'customer',
            'invoiceItems',
            'taxitems',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CustInvoiceResource($custInvoice);
    }

    public function update(CustInvoiceUpdateRequest $request, CustInvoice $custInvoice)
    {
        $this->authorize('update', $custInvoice);

        $custInvoice->loadMissing('order');
        if (! $custInvoice->order || $custInvoice->order->status !== 'approved') {
            return response()->json([
                'message' => 'Customer invoices can only be edited when linked to an approved order.',
                'errors'  => [
                    'order_id' => ['Invoice must be associated with an approved order to edit header fields.'],
                ],
            ], 422);
        }

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custInvoice->id, $validated);
        return new CustInvoiceResource($updated);
    }

    public function destroy(CustInvoice $custInvoice)
    {
        $this->authorize('delete', $custInvoice);

        $this->service->delete($custInvoice->id);
        return response()->noContent();
    }

    /**
     * Mark a customer invoice as sent.
     *
     * This is separate from the generic update endpoint so that we keep
     * header-only edits constrained while still allowing an explicit
     * transition from draft → sent for approved orders.
     */
    public function markSent(CustInvoice $custInvoice, Request $request)
    {
        $this->authorize('update', $custInvoice);

        $custInvoice->loadMissing('order');

        if (! $custInvoice->order || $custInvoice->order->status !== 'approved') {
            return response()->json([
                'message' => 'Invoice can only be marked as sent when its order is approved.',
                'errors'  => [
                    'order_id' => ['Invoice must be associated with an approved order to mark as sent.'],
                ],
            ], 422);
        }

        if ($custInvoice->status === 'sent') {
            return new CustInvoiceResource($custInvoice);
        }

        if ($custInvoice->status !== 'draft') {
            return response()->json([
                'message' => 'Only draft invoices can be marked as sent.',
                'errors'  => [
                    'status' => ['This invoice is not in draft status.'],
                ],
            ], 422);
        }

        $custInvoice->status = 'sent';
        $custInvoice->updated_by = Auth::id();
        $custInvoice->save();

        $custInvoice->refresh();
        $custInvoice->loadMissing([
            'order',
            'project',
            'customer',
            'invoiceItems',
            'taxitems',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CustInvoiceResource($custInvoice);
    }

    /**
     * Record a payment against a customer invoice and create a corresponding
     * allocation entry that tracks the running balance.
     */
    public function addPayment(Request $request, CustInvoice $custInvoice)
    {
        $this->authorize('update', $custInvoice);

        $custInvoice->loadMissing('order');

        if (! $custInvoice->order || $custInvoice->order->status !== 'approved') {
            return response()->json([
                'message' => 'Payments can only be recorded for invoices whose order is approved.',
                'errors'  => [
                    'order_id' => ['Invoice must be associated with an approved order to add payments.'],
                ],
            ], 422);
        }

        if ($custInvoice->status !== 'sent' && $custInvoice->status !== 'partial-paid') {
            return response()->json([
                'message' => 'Payments can only be added to sent or partially paid invoices.',
                'errors'  => [
                    'status' => ['Invoice must be in sent or partial-paid status to add payments.'],
                ],
            ], 422);
        }

        $validated = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'mpesa', 'bank_transfer', 'check'])],
            'payment_status' => ['required', Rule::in(['pending', 'complete'])],
            'currency' => ['required', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'transaction_reference' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['required', 'string', 'max:255'],
            'exchange_rate' => ['required', 'numeric', 'min:0'],
            'fee_or_charge' => ['required', 'numeric', 'min:0'],
        ]);

        $invoice = $custInvoice;

        $invoice = DB::transaction(function () use ($invoice, $validated) {
            $existingAllocations = CustPaymentAllocation::where('invoice_id', $invoice->id)->get();
            $previousBalance = (float) $invoice->total_amount - (float) $existingAllocations->sum('allocated_amount');
            $afterBalance = max($previousBalance - (float) $validated['amount_paid'], 0);
            $installmentNumber = $existingAllocations->count() + 1;

            $payment = CustPayment::create([
                // In this schema, transaction_id is linked to cust_invoices via FK
                'transaction_id' => $invoice->id,
                'amount_paid' => $validated['amount_paid'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_status'],
                'currency' => $validated['currency'],
                'bank_name' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_reference' => $validated['transaction_reference'] ?? null,
                'receipt_number' => $validated['receipt_number'],
                'invoice_total_amount' => $invoice->total_amount,
                'exchange_rate' => $validated['exchange_rate'],
                'fee_or_charge' => $validated['fee_or_charge'],
                'reconciled' => false,
                'reconciliation_date' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            CustPaymentAllocation::create([
                'payment_id' => $payment->id,
                'invoice_id' => $invoice->id,
                'allocated_amount' => $validated['amount_paid'],
                'allocation_date' => $validated['payment_date'],
                'balance_before_payment' => $previousBalance,
                'balance_after_payment' => $afterBalance,
                'installment_number' => $installmentNumber,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            $invoice->refresh();

            return $invoice;
        });

        $invoice->loadMissing([
            'order',
            'project',
            'customer',
            'invoiceItems',
            'taxitems',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CustInvoiceResource($invoice);
    }

    /**
     * Create a customer invoice from an approved order.
     * This is the public endpoint used by the UI; it delegates
     * to shared order→invoice logic and ensures we only work
     * with approved orders that do not yet have an invoice.
     */
    public function createFromOrder(Request $request)
    {
        $this->authorize('create', CustInvoice::class);

        $data = $request->validate([
            'order_id'         => ['required', 'integer', 'exists:orders,id'],
            'title'            => ['nullable', 'string'],
            'description'      => ['nullable', 'string'],
            'payment_terms'    => ['nullable', 'string'],
            'notes_to_customer'=> ['nullable', 'string'],
        ]);

        $order = Order::with('custInvoices')->findOrFail($data['order_id']);

        if ($order->status !== 'approved') {
            return response()->json([
                'message' => 'Invoice can only be generated from approved orders.',
                'errors'  => [
                    'status' => ['Order must be approved before generating an invoice.'],
                ],
            ], 422);
        }

        if ($order->custInvoices()->exists()) {
            return response()->json([
                'message' => 'An invoice already exists for this order.',
                'errors'  => [
                    'order_id' => ['Only one customer invoice is allowed per order.'],
                ],
            ], 422);
        }

        $overrides = $request->only([
            'title',
            'description',
            'payment_terms',
            'notes_to_customer',
        ]);

        $invoice = DB::transaction(function () use ($request, $order, $overrides) {
            return $this->orderToCustInvoiceService->createInvoiceFromOrder(
                $order,
                $request->user()?->id,
                $overrides
            );
        });

        return new CustInvoiceResource($invoice);
    }

    /**
     * Generate and download a PDF representation of the customer invoice.
     */
    public function downloadPdf(CustInvoice $custInvoice, Request $request)
    {
        $this->authorize('view', $custInvoice);

        $pdf = $this->buildCustInvoicePdf($custInvoice, $request->user()?->id);

        return response()->streamDownload(
            function () use ($pdf) {
                echo $pdf['output'];
            },
            $pdf['fileName'],
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }

    /**
     * Send the customer invoice PDF to the customer via email.
     */
    public function sendEmail(CustInvoice $custInvoice, Request $request)
    {
        $this->authorize('view', $custInvoice);

        $custInvoice->loadMissing(['customer', 'project']);

        if (! $custInvoice->customer || empty($custInvoice->customer->email)) {
            return response()->json([
                'message' => 'Invoice customer email address is missing.',
            ], 422);
        }

        // Try to reuse an existing PDF for this invoice, if available
        $download = Download::where('name', $custInvoice->invoice_number)->first();

        if ($download && Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildCustInvoicePdf($custInvoice, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = Storage::disk('public')->path($relativePath);

        $recipientName = $custInvoice->customer->name ?? 'Customer';
        $projectName = $custInvoice->project->name ?? null;
        $fromName = config('mail.from.name', config('app.name', 'EPMS'));

        $subject = sprintf(
            'Invoice %s%s',
            $custInvoice->invoice_number,
            $projectName ? ' - ' . $projectName : ''
        );

        $mailData = [
            'invoice'       => $custInvoice,
            'recipientName' => $recipientName,
            'projectName'   => $projectName,
            'fromName'      => $fromName,
        ];

        try {
            Mail::send('emails.cust-invoice', $mailData, function ($message) use ($custInvoice, $recipientName, $subject, $fullPath, $fileName) {
                $message->to($custInvoice->customer->email, $recipientName)
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as'   => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $e) {
            \Log::error('Failed to send customer invoice email', [
                'invoice_id' => $custInvoice->id,
                'error'      => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to send invoice email to customer.',
            ], 500);
        }

        return response()->json([
            'message' => 'Invoice emailed to customer successfully.',
        ]);
    }

    /**
     * Build the customer invoice PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCustInvoicePdf(CustInvoice $custInvoice, ?int $userId = null): array
    {
        $custInvoice->loadMissing([
            'project',
            'customer',
            'invoiceItems',
            'taxitems',
            'documents',
            'order',
        ]);

        $configValues = SysConfig::whereIn('name', [
            'NAME',
            'EMAIL',
            'ADDRESS_LINE_1',
            'CITY',
            'STATE',
            'COUNTRY',
            'PHONE',
            'WEBSITE',
        ])->pluck('value', 'name');

        $senderName = $configValues['NAME'] ?? config('app.name', 'EPMS');
        $senderEmail = $configValues['EMAIL'] ?? config('mail.from.address', 'no-reply@example.com');
        $generatedAt = now();

        $data = [
            'invoice'            => $custInvoice,
            'senderName'         => $senderName,
            'senderEmail'        => $senderEmail,
            'senderPhone'        => $configValues['PHONE']   ?? null,
            'senderWebsite'      => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1' => $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity'         => $configValues['CITY']    ?? null,
            'senderState'        => $configValues['STATE']   ?? null,
            'senderCountry'      => $configValues['COUNTRY'] ?? null,
            'generatedAt'        => $generatedAt,
        ];

        $html = view('pdf.cust-invoice', $data)->render();

        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $custInvoice->invoice_number . '.pdf';
        $relativePath = 'cust-invoices/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $custInvoice->invoice_number]);
        $download->path = $relativePath;
        $download->updated_at = now();
        $download->updated_by = $userId;
        if (! $download->exists) {
            $download->created_at = now();
            $download->created_by = $userId;
        }
        $download->save();

        return [
            'fileName'     => $fileName,
            'relativePath' => $relativePath,
            'output'       => $output,
        ];
    }
}