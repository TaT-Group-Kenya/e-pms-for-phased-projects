<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->string('job_reference_id')->nullable()->after('project_id');
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->string('job_reference_id')->nullable()->after('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->dropColumn('job_reference_id');
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('job_reference_id');
        });
    }
};
