<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_phases', function (Blueprint $table) {
            if (Schema::hasColumn('project_phases', 'quote_item_id')) {
                $table->dropColumn('quote_item_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('project_phases', function (Blueprint $table) {
            if (! Schema::hasColumn('project_phases', 'quote_item_id')) {
                $table->unsignedBigInteger('quote_item_id')->nullable();
            }
        });
    }
};
