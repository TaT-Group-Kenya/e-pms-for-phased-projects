<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // Drop existing simple unique index if present
            $table->dropUnique('quotations_job_reference_id_unique');
            // Enforce uniqueness only among non-deleted rows via composite key
            $table->unique(['job_reference_id', 'deleted_at']);
        });

        Schema::table('orders', function (Blueprint $table) {
            // Drop existing simple unique index if present
            $table->dropUnique('orders_job_reference_id_unique');
            // Enforce uniqueness only among non-deleted rows via composite key
            $table->unique(['job_reference_id', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique(['job_reference_id', 'deleted_at']);
            $table->unique('job_reference_id');
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->dropUnique(['job_reference_id', 'deleted_at']);
            $table->unique('job_reference_id');
        });
    }
};
