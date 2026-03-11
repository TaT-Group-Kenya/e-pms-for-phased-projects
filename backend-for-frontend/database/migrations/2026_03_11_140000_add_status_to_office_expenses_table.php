<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('office_expenses', function (Blueprint $table) {
            $table->enum('status', ['pending', 'paid'])->default('pending')->after('date');
            $table->string('currency', 10)->default('KES')->change();
        });
    }

    public function down()
    {
        Schema::table('office_expenses', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->string('currency', 10)->change();
        });
    }
};
