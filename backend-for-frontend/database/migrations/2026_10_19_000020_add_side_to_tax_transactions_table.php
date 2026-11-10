<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // dr = tax liability/receivable opened at document creation (full tax)
        // cr = movement against it (collected via payments, settled, adjusted).
        // Existing rows (payment-time collections) are credit-side movements.
        Schema::table('tax_transactions', function ($table) {
            $table->enum('side', ['dr', 'cr'])->default('cr')->after('direction');
            $table->index(['source_type', 'source_id', 'side'], 'tax_txn_doc_side_index');
        });

        DB::table('tax_transactions')->update(['side' => 'cr']);
    }

    public function down(): void
    {
        Schema::table('tax_transactions', function ($table) {
            $table->dropIndex('tax_txn_doc_side_index');
            $table->dropColumn('side');
        });
    }
};
