<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('ship_container_id')->nullable()->after('customer_id')->index();
        });

        // Backfill from quotations that were created from linked containers
        DB::statement(
            'UPDATE orders o
             JOIN quotations q ON q.id = o.quotation_id AND q.ship_container_id IS NOT NULL
             SET o.ship_container_id = q.ship_container_id'
        );

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('ship_container_id')
                ->references('id')
                ->on('ship_containers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['ship_container_id']);
            $table->dropColumn('ship_container_id');
        });
    }
};