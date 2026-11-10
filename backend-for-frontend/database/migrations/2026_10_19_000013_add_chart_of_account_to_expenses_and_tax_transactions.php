<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $expenseId = (int) DB::table('chart_of_accounts')->where('code', '5000')->value('id');
        $assetsId = (int) DB::table('chart_of_accounts')->where('code', '1000')->value('id');
        $liabilitiesId = (int) DB::table('chart_of_accounts')->where('code', '2000')->value('id');

        // Office expenses settle as expense (chart 5000).
        Schema::table('office_expenses', function ($table) {
            $table->unsignedBigInteger('chart_of_account')->default(0)->after('currency');
        });

        DB::table('office_expenses')->update(['chart_of_account' => $expenseId]);

        DB::statement(
            'ALTER TABLE office_expenses ALTER COLUMN chart_of_account SET DEFAULT '.$expenseId
        );

        // The general transactions table carries expense settlements (office
        // expenses, loan repayments) — default to expense 5000.
        Schema::table('transactions', function ($table) {
            $table->unsignedBigInteger('chart_of_account')->default(0)->after('account_credit');
            $table->index('chart_of_account');
        });

        DB::table('transactions')->update(['chart_of_account' => $expenseId]);

        DB::statement(
            'ALTER TABLE transactions ALTER COLUMN chart_of_account SET DEFAULT '.$expenseId
        );

        // Topups credit asset accounts — they are asset movements, not
        // expenses, so retag them accordingly.
        DB::table('transactions')
            ->where('transaction_type', 'topup')
            ->update(['chart_of_account' => $assetsId]);

        DB::statement(
            'ALTER TABLE transactions ALTER COLUMN chart_of_account SET DEFAULT '.$expenseId
        );

        // Loan repayment allocations: the interest component is an expense —
        // tagged 5000 — while the principal component reduces the liability.
        // The tag lives on the allocation so the trial balance can split
        // interest expense from principal repayment exactly.
        Schema::table('loan_repayment_allocations', function ($table) {
            $table->unsignedBigInteger('chart_of_account')->default(0)->after('principal_applied');
            $table->index(['chart_of_account', 'loan_id'], 'lra_chart_loan_index');
        });

        DB::table('loan_repayment_allocations')->update(['chart_of_account' => $expenseId]);

        DB::statement(
            'ALTER TABLE loan_repayment_allocations ALTER COLUMN chart_of_account SET DEFAULT '.$expenseId
        );

        // Dedicated tax transactions ledger. Each tax posting row carries:
        //  - chart_of_account: net-effect chart of the tax position
        //    (1000 receivable for VAT paid on costs, 2000 payable for VAT
        //    collected on sales, 5000 for non-recoverable taxes)
        //  - direction: 'collected' (on sales) / 'paid' (on costs)
        //  - tax_id: the taxes.rate lookup row (VAT, WHT, ...)
        //  - source_type/source_id: the invoice, note, expense or payment
        //    that generated the tax amount (same convention as other ledgers)
        Schema::create('tax_transactions', function ($table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->enum('direction', ['collected', 'paid', 'adjusted']);
            $table->unsignedBigInteger('chart_of_account');
            $table->decimal('amount', 15, 2);
            $table->string('transaction_currency', 10)->nullable();
            $table->decimal('exchange_rate', 15, 6)->default(1);
            $table->decimal('converted_amount', 15, 2)->default(0);
            $table->date('transaction_date');
            $table->date('posted_date')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->text('narration')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('tax_id')->references('id')->on('taxes');
            $table->foreign('chart_of_account')->references('id')->on('chart_of_accounts');
            $table->index(['source_type', 'source_id'], 'tax_txn_source_index');
            $table->index(['direction', 'chart_of_account'], 'tax_txn_direction_chart_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_transactions');

        if (Schema::hasColumn('loan_repayment_allocations', 'chart_of_account')) {
            Schema::table('loan_repayment_allocations', function ($table) {
                if (Schema::hasIndex('loan_repayment_allocations', 'lra_chart_loan_index')) {
                    $table->dropIndex('lra_chart_loan_index');
                }

                $table->dropColumn('chart_of_account');
            });
        }

        if (Schema::hasColumn('transactions', 'chart_of_account')) {
            Schema::table('transactions', function ($table) {
                if (Schema::hasIndex('transactions', 'transactions_chart_of_account_index')) {
                    $table->dropIndex(['chart_of_account']);
                }

                $table->dropColumn('chart_of_account');
            });
        }

        if (Schema::hasColumn('office_expenses', 'chart_of_account')) {
            Schema::table('office_expenses', function ($table) {
                $table->dropColumn('chart_of_account');
            });
        }
    }
};
