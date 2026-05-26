<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Services\PdcIssuedCompanyService;
use App\Http\Resources\PdcIssuedCompanyResource;
use App\Http\Requests\PdcIssuedCompanyStoreRequest;
use App\Http\Requests\PdcIssuedCompanyUpdateRequest;
use App\Models\PdcIssuedCompany;
use App\Models\CompanyPayment;
use App\Models\CompanyTransactionsLedger;
use App\Models\CompanyInvoice;
use App\Models\Account;
use App\Services\CommonService;
use App\Services\CurrencyConversionService;

class PdcIssuedCompanyController extends Controller
{
    protected $service;

    public function __construct(PdcIssuedCompanyService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', PdcIssuedCompany::class);

        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');

        $data = $this->service->index($filters, $perPage, $page, 0, ['company', 'invoice', 'bankAccount']);
        return PdcIssuedCompanyResource::collection($data);
    }

    public function store(PdcIssuedCompanyStoreRequest $request)
    {
        $this->authorize('create', PdcIssuedCompany::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();

        $model = $this->service->create($validated);
        return new PdcIssuedCompanyResource($model);
    }

    public function show($pdc)
    {
        $id = null;
        if ($pdc instanceof PdcIssuedCompany) {
            $id = $pdc->id;
        } elseif (is_numeric($pdc)) {
            $id = (int) $pdc;
        } else {
            $routeId = request()->route('pdc_issued_company') ?? request()->route('pdc');
            $id = is_numeric($routeId) ? (int) $routeId : null;
        }

        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id, ['company', 'invoice', 'bankAccount', 'createdByUser', 'updatedByUser']);
        $this->authorize('view', $model);
        return new PdcIssuedCompanyResource($model);
    }

    public function update(PdcIssuedCompanyUpdateRequest $request, $pdc)
    {
        $id = $pdc instanceof PdcIssuedCompany ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) (request()->route('pdc_issued_company') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id, ['company', 'invoice', 'bankAccount', 'createdByUser', 'updatedByUser']);
        $this->authorize('update', $model);

        // Prevent over-allocation when changing amount on PDC tied to an invoice
        $validated = $request->validated();
        if (isset($validated['amount']) && $model->invoice_id) {
            $invoice = CompanyInvoice::find($model->invoice_id);
            if ($invoice) {
                $previousPaymentsTotal = (float) CompanyPayment::where('invoice_id', $invoice->id)->where('is_deleted', false)->sum('amount_paid');

                $otherPdcReserved = (float) PdcIssuedCompany::where('invoice_id', $invoice->id)
                    ->where('is_deleted', false)
                    ->whereIn('status', ['issued','pending'])
                    ->where('id', '<>', $model->id)
                    ->sum('amount');

                $newAmount = (float) $validated['amount'];
                $totalAfter = $previousPaymentsTotal + $otherPdcReserved + $newAmount;
                if ($totalAfter > (float) $invoice->total_amount + 0.0001) {
                    return response()->json(['message' => 'Updating this PDC would over-allocate the related invoice. Reduce the amount.'], 422);
                }
            }
        }
        $validated['updated_by'] = Auth::id();
        $validated['updated_at'] = now();

        $updated = $this->service->update($id, $validated);
        return new PdcIssuedCompanyResource($updated);
    }

    public function destroy($pdc)
    {
        $id = $pdc instanceof PdcIssuedCompany ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) (request()->route('pdc_issued_company') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $model = $this->service->find($id);
        $this->authorize('delete', $model);

        $this->service->delete($id);
        return response()->noContent();
    }

    /**
     * Post an issued PDC to accounts when the cheque clears (company payable).
     */
    public function postToAccounts(Request $request, $pdc)
    {
        $id = $pdc instanceof PdcIssuedCompany ? $pdc->id : (is_numeric($pdc) ? (int) $pdc : (int) ($request->input('id') ?? request()->route('pdc_issued_company') ?? request()->route('pdc')));
        if (empty($id)) {
            return response()->json(['message' => 'PDC id is required'], 400);
        }

        $pdcModel = $this->service->find($id);
        $this->authorize('update', $pdcModel);

        if ($pdcModel->is_deleted) {
            return response()->json(['message' => 'PDC not found'], 404);
        }

        if (!in_array($pdcModel->status, ['issued','pending'])) {
            return response()->json(['message' => 'PDC is not in an issuable state.'], 422);
        }

        $clearDate = now()->toDateString();
        if ($pdcModel->cheque_date && $pdcModel->cheque_date > $clearDate) {
            return response()->json(['message' => 'Cheque has not matured yet.'], 422);
        }

        $invoice = $pdcModel->invoice_id ? CompanyInvoice::with('project')->find($pdcModel->invoice_id) : null;

        DB::transaction(function () use ($pdcModel, $invoice, $clearDate) {
            $commonService = new CommonService();
            $currencyConversionService = new CurrencyConversionService();

            do {
                $transactionNumber = $commonService->generateUniqueCode('CMPPAY-');
            } while (CompanyPayment::where('transaction_number', $transactionNumber)->exists());

            $account = $pdcModel->bank_account_id ? Account::find($pdcModel->bank_account_id) : null;
            $accountCurrencyCode = $account ? $account->currency : $pdcModel->currency;
            $invoiceCurrencyCode = $pdcModel->currency;

            $conversion = $currencyConversionService->convertToBaseFromInvoice((float) $pdcModel->amount, $invoiceCurrencyCode, $accountCurrencyCode);
            $exchangeRate = $conversion['exchange_rate'];
            $convertedAmount = $conversion['converted_amount'];
            $baseCurrencyCode = $conversion['base_currency'];

            if ($account && ! (bool) $account->overdraft_allowed && (float) $account->balance < $convertedAmount) {
                throw ValidationException::withMessages([
                    'bank_account_id' => ['Selected bank account does not have sufficient balance and overdraft is not allowed.'],
                ]);
            }

            $amountToAllocate = (float) $pdcModel->amount;
            $previousPaymentsTotal = 0;
            if ($invoice) {
                $previousPaymentsTotal = (float) CompanyPayment::where('invoice_id', $invoice->id)->where('is_deleted', false)->sum('amount_paid');
                $amountToAllocate = min($amountToAllocate, max((float) $invoice->total_amount - $previousPaymentsTotal, 0.0));
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

            $projectCurrencyCode = $invoice && $invoice->project ? $invoice->project->currency : null;
            $forexRate = null;
            $projectCurrencyValue = null;
            if ($projectCurrencyCode) {
                if ($projectCurrencyCode === 'KES') {
                    $forexRate = 1.0;
                    $projectCurrencyValue = round((float) $pdcModel->amount / $forexRate, 2);
                } elseif ($pdcModel->forex_rate && (float) $pdcModel->forex_rate > 0) {
                    $forexRate = (float) $pdcModel->forex_rate;
                    $projectCurrencyValue = round((float) $pdcModel->amount / $forexRate, 2);
                }
            }

            $payment = CompanyPayment::create([
                'transaction_number' => $transactionNumber,
                'invoice_id' => $invoice ? $invoice->id : null,
                'amount_paid' => (float) $pdcModel->amount,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $clearDate,
                'payment_method' => 'CHEQUE',
                'payment_status' => 'complete',
                'currency' => $invoiceCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'forex_rate' => $forexRate,
                'project_currency_value' => $projectCurrencyValue,
                'project_currency' => $projectCurrencyCode,
                'bank_name' => $pdcModel->bank,
                'check_number' => $pdcModel->cheque_number,
                'transaction_reference' => $transactionRef,
                'receipt_number' => $receiptRef,
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
                'transaction_date' => $clearDate,
                'posted_date' => now(),
                'amount' => (float) $pdcModel->amount,
                'transaction_currency' => $invoiceCurrencyCode,
                'base_currency' => $baseCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'company_id' => $pdcModel->company_id,
                'customer_id' => null,
                'source_type' => 'company_invoice',
                'source_id' => $invoice->id,
                'account_debit' => $pdcModel->bank_account_id,
                'account_credit' => null,
                'category' => 'expense',
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

            if ($account) {
                $account->balance = (string) number_format((float) $account->balance - $pdcModel->amount, 2, '.', '');
                $account->updated_at = now();
                $account->updated_by = Auth::id();
                $account->save();
            }

            $pdcModel->status = 'cleared';
            $pdcModel->related_transaction_id = $trxn->id;
            $pdcModel->updated_at = now();
            $pdcModel->updated_by = Auth::id();
            $pdcModel->save();

            if ($invoice) {
                $paidTotal = $previousPaymentsTotal + (float) $pdcModel->amount;
                $remaining = max((float) $invoice->total_amount - $paidTotal, 0.0);
                if ($remaining <= 0.0) {
                    $invoice->status = 'paid';
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
            }
        });

        return response()->json(['message' => 'PDC posted to accounts successfully.']);
    }
}
