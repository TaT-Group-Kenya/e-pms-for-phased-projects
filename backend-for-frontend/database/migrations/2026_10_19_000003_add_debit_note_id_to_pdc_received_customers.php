<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pdc_received_customers', function (Blueprint $table) {
            if (! Schema::hasColumn('pdc_received_customers', 'debit_note_id')) {
                $table->unsignedBigInteger('debit_note_id')->nullable()->after('invoice_id');
                $table->index('debit_note_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pdc_received_customers', function (Blueprint $table) {
            if (Schema::hasColumn('pdc_received_customers', 'debit_note_id')) {
                $table->dropIndex(['debit_note_id']);
                $table->dropColumn('debit_note_id');
            }
        });
    }
};