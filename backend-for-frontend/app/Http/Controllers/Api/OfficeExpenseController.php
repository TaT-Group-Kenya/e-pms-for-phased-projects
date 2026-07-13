<?php
    namespace App\Http\Controllers\Api;
    use App\Http\Controllers\Controller;
    use Illuminate\Http\Request;
    use App\Models\OfficeExpense;
    use App\Services\OfficeExpenseService;
    use App\Services\OfficeExpensePaymentService;
    use App\Services\TransactionService;
    use App\Services\TransactionCostManagerService;
    use App\Http\Resources\OfficeExpenseResource;
    use App\Http\Requests\OfficeExpenseStoreRequest;
    use App\Http\Requests\OfficeExpenseUpdateRequest;
    use Illuminate\Support\Facades\DB;

    class OfficeExpenseController extends Controller
    {
        protected $service;
        protected $paymentService;
        protected $transactionService;

        public function __construct(
            OfficeExpenseService $service,
            OfficeExpensePaymentService $paymentService,
            TransactionService $transactionService
        ) {
            $this->service = $service;
            $this->paymentService = $paymentService;
            $this->transactionService = $transactionService;
        }

    public function index(Request $request)
    {
        $this->authorize('viewAny', OfficeExpense::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page', 'search');
        $query = \App\Models\OfficeExpense::with(['category', 'costCenter', 'payments', 'payments.transaction','payments.transaction.debitAccount','payments.transaction.creditAccount', 'createdByUser']);
        if ($request->get('with_trashed')) {
            $query->withTrashed();
        }
        if ($request->get('only_trashed')) {
            $query->onlyTrashed();
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        // Dedicated search block
        if ($search = $request->get('search')) {
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%$search%")
                  ->orWhereHas('category', function($q) use ($search) {
                      $q->where('name', 'like', "%$search%");
                  });
            });
        }
        $data = $query->paginate($perPage, ['*'], 'page', $page);
        return OfficeExpenseResource::collection($data);
    }

    public function store(OfficeExpenseStoreRequest $request)
    {
        $this->authorize('create', OfficeExpense::class);
        $data = $request->validated();
        $data['created_by'] = auth()->id();
        $expense = $this->service->create($data);
        return new OfficeExpenseResource($expense);
    }

    public function show($id)
    {
        $expense = \App\Models\OfficeExpense::with(['payments', 'payments.transaction','payments.transaction.debitAccount','payments.transaction.creditAccount', 'createdByUser', 'updatedByUser'])->findOrFail($id);
        $this->authorize('view', $expense);
        return new OfficeExpenseResource($expense);
    }

    public function update(OfficeExpenseUpdateRequest $request, $id)
    {
        $expense = \App\Models\OfficeExpense::findOrFail($id);
        $this->authorize('update', $expense);
        $data = $request->validated();
        $data['updated_by'] = auth()->id();
        \Log::info('Updating office expense', ['id' => $id, 'data' => $data]);
        $expense = $this->service->update($id, $data);
        return new OfficeExpenseResource($expense);
    }

    public function destroy($id)
    {
        $expense = \App\Models\OfficeExpense::findOrFail($id);
        $this->authorize('delete', $expense);
        if (method_exists($expense, 'trashed') && $expense->trashed()) {
            return response()->json(['message' => 'Already deleted'], 400);
        }
        $expense->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

        /**
     * Settle an office expense (pay it in full, single installment only).
     * Payload: amount, date, funding_account, narration, transaction_cost (optional)
     */
    public function settleExpense(Request $request, $id)
    {
        $expense = OfficeExpense::findOrFail($id);
        $this->authorize('update', $expense);

        if ($expense->status === 'paid') {
            return response()->json(['message' => 'Expense is already paid.'], 422);
        }


        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'funding_account' => ['required', 'integer', 'exists:accounts,id'],
            'narration' => ['nullable', 'string'],
            'transaction_cost' => ['nullable', 'numeric', 'min:0'],
        ]);

        // Ensure settlement date is not older than expense creation date
        $settleDate = \Carbon\Carbon::parse($validated['date'])->toDateString();
        $expenseCreatedAt = $expense->created_at instanceof \Carbon\Carbon
            ? $expense->created_at->toDateString()
            : \Carbon\Carbon::parse($expense->created_at)->toDateString();
        if ($settleDate < $expenseCreatedAt) {
            return response()->json([
                'message' => 'Settlement date cannot be earlier than the expense creation date (' . $expenseCreatedAt . ').',
            ], 422);
        }

        // Ensure full payment only
        if ((float)$validated['amount'] !== (float)$expense->amount) {
            return response()->json(['message' => 'Expense must be settled in full.'], 422);
        }

        // Check funding account currency matches expense currency
        $account = \App\Models\Account::findOrFail($validated['funding_account']);
        if ($account->currency !== $expense->currency) {
            return response()->json(['message' => 'Funding account currency must match expense currency.'], 422);
        }

        $userId = $request->user()?->id;
        $transactionCost = $validated['transaction_cost'] ?? 0;

        $result = DB::transaction(function () use ($expense, $validated, $userId, $transactionCost, $request) {

            // Generate unique transaction number
            $commonService = new \App\Services\CommonService();
            do {
                $transactionNumber = $commonService->generateUniqueCode('EXPPAY-');
            } while (\App\Models\OfficeExpensePayment::where('transaction_number', $transactionNumber)->exists());

             // Create OfficeExpensePayment
            $payment = $this->paymentService->create([
                'expense_id' => $expense->id,
                'transaction_number' => $transactionNumber,
                'direction' => 'out',
                'transaction_type' => 'expense',
                'amount_paid' => $validated['amount'],
                'tax_amount' => 0,
                'net_amount' => $validated['amount'],
                'payment_date' => $validated['date'],
                'payment_method' => 'internal_transfer',
                'payment_status' => 'completed',
                'currency' => $expense->currency,
                'exchange_rate' => 1,
                'created_by' => $userId,
                'created_at' => now(),
            ]);

            // Create Transaction
            $ledger = $this->transactionService->create([
                'transaction_number' => $transactionNumber,
                'transaction_type' => 'expense',
                'transaction_date' => $validated['date'],
                'posted_date' => now(),
                'amount' => $validated['amount'],
                'transaction_currency' => $expense->currency,
                'base_currency' => $expense->currency,
                'exchange_rate' => 1,
                'converted_amount' => $validated['amount'],
                'tax_amount' => 0,
                'converted_tax_amount' => 0,
                'net_amount' => $validated['amount'],
                'source_type' => 'office_expense',
                'source_id' => $expense->id,
                'account_debit' => $validated['funding_account'],
                'account_credit' => null,
                'category' => 'expense',
                'payment_method' => 'internal_transfer',
                'transaction_status' => 'cleared',
                'narration' => $validated['narration'] ?? 'Payment for office expense ID ' . $expense->id,
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Y-m'),
                'is_adjusting_entry' => false,
                'cost_center_id' => $expense->cost_center_id,
                'created_by' => $userId,
                'created_at' => now(),
            ]);

            // Link payment to transaction
            $payment->transaction_id = $ledger->id;
            $payment->save();

            // Update expense status to paid
            $expense->status = 'paid';
            $expense->updated_by = $userId;
            $expense->save();

            // Process transaction cost if provided and greater than zero
            if ($transactionCost > 0) {
                $transactionCostManager = new TransactionCostManagerService();
                $transactionCostManager->processTransactionCost([
                    'transaction_cost' => $transactionCost,
                    'currency' => $expense->currency,
                    'funding_account_id' => $validated['funding_account'],
                    'narration' => 'Transaction cost for office expense ID ' . $expense->id,
                    'exchangeRate' => 1,
                    'user_id' => $userId,
                ]);
            }

            // Deduct from funding account (amount + transaction cost)
            $account = \App\Models\Account::find($validated['funding_account']);
            if ($account) {
                $currentBalance = (float) $account->balance;
                $totalDeduction = $validated['amount'] + $transactionCost;
                $account->balance = (string) number_format($currentBalance - $totalDeduction, 2, '.', '');
                $account->updated_at = now();
                $account->updated_by = $userId;
                $account->save();
            }

            return $expense->fresh(['payments']);
        });

        return (new OfficeExpenseResource($result))->additional([
            'message' => 'Expense settled successfully.'
        ]);
    }

    public function restore($id)
    {
        $expense = \App\Models\OfficeExpense::findOrFail($id);
        if (method_exists($expense, 'restore')) {
            $this->authorize('update', $expense);
            $expense->restore();
            return new OfficeExpenseResource($expense);
        }
        return response()->json(['message' => 'Restore not supported'], 400);
    }
}
