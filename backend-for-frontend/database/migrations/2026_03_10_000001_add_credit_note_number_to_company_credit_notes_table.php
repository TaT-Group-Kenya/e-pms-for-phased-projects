<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_credit_notes', function (Blueprint $table) {
            //$table->unique('credit_note_number');
        });
    }

    public function down(): void
    {
        Schema::table('company_credit_notes', function (Blueprint $table) {
            $table->dropUnique(['credit_note_number']);
        });
    }
};