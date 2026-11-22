<?php

namespace Tests\Feature;

use App\Services\TaxTransactionService;
use App\Services\TrialBalanceService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Trial Balance v3: the run must balance by construction — every figure
 * has its pair. Scenario mirrors the user's worked example: KES + USD
 * accounts with opening balances, a USD customer invoice (recorded rate),
 * a vendor invoice, an office expense (unpaid slice → Expenses Payable),
 * a loan with interest, and tax-ledger movements.
 */
class TrialBalanceBalanceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        foreach ([
            'trial_balance_run_lines',
            'trial_balance_runs',
            'tax_transactions',
            'loan_repayment_allocations',
            'loan_schedules',
            'loan_repayments',
            'loans',
            'company_payments',
            'company_invoices',
            'office_expenses',
            'cust_credit_notes',
            'cust_debit_notes',
            'cust_invoices',
            'customer_transactions_ledger',
            'company_transactions_ledger',
            'transactions',
            'chart_of_accounts',
            'accounts',
        ] as $table) {
            Schema::dropIfExists($table);
        }

        Schema::create('chart_of_accounts', function (Blueprint $t) {
            $t->id();
            $t->string('code')->unique();
            $t->string('name')->nullable();
            $t->boolean('is_bank_account_grp')->default(false);
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('accounts', function (Blueprint $t) {
            $t->id();
            $t->string('name')->nullable();
            $t->unsignedBigInteger('chart_of_account_id')->nullable();
            $t->decimal('balance', 15, 2)->default(0);
            $t->string('currency')->default('KES');
            $t->string('code')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('transactions', function (Blueprint $t) {
            $t->id();
            $t->string('transaction_number')->nullable();
            $t->string('transaction_type')->nullable();
            $t->date('transaction_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->string('transaction_currency', 10)->default('KES');
            $t->string('base_currency', 10)->nullable();
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->unsignedBigInteger('account_debit')->nullable();
            $t->unsignedBigInteger('account_credit')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('cust_invoices', function (Blueprint $t) {
            $t->id();
            $t->string('invoice_number');
            $t->string('title')->nullable();
            $t->unsignedBigInteger('order_id')->nullable();
            $t->unsignedBigInteger('project_id')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->decimal('total_amount', 15, 2);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->decimal('forex_rate', 15, 6)->default(1);
            $t->string('status')->default('draft');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('cust_debit_notes', function (Blueprint $t) {
            $t->id();
            $t->string('debit_note_number')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->decimal('total_amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->string('status')->default('draft');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('cust_credit_notes', function (Blueprint $t) {
            $t->id();
            $t->string('credit_note_number')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->decimal('total_amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->string('status')->default('draft');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('customer_transactions_ledger', function (Blueprint $t) {
            $t->id();
            $t->string('transaction_type')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->unsignedBigInteger('cust_payment_id')->nullable();
            $t->date('transaction_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->decimal('net_amount', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->string('transaction_currency', 10)->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('company_invoices', function (Blueprint $t) {
            $t->id();
            $t->string('invoice_number')->nullable();
            $t->unsignedBigInteger('company_id')->nullable();
            $t->decimal('total_amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->string('status')->default('draft');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('company_credit_notes', function (Blueprint $t) {
            $t->id();
            $t->string('credit_note_number')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->decimal('total_amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->string('status')->default('draft');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('company_payments', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->decimal('amount_paid', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->date('payment_date')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('office_expenses', function (Blueprint $t) {
            $t->id();
            $t->string('description', 2000)->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->string('status')->default('pending');
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('loans', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('destination_account_id')->nullable();
            $t->string('lender_name')->nullable();
            $t->unsignedBigInteger('lender_id')->nullable();
            $t->decimal('principal', 15, 2)->default(0);
            $t->decimal('principal_kes', 15, 2)->default(0);
            $t->string('currency', 10)->default('KES');
            $t->string('interest_type')->default('none');
            $t->decimal('interest_rate', 8, 2)->default(0);
            $t->integer('tenure_months')->default(0);
            $t->string('repayment_frequency')->default('monthly');
            $t->date('disbursement_date')->nullable();
            $t->date('first_payment_date')->nullable();
            $t->decimal('installment_amount', 15, 2)->nullable();
            $t->decimal('installment_amount_kes', 15, 2)->nullable();
            $t->string('status')->default('active');
            $t->unsignedBigInteger('disbursement_transaction_id')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('loan_schedules', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('loan_id');
            $t->integer('installment_number');
            $t->date('due_date');
            $t->decimal('expected_principal', 15, 2)->default(0);
            $t->decimal('expected_interest', 15, 2)->default(0);
            $t->string('status')->default('pending');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('loan_repayments', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('loan_id');
            $t->unsignedBigInteger('transaction_id')->nullable();
            $t->unsignedBigInteger('schedule_installment_id')->nullable();
            $t->date('payment_date')->nullable();
            $t->decimal('amount_paid', 15, 2)->default(0);
            $t->decimal('amount_paid_kes', 15, 2)->default(0);
            $t->decimal('principal_component', 15, 2)->default(0);
            $t->decimal('principal_component_kes', 15, 2)->default(0);
            $t->decimal('interest_component', 15, 2)->default(0);
            $t->decimal('interest_component_kes', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->decimal('balance_after', 15, 2)->nullable();
            $t->unsignedBigInteger('paid_from_account_id')->nullable();
            $t->string('payment_reference')->nullable();
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('loan_repayment_allocations', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('loan_id');
            $t->unsignedBigInteger('repayment_id');
            $t->unsignedBigInteger('schedule_installment_id')->nullable();
            $t->decimal('interest_applied', 15, 2)->default(0);
            $t->decimal('interest_applied_kes', 15, 2)->default(0);
            $t->decimal('principal_applied', 15, 2)->default(0);
            $t->decimal('principal_applied_kes', 15, 2)->default(0);
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->timestamps();
        });

        Schema::create('tax_transactions', function (Blueprint $t) {
            $t->id();
            $t->string('transaction_number')->unique();
            $t->unsignedBigInteger('tax_id')->nullable();
            $t->string('side')->default('cr');
            $t->string('direction')->default('collected');
            $t->string('entry_type')->nullable();
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->decimal('amount', 15, 2);
            $t->string('transaction_currency', 10)->nullable();
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->decimal('converted_amount', 15, 2)->default(0);
            $t->decimal('running_balance', 15, 2)->nullable();
            $t->date('transaction_date');
            $t->date('posted_date')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->unsignedBigInteger('company_id')->nullable();
            $t->unsignedBigInteger('supplier_or_customer')->nullable();
            $t->string('kra_pin', 64)->nullable();
            $t->string('source_type');
            $t->unsignedBigInteger('source_id')->nullable();
            $t->unsignedBigInteger('payment_id')->nullable();
            $t->text('narration')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('trial_balance_runs', function (Blueprint $t) {
            $t->id();
            $t->string('run_number')->unique();
            $t->date('as_at_date');
            $t->decimal('forex_rate', 15, 6);
            $t->string('base_currency', 10)->default('KES');
            $t->string('trigger', 20)->default('manual');
            $t->unsignedBigInteger('accounting_period_id')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });

        Schema::create('trial_balance_run_lines', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('trial_balance_run_id');
            $t->unsignedBigInteger('chart_of_account');
            $t->string('category');
            $t->string('source_table');
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->unsignedBigInteger('account_id')->nullable();
            $t->decimal('debit_kes', 15, 2)->default(0);
            $t->decimal('credit_kes', 15, 2)->default(0);
            $t->decimal('debit_usd', 15, 2)->default(0);
            $t->decimal('credit_usd', 15, 2)->default(0);
            $t->text('description')->nullable();
            $t->timestamps();
        });

        \DB::table('chart_of_accounts')->insert([
            ['code' => '1000', 'name' => 'Assets', 'is_bank_account_grp' => true],
            ['code' => '2000', 'name' => 'Liabilities', 'is_bank_account_grp' => false],
            ['code' => '3000', 'name' => 'Equity', 'is_bank_account_grp' => false],
            ['code' => '4000', 'name' => 'Revenue/Income', 'is_bank_account_grp' => false],
            ['code' => '5000', 'name' => 'Expenses', 'is_bank_account_grp' => false],
        ]);
    }

    protected function tearDown(): void
    {
        Schema::disableForeignKeyConstraints();
        parent::tearDown();
    }

    protected function runTb(): array
    {
        $service = app(TrialBalanceService::class);
        $run = $service->generate(['as_at_date' => '2026-12-31', 'forex_rate' => 129.2, 'created_by' => 1]);

        return $service->present($run);
    }

    protected function line(array $presented, string $name): ?array
    {
        return collect($presented['lines'])->firstWhere('account_name', $name);
    }

    protected function seedAccounts(): array
    {
        // Closing balances default to just the opening (capital) amounts;
        // tests adjust them with ->balance updates as their flows demand:
        // every cash-moving flow must land in the account's closing balance
        // for the trial balance to wash.
        $kes = \DB::table('accounts')->insertGetId([
            'name' => 'KES Bank Account', 'code' => 'INT-ACC-KES', 'currency' => 'KES',
            'chart_of_account_id' => 1, 'balance' => 1710.23,
        ]);
        $usd = \DB::table('accounts')->insertGetId([
            'name' => 'USD Bank Account', 'code' => 'INT-ACC-USD', 'currency' => 'USD',
            'chart_of_account_id' => 1, 'balance' => 79.45,
        ]);

        \DB::table('transactions')->insert([
            ['transaction_type' => 'topup', 'source_type' => 'account_initial_balance', 'source_id' => $kes,
                'amount' => 1710.23, 'transaction_currency' => 'KES', 'exchange_rate' => 1, 'transaction_date' => '2026-01-02', 'account_credit' => $kes],
            ['transaction_type' => 'topup', 'source_type' => 'account_initial_balance', 'source_id' => $usd,
                'amount' => 79.45, 'transaction_currency' => 'USD', 'exchange_rate' => 1, 'transaction_date' => '2026-01-02', 'account_credit' => $usd],
        ]);

        return ['kes' => $kes, 'usd' => $usd];
    }

    public function test_trial_balance_balances_across_the_full_example(): void
    {
        $accounts = $this->seedAccounts();

        /* Loans: USD 1,200 disbursed on the USD account, interest 12% over
         * 12 monthly installments — due interest has fallen due. */
        $loanId = \DB::table('loans')->insertGetId([
            'destination_account_id' => $accounts['usd'], 'lender_name' => 'Lender A',
            'principal' => 1200, 'principal_kes' => 155040, 'currency' => 'USD',
            'interest_type' => 'flat', 'interest_rate' => 12, 'tenure_months' => 12,
            'repayment_frequency' => 'monthly', 'disbursement_date' => '2026-06-01',
            'first_payment_date' => '2026-07-01', 'status' => 'active',
        ]);
        // Twelve monthly installments due Jul 2026 … Jun 2027: principal
        // 100.00 + interest 12.00 each. Six fall due by 2026-12-31.
        $rows = [];
        foreach (range(1, 12) as $i) {
            $year = $i + 6 <= 12 ? 2026 : 2027;
            $month = $i + 6 <= 12 ? $i + 6 : $i - 6;
            $rows[] = [
                'loan_id' => $loanId, 'installment_number' => $i,
                'due_date' => sprintf('%04d-%02d-01', $year, $month),
                'expected_principal' => 100, 'expected_interest' => 12, 'status' => 'pending',
            ];
        }
        \DB::table('loan_schedules')->insert($rows);

        // A USD customer invoice: 10,000 gross + 1,600 VAT at recorded 129.2,
        // partly paid 2,000 USD (receipt at the recorded rate too).
        \DB::table('cust_invoices')->insert([
            'invoice_number' => 'CINV-1', 'total_amount' => 10000, 'tax_amount' => 1600,
            'currency' => 'USD', 'forex_rate' => 129.2, 'status' => 'partial-paid', 'created_at' => '2026-08-01 00:00:00',
        ]);
        \DB::table('customer_transactions_ledger')->insert([
            'transaction_type' => 'receipt', 'source_type' => 'cust_invoice', 'source_id' => 1,
            'amount' => 2000, 'exchange_rate' => 129.2, 'transaction_currency' => 'USD',
            'transaction_date' => '2026-08-15',
        ]);

        // A KES vendor invoice: 500,000 gross + 80,000 VAT, unpaid.
        \DB::table('company_invoices')->insert([
            'invoice_number' => 'CMPINV-1', 'total_amount' => 500000, 'tax_amount' => 80000,
            'currency' => 'KES', 'status' => 'sent', 'created_at' => '2026-09-01 00:00:00',
        ]);

        // Office expenses: paid 65,431 + pending 650,000.
        \DB::table('office_expenses')->insert([
            ['description' => 'paid exp', 'amount' => 65431, 'currency' => 'KES', 'status' => 'paid', 'created_at' => '2026-09-10 00:00:00'],
            ['description' => 'pending exp', 'amount' => 650000, 'currency' => 'KES', 'status' => 'pending', 'created_at' => '2026-09-11 00:00:00'],
        ]);

        // Cash-moving flows land in the closing balances: the 2,000 USD
        // receipt into the KES account and the paid office expense.
        \DB::table('accounts')->where('id', $accounts['kes'])->update([
            'balance' => round(1710.23 + 2000 * 129.2 - 65431, 2),
        ]);
        \DB::table('accounts')->where('id', $accounts['usd'])->update([
            'balance' => 79.45 + 1200, // opening + loan disbursement
        ]);

        // Tax ledger: the invoice + vendor VAT movements (the credit note
        // effect and remittances ride on this table).
        TaxTransactionService::record([
            'side' => 'cr', 'entry_type' => TaxTransactionService::ENTRY_VAT_OUT,
            'source_type' => 'cust_invoice', 'source_id' => 1,
            'amount' => 1600, 'transaction_currency' => 'USD', 'exchange_rate' => 129.2,
            'transaction_date' => '2026-08-01',
        ]);
        TaxTransactionService::record([
            'side' => 'dr', 'entry_type' => TaxTransactionService::ENTRY_VAT_IN,
            'source_type' => 'company_invoice', 'source_id' => 1,
            'amount' => 80000, 'transaction_currency' => 'KES', 'exchange_rate' => 1,
            'transaction_date' => '2026-09-01',
        ]);

        $presented = $this->runTb();

        /* Balance first: credits equal debits. */
        $this->assertEquals(
            $presented['totals']['credit_kes'],
            $presented['totals']['debit_kes'],
            'The trial balance must balance.'
        );

        /* Cash: KES 194,679.23 + USD 1,279.45 × 129.2 (run rate). */
        $cash = $this->line($presented, 'Cash/Bank Accounts');
        $this->assertEquals(round(194679.23 + 1279.45 * 129.2, 2), $cash['debit_kes']);

        /* AR: (10,000 − 2,000) USD × recorded 129.2 = 1,033,600. */
        $ar = $this->line($presented, 'Accounts Receivable');
        $this->assertEquals(1033600.00, $ar['debit_kes']);

        /* Sales Revenue: (10,000 − 1,600) USD × 129.2 = 1,085,280. */
        $sales = $this->line($presented, 'Sales Revenue');
        $this->assertEquals(1085280.00, $sales['credit_kes']);

        /* Sales Tax Payable: output 1,600 USD × 129.2 = 206,720 − input 80,000 = 126,720 CR. */
        $tax = $this->line($presented, 'Sales Tax Payable');
        $this->assertEquals(126720.00, $tax['credit_kes']);
        // The debit-side twin row exists zero-filled (stable layout).
        $this->assertEquals(0.00, $this->line($presented, 'Sales Tax Receivable')['debit_kes']);

        /* AP: 500,000. COGS: 500,000 − 80,000 = 420,000. */
        $this->assertEquals(500000.00, $this->line($presented, 'Accounts Payable')['credit_kes']);
        $this->assertEquals(420000.00, $this->line($presented, 'Cost of Goods Sold')['debit_kes']);

        /* Expenses: 65,431 + 650,000; Payable: 650,000. */
        $this->assertEquals(715431.00, $this->line($presented, 'Expenses')['debit_kes']);
        $this->assertEquals(650000.00, $this->line($presented, 'Expenses Payable')['credit_kes']);

        /* Loans Payable: USD 1,200 × loan rate (155,040 / 1200 = 129.2) = 155,040. */
        $this->assertEquals(155040.00, $this->line($presented, 'Loans Payable')['credit_kes']);

        /* Interest: due by 2026-12-31 = installments with due_date July..Dec (6) × 12 USD = 72 → ×129.2 = 9,302.40.
         * None paid. */
        $this->assertEquals(9302.40, $this->line($presented, 'Interest Expenses')['debit_kes']);
        $this->assertEquals(9302.40, $this->line($presented, 'Interest Payable')['credit_kes']);

        /* Owners Capital: 1,710.23 KES + 79.45 USD at the run rate
         * (initial-balance topups are booked at their account currency;
         * USD amounts convert at the rate provided in the run). */
        $capital = $this->line($presented, 'Owners Capital');
        $this->assertEquals(round(1710.23 + 79.45 * 129.2, 2), $capital['credit_kes']);

        /* With every flow's cash leg inside the closing balances, the
         * reconciliation plug is zero — the run balances on its own. */
        $recon = $this->line($presented, 'Sales Tax Reconciliation');
        $this->assertNotNull($recon);
        $this->assertEquals(0.0, $recon['credit_kes'] + $recon['debit_kes']);
    }

    public function test_negative_net_vat_flips_to_the_debit_side(): void
    {
        $this->seedAccounts();

        // Only a vendor invoice: input VAT 80,000 with no output → net −80,000.
        \DB::table('company_invoices')->insert([
            'invoice_number' => 'CMPINV-N', 'total_amount' => 500000, 'tax_amount' => 80000,
            'currency' => 'KES', 'status' => 'sent', 'created_at' => '2026-09-01 00:00:00',
        ]);
        TaxTransactionService::record([
            'side' => 'dr', 'entry_type' => TaxTransactionService::ENTRY_VAT_IN,
            'source_type' => 'company_invoice', 'source_id' => 1,
            'amount' => 80000, 'transaction_currency' => 'KES', 'exchange_rate' => 1,
            'transaction_date' => '2026-09-01',
        ]);

        $presented = $this->runTb();

        $this->assertEquals($presented['totals']['credit_kes'], $presented['totals']['debit_kes']);

        $receivable = $this->line($presented, 'Sales Tax Receivable');
        $this->assertNotNull($receivable);
        $this->assertEquals(80000.00, $receivable['debit_kes']);

        // The Payable row exists zero-filled on the liabilities side.
        $payable = $this->line($presented, 'Sales Tax Payable');
        $this->assertNotNull($payable);
        $this->assertEquals(0.00, $payable['credit_kes']);
    }

    public function test_remittance_via_tax_ledger_reduces_the_payable(): void
    {
        $accounts = $this->seedAccounts();

        \DB::table('cust_invoices')->insert([
            'invoice_number' => 'CINV-1', 'total_amount' => 10000, 'tax_amount' => 1600,
            'currency' => 'USD', 'forex_rate' => 129.2, 'status' => 'sent', 'created_at' => '2026-08-01 00:00:00',
        ]);
        TaxTransactionService::record([
            'side' => 'cr', 'entry_type' => TaxTransactionService::ENTRY_VAT_OUT,
            'source_type' => 'cust_invoice', 'source_id' => 1,
            'amount' => 1600, 'transaction_currency' => 'USD', 'exchange_rate' => 129.2,
            'transaction_date' => '2026-08-01',
        ]);

        // Bill run + remittance through the ledger (VAT_IN −206,720). The
        // remittance cash leg leaves the KES account: capital is seeded
        // high enough that both legs wash inside the closing balance.
        \DB::table('accounts')->where('id', $accounts['kes'])->update([
            'balance' => round(1710.23 + 500000 - 206720, 2),
        ]);
        // The extra 500,000 is also capital injected (a topup row).
        \DB::table('transactions')->insert([
            ['transaction_type' => 'topup', 'source_type' => 'account_initial_balance', 'source_id' => $accounts['kes'],
                'amount' => 500000, 'transaction_currency' => 'KES', 'exchange_rate' => 1, 'transaction_date' => '2026-01-02', 'account_credit' => $accounts['kes']],
        ]);

        TaxTransactionService::record([
            'side' => 'dr', 'entry_type' => TaxTransactionService::ENTRY_VAT_IN,
            'source_type' => 'tax_bill', 'source_id' => 1,
            'amount' => 206720, 'transaction_currency' => 'KES', 'exchange_rate' => 1,
            'transaction_date' => '2026-12-20',
        ]);

        $presented = $this->runTb();

        // Net VAT after remittance = 0 → the payable row reads zero and
        // the run balances: the remittance's cash leg is inside the
        // closing balances, its tax leg inside the tax ledger net.
        $payable = $this->line($presented, 'Sales Tax Payable');
        $this->assertNotNull($payable);
        $this->assertEquals(0.00, $payable['credit_kes']);
        $this->assertEquals(
            $presented['totals']['credit_kes'],
            $presented['totals']['debit_kes']
        );
    }

    public function test_customer_credit_notes_reduce_revenue_and_ar(): void
    {
        $this->seedAccounts();

        \DB::table('cust_invoices')->insert([
            'invoice_number' => 'CINV-1', 'total_amount' => 10000, 'tax_amount' => 1600,
            'currency' => 'USD', 'forex_rate' => 129.2, 'status' => 'sent', 'created_at' => '2026-08-01 00:00:00',
        ]);
        \DB::table('cust_credit_notes')->insert([
            'credit_note_number' => 'CCN-1', 'invoice_id' => 1, 'total_amount' => 2900,
            'tax_amount' => 400, 'currency' => 'USD', 'status' => 'raised', 'created_at' => '2026-08-10 00:00:00',
        ]);

        // The tax ledger mirrors the same VAT lifecycle the document flows
        // post: invoice declares VAT_OUT +1,600 USD; the raised credit note
        // restates it through a −400 USD correction (Balancing).
        TaxTransactionService::record([
            'side' => 'cr', 'entry_type' => TaxTransactionService::ENTRY_VAT_OUT,
            'source_type' => 'cust_invoice', 'source_id' => 1,
            'amount' => 1600, 'transaction_currency' => 'USD', 'exchange_rate' => 129.2,
            'transaction_date' => '2026-08-01',
        ]);
        TaxTransactionService::record([
            'side' => 'dr', 'entry_type' => TaxTransactionService::ENTRY_BALANCING,
            'source_type' => 'cust_credit_note', 'source_id' => 1,
            'amount' => 400, 'transaction_currency' => 'USD', 'exchange_rate' => 129.2,
            'transaction_date' => '2026-08-10',
        ]);

        $presented = $this->runTb();

        $this->assertEquals(
            $presented['totals']['credit_kes'],
            $presented['totals']['debit_kes']
        );

        // AR: 10,000 − 2,900 = 7,100 USD × 129.2 = 917,320.
        $this->assertEquals(917320.00, $this->line($presented, 'Accounts Receivable')['debit_kes']);
        // Revenue: (7,100) net = 10,000 − 1,600 − (2,900 − 400) = 5,900 USD × 129.2 = 762,280.
        $this->assertEquals(762280.00, $this->line($presented, 'Sales Revenue')['credit_kes']);
        // Net VAT: 1,600 − 400 = 1,200 USD × 129.2 = 155,040 CR.
        $this->assertEquals(155040.00, $this->line($presented, 'Sales Tax Payable')['credit_kes']);
    }
}
