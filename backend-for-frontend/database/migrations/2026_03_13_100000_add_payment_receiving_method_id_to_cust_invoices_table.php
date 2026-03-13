<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('payment_receiving_method_id')->nullable()->after('currency');
            $table->foreign('payment_receiving_method_id')
                ->references('id')
                ->on('payment_receiving_methods')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->dropForeign(['payment_receiving_method_id']);
            $table->dropColumn('payment_receiving_method_id');
        });
    }
};
