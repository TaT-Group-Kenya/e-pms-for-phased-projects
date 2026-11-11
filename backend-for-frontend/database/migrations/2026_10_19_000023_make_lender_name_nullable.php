<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * loans.lender_id is now the canonical lender reference (FK); the
     * free-text lender_name stays as an optional display copy.
     */
    public function up(): void
    {
        Schema::table('loans', function ($table) {
            $table->string('lender_name')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('loans', function ($table) {
            $table->string('lender_name')->nullable(false)->change();
        });
    }
};
