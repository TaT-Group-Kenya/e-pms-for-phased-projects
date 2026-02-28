<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Models\Order;
use App\Models\CustInvoice;
use App\Models\CustPayment;
use App\Models\CustPaymentAllocation;
use App\Models\CustomerTransactionsLedger;
use App\Services\CurrencyConversionService;
use App\Models\Account;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CommonService;
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

        if (! in_array($custInvoice->status, ['sent', 'partial-paid'], true)) {
            return response()->json([
                'message' => 'Payments can only be added when the invoice status is sent or partial-paid.',
                'errors'  => [
                    'status' => ['Invoice must be in sent status to add payments.'],
                ],
            ], 422);
        }

        $validated = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'mpesa', 'bank_transfer', 'check'])],
            'payment_status' => ['required', Rule::in(['pending', 'complete'])],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['required', 'string', 'max:255'],
            'account_id' => ['required', 'integer', 'exists:accounts,id,is_deleted,0'],
        ]);

        $invoice = $custInvoice;

        $invoice = DB::transaction(function () use ($invoice, $validated) {
            $commonService = new CommonService();

            $account = Account::findOrFail($validated['account_id']);

            // Generate a unique transaction number for the payment, similar to order numbers
            do {
                $transactionNumber = $commonService->generateUniqueCode('CPM-');
            } while (CustPayment::where('transaction_number', $transactionNumber)->exists());

            // Only consider active (non-deleted) allocations when computing the
            // previous balance so that deleted payments do not affect
            // outstanding balance or overpayment checks.
            $existingAllocations = CustPaymentAllocation::where('invoice_id', $invoice->id)
                ->where('is_deleted', false)
                ->get();
            $previousBalance = (float) $invoice->total_amount - (float) $existingAllocations->sum('allocated_amount');

            // Strictly prevent overpayments beyond the current outstanding balance,
            // allowing a small tolerance for rounding differences.
            $amountPaid = (float) $validated['amount_paid'];
            $tolerance = 0.01; // 1 cent tolerance
            $outstandingBalance = max($previousBalance, 0.0);

            if ($amountPaid > $outstandingBalance + $tolerance) {
                $excess = $amountPaid - $outstandingBalance;

                throw ValidationException::withMessages([
                    'amount_paid' => [
                        'Payment amount exceeds the outstanding invoice balance by ' . number_format($excess, 2, '.', '') . '.',
                    ],
                ]);
            }

            $afterBalance = max($previousBalance - $amountPaid, 0);
            $installmentNumber = $existingAllocations->count() + 1;

            // Derive tax vs net portions based on invoice totals.
            // If the invoice has a non-zero tax_amount, allocate proportionally;
            // otherwise treat the entire payment as net.
            $invoiceTotal = (float) $invoice->total_amount;
            $invoiceTaxTotal = (float) $invoice->tax_amount;

            if ($invoiceTotal > 0 && $invoiceTaxTotal > 0) {
                $taxPortion = min(
                    round(($invoiceTaxTotal / $invoiceTotal) * (float) $validated['amount_paid'], 2),
                    (float) $validated['amount_paid']
                );
            } else {
                $taxPortion = 0.0;
            }

            $netPortion = (float) $validated['amount_paid'] - $taxPortion;

            // Determine base (account) currency and invoice currency
            $accountCurrencyCode = $account->currency ?? 'KES';
            $invoiceCurrencyCode = $invoice->currency;

            // Use shared conversion helper: 1 invoice currency unit = exchange_rate * base currency units
            $conversionService = new CurrencyConversionService();
            $conversion = $conversionService->convertToBaseFromInvoice((float) $validated['amount_paid'], $invoiceCurrencyCode, $accountCurrencyCode);
            $exchangeRate = $conversion['exchange_rate'];
            $convertedAmount = $conversion['converted_amount'];

            $feeOrCharge = 0.0;

            $payment = CustPayment::create([
                'transaction_number' => $transactionNumber,
                'amount_paid' => $validated['amount_paid'],
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_status'],
                'currency' => $invoiceCurrencyCode,
                'bank_name' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_reference' => $validated['receipt_number'],
                'receipt_number' => $validated['receipt_number'],
                'invoice_total_amount' => $invoice->total_amount,
                'exchange_rate' => $exchangeRate,
                'fee_or_charge' => $feeOrCharge,
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

            // Create a corresponding customer transactions ledger entry
            CustomerTransactionsLedger::create([
                'cust_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number,
                'transaction_type' => 'receipt',
                'transaction_date' => $validated['payment_date'],
                'posted_date' => now(),
                'amount' => $validated['amount_paid'],
                'transaction_currency' => $invoiceCurrencyCode,
                'base_currency' => $accountCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'customer_id' => $invoice->customer_id,
                'source_type' => 'cust_invoice',
                'source_id' => $invoice->id,
                'account_debit' => null,
                'account_credit' => $account->id,
                'category' => 'revenue',
                'payment_method' => $validated['payment_method'],
                'bank_account' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => $validated['related_transaction_id'] ?? null,
                'narration' => 'Payment for invoice ' . $invoice->invoice_number,
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Ym'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            // Update benefiting account balance: credit increases balance
            $currentBalance = (float) $account->balance;
            $account->balance = (string) number_format($currentBalance + $convertedAmount, 2, '.', '');
            $account->updated_at = now();
            $account->updated_by = Auth::id();
            $account->save();

            // Update invoice status based on remaining balance
            if ($afterBalance <= 0) {
                $invoice->status = 'paid';
            } else {
                $invoice->status = 'partial-paid';
            }

            $invoice->updated_by = Auth::id();
            $invoice->save();

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
     * Delete (logically) a payment recorded against a customer invoice and
     * reverse its impact on allocations, ledger and account balance.
     */
    public function deletePayment(Request $request, CustInvoice $custInvoice, CustPayment $custPayment)
    {
        $this->authorize('update', $custInvoice);

        $custInvoice->loadMissing('order');

        if (! $custInvoice->order || $custInvoice->order->status !== 'approved') {
            return response()->json([
                'message' => 'Payments can only be modified for invoices whose order is approved.',
                'errors'  => [
                    'order_id' => ['Invoice must be associated with an approved order to modify payments.'],
                ],
            ], 422);
        }

        if ($custPayment->is_deleted) {
            return response()->json([
                'message' => 'This payment has already been deleted.',
            ], 422);
        }

        // Ensure the payment is actually allocated to this invoice
        $allocations = CustPaymentAllocation::where('payment_id', $custPayment->id)
            ->where('invoice_id', $custInvoice->id)
            ->where('is_deleted', false)
            ->get();

        if ($allocations->isEmpty()) {
            return response()->json([
                'message' => 'Payment is not associated with this invoice.',
            ], 404);
        }

        if ($custPayment->reconciled) {
            return response()->json([
                'message' => 'Reconciled payments cannot be deleted.',
                'errors'  => [
                    'payment_id' => ['Reverse the reconciliation before deleting this payment.'],
                ],
            ], 422);
        }

        $invoice = $custInvoice;

        $invoice = DB::transaction(function () use ($invoice, $custPayment, $allocations) {
            $userId = Auth::id();

            // Soft delete the payment record itself
            $custPayment->softDelete($userId);

            // Logically delete allocations for this payment on this invoice
            foreach ($allocations as $allocation) {
                if (! $allocation->is_deleted) {
                    $allocation->is_deleted = true;
                    $allocation->deleted_at = now();
                    $allocation->deleted_by = $userId;
                    $allocation->save();
                }
            }

            // Fetch active ledger entries for this payment against this invoice
            $ledgers = CustomerTransactionsLedger::where('cust_payment_id', $custPayment->id)
                ->where('source_type', 'cust_invoice')
                ->where('source_id', $invoice->id)
                ->where('is_deleted', false)
                ->get();

            // Reverse the impact on the benefiting account balance(s)
            $amountsByAccount = [];
            foreach ($ledgers as $ledger) {
                if (! empty($ledger->account_credit)) {
                    $accountId = $ledger->account_credit;
                    $amountsByAccount[$accountId] = ($amountsByAccount[$accountId] ?? 0.0)
                        + (float) $ledger->converted_amount;
                }
            }

            foreach ($amountsByAccount as $accountId => $amountToReverse) {
                // Include logically deleted accounts as well, just in case
                $account = Account::withDeleted()->find($accountId);
                if ($account) {
                    $currentBalance = (float) $account->balance;
                    $account->balance = (string) number_format($currentBalance - $amountToReverse, 2, '.', '');
                    $account->updated_at = now();
                    $account->updated_by = $userId;
                    $account->save();
                }
            }

            // Soft delete ledger rows so they no longer participate in normal queries
            foreach ($ledgers as $ledger) {
                $ledger->softDelete($userId);
            }

            // Recalculate invoice status based on remaining (non-deleted) allocations
            $existingAllocations = CustPaymentAllocation::where('invoice_id', $invoice->id)
                ->where('is_deleted', false)
                ->get();

            $allocatedTotal = (float) $existingAllocations->sum('allocated_amount');
            $remaining = max((float) $invoice->total_amount - $allocatedTotal, 0);

            if ($allocatedTotal <= 0) {
                // No active payments remaining
                $invoice->status = 'sent';
            } elseif ($remaining <= 0) {
                $invoice->status = 'paid';
            } else {
                $invoice->status = 'partial-paid';
            }

            $invoice->updated_by = $userId;
            $invoice->save();

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
     * Update non-financial metadata for a payment recorded against a
     * customer invoice. Financial fields such as amount, date, account
     * or currency must not be edited in-place and require delete+re-add.
     */
    public function updatePayment(Request $request, CustInvoice $custInvoice, CustPayment $custPayment)
    {
        $this->authorize('update', $custInvoice);

        $custInvoice->loadMissing('order');

        if (! $custInvoice->order || $custInvoice->order->status !== 'approved') {
            return response()->json([
                'message' => 'Payments can only be modified for invoices whose order is approved.',
                'errors'  => [
                    'order_id' => ['Invoice must be associated with an approved order to modify payments.'],
                ],
            ], 422);
        }

        if ($custPayment->is_deleted) {
            return response()->json([
                'message' => 'This payment has already been deleted.',
            ], 422);
        }

        // Ensure the payment is actually allocated to this invoice
        $hasAllocation = CustPaymentAllocation::where('payment_id', $custPayment->id)
            ->where('invoice_id', $custInvoice->id)
            ->where('is_deleted', false)
            ->exists();

        if (! $hasAllocation) {
            return response()->json([
                'message' => 'Payment is not associated with this invoice.',
            ], 404);
        }

        if ($custPayment->reconciled) {
            return response()->json([
                'message' => 'Reconciled payments cannot be edited.',
                'errors'  => [
                    'payment_id' => ['Reverse the reconciliation before editing this payment.'],
                ],
            ], 422);
        }

        // Block financial field edits; these require a delete + re-add flow
        if ($request->hasAny(['amount_paid', 'payment_date', 'account_id', 'currency', 'exchange_rate'])) {
            return response()->json([
                'message' => 'Financial fields (amount, date, account or currency) cannot be edited in place. Delete and re-add the payment with corrected values.',
            ], 422);
        }

        $validated = $request->validate([
            'payment_status' => ['sometimes', 'required', Rule::in(['pending', 'complete'])],
            'bank_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'check_number' => ['sometimes', 'nullable', 'string', 'max:255'],
            'receipt_number' => ['sometimes', 'required', 'string', 'max:255'],
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'No editable fields were provided.',
            ], 422);
        }

        $invoice = $custInvoice;

        $invoice = DB::transaction(function () use ($invoice, $custPayment, $validated) {
            $userId = Auth::id();

            // Update payment metadata
            if (array_key_exists('payment_status', $validated)) {
                $custPayment->payment_status = $validated['payment_status'];
            }
            if (array_key_exists('bank_name', $validated)) {
                $custPayment->bank_name = $validated['bank_name'];
            }
            if (array_key_exists('check_number', $validated)) {
                $custPayment->check_number = $validated['check_number'];
            }
            if (array_key_exists('receipt_number', $validated)) {
                $custPayment->receipt_number = $validated['receipt_number'];
                $custPayment->transaction_reference = $validated['receipt_number'];
            }

            $custPayment->updated_by = $userId;
            $custPayment->updated_at = now();
            $custPayment->save();

            // Propagate relevant metadata to ledger entries for this payment/invoice
            $ledgers = CustomerTransactionsLedger::where('cust_payment_id', $custPayment->id)
                ->where('source_type', 'cust_invoice')
                ->where('source_id', $invoice->id)
                ->where('is_deleted', false)
                ->get();

            foreach ($ledgers as $ledger) {
                // Do not change transaction_status here; it remains one of 'cleared', 'reconciled', or 'void'.
                if (array_key_exists('bank_name', $validated)) {
                    $ledger->bank_account = $validated['bank_name'];
                }
                if (array_key_exists('check_number', $validated)) {
                    $ledger->check_number = $validated['check_number'];
                }
                if (array_key_exists('receipt_number', $validated)) {
                    $ledger->transaction_reference = $validated['receipt_number'];
                }

                $ledger->updated_by = $userId;
                $ledger->updated_at = now();
                $ledger->save();
            }

            // No need to recompute allocations or balances as we didn't touch financial fields
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