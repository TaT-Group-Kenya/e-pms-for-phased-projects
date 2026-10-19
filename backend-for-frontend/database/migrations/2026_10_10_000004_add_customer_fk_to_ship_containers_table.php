<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ship_containers', function (Blueprint $table) {
            // Linked customer is the project's Customer entity (optional).
            // client_name stays free text and may differ from the customer.
            $table->foreign('customer_id')
                ->references('id')
                ->on('customers')
                ->nullOnDelete();
        });

        // Drop rows pointing at non-existent customers before adding the constraint
        $orphans = DB::table('ship_containers')
            ->whereNotNull('customer_id')
            ->whereNotIn('customer_id', DB::table('customers')->select('id'))
            ->pluck('id');

        if ($orphans->isNotEmpty()) {
            DB::table('ship_containers')->whereIn('id', $orphans)->update(['customer_id' => null]);
        }
    }

    public function down(): void
    {
        Schema::table('ship_containers', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
        });
    }
};
