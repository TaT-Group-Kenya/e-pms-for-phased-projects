<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\ChartOfAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Wipes every financial table (documents, movements, ledgers, snapshots)
 * and seeds KES + USD bank accounts at zero balance, so the trial balance
 * and all finance features can be exercised from a clean slate.
 *
 * Structural seeders (chart of accounts, currencies, roles, users, taxes)
 * are untouched — only rows that carry money or reference money go.
 */
class FinanceCleanSlateSeeder extends Seeder
{
    /**
     * Financial tables in dependency-safe truncation order.
     */
    protected array $financialTables = [
        'trial_balance_run_lines',
        'trial_balance_runs',
        'tax_transactions',
        'accounting_period_logs',
        'accounting_periods',
        'loan_repayment_allocations',
        'loan_repayments',
        'loan_schedules',
        'loans',
        'office_expense_payments',
        'office_expense_documents',
        'office_expenses',
        // Operational chain: containers -> quotations (+ items, approvals,
        // documents) -> orders -> projects.
        'ship_container_numbers',
        'ship_containers',
        'quote_approvals',
        'quote_documents',
        'quote_line_items',
        'quotation_tax_items',
        'quotations',
        'order_documents',
        'order_items',
        'orders',
        'projects',
        'company_projects',
        'project_phases',
        'project_progress_updates',
        // Note chains.
        'pdc_issued_companies',
        'pdc_received_customers',
        'cust_debit_note_payments',
        'cust_debit_note_documents',
        'cust_debit_note_items',
        'cust_debit_notes',
        'company_credit_note_tax_items',
        'company_credit_note_items',
        'company_credit_notes',
        'company_invoice_tax_items',
        'company_invoice_documents',
        'company_invoice_items',
        'company_invoices',
        'company_payments',
        'cust_credit_note_tax_items',
        'cust_credit_note_items',
        'cust_credit_notes',
        'cust_payment_allocations',
        'cust_payments',
        'cust_invoice_tax_items',
        'cust_invoice_documents',
        'cust_invoice_items',
        'cust_invoices',
        // Ledger + account movements (documents and downloads cache).
        'customer_transactions_ledger',
        'company_transactions_ledger',
        'transactions',
        'downloads',
        'accounts',
    ];

    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        foreach ($this->financialTables as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->delete();
            }
        }

        Schema::enableForeignKeyConstraints();

        // Clear the quoted/linked flags on ship containers so the container
        // pool starts fresh for new quotations.
        if (Schema::hasTable('ship_containers')) {
            DB::table('ship_containers')->update(['quoted' => false]);
        }

        // Seed exactly two zero-balance bank accounts: one KES, one USD.
        $assetsId = (int) ChartOfAccount::where('code', '1000')->value('id');

        Account::firstOrCreate(
            ['code' => 'INT-ACC-KES'],
            [
                'name' => 'KES Bank Account',
                'description' => 'Main KES bank account',
                'type' => 'bank',
                'group' => 'Checking',
                'currency' => 'KES',
                'balance' => 0,
                'overdraft_allowed' => false,
                'chart_of_account_id' => $assetsId,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        Account::firstOrCreate(
            ['code' => 'INT-ACC-USD'],
            [
                'name' => 'USD Bank Account',
                'description' => 'Main USD bank account',
                'type' => 'bank',
                'group' => 'Checking',
                'currency' => 'USD',
                'balance' => 0,
                'overdraft_allowed' => false,
                'chart_of_account_id' => $assetsId,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
