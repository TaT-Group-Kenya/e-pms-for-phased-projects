<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_credit_note_items', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('item_amount');
            $table->decimal('total', 15, 2)->default(0)->after('quantity');
        });

        Schema::table('company_credit_note_items', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('item_amount');
            $table->decimal('total', 15, 2)->default(0)->after('quantity');
        });
    }

    public function down(): void
    {
        Schema::table('cust_credit_note_items', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'total']);
        });

        Schema::table('company_credit_note_items', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'total']);
        });
    }
};
