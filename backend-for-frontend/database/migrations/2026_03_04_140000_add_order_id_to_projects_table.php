<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (! Schema::hasColumn('projects', 'order_id')) {
                $table->unsignedBigInteger('order_id')->nullable()->after('id');
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'order_id')) {
                try {
                    $table->dropForeign(['order_id']);
                } catch (\Throwable $e) {
                    // FK may already be dropped.
                }
                $table->dropColumn('order_id');
            }
        });
    }
};
