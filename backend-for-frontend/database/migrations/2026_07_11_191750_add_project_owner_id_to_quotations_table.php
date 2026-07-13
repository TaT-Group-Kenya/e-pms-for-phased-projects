<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->unsignedBigInteger('project_owner_id')->nullable()->index()->after('customer_id');
            $table->foreign('project_owner_id')->references('id')->on('project_owners')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropForeign(['project_owner_id']);
            $table->dropIndex(['project_owner_id']);
            $table->dropColumn('project_owner_id');
        });
    }
};
