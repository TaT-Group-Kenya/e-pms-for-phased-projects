<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Account;
use App\Models\CustomerTransactionsLedger;
use App\Models\CompanyTransactionsLedger;
use App\Models\Transaction;
use App\Services\AccountService;
use App\Services\CommonService;
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
        $validated = $request->validated();

        // Generate account code in backend using CommonService
        $commonService = new CommonService();
        $validated['code'] = $commonService->generateUniqueCode('INT-ACC-');
        $validated['currency'] = 'KES'; // Accounts run on Base currency

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
        $validated['currency'] = 'KES'; // Accounts run on Base currency

        $updated = $this->service->update($account->id, $validated);
        return new AccountResource($updated);
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

        $companyLedgerQuery = CompanyTransactionsLedger::with(['company', 'customer'])
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

        $rows = collect();

        $customerLedgerQuery->get()->each(function ($row) use (&$rows, $accountId) {
            $debitBase = $row->account_debit == $accountId ? ($row->converted_amount ?? $row->amount) : 0;
            $creditBase = $row->account_credit == $accountId ? ($row->converted_amount ?? $row->amount) : 0;

            $rows->push([
                'source' => 'customer_ledger',
                'source_id' => $row->id,
                'transaction_number' => $row->transaction_number,
                'transaction_type' => $row->transaction_type,
                'transaction_date' => $row->transaction_date,
                'posted_date' => $row->posted_date,
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
            $debitBase = $row->account_debit == $accountId ? ($row->converted_amount ?? $row->amount) : 0;
            $creditBase = $row->account_credit == $accountId ? ($row->converted_amount ?? $row->amount) : 0;

            $rows->push([
                'source' => 'company_ledger',
                'source_id' => $row->id,
                'transaction_number' => $row->transaction_number,
                'transaction_type' => $row->transaction_type,
                'transaction_date' => $row->transaction_date,
                'posted_date' => $row->posted_date,
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
            $debitBase = $row->account_debit == $accountId ? ($row->converted_amount ?? $row->amount) : 0;
            $creditBase = $row->account_credit == $accountId ? ($row->converted_amount ?? $row->amount) : 0;

            $rows->push([
                'source' => 'transaction',
                'source_id' => $row->id,
                'transaction_number' => $row->transaction_number,
                'transaction_type' => $row->transaction_type,
                'transaction_date' => $row->transaction_date,
                'posted_date' => $row->posted_date,
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

        $rows = $rows->sortBy([
            ['posted_date', 'asc'],
            ['transaction_date', 'asc'],
            ['transaction_number', 'asc'],
        ])->values();

        $runningBalance = 0;
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