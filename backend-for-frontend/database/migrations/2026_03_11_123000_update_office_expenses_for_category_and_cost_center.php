<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('office_expenses', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('id');
            $table->unsignedBigInteger('cost_center_id')->nullable()->after('category_id');
            $table->dropColumn('category');
            $table->dropColumn('cost_center');
        });
    }

    public function down()
    {
        Schema::table('office_expenses', function (Blueprint $table) {
            $table->string('category')->nullable();
            $table->string('cost_center')->nullable();
            $table->dropColumn('category_id');
            $table->dropColumn('cost_center_id');
        });
    }
};
