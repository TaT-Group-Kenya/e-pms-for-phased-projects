<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInvoice;
use App\Models\CompanyPayment;
use App\Models\PdcIssuedCompany;
use App\Models\CompanyTransactionsLedger;
use App\Models\CompanyBank;
use App\Models\Account;
use App\Models\CompanyProject;
use App\Models\ProjectPhase;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CommonService;
use App\Services\CompanyInvoiceService;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\CompanyInvoiceResource;
use App\Http\Requests\CompanyInvoiceStoreRequest;
use App\Http\Requests\CompanyInvoiceUpdateRequest;

class CompanyInvoiceController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoice::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        $data->load(['company', 'payments', 'project']);
        return CompanyInvoiceResource::collection($data);
    }

    public function store(CompanyInvoiceStoreRequest $request)
    {
        $this->authorize('create', \App\Models\CompanyInvoice::class);
        $validated = $request->validated();
        $validated['created_at'] = $validated['created_at'] ?? now();

        // Ensure the selected company has at least one configured bank/payment method
        if (! empty($validated['company_id'])) {
            $hasBankAccount = CompanyBank::where('company_id', $validated['company_id'])
                ->where('is_deleted', false)
                ->exists();

            if (! $hasBankAccount) {
                return response()->json([
                    'message' => 'The selected company does not have any bank/payment details configured. Please add at least one company bank account before creating an invoice.',
                    'errors'  => [
                        'company_id' => ['Company must have at least one bank/payment method configured.'],
                    ],
                ], 422);
            }
        }

        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CompanyInvoiceResource($model);
    }

    /**
     * Create a draft company invoice from a completed project phase assignment.
     *
     * The UI selects a company and one of its completed assigned project phases;
     * this endpoint generates a draft invoice header with zero financial amounts.
     * Amounts and line items can then be edited on the invoice detail screen.
     */
    public function createFromPhase(Request $request)
    {
        $this->authorize('create', CompanyInvoice::class);

        $data = $request->validate([
            'company_id'       => ['required', 'integer', 'exists:companies,id'],
            'project_phase_id' => ['required', 'integer', 'exists:project_phases,id'],
            'title'            => ['nullable', 'string'],
            'description'      => ['nullable', 'string'],
            'payment_terms'    => ['nullable', 'string'],
            'notes_to_customer'=> ['nullable', 'string'],
        ]);

        // Company invoices require at least one bank/payment method so that
        // payment details can be presented on the invoice.
        $hasBankAccount = CompanyBank::where('company_id', $data['company_id'])
            ->where('is_deleted', false)
            ->exists();

        if (! $hasBankAccount) {
            return response()->json([
                'message' => 'The selected company does not have any bank/payment details configured. Please add at least one company bank account before creating an invoice.',
                'errors'  => [
                    'company_id' => ['Company must have at least one bank/payment method configured.'],
                ],
            ], 422);
        }

        $phase = ProjectPhase::with('project')->findOrFail($data['project_phase_id']);

        // Ensure this phase is assigned to the selected company and is marked complete.
        $assignment = CompanyProject::where('company_id', $data['company_id'])
            ->where('phase_id', $phase->id)
            ->where('is_complete', true)
            ->first();

        if (! $assignment) {
            return response()->json([
                'message' => 'Selected phase is not a completed assignment for this company.',
                'errors'  => [
                    'project_phase_id' => ['Phase must be assigned to the selected company and marked complete.'],
                ],
            ], 422);
        }

        // Prevent duplicate invoices for the same company and project phase.
        $existingInvoice = CompanyInvoice::where('company_id', $data['company_id'])
            ->where('project_phase_id', $phase->id)
            ->where('is_deleted', false)
            ->first();

        if ($existingInvoice) {
            return response()->json([
                'message' => 'An invoice already exists for this company and project phase.',
                'errors'  => [
                    'project_phase_id' => ['Only one company invoice is allowed per company and project phase.'],
                ],
            ], 422);
        }

        $commonService = new CommonService();

        // Generate a unique invoice number for the company invoice.
       $invoiceNumber = $commonService->getNextCompanyInvoiceNumber();

        $project = $phase->project;

        $invoice = DB::transaction(function () use ($data, $phase, $project, $invoiceNumber) {
            return CompanyInvoice::create([
                'invoice_number'      => $invoiceNumber,
                'project_id'          => $project ? $project->id : null,
                'company_id'          => $data['company_id'],
                'project_phase_id'    => $phase->id,
                'title'               => $data['title'] ?? $phase->name,
                'description'         => $data['description'] ?? ($phase->description ?? ''),
                'status'              => 'draft',
                'subtotal_amount'     => 0,
                'tax_amount'          => 0,
                'discount_percentage' => '0',
                'discount_amount'     => 0,
                'total_amount'        => 0,
                'currency'            => 'KES',
                'payment_terms'       => $data['payment_terms'] ?? '',
                'notes_to_customer'   => $data['notes_to_customer'] ?? '',
                'valid_until'         => now()->addDays(30),
                'created_at'          => now(),
                'updated_at'          => now(),
                'created_by'          => Auth::id(),
                'updated_by'          => Auth::id(),
                'is_deleted'          => false,
            ]);
        });

        $invoice->loadMissing([
            'project',
            'project.phases',
            'invoiceItems.projectPhase',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($invoice);
    }

    public function show(CompanyInvoice $companyInvoice)
    {
        $this->authorize('view', $companyInvoice);

        $companyInvoice->loadMissing([
            'project',
            'project.phases',
            'invoiceItems.projectPhase',
            'payments',
            'creditnotes',
            'documents',
            'pdcsIssued',
        ]);

        return new CompanyInvoiceResource($companyInvoice);
    }

    /**
     * Record a payment against a company invoice and create a corresponding
     * company transactions ledger entry with tax/net split.
     */
    public function addPayment(Request $request, CompanyInvoice $companyInvoice)
    {
        $this->authorize('update', $companyInvoice);

        if (! in_array($companyInvoice->status, ['sent', 'partially-paid'], true)) {
            return response()->json([
                'message' => 'Payments can only be added when the invoice status is sent or partially-paid.',
                'errors'  => [
                    'status' => ['Invoice must be in sent or partially-paid status to add payments.'],
                ],
            ], 422);
        }

        $validated = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'string', 'max:255'],
            'payment_status' => ['required', Rule::in(['pending', 'complete'])],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'cheque_date' => ['required_if:payment_method,check', 'nullable', 'date', 'after_or_equal:today'],
            'bank_branch' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['required_unless:payment_method,check', 'string', 'max:255'],
            'forex_rate' => ['required', 'numeric', 'min:0'],
            'settlement_account_forex_rate' => ['nullable', 'numeric', 'min:0'],
            'account_id' => ['required', 'integer', 'exists:accounts,id,is_deleted,0'],
        ]);

        // Ensure payment_date is not older than invoice creation date
        $paymentDate = \Carbon\Carbon::parse($validated['payment_date'])->toDateString();
        $invoiceCreatedAt = $companyInvoice->created_at instanceof \Carbon\Carbon
            ? $companyInvoice->created_at->toDateString()
            : \Carbon\Carbon::parse($companyInvoice->created_at)->toDateString();
        if ($paymentDate < $invoiceCreatedAt) {
            return response()->json([
                'message' => 'Payment date cannot be earlier than the invoice creation date (' . $invoiceCreatedAt . ').',
                'errors'  => [
                    'payment_date' => ['Payment date must not be before the invoice creation date.'],
                ],
            ], 422);
        }

        $invoice = $companyInvoice;

        $settlementAccRate = $validated['settlement_account_forex_rate'] ?? 1;


        $commonService = new CommonService();

        $invoice = DB::transaction(function () use ($invoice, $validated, $commonService, $settlementAccRate) {
            $amountPaid = (float) $validated['amount_paid'];

            $account = Account::findOrFail($validated['account_id']);

            // Strictly prevent overpayments beyond the current outstanding balance,
            // allowing a small tolerance for rounding differences. Only consider
            // non-deleted payments so that deleted ones do not affect the
            // outstanding balance.
            $existingPaymentsTotal = (float) CompanyPayment::where('invoice_id', $invoice->id)
                ->where('is_deleted', false)
                ->sum('amount_paid');
            $pdcReserved = (float) \App\Models\PdcIssuedCompany::where('invoice_id', $invoice->id)
                ->where('is_deleted', false)
                ->whereIn('status', ['issued', 'pending'])
                ->sum('amount');
            $outstandingBalance = max((float) $invoice->total_amount - $existingPaymentsTotal - $pdcReserved, 0.0);
            $tolerance = 0.01; // 1 cent tolerance

            if ($amountPaid > $outstandingBalance + $tolerance) {
                $excess = $amountPaid - $outstandingBalance;

                throw ValidationException::withMessages([
                    'amount_paid' => [
                        'Payment amount exceeds the outstanding invoice balance by ' . number_format($excess, 2, '.', '') . '.',
                    ],
                ]);
            }

            $invoiceTotal = (float) $invoice->total_amount;
            $invoiceTaxTotal = (float) $invoice->tax_amount;

            if ($invoiceTotal > 0 && $invoiceTaxTotal > 0) {
                $taxPortion = min(
                    round(($invoiceTaxTotal / $invoiceTotal) * $amountPaid, 2),
                    $amountPaid
                );
            } else {
                $taxPortion = 0.0;
            }

            $netPortion = $amountPaid - $taxPortion;

            // Determine base (account) currency and invoice currency
            $accountCurrencyCode = $account->currency;
            $invoiceCurrencyCode = $invoice->currency;

            // Determine project currency from the linked project (if any)
            $projectCurrencyCode = $invoice->project ? $invoice->project->currency : null;

            // Enforce that the selected account uses the same currency as the invoice
            if ($accountCurrencyCode !== $invoiceCurrencyCode && $settlementAccRate === 1) {
                throw ValidationException::withMessages([
                    'account_id' => [
                        'Selected account currency (' . $accountCurrencyCode . ') must match the invoice currency (' . $invoiceCurrencyCode . ').',
                    ],
                ]);
            }

            $exchangeRate = 1;
            $convertedAmount = $amountPaid;
            
            // Amount to debit the account is the amount paid divided by the settlement account forex rate
            $amountToDebitAccount = round($amountPaid/$settlementAccRate, 2);

            // Compute forex_rate and project currency value for margin-per-project reporting
            // forex_rate represents KES to project currency when project currency is not KES.
            $forexRate = null; //the rate of changing KES to invoice currency
            $projectCurrencyValue = null;

            if ($projectCurrencyCode) {
                if ($projectCurrencyCode === 'KES') {
                    $forexRate = 1.0;
                    $projectCurrencyValue = round($amountPaid / $forexRate, 2);
                } else {
                    $forexRateInput = $validated['forex_rate'] ?? null;
                    if (! $forexRateInput || (float) $forexRateInput <= 0) {
                        throw ValidationException::withMessages([
                            'forex_rate' => ['A valid forex rate is required for non-KES project currency.'],
                        ]);
                    }
                    $forexRate = (float) $forexRateInput;
                    $projectCurrencyValue = round($amountPaid / $forexRate, 2);
                }
            }

            $currentBalance = (float) $account->balance;

            if (! (bool) $account->overdraft_allowed && $currentBalance < $amountToDebitAccount) {
                throw ValidationException::withMessages([
                    'account_id' => ['Selected account does not have sufficient balance and overdraft is not allowed.'],
                ]);
            }

            // If this is a cheque that matures in the future, persist a PDC
            if (strtolower($validated['payment_method']) === 'check') {
                $chequeDate = isset($validated['cheque_date']) && $validated['cheque_date']
                    ? \Carbon\Carbon::parse($validated['cheque_date'])->toDateString()
                    : $validated['payment_date'];

                if ($chequeDate > now()->toDateString()) {
                    // Create a PDC issued to company (post-dated cheque) and skip immediate posting
                    do {
                        $pdcTxn = $commonService->generateUniqueCode('PDC-');
                    } while (PdcIssuedCompany::where('transaction_number', $pdcTxn)->exists());

                    PdcIssuedCompany::create([
                        'transaction_number' => $pdcTxn,
                        'company_id' => $invoice->company_id,
                        'invoice_id' => $invoice->id,
                        'forex_rate' => $forexRate,
                        'cheque_number' => $validated['check_number'] ?? null,
                        'cheque_date' => $chequeDate,
                        'issued_date' => $validated['payment_date'],
                        'amount' => (float) $validated['amount_paid'],
                        'currency' => $invoice->currency,
                        'bank' => $validated['bank_name'] ?? null,
                        'bank_branch' => $validated['bank_branch'] ?? null,
                        // Use the benefiting account as the bank account to post to on clear
                        'bank_account_id' => $validated['account_id'] ?? null,
                        'status' => 'issued',
                        'narration' => 'PDC created from invoice payment (deferred).',
                        'created_at' => now(),
                        'created_by' => Auth::id(),
                    ]);

                    $invoice->refresh();
                    $invoice->loadMissing([
                        'project',
                        'invoiceItems.projectPhase',
                        'payments',
                        'creditnotes',
                        'documents',
                    ]);

                    return new CompanyInvoiceResource($invoice);
                }
            }

            // Generate a unique transaction number for this company payment
            do {
                $transactionNumber = $commonService->generateUniqueCode('CMPPAY-');
            } while (
                CompanyPayment::where('transaction_number', $transactionNumber)->exists()
            );

            $payment = CompanyPayment::create([
                'transaction_number' => $transactionNumber,
                'invoice_id' => $invoice->id,
                'amount_paid' => $amountPaid,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'complete',
                'currency' => $invoiceCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'forex_rate' => $forexRate,
                'project_currency_value' => $projectCurrencyValue,
                'project_currency' => $projectCurrencyCode,
                'bank_name' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_reference' => $validated['receipt_number'],
                'settlement_account_forex_rate' => $settlementAccRate,
                'receipt_number' => $validated['receipt_number'],
                'reconciled' => false,
                'reconciliation_date' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            $trxn = CompanyTransactionsLedger::create([
                'company_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number,
                'transaction_type' => 'payment',
                'transaction_date' => $validated['payment_date'],
                'posted_date' => now(),
                'amount' => $amountPaid,
                'transaction_currency' => $invoiceCurrencyCode,
                'base_currency' => $accountCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'company_id' => $invoice->company_id,
                'customer_id' => null,
                'source_type' => 'company_invoice',
                'source_id' => $invoice->id,
                'account_debit' => $account->id,
                'account_credit' => null,
                'category' => 'expense',
                'payment_method' => $validated['payment_method'],
                'bank_account' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => $validated['related_transaction_id'] ?? null,
                'narration' => 'Payment for company invoice ' . $invoice->invoice_number,
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Ym'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            $payment->transaction_id = $trxn->id;
            $payment->save();

            // Update accounts account balance: debit decreases balance
            $balanceAfterThis = $currentBalance - $amountToDebitAccount;
            $account->balance = round($balanceAfterThis, 4);
            $account->updated_at = now();
            $account->updated_by = Auth::id();
            $account->save();

            // Update invoice status based on remaining balance after this payment.
            // Reuse the existing non-deleted payments total and include this payment.
            $paidTotal = $existingPaymentsTotal + $amountPaid;
            $remaining = max((float) $invoice->total_amount - $paidTotal, 0.0);


            if ($remaining <= 0.0) {
                $invoice->status = 'paid';
                // Mark all project phases on this invoice as billed
                $phaseIds = $invoice->invoiceItems()
                    ->whereNotNull('project_phase_id')
                    ->pluck('project_phase_id')
                    ->unique()
                    ->toArray();
                if (!empty($phaseIds)) {
                    \App\Models\ProjectPhase::whereIn('id', $phaseIds)->update(['is_billed' => true]);
                }
            } else {
                $invoice->status = 'partially-paid';
            }

            $invoice->updated_by = Auth::id();
            $invoice->updated_at = now();
            $invoice->save();

            $invoice->refresh();

            return $invoice;
        });

        $invoice->loadMissing([
            'project',
            'invoiceItems.projectPhase',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($invoice);
    }

    /**
     * Logically delete a payment recorded against a company invoice and
     * reverse its impact on the associated account and company ledger.
     */
    public function deletePayment(Request $request, CompanyInvoice $companyInvoice, CompanyPayment $companyPayment)
    {
        $this->authorize('update', $companyInvoice);

        if ($companyPayment->is_deleted) {
            return response()->json([
                'message' => 'This payment has already been deleted.',
            ], 422);
        }

        // Ensure the payment actually belongs to this invoice
        if ($companyPayment->invoice_id !== $companyInvoice->id) {
            return response()->json([
                'message' => 'Payment is not associated with this invoice.',
            ], 404);
        }

        if ($companyPayment->reconciled) {
            return response()->json([
                'message' => 'Reconciled payments cannot be deleted.',
                'errors'  => [
                    'payment_id' => ['Reverse the reconciliation before deleting this payment.'],
                ],
            ], 422);
        }

        $invoice = $companyInvoice;

        $invoice = DB::transaction(function () use ($invoice, $companyPayment) {
            $userId = Auth::id();

            // Soft delete the payment record itself
            $companyPayment->softDelete($userId);

            // Fetch active ledger entries for this payment against this invoice
            $ledgers = CompanyTransactionsLedger::where('company_payment_id', $companyPayment->id)
                ->where('source_type', 'company_invoice')
                ->where('source_id', $invoice->id)
                ->where('is_deleted', false)
                ->get();

            // Reverse the impact on the paying account balance(s)
            $amountsByAccount = [];
            foreach ($ledgers as $ledger) {
                if (! empty($ledger->account_debit)) {
                    $accountId = $ledger->account_debit;
                    $amountsByAccount[$accountId] = ($amountsByAccount[$accountId] ?? 0.0)
                        + (float) $ledger->converted_amount;
                }
            }

            foreach ($amountsByAccount as $accountId => $amountToReverse) {
                // Include logically deleted accounts as well, just in case
                $account = Account::withDeleted()->find($accountId);
                if ($account) {
                    $currentBalance = (float) $account->balance;
                    // Payments debit (decrease) the account; deleting them should credit (increase)
                    $account->balance = (string) number_format($currentBalance + $amountToReverse, 2, '.', '');
                    $account->updated_at = now();
                    $account->updated_by = $userId;
                    $account->save();
                }
            }

            // Soft delete ledger rows so they no longer participate in normal queries
            foreach ($ledgers as $ledger) {
                $ledger->softDelete($userId);
            }

            // Recalculate invoice status based on remaining (non-deleted) payments
            $activePayments = CompanyPayment::where('invoice_id', $invoice->id)
                ->where('is_deleted', false)
                ->get();

            $paidTotal = (float) $activePayments->sum('amount_paid');
            $remaining = max((float) $invoice->total_amount - $paidTotal, 0.0);

            if ($paidTotal <= 0.0) {
                // No active payments remaining
                $invoice->status = 'sent';
            } elseif ($remaining <= 0.0) {
                $invoice->status = 'paid';
            } else {
                $invoice->status = 'partially-paid';
            }

            $invoice->updated_by = $userId;
            $invoice->updated_at = now();
            $invoice->save();

            $invoice->refresh();

            return $invoice;
        });

        $invoice->loadMissing([
            'project',
            'invoiceItems.projectPhase',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($invoice);
    }

    /**
     * Update non-financial metadata for a payment recorded against a
     * company invoice. Financial fields such as amount, date, account
     * or currency must not be edited in-place and require delete+re-add.
     */
    public function updatePayment(Request $request, CompanyInvoice $companyInvoice, CompanyPayment $companyPayment)
    {
        $this->authorize('update', $companyInvoice);

        if ($companyPayment->is_deleted) {
            return response()->json([
                'message' => 'This payment has already been deleted.',
            ], 422);
        }

        // Ensure the payment actually belongs to this invoice
        if ($companyPayment->invoice_id !== $companyInvoice->id) {
            return response()->json([
                'message' => 'Payment is not associated with this invoice.',
            ], 404);
        }

        if ($companyPayment->reconciled) {
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

        $invoice = $companyInvoice;

        $invoice = DB::transaction(function () use ($invoice, $companyPayment, $validated) {
            $userId = Auth::id();

            // Update payment metadata
            if (array_key_exists('payment_status', $validated)) {
                $companyPayment->payment_status = $validated['payment_status'];
            }
            if (array_key_exists('bank_name', $validated)) {
                $companyPayment->bank_name = $validated['bank_name'];
            }
            if (array_key_exists('check_number', $validated)) {
                $companyPayment->check_number = $validated['check_number'];
            }
            if (array_key_exists('receipt_number', $validated)) {
                $companyPayment->receipt_number = $validated['receipt_number'];
                $companyPayment->transaction_reference = $validated['receipt_number'];
            }

            $companyPayment->updated_by = $userId;
            $companyPayment->updated_at = now();
            $companyPayment->save();

            // Propagate relevant metadata to ledger entries for this payment/invoice
            $ledgers = CompanyTransactionsLedger::where('company_payment_id', $companyPayment->id)
                ->where('source_type', 'company_invoice')
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

            // No need to recompute balances as we didn't touch financial fields
            $invoice->refresh();

            return $invoice;
        });

        $invoice->loadMissing([
            'project',
            'invoiceItems.projectPhase',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($invoice);
    }

    public function update(CompanyInvoiceUpdateRequest $request, CompanyInvoice $companyInvoice)
    {
        $this->authorize('update', $companyInvoice);

        $validated = $request->validated();
        $validated['created_at'] = $validated['created_at'] ?? $companyInvoice->created_at;
        $validated['updated_at'] = $validated['updated_at'] ?? now();
        $validated['updated_by'] = Auth::id();
        $hasStatusInPayload = array_key_exists('status', $validated);

        $userId = Auth::id();

        // Prevent marking an invoice as draft if it already has any ledger entries
        if ($hasStatusInPayload && $validated['status'] === 'draft') {
            $hasLedgerEntries = CompanyTransactionsLedger::where('source_type', 'company_invoice')
                ->where('source_id', $companyInvoice->id)
                ->where('is_deleted', false)
                ->exists();

            if ($hasLedgerEntries) {
                return response()->json([
                    'message' => 'Cannot mark invoice as draft because it already has ledger entries.',
                    'errors' => [
                        'status' => ['We cannot mark draft invoices that have ledger entries.'],
                    ],
                ], 422);
            }
        }

                    // If cheque and receipt not provided, default receipt to chk-{check_number}
                    if (strtolower($validated['payment_method'] ?? '') === 'check' && empty($validated['receipt_number'])) {
                        $validated['receipt_number'] = isset($validated['check_number']) ? 'chk-' . $validated['check_number'] : null;
                    }
        // When marking the invoice as sent, ensure it has line items and
        // create a corresponding company ledger entry if one does not exist yet.
        if ($hasStatusInPayload && $validated['status'] === 'sent') {
            $hasLineItems = $companyInvoice->invoiceItems()->exists();
            if (!$hasLineItems) {
                return response()->json([
                    'message' => 'Cannot mark invoice as sent without any line items.',
                    'errors'  => [
                        'status' => ['Add at least one invoice line item before marking as sent.'],
                    ],
                ], 422);
            }

            $updated = DB::transaction(function () use ($companyInvoice, $validated, $userId) {
                // First update the invoice itself
                $updatedInvoice = $this->service->update($companyInvoice->id, $validated);

                // Check if an invoice-level ledger entry already exists for this invoice
                $hasInvoiceLedger = CompanyTransactionsLedger::where('source_type', 'company_invoice')
                    ->where('source_id', $updatedInvoice->id)
                    ->where('transaction_type', 'invoice')
                    ->where('is_deleted', false)
                    ->exists();

                if (!$hasInvoiceLedger) {
                    $invoiceTotal   = (float) $updatedInvoice->total_amount;
                    $invoiceTax     = (float) $updatedInvoice->tax_amount;
                    $invoiceSubtotal = (float) $updatedInvoice->subtotal_amount;
                    $invoiceDiscount = (float) $updatedInvoice->discount_amount;
                    $netAmount      = $invoiceSubtotal - $invoiceDiscount;

                    $currencyCode = $updatedInvoice->currency;

                    CompanyTransactionsLedger::create([
                        'company_payment_id'     => null,
                        'transaction_number'     => $updatedInvoice->invoice_number,
                        'transaction_type'       => 'invoice',
                        'transaction_date'       => $updatedInvoice->created_at ?? now(),
                        'posted_date'            => now(),
                        'amount'                 => $invoiceTotal,
                        'transaction_currency'   => $currencyCode,
                        'base_currency'          => 'KES',
                        'exchange_rate'          => 1.0,
                        'converted_amount'       => 0.0,
                        'converted_tax_amount'   => 0.0,
                        'converted_net_amount'   => 0.0,
                        'tax_amount'             => $invoiceTax,
                        'net_amount'             => $netAmount,
                        'company_id'             => $updatedInvoice->company_id,
                        'customer_id'            => null,
                        'source_type'            => 'company_invoice',
                        'source_id'              => $updatedInvoice->id,
                        'account_debit'          => null,
                        'account_credit'         => null,
                        'category'               => 'expense',
                        'payment_method'         => null,
                        'bank_account'           => null,
                        'check_number'           => null,
                        'transaction_status'     => 'cleared',
                        'related_transaction_id' => null,
                        'narration'              => 'Company invoice ' . $updatedInvoice->invoice_number . ' posted to ledger.',
                        'is_recurring'           => false,
                        'fiscal_year'            => now()->year,
                        'accounting_period'      => now()->format('Ym'),
                        'is_adjusting_entry'     => false,
                        'cost_center_id'         => null,
                        'created_by'             => $userId,
                        'updated_by'             => $userId,
                    ]);
                }

                return $updatedInvoice;
            });

            return new CompanyInvoiceResource($updated);
        }

        // For all other updates, fall back to the standard update flow
        $updated = $this->service->update($companyInvoice->id, $validated);
        return new CompanyInvoiceResource($updated);
    }

    public function destroy(CompanyInvoice $companyInvoice)
    {
        $this->authorize('delete', $companyInvoice);

        if ($companyInvoice->status !== 'draft') {
            return response()->json([
                'message' => 'Only draft company invoices can be deleted.',
            ], 422);
        }

        $this->service->delete($companyInvoice->id);
        return response()->noContent();
    }

    /**
     * Generate and download a PDF representation of the company invoice.
     */
    public function downloadPdf(CompanyInvoice $companyInvoice, Request $request)
    {
        $this->authorize('view', $companyInvoice);

        $pdf = $this->buildCompanyInvoicePdf($companyInvoice, $request->user()?->id);

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
     * Send the company invoice PDF via email.
     */
    public function sendEmail(CompanyInvoice $companyInvoice, Request $request)
    {
        $this->authorize('view', $companyInvoice);

        $companyInvoice->loadMissing(['company', 'project']);

        $recipientEmail = $companyInvoice->company->email ?? null;
        $recipientName = $companyInvoice->company->name ?? 'Company';

        if (! $recipientEmail) {
            return response()->json([
                'message' => 'Company email address is missing for this invoice.',
            ], 422);
        }

        // Try to reuse an existing PDF for this invoice, if available
        $download = Download::where('name', $companyInvoice->invoice_number)->first();

        if ($download && Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildCompanyInvoicePdf($companyInvoice, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = Storage::disk('public')->path($relativePath);

        $projectName = $companyInvoice->project->name ?? null;
        $fromName = config('mail.from.name', config('app.name', 'EPMS'));

        $subject = sprintf(
            'Company Invoice %s%s',
            $companyInvoice->invoice_number,
            $projectName ? ' - ' . $projectName : ''
        );

        $mailData = [
            'invoice'       => $companyInvoice,
            'recipientName' => $recipientName,
            'projectName'   => $projectName,
            'fromName'      => $fromName,
        ];

        try {
            Mail::send('emails.company-invoice', $mailData, function ($message) use ($recipientEmail, $recipientName, $subject, $fullPath, $fileName) {
                $message->to($recipientEmail, $recipientName)
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as'   => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $e) {
            \Log::error('Failed to send company invoice email', [
                'company_invoice_id' => $companyInvoice->id,
                'error'              => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to send company invoice email.',
            ], 500);
        }

        return response()->json([
            'message' => 'Company invoice emailed successfully.',
        ]);
    }

    /**
     * Build the company invoice PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCompanyInvoicePdf(CompanyInvoice $companyInvoice, ?int $userId = null): array
    {
        $companyInvoice->loadMissing([
            'project',
            'company',
            'company.bankAccounts',
            'invoiceItems',
            'documents',
            'payments' => function ($query) {
                // Filter out logically deleted company payments; table is company_payments.
                $query->where('company_payments.is_deleted', false)
                    ->orderBy('payment_date', 'asc')
                    ->orderBy('created_at', 'asc');
            },
        ]);

        $configValues = SysConfig::whereIn('name', [
            'NAME',
            'EMAIL',
            'INSTANCE_LOGO',
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

        // Pre-compute payment summary in invoice currency for the PDF.
        $payments = $companyInvoice->payments ?? collect();
        $paymentsTotal = (float) $payments->sum('amount_paid');
        $invoiceTotal = (float) $companyInvoice->total_amount;
        $outstandingBalance = max($invoiceTotal - $paymentsTotal, 0.0);

        $data = [
            'invoice'            => $companyInvoice,
            'payments'           => $payments,
            'paymentsTotal'      => $paymentsTotal,
            'outstandingBalance' => $outstandingBalance,
            'senderName'         => $senderName,
            'senderEmail'        => $senderEmail,
            'instanceLogo'      => $configValues['INSTANCE_LOGO'] ?? null,
            'senderPhone'        => $configValues['PHONE']   ?? null,
            'senderWebsite'      => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1' => $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity'         => $configValues['CITY']    ?? null,
            'senderState'        => $configValues['STATE']   ?? null,
            'senderCountry'      => $configValues['COUNTRY'] ?? null,
            'generatedAt'        => $generatedAt,
        ];

        $html = view('pdf.company-invoice', $data)->render();

        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $companyInvoice->invoice_number . '.pdf';
        $relativePath = 'company-invoices/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $companyInvoice->invoice_number]);
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