<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $model = $this->service->find($id, ['customer', 'invoice', 'bankAccount']);
        $this->authorize('view', $model);
        return new PdcReceivedCustomerResource($model);
    }

    public function update(PdcReceivedCustomerUpdateRequest $request, $pdc)
    {
        $id = $pdc instanceof PdcReceivedCustomer ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) (request()->route('pdc_received_customer') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id);
        $this->authorize('update', $model);

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
                    ->whereIn('status', ['received','pending','issued'])
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

        $this->service->delete($id);
        return response()->noContent();
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

        $invoice = $pdcModel->invoice_id ? CustInvoice::find($pdcModel->invoice_id) : null;

        DB::transaction(function () use ($pdcModel, $invoice) {
            $commonService = new CommonService();

            do {
                $transactionNumber = $commonService->generateUniqueCode('CUSTPM-');
            } while (CustPayment::where('transaction_number', $transactionNumber)->exists());

            $previousBalance = null;
            if ($invoice) {
                $existingAllocations = CustPaymentAllocation::where('invoice_id', $invoice->id)->where('is_deleted', false)->get();
                $previousBalance = (float) $invoice->total_amount - (float) $existingAllocations->sum('allocated_amount');
                $outstanding = max($previousBalance, 0.0);
                $amountToAllocate = min((float) $pdcModel->amount, $outstanding);
            } else {
                $amountToAllocate = (float) $pdcModel->amount;
            }

            // default transaction reference/receipt for cheque-based payments
            $transactionRef = $pdcModel->cheque_number ? ('chk-' . $pdcModel->cheque_number) : ($pdcModel->transaction_number ?? null);
            $receiptRef = $transactionNumber ?: ($transactionRef ?? $pdcModel->transaction_number ?? $transactionNumber);

            $payment = CustPayment::create([
                'transaction_number' => $transactionNumber,
                'amount_paid' => $pdcModel->amount,
                'direction' => 'incoming',
                'transaction_type' => 'receipt',
                'tax_amount' => 0,
                'net_amount' => $pdcModel->amount,
                'payment_date' => $clearDate,
                'payment_method' => 'CHEQUE',
                'payment_status' => 'complete',
                'currency' => $pdcModel->currency,
                'bank_name' => $pdcModel->bank,
                'check_number' => $pdcModel->cheque_number,
                'transaction_reference' => $transactionRef,
                'receipt_number' => $receiptRef,
                'invoice_total_amount' => $invoice ? $invoice->total_amount : null,
                'exchange_rate' => 1,
                'fee_or_charge' => 0,
                'reconciled' => false,
                'reconciliation_date' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            if ($invoice && $amountToAllocate > 0) {
                $installmentNumber = CustPaymentAllocation::where('invoice_id', $invoice->id)->where('is_deleted', false)->count() + 1;
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

            $convertedAmount = $pdcModel->amount;
            $trxn = CustomerTransactionsLedger::create([
                'cust_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number,
                'transaction_type' => 'receipt',
                'transaction_date' => $clearDate,
                'posted_date' => now(),
                'amount' => $pdcModel->amount,
                'transaction_currency' => $pdcModel->currency,
                'base_currency' => $pdcModel->currency,
                'exchange_rate' => 1,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => 0,
                'converted_net_amount' => $convertedAmount,
                'tax_amount' => 0,
                'net_amount' => $pdcModel->amount,
                'customer_id' => $pdcModel->customer_id,
                'source_type' => 'pdc_received_customer',
                'source_id' => $pdcModel->id,
                'account_debit' => null,
                'account_credit' => $pdcModel->bank_account_id,
                'category' => 'revenue',
                'payment_method' => 'CHEQUE',
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

            if ($pdcModel->bank_account_id) {
                $account = Account::find($pdcModel->bank_account_id);
                if ($account) {
                    $account->balance = (string) number_format((float) $account->balance + $pdcModel->amount, 2, '.', '');
                    $account->updated_at = now();
                    $account->updated_by = Auth::id();
                    $account->save();
                }
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
