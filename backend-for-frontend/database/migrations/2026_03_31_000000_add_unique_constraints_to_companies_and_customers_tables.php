<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->unique('email');
            $table->unique('phone');
            $table->unique('kra_pin');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->unique('email');
            $table->unique('phone');
            $table->unique('kra_pin');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropUnique(['email']);
            $table->dropUnique(['phone']);
            $table->dropUnique(['kra_pin']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique(['email']);
            $table->dropUnique(['phone']);
            $table->dropUnique(['kra_pin']);
        });
    }
};
