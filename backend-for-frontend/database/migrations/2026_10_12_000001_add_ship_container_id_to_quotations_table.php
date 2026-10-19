<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // A quotation is based on one ship container entry (1:1).
            $table->unsignedBigInteger('ship_container_id')->nullable()->after('customer_id')->index();
        });

        // Seed existing quotations' linkage from their former bol_number text
        // where a matching ship container number exists.
        DB::statement(
            'UPDATE quotations q
             JOIN ship_container_numbers n ON UPPER(TRIM(q.bol_number)) = n.container_no
             SET q.ship_container_id = n.ship_container_id
             WHERE q.bol_number IS NOT NULL AND q.ship_container_id IS NULL'
        );

        Schema::table('quotations', function (Blueprint $table) {
            $table->foreign('ship_container_id')
                ->references('id')
                ->on('ship_containers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // Keep the column when rolling back, just drop the relation
            $table->dropForeign(['ship_container_id']);
            $table->dropColumn('ship_container_id');
        });
    }
};