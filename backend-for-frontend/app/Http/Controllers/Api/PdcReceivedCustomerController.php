<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Services\PdcReceivedCustomerService;
use App\Http\Resources\PdcReceivedCustomerResource;
use App\Http\Requests\PdcReceivedCustomerStoreRequest;
use App\Http\Requests\PdcReceivedCustomerUpdateRequest;
use App\Models\PdcReceivedCustomer;
use App\Models\CustPayment;
use App\Models\CustPaymentAllocation;
use App\Models\CustomerTransactionsLedger;
use App\Models\CustInvoice;
use App\Models\Account;
use App\Services\CommonService;
use App\Services\CurrencyConversionService;

class PdcReceivedCustomerController extends Controller
{
    protected $service;

    public function __construct(PdcReceivedCustomerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', PdcReceivedCustomer::class);

        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');

        $data = $this->service->index($filters, $perPage, $page, 0, ['customer', 'invoice', 'bankAccount']);
        return PdcReceivedCustomerResource::collection($data);
    }

    public function store(PdcReceivedCustomerStoreRequest $request)
    {
        $this->authorize('create', PdcReceivedCustomer::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();

        $model = $this->service->create($validated);
        return new PdcReceivedCustomerResource($model);
    }

    public function show($pdc)
    {
        // Accept either route model or raw id and resolve model via service
        $id = null;
        if ($pdc instanceof PdcReceivedCustomer) {
            $id = $pdc->id;
        } elseif (is_numeric($pdc)) {
            $id = (int) $pdc;
        } else {
            $routeId = request()->route('pdc_received_customer') ?? request()->route('pdc');
            $id = is_numeric($routeId) ? (int) $routeId : null;
        }

        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id, ['customer', 'invoice', 'bankAccount', 'createdByUser', 'updatedByUser']);
        $this->authorize('view', $model);
        return new PdcReceivedCustomerResource($model);
    }

    public function update(PdcReceivedCustomerUpdateRequest $request, $pdc)
    {
        $id = $pdc instanceof PdcReceivedCustomer ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) (request()->route('pdc_received_customer') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id, ['customer', 'invoice', 'bankAccount', 'createdByUser', 'updatedByUser']);
        $this->authorize('update', $model);

        if ($model->status === 'cleared') {
            return response()->json(['message' => 'PDC cannot be updated as it is already cleared.'], 400);
        }

        // Validate overpayment risk when changing amount and invoice is attached
        $validated = $request->validated();
        if (isset($validated['amount']) && $model->invoice_id) {
            $invoice = CustInvoice::find($model->invoice_id);
            if ($invoice) {
                // Sum of allocations/payments already applied to invoice
                $existingAllocationsTotal = (float) CustPaymentAllocation::where('invoice_id', $invoice->id)->where('is_deleted', false)->sum('allocated_amount');

                // Sum of other PDCs (excluding this one) that are reserved against the invoice
                $otherPdcReserved = (float) PdcReceivedCustomer::where('invoice_id', $invoice->id)
                    ->where('is_deleted', false)
                    ->whereIn('status', ['received','pending'])
                    ->where('id', '<>', $model->id)
                    ->sum('amount');

                $newAmount = (float) $validated['amount'];

                // After update, total reserved/payments should not exceed invoice total
                $totalAfter = $existingAllocationsTotal + $otherPdcReserved + $newAmount;
                if ($totalAfter > (float) $invoice->total_amount + 0.0001) {
                    return response()->json(['message' => 'Updating this PDC would over-allocate the related invoice. Reduce the amount.'], 422);
                }
            }
        }
        $validated['updated_by'] = Auth::id();
        $validated['updated_at'] = now();

        $updated = $this->service->update($id, $validated);
        return new PdcReceivedCustomerResource($updated);
    }

    public function destroy($pdc)
    {
        $id = $pdc instanceof PdcReceivedCustomer ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) (request()->route('pdc_received_customer') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id);
        $this->authorize('delete', $model);

        if ($model->status === 'cleared') {
            return response()->json(['message' => 'PDC cannot be deleted as it is already cleared.'], 400);
        }

        $this->service->delete($id);
        return response()->noContent();
    }

    public function updatePdcStatus(Request $request, $pdc)
    {
        $status = $request->input('status');
        $id = $pdc instanceof PdcReceivedCustomer ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) (request()->route('pdc_received_customer') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id);
        $this->authorize('update', $model);

        if ($model->status === 'cleared') {
            return response()->json(['message' => 'PDC cannot be updated as it is already cleared.'], 422);
        }

        $validatedStatus = $status === 'cancelled' || $status === 'bounced' || $status === 'received' ? $status : 'cancelled';
        $model->status = $validatedStatus;
        $model->updated_at = now();
        $model->updated_by = Auth::id();
        $model->save();

        return new PdcReceivedCustomerResource($model);
    }

    /**
     * Post a received PDC to accounts when the cheque clears.
     */
    public function postToAccounts(Request $request, $pdc)
    {
        // Resolve id/model similar to other methods
        $id = $pdc instanceof PdcReceivedCustomer ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) ($request->input('id') ?? request()->route('pdc_received_customer') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $pdcModel = $this->service->find($id);
        $this->authorize('update', $pdcModel);

        if ($pdcModel->is_deleted) {
            return response()->json(['message' => 'PDC not found'], 404);
        }

        if (! in_array($pdcModel->status, ['received','pending'])) {
            return response()->json(['message' => 'PDC is not in a receivable state.'], 422);
        }

        $clearDate = now()->toDateString();
        if ($pdcModel->cheque_date && $pdcModel->cheque_date > $clearDate) {
            return response()->json(['message' => 'Cheque has not matured yet.'], 422);
        }

        $invoice = $pdcModel->invoice_id ? CustInvoice::with('order', 'project')->find($pdcModel->invoice_id) : null;

        DB::transaction(function () use ($pdcModel, $invoice, $clearDate) {
            $commonService = new CommonService();
            $conversionService = new CurrencyConversionService();

            do {
                $transactionNumber = $commonService->generateUniqueCode('CUSTPM-');
            } while (CustPayment::where('transaction_number', $transactionNumber)->exists());

            $account = $pdcModel->bank_account_id ? Account::find($pdcModel->bank_account_id) : null;
            $invoiceCurrencyCode = $pdcModel->currency;
            $baseCurrencyForLocalTaxationCode = 'KES';

            if ($account && $account->currency !== $invoiceCurrencyCode) {
                throw ValidationException::withMessages([
                    'bank_account_id' => [
                        'Benefiting bank account currency (' . $account->currency . ') must match the invoice currency (' . $invoiceCurrencyCode . ').',
                    ],
                ]);
            }

            $conversion = $conversionService->convertToBaseFromInvoice(
                (float) $pdcModel->amount,
                $invoiceCurrencyCode,
                $baseCurrencyForLocalTaxationCode
            );

            $exchangeRate = $conversion['exchange_rate'];
            $convertedAmount = $conversion['converted_amount'];

            $previousBalance = null;
            if ($invoice) {
                $existingAllocations = CustPaymentAllocation::where('invoice_id', $invoice->id)
                    ->where('is_deleted', false)
                    ->get();
                $pdcReserved = PdcReceivedCustomer::where('invoice_id', $invoice->id)
                    ->where('is_deleted', false)
                    ->whereIn('status', ['received', 'pending'])
                    ->where('id', '<>', $pdcModel->id)
                    ->sum('amount');

                $previousBalance = (float) $invoice->total_amount
                    - (float) $existingAllocations->sum('allocated_amount')
                    - (float) $pdcReserved;
                $outstanding = max($previousBalance, 0.0);
                $amountToAllocate = min((float) $pdcModel->amount, $outstanding);
            } else {
                $amountToAllocate = (float) $pdcModel->amount;
            }

            $transactionRef = $pdcModel->cheque_number ? ('chk-' . $pdcModel->cheque_number) : ($pdcModel->transaction_number ?? null);
            $receiptRef = $transactionNumber ?: ($transactionRef ?? $pdcModel->transaction_number ?? $transactionNumber);

            $taxPortion = 0.0;
            $netPortion = (float) $pdcModel->amount;
            if ($invoice && (float) $invoice->total_amount > 0 && (float) $invoice->tax_amount > 0) {
                $taxPortion = min(
                    round(((float) $invoice->tax_amount / (float) $invoice->total_amount) * (float) $pdcModel->amount, 2),
                    (float) $pdcModel->amount
                );
                $netPortion = (float) $pdcModel->amount - $taxPortion;
            }

            $payment = CustPayment::create([
                'transaction_number' => $transactionNumber,
                'amount_paid' => (float) $pdcModel->amount,
                'direction' => 'incoming',
                'transaction_type' => 'receipt',
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $clearDate,
                'payment_method' => 'check',
                'payment_status' => 'complete',
                'currency' => $invoiceCurrencyCode,
                'bank_name' => $pdcModel->bank,
                'check_number' => $pdcModel->cheque_number,
                'transaction_reference' => $transactionRef,
                'receipt_number' => $receiptRef,
                'invoice_total_amount' => $invoice ? $invoice->total_amount : null,
                'exchange_rate' => $exchangeRate,
                'fee_or_charge' => 0,
                'reconciled' => false,
                'reconciliation_date' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            if ($invoice && $amountToAllocate > 0) {
                $installmentNumber = CustPaymentAllocation::where('invoice_id', $invoice->id)
                    ->where('is_deleted', false)
                    ->count() + 1;
                $afterBalance = max($previousBalance - $amountToAllocate, 0);

                CustPaymentAllocation::create([
                    'payment_id' => $payment->id,
                    'invoice_id' => $invoice->id,
                    'allocated_amount' => $amountToAllocate,
                    'allocation_date' => $clearDate,
                    'balance_before_payment' => $previousBalance,
                    'balance_after_payment' => $afterBalance,
                    'installment_number' => $installmentNumber,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                ]);

                if ($afterBalance <= 0) {
                    $invoice->status = 'paid';
                } else {
                    $invoice->status = 'partial-paid';
                }
                $invoice->updated_by = Auth::id();
                $invoice->save();
            }

            $trxn = CustomerTransactionsLedger::create([
                'cust_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number,
                'transaction_type' => 'receipt',
                'transaction_date' => $clearDate,
                'posted_date' => now(),
                'amount' => (float) $pdcModel->amount,
                'transaction_currency' => $invoiceCurrencyCode,
                'base_currency' => $baseCurrencyForLocalTaxationCode,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'customer_id' => $pdcModel->customer_id,
                'source_type' => 'cust_invoice',
                'source_id' => $invoice->id,
                'account_debit' => null,
                'account_credit' => $account ? $account->id : null,
                'category' => 'revenue',
                'payment_method' => 'check',
                'bank_account' => $pdcModel->bank,
                'check_number' => $pdcModel->cheque_number,
                'transaction_status' => 'cleared',
                'related_transaction_id' => null,
                'narration' => 'PDC cleared: ' . ($pdcModel->narration ?? ''),
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

            if ($account) {
                $currentBalance = (float) $account->balance;
                $account->balance = (string) number_format($currentBalance + (float) $pdcModel->amount, 2, '.', '');
                $account->updated_at = now();
                $account->updated_by = Auth::id();
                $account->save();
            }

            $pdcModel->status = 'cleared';
            $pdcModel->related_transaction_id = $trxn->id;
            $pdcModel->updated_at = now();
            $pdcModel->updated_by = Auth::id();
            $pdcModel->save();
        });

        return response()->json(['message' => 'PDC posted to accounts successfully.']);
    }
}
