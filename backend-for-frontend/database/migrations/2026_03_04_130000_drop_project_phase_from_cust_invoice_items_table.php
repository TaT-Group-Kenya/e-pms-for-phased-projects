<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_invoice_items', function (Blueprint $table) {
            if (Schema::hasColumn('cust_invoice_items', 'project_phase_id')) {
                // Drop foreign key first (if it exists), then the column.
                try {
                    $table->dropForeign(['project_phase_id']);
                } catch (\Throwable $e) {
                    // Foreign key might already be dropped in some environments; ignore.
                }

                $table->dropColumn('project_phase_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cust_invoice_items', function (Blueprint $table) {
            if (! Schema::hasColumn('cust_invoice_items', 'project_phase_id')) {
                $table->unsignedBigInteger('project_phase_id')->nullable()->after('invoice_id');
            }
        });
    }
};
