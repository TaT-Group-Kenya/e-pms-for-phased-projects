<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Change the status column to enum with allowed values and set default to draft
            $table->enum('status', ['new', 'progress', 'draft', 'complete'])->default('draft')->change();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Revert back to string column
            $table->string('status')->change();
        });
    }
};
