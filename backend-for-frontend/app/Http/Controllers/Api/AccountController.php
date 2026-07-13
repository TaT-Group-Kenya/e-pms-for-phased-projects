<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Account;
use App\Models\CustomerTransactionsLedger;
use App\Models\CompanyTransactionsLedger;
use App\Models\Transaction;
use App\Models\PdcIssuedCompany;
use App\Models\PdcReceivedCustomer;
use App\Services\AccountService;
use App\Services\CommonService;
use App\Services\TransactionService;
use App\Http\Resources\AccountResource;
use App\Http\Requests\AccountStoreRequest;
use App\Http\Requests\AccountUpdateRequest;
use App\Models\Download;
use App\Models\SysConfig;
use Dompdf\Dompdf;
use Dompdf\Options;

class AccountController extends Controller
{
    protected $service;

    public function __construct(AccountService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Account::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page, 0);
        return AccountResource::collection($data);
    }

    public function store(AccountStoreRequest $request)
    {
        $this->authorize('create', \App\Models\Account::class);
        $validated = $request->validated();

        // Generate account code in backend using CommonService
        $commonService = new CommonService();
        $validated['code'] = $commonService->generateUniqueCode('INT-ACC-');
        // $validated['balance'] = 0; allow initial balance to be set on creation
        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();
        $model = $this->service->create($validated);
        return new AccountResource($model);
    }

    public function show(Account $account)
    {
        $this->authorize('view', $account);
        return new AccountResource($account);
    }

    public function update(AccountUpdateRequest $request, Account $account)
    {
        $this->authorize('update', $account);

        $validated = $request->validated();
        // Enforce base currency and prevent balance changes via update
        unset($validated['currency'], $validated['balance']);
        $validated['updated_by'] = Auth::id();
        $validated['updated_at'] = now();
        $updated = $this->service->update($account->id, $validated);
        return new AccountResource($updated);
    }

    public function topup(Request $request, Account $account, TransactionService $transactionService)
    {
        $this->authorize('update', $account);

        $data = $request->validate([
            'source_account_id' => ['required', 'integer'],
            'source_debit_amount' => ['required', 'numeric', 'min:0.01'],
            'exchange_rate' => ['nullable', 'numeric', 'min:0.0000001'],
            'amount' => ['nullable', 'numeric', 'min:0.01'],
            'transaction_date' => ['nullable', 'date'],
            'posted_date' => ['nullable', 'date'],
            'narration' => ['nullable', 'string', 'max:1000'],
        ]);
        $transactionDate = $data['transaction_date'] ?? now()->toDateString();
        $postedDate = $data['posted_date'] ?? now()->toDateString();

        $userId = $request->user()?->id;
        $sourceAccount = Account::findOrFail($data['source_account_id']);

        // Prevent using the same account as both source and target
        if ($sourceAccount->id === $account->id) {
            return response()->json([
                'message' => 'Source account must be different from the account being topped up.',
            ], 422);
        }

        // Basic balance and currency validation for the source account
        $sourceCurrency = (string) $sourceAccount->currency;
        $targetCurrency = (string) $account->currency;

        $exchangeRate = 1.0;
        if ($sourceCurrency && $targetCurrency && $sourceCurrency !== $targetCurrency) {
            if (!isset($data['exchange_rate'])) {
                return response()->json([
                    'message' => 'Exchange rate is required when source and target currencies differ.',
                ], 422);
            }
            $exchangeRate = (float) $data['exchange_rate'];
            if ($exchangeRate <= 0) {
                return response()->json([
                    'message' => 'Exchange rate must be greater than zero.',
                ], 422);
            }
        }

        // Canonical flow: user specifies source_debit_amount in the
        // source account's currency. When currencies differ, we derive
        // the target (top-up) amount as source_debit_amount * exchange_rate.
        $sourceDebitAmount = (float) $data['source_debit_amount'];

        if ($sourceDebitAmount <= 0) {
            return response()->json([
                'message' => 'Source debit amount must be greater than zero.',
            ], 422);
        }

        // If currencies are the same, treat exchange rate as 1:1 regardless
        // of what the client sends.
        if ($sourceCurrency === $targetCurrency) {
            $exchangeRate = 1.0;
        }

        // Interpret exchange rate as: 1 SOURCE = X TARGET
        // i.e. exchange_rate = how many units of target currency equal 1 unit of source currency.
        // When currencies differ, the top-up (target) amount is: source_debit_amount * exchange_rate.
        $amount = $sourceCurrency === $targetCurrency
            ? $sourceDebitAmount
            : ($sourceDebitAmount * $exchangeRate);

        if ($amount <= 0) {
            return response()->json([
                'message' => 'Calculated top-up amount must be greater than zero.',
            ], 422);
        }

        if ((float) $sourceAccount->balance <= 0 || (float) $sourceAccount->balance < $sourceDebitAmount) {
            return response()->json([
                'message' => 'Source account does not have enough balance for this top-up.',
            ], 422);
        }

        DB::transaction(function () use (
            $account,
            $sourceAccount,
            $amount,
            $sourceDebitAmount,
            $transactionDate,
            $postedDate,
            $data,
            $userId,
            $transactionService,
            $exchangeRate,
            $sourceCurrency,
            $targetCurrency
        ) {
            $commonService = new CommonService();
            $transactionNumber = $commonService->generateUniqueCode('TRX-');

            // Record debit on the source account in its own currency
            $transactionService->create([
                'transaction_number' => $transactionNumber,
                'transaction_type' => 'expense',
                'transaction_date' => $transactionDate,
                'posted_date' => $postedDate,
                'amount' => $sourceDebitAmount,
                'base_currency' => $targetCurrency,
                'tax_amount' => 0,
                'net_amount' => $sourceDebitAmount,
                'transaction_currency' => $sourceCurrency,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $amount,
                'converted_tax_amount' => 0,
                'converted_net_amount' => $amount,
                'customer_id' => null,
                'company_id' => null,
                'source_type' => 'account_topup',
                'source_id' => $account->id,
                'account_debit' => $sourceAccount->id,
                'account_credit' => null,
                'category' => 'revenue',
                'payment_method' => 'CASH',
                'bank_account' => null,
                'check_number' => null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => null,
                'narration' => $data['narration'] ?? 'Funding account top-up',
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Y-m'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            // Record credit on the target account in its own currency
            $transactionNumber = $commonService->generateUniqueCode('TRX-');
            $transactionService->create([
                'transaction_number' => $transactionNumber,
                'transaction_type' => 'topup',
                'transaction_date' => $transactionDate,
                'posted_date' => $postedDate,
                'amount' => $amount,
                'base_currency' => $sourceCurrency,
                'tax_amount' => 0,
                'net_amount' => $amount,
                'transaction_currency' => $targetCurrency,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $sourceDebitAmount,
                'converted_tax_amount' => 0,
                'converted_net_amount' => $sourceDebitAmount,
                'customer_id' => null,
                'company_id' => null,
                'source_type' => 'account_topup',
                'source_id' => $account->id,
                'account_debit' => null,
                'account_credit' => $account->id,
                'category' => 'revenue',
                'payment_method' => 'CASH',
                'bank_account' => null,
                'check_number' => null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => null,
                'narration' => $data['narration'] ?? 'Account top-up',
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Y-m'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            // Decrease the source account balance
            $sourceAccount->balance = (float) $sourceAccount->balance - $sourceDebitAmount;
            $sourceAccount->updated_at = now();
            $sourceAccount->updated_by = $userId;
            $sourceAccount->save();

            // Increase the target account balance
            $account->balance = (float) $account->balance + $amount;
            $account->updated_at = now();
            $account->updated_by = $userId;
            $account->save();
        });

        $account->refresh();

        return response()->json([
            'message' => 'Account topped up successfully.',
            'data' => [
                'account' => new AccountResource($account),
            ],
        ]);
    }

    public function statement(Request $request, Account $account)
    {
        $this->authorize('view', $account);

        [$rows, $meta] = $this->buildStatementData($request, $account);

        return response()->json([
            'data' => $rows,
            'meta' => $meta,
        ]);
    }

    public function downloadStatementPdf(Request $request, Account $account)
    {
        $this->authorize('view', $account);

        [$rows, $meta] = $this->buildStatementData($request, $account);

        $pdf = $this->buildAccountStatementPdf($account, $rows, $meta, $request->user()?->id);

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
     * Prepare statement rows and meta for an account.
     *
     * @return array{0: \Illuminate\Support\Collection, 1: array}
     */
    protected function buildStatementData(Request $request, Account $account): array
    {
        $accountId = $account->id;

        $from = $request->query('from');
        $to = $request->query('to');

        $applyDateFilters = function ($query) use ($from, $to) {
            if ($from) {
                $query->whereDate('posted_date', '>=', $from);
            }
            if ($to) {
                $query->whereDate('posted_date', '<=', $to);
            }
        };

        $customerLedgerQuery = CustomerTransactionsLedger::with(['customer'])
            ->where(function ($query) use ($accountId) {
                $query
                    ->where('account_debit', $accountId)
                    ->orWhere('account_credit', $accountId);
            });
        $applyDateFilters($customerLedgerQuery);

        $companyLedgerQuery = CompanyTransactionsLedger::with(['company', 'customer', 'payment'])
            ->where(function ($query) use ($accountId) {
                $query
                    ->where('account_debit', $accountId)
                    ->orWhere('account_credit', $accountId);
            });
        $applyDateFilters($companyLedgerQuery);

        $transactionsQuery = Transaction::with(['company', 'customer'])
            ->where(function ($query) use ($accountId) {
                $query
                    ->where('account_debit', $accountId)
                    ->orWhere('account_credit', $accountId);
            });
        $applyDateFilters($transactionsQuery);

        // Prepare PDC totals queries (filtered by bank_account_id and cheque_date)
        $applyChequeDateFilters = function ($query) use ($from, $to) {
            if ($from) {
                $query->whereDate('cheque_date', '>=', $from);
            }
            if ($to) {
                $query->whereDate('cheque_date', '<=', $to);
            }
        };

        $pdcIssuedQuery = PdcIssuedCompany::whereIn('status', ['pending', 'issued'])
            ->where('bank_account_id', $accountId);
        $applyChequeDateFilters($pdcIssuedQuery);

        $pdcReceivedQuery = PdcReceivedCustomer::whereIn('status', ['pending', 'received'])
            ->where('bank_account_id', $accountId);
        $applyChequeDateFilters($pdcReceivedQuery);

        $rows = collect();

        $customerLedgerQuery->get()->each(function ($row) use (&$rows, $accountId) {
            // For account statements, always use the original amount in the
            // account's currency; converted amounts are only for reporting.
            $debitBase = $row->account_debit == $accountId ? $row->amount : 0;
            $creditBase = $row->account_credit == $accountId ? $row->amount : 0;

            $rows->push([
                'source' => 'customer_ledger',
                'source_id' => $row->id,
                'transaction_number' => $row->transaction_number,
                'transaction_type' => $row->transaction_type,
                'transaction_date' => $row->transaction_date,
                'posted_date' => $row->posted_date,
                'created_at' => $row->created_at,
                'narration' => $row->narration,
                'transaction_currency' => $row->transaction_currency,
                'base_currency' => $row->base_currency,
                'amount' => $row->amount,
                'converted_amount' => $row->converted_amount,
                'tax_amount' => $row->tax_amount,
                'net_amount' => $row->net_amount,
                'converted_tax_amount' => $row->converted_tax_amount,
                'converted_net_amount' => $row->converted_net_amount,
                'customer_name' => optional($row->customer)->name,
                'company_name' => null,
                'debit_base' => $debitBase,
                'credit_base' => $creditBase,
            ]);
        });

        $companyLedgerQuery->get()->each(function ($row) use (&$rows, $accountId) {
            /* vendor invoices can be paid from different currencies, so for account statements, the value of amount is always in KES, we therefore need to apply CompanyPayment.settlement_account_forex_rate value.
            */
            $companyPayment = $row->payment;
            $settlementForexRate = $companyPayment?->settlement_account_forex_rate;
            $debitBase = $row->account_debit == $accountId ? $row->amount/$settlementForexRate : 0;
            $creditBase = $row->account_credit == $accountId ? $row->amount/$settlementForexRate : 0;

            $rows->push([
                'source' => 'company_ledger',
                'source_id' => $row->id,
                'transaction_number' => $row->transaction_number,
                'transaction_type' => $row->transaction_type,
                'transaction_date' => $row->transaction_date,
                'posted_date' => $row->posted_date,
                'created_at' => $row->created_at,
                'narration' => $row->narration,
                'transaction_currency' => $row->transaction_currency,
                'base_currency' => $row->base_currency,
                'amount' => $row->amount,
                'converted_amount' => $row->converted_amount,
                'tax_amount' => $row->tax_amount,
                'net_amount' => $row->net_amount,
                'converted_tax_amount' => $row->converted_tax_amount,
                'converted_net_amount' => $row->converted_net_amount,
                'customer_name' => optional($row->customer)->name,
                'company_name' => optional($row->company)->name,
                'debit_base' => $debitBase,
                'credit_base' => $creditBase,
            ]);
        });

        $transactionsQuery->get()->each(function ($row) use (&$rows, $accountId) {
            $debitBase = $row->account_debit == $accountId ? $row->amount : 0;
            $creditBase = $row->account_credit == $accountId ? $row->amount : 0;

            $rows->push([
                'source' => 'transaction',
                'source_id' => $row->id,
                'transaction_number' => $row->transaction_number,
                'transaction_type' => $row->transaction_type,
                'transaction_date' => $row->transaction_date,
                'posted_date' => $row->posted_date,
                'created_at' => $row->created_at,
                'narration' => $row->narration,
                'transaction_currency' => $row->transaction_currency,
                'base_currency' => $row->base_currency,
                'amount' => $row->amount,
                'converted_amount' => $row->converted_amount,
                'tax_amount' => $row->tax_amount,
                'net_amount' => $row->net_amount,
                'converted_tax_amount' => $row->converted_tax_amount,
                'converted_net_amount' => $row->converted_net_amount,
                'customer_name' => optional($row->customer)->name,
                'company_name' => optional($row->company)->name,
                'debit_base' => $debitBase,
                'credit_base' => $creditBase,
            ]);
        });

        // Ensure the statement is ordered from oldest to newest so the
        // running balance progresses chronologically in a visually
        // intuitive way, using created_at for time precision.
        $rows = $rows->sortBy([
            ['transaction_date', 'asc'],
            ['posted_date', 'asc'],
            ['created_at', 'asc'],
            ['transaction_number', 'asc'],
        ])->values();
        // start with the account's current balance as the initial running balance
        $runningBalance = $account->balance ?? 0;

        $totalDebit = 0;
        $totalCredit = 0;

        $rows = $rows->map(function ($row) use (&$runningBalance, &$totalDebit, &$totalCredit) {
            $debit = $row['debit_base'] ?? 0;
            $credit = $row['credit_base'] ?? 0;

            $totalDebit += $debit;
            $totalCredit += $credit;

            // For the account statement, treat credits as increasing the
            // account balance and debits as decreasing it.
            $runningBalance += $credit - $debit;

            $row['running_balance_base'] = $runningBalance;

            return $row;
        });

        $meta = [
            'account' => new AccountResource($account),
            'total_debit_base' => $totalDebit,
            'total_credit_base' => $totalCredit,
            'closing_balance_base' => $runningBalance,
            'from' => $from,
            'to' => $to,
        ];

        // Compute PDC totals (amounts) based on bank account and date range
        try {
            $pdcIssuedTotal = (float) $pdcIssuedQuery->sum('amount');
        } catch (\Throwable $e) {
            $pdcIssuedTotal = 0.0;
        }

        try {
            $pdcReceivedTotal = (float) $pdcReceivedQuery->sum('amount');
        } catch (\Throwable $e) {
            $pdcReceivedTotal = 0.0;
        }

        $meta['pdc_issued_total'] = $pdcIssuedTotal;
        $meta['pdc_received_total'] = $pdcReceivedTotal;

        return [$rows, $meta];
    }

    /**
     * Build the account statement PDF, persist it and track in downloads.
     *
     * @param \Illuminate\Support\Collection $rows
     * @param array $meta
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildAccountStatementPdf(Account $account, $rows, array $meta, ?int $userId = null): array
    {
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

        $data = [
            'account'            => $account,
            'rows'               => $rows,
            'meta'               => $meta,
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

        $html = view('pdf.account-statement', $data)->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $number = $account->code ?: ('ACCOUNT-' . $account->id);
        $fileName = $number . '-statement.pdf';
        $relativePath = 'account-statements/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $downloadKey = 'account-statement:' . $number;
        $download = Download::firstOrNew(['name' => $downloadKey]);
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

    public function destroy(Account $account)
    {
        $this->authorize('delete', $account);

        $accountId = $account->id;

        $hasLedgerReferences =
            CustomerTransactionsLedger::where(function ($query) use ($accountId) {
                $query
                    ->where('account_debit', $accountId)
                    ->orWhere('account_credit', $accountId)
                    ->orWhere('bank_account', $accountId);
            })->exists()
            || CompanyTransactionsLedger::where(function ($query) use ($accountId) {
                $query
                    ->where('account_debit', $accountId)
                    ->orWhere('account_credit', $accountId)
                    ->orWhere('bank_account', $accountId);
            })->exists()
            || Transaction::where(function ($query) use ($accountId) {
                $query
                    ->where('account_debit', $accountId)
                    ->orWhere('account_credit', $accountId)
                    ->orWhere('bank_account', $accountId);
            })->exists();

        if ($hasLedgerReferences) {
            return response()->json([
                'message' => 'Account cannot be deleted because it is referenced in existing payments or transactions ledger.',
            ], 422);
        }

        $account->softDelete(Auth::id());

        return response()->noContent();
    }
}