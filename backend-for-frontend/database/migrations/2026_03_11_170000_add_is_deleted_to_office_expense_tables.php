<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('office_expense_categories', function (Blueprint $table) {
            if (!Schema::hasColumn('office_expense_categories', 'is_deleted')) {
                $table->boolean('is_deleted')->default(false);
            }
        });
        Schema::table('office_expenses', function (Blueprint $table) {
            if (!Schema::hasColumn('office_expenses', 'is_deleted')) {
                $table->boolean('is_deleted')->default(false);
            }
        });
    }

    public function down()
    {
        Schema::table('office_expense_categories', function (Blueprint $table) {
            if (Schema::hasColumn('office_expense_categories', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
        });
        Schema::table('office_expenses', function (Blueprint $table) {
            if (Schema::hasColumn('office_expenses', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
        });
    }
};
