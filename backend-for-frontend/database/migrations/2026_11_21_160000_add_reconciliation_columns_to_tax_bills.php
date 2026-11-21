<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Per-period reconciliation for tax bills.
     *
     * A bill's liability belongs to its period: when the bill is paid in a
     * later month (after other entries have landed), the settlement still
     * reduces THAT month's liability. The bill therefore records the
     * settlement's per-period effect; the remaining balance carries to the
     * next unpaid bills in chronological order.
     */
    public function up(): void
    {
        if (! Schema::hasTable('tax_bills')) {
            return;
        }

        Schema::table('tax_bills', function (Blueprint $table) {
            // Liability settled against the bill's own period.
            $table->decimal('settled_for_period', 15, 2)->default(0)->after('paid_amount');
            // Liability carried forward to later bills (unfunded at run time).
            $table->decimal('carried_forward', 15, 2)->default(0)->after('settled_for_period');
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('tax_bills') && Schema::hasColumn('tax_bills', 'settled_for_period')) {
            Schema::table('tax_bills', function (Blueprint $table) {
                $table->dropColumn(['settled_for_period', 'carried_forward']);
            });
        }
    }
};
