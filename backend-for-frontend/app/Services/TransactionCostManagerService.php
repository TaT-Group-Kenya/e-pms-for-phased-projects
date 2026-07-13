<?php

namespace App\Services;

use App\Models\OfficeExpenseCategory;
use App\Models\Department;
use App\Models\OfficeExpense;
use App\Models\OfficeExpensePayment;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionCostManagerService
{
    /**
     * Process transaction cost by creating office expense and payment entries.
     *
     * @param array $data {
     *     @var float $transactionCost The transaction cost amount
     *     @var string $currency The invoice/currency code
     *     @var int $fundingAccountId The account ID to fund the expense
     *     @var string $invoiceNumber The invoice number for narration
     *     @var float $exchangeRate The exchange rate for currency conversion
     *     @var int $userId The user ID creating the entries
     * }
     * @return OfficeExpense|null
     */
    public function processTransactionCost(array $data): ?OfficeExpense
    {
        $transactionCost = $data['transaction_cost'] ?? 0;
        
        // Skip if transaction cost is zero or not provided
        if (empty($transactionCost) || (float)$transactionCost <= 0) {
            return null;
        }

        return DB::transaction(function () use ($data, $transactionCost) {
            // Step 1: Get or create "Transaction charges" category
            $category = $this->getOrCreateTransactionChargesCategory();
            
            // Step 2: Get or create "Accounts" cost center
            $costCenter = $this->getOrCreateAccountsCostCenter();
            
            // Step 3: Create OfficeExpense
            $expense = $this->createOfficeExpense(
                $category->id,
                $costCenter->id,
                $transactionCost,
                $data['currency'] ?? 'KES',
                $data['user_id'] ?? null
            );
            
            // Step 4: Create OfficeExpensePayment (settle the expense)
            $this->settleOfficeExpense(
                $expense->id,
                $transactionCost,
                $data['funding_account_id'],
                $data['invoice_number'] ?? '',
                $data['exchangeRate'] ??  1,
                $data['user_id'] ?? null
            );
            
            return $expense;
        });
    }

    /**
     * Get or create "Transaction charges" office expense category.
     */
    protected function getOrCreateTransactionChargesCategory(): OfficeExpenseCategory
    {
        $category = OfficeExpenseCategory::whereRaw('LOWER(name) = ?', ['transaction charges'])->first();
        
        if (!$category) {
            $category = OfficeExpenseCategory::create([
                'name' => 'Transaction charges',
                'created_by' => auth()->id(),
            ]);
        }
        
        return $category;
    }

    /**
     * Get or create "Accounts" cost center (Department).
     */
    protected function getOrCreateAccountsCostCenter(): Department
    {
        $costCenter = Department::whereRaw('LOWER(name) = ?', ['accounts'])->first();
        
        if (!$costCenter) {
            $costCenter = Department::create([
                'name' => 'Accounts',
                'created_by' => auth()->id(),
            ]);
        }
        
        return $costCenter;
    }

    /**
     * Create a new OfficeExpense.
     */
    protected function createOfficeExpense(int $categoryId, int $costCenterId, float $amount, string $currency, ?int $userId): OfficeExpense
    {
        return OfficeExpense::create([
            'category_id' => $categoryId,
            'cost_center_id' => $costCenterId,
            'description' => 'Transaction charges for invoice payment',
            'amount' => $amount,
            'currency' => $currency,
            'date' => now(),
            'status' => 'pending',
            'created_by' => $userId ?? auth()->id(),
        ]);
    }

    /**
     * Settle an office expense (create payment and transaction).
     */
    protected function settleOfficeExpense(int $expenseId, float $amount, int $fundingAccountId, string $invoiceNumber, float $exchangeRate, ?int $userId): void
    {
        $expense = OfficeExpense::findOrFail($expenseId);
        
        // Generate unique transaction number
        $commonService = new CommonService();
        do {
            $transactionNumber = $commonService->generateUniqueCode('EXPPAY-');
        } while (OfficeExpensePayment::where('transaction_number', $transactionNumber)->exists());

        // Create OfficeExpensePayment
        $payment = OfficeExpensePayment::create([
            'expense_id' => $expense->id,
            'transaction_number' => $transactionNumber,
            'direction' => 'out',
            'transaction_type' => 'expense',
            'amount_paid' => $amount,
            'tax_amount' => 0,
            'net_amount' => $amount,
            'payment_date' => now(),
            'payment_method' => 'internal_transfer',
            'payment_status' => 'completed',
            'currency' => $expense->currency,
            'exchange_rate' => $exchangeRate,
            'transaction_cost' => 0,
            'created_by' => $userId ?? auth()->id(),
            'created_at' => now(),
        ]);

        // Create Transaction
        $ledger = Transaction::create([
            'transaction_number' => $transactionNumber,
            'transaction_type' => 'expense',
            'transaction_date' => now(),
            'posted_date' => now(),
            'amount' => $amount,
            'transaction_currency' => $expense->currency,
            'base_currency' => $expense->currency,
            'exchange_rate' => $exchangeRate,
            'converted_amount' => round($amount/$exchangeRate, 3),
            'tax_amount' => 0,
            'converted_tax_amount' => 0,
            'net_amount' => $amount,
            'source_type' => 'office_expense',
            'source_id' => $expense->id,
            'account_debit' => $fundingAccountId,
            'account_credit' => null,
            'category' => 'expense',
            'payment_method' => 'internal_transfer',
            'transaction_status' => 'cleared',
            'narration' => "transaction charges for {$invoiceNumber}",
            'is_recurring' => false,
            'fiscal_year' => now()->year,
            'accounting_period' => now()->format('Y-m'),
            'is_adjusting_entry' => false,
            'cost_center_id' => $expense->cost_center_id,
            'created_by' => $userId ?? auth()->id(),
            'created_at' => now(),
        ]);

        // Link payment to transaction
        $payment->transaction_id = $ledger->id;
        $payment->save();

        // Update expense status to paid
        $expense->status = 'paid';
        $expense->save();
    }
}
