<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->unique('job_reference_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->unique('job_reference_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique('orders_job_reference_id_unique');
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->dropUnique('quotations_job_reference_id_unique');
        });
    }
};
