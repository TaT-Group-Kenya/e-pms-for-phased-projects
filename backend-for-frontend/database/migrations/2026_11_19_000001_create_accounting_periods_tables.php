<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Accounting periods (year / quarter / month hierarchy).
 *
 * Only months carry an operational status. Quarter and year rows exist so
 * the hierarchy is materialised (and ready for future quarter/year locking);
 * their status is derived from their child months and kept in sync when
 * children change.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('accounting_periods')) {
            return;
        }

        Schema::create('accounting_periods', function (Blueprint $table) {
            $table->id();
            $table->enum('period_type', ['year', 'quarter', 'month']);
            $table->unsignedSmallInteger('fiscal_year');
            $table->unsignedTinyInteger('quarter')->nullable(); // 1-4
            $table->unsignedTinyInteger('month')->nullable();   // 1-12
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamp('closed_at')->nullable();
            $table->unsignedBigInteger('closed_by')->nullable();
            $table->timestamp('closed_at_snapshot')->nullable();
            $table->timestamp('reopened_at')->nullable();
            $table->unsignedBigInteger('reopened_by')->nullable();
            $table->text('last_reopen_reason')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique(
                ['period_type', 'fiscal_year', 'quarter', 'month'],
                'uq_accounting_period_key'
            );
            $table->index(['period_type', 'fiscal_year', 'status'], 'ix_ap_type_year_status');
            $table->index(['start_date', 'end_date'], 'ix_ap_range');
        });

        Schema::create('accounting_period_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accounting_period_id');
            $table->string('action'); // closed | reopened
            $table->unsignedBigInteger('performed_by')->nullable();
            $table->timestamp('performed_at');
            $table->text('reason')->nullable();
            $table->unsignedBigInteger('snapshot_run_id')->nullable(); // trial_balance_runs.id
            $table->timestamps();

            $table->foreign('accounting_period_id', 'fk_aplog_period')
                ->references('id')->on('accounting_periods')->onDelete('cascade');
            $table->foreign('snapshot_run_id', 'fk_aplog_snapshot')
                ->references('id')->on('trial_balance_runs')->onDelete('set null');
            $table->index(['accounting_period_id', 'performed_at'], 'ix_aplog_period_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounting_period_logs');
        Schema::dropIfExists('accounting_periods');
    }
};
