<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A trial-balance run is an immutable snapshot: the books as they
        // stood at as_at_date, translated at the FX rate the user entered.
        // Line rows keep the full legal detail (source ledger references)
        // for export years later.
        Schema::create('trial_balance_runs', function ($table) {
            $table->id();
            $table->string('run_number')->unique();
            $table->date('as_at_date');
            $table->decimal('forex_rate', 15, 6); // USD -> KES entered by the user
            $table->string('base_currency', 10)->default('KES');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->index('as_at_date');
        });

        Schema::create('trial_balance_run_lines', function ($table) {
            $table->id();
            $table->unsignedBigInteger('trial_balance_run_id');
            $table->unsignedBigInteger('chart_of_account');
            $table->string('category'); // Assets/Liabilities/Equity/Revenue/Expenses label
            $table->string('source_table'); // transactions, customer_transactions_ledger, ...
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->decimal('debit_kes', 15, 2)->default(0);
            $table->decimal('credit_kes', 15, 2)->default(0);
            $table->decimal('debit_usd', 15, 2)->default(0);
            $table->decimal('credit_usd', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('trial_balance_run_id')->references('id')->on('trial_balance_runs');
            $table->foreign('chart_of_account')->references('id')->on('chart_of_accounts');
            $table->index(['trial_balance_run_id', 'chart_of_account'], 'tbrl_run_chart_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trial_balance_run_lines');
        Schema::dropIfExists('trial_balance_runs');
    }
};
