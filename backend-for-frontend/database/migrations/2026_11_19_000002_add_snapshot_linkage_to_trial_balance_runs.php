<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tags each trial balance run with how it was produced: a normal manual
 * run or the automatic snapshot taken when an accounting period was closed.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('trial_balance_runs')) {
            return;
        }

        if (! Schema::hasColumn('trial_balance_runs', 'trigger')) {
            Schema::table('trial_balance_runs', function (Blueprint $table) {
                $table->string('trigger', 20)->default('manual')->after('base_currency');
            });
        }

        if (! Schema::hasColumn('trial_balance_runs', 'accounting_period_id')) {
            Schema::table('trial_balance_runs', function (Blueprint $table) {
                $table->unsignedBigInteger('accounting_period_id')->nullable()->after('trigger');
                $table->foreign('accounting_period_id', 'fk_tbrun_period')
                    ->references('id')->on('accounting_periods')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('trial_balance_runs')) {
            return;
        }

        if (Schema::hasColumn('trial_balance_runs', 'accounting_period_id')) {
            Schema::table('trial_balance_runs', function (Blueprint $table) {
                $table->dropForeign('fk_tbrun_period');
                $table->dropColumn('accounting_period_id');
            });
        }

        if (Schema::hasColumn('trial_balance_runs', 'trigger')) {
            Schema::table('trial_balance_runs', function (Blueprint $table) {
                $table->dropColumn('trigger');
            });
        }
    }
};
