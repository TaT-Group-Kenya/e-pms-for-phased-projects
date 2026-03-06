<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            // New currency code column
            $table->string('currency', 10)->nullable()->after('group');
        });

        Schema::table('accounts', function (Blueprint $table) {
            // Drop FK and column if they exist
            if (Schema::hasColumn('accounts', 'currency_id')) {
                $table->dropForeign(['currency_id']);
                $table->dropColumn('currency_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            // Recreate currency_id column (nullable) and FK
            $table->unsignedBigInteger('currency_id')->nullable()->after('group');
        });

        // Backfill currency_id from currencies.code where possible
        DB::table('accounts')
            ->join('currencies', 'accounts.currency', '=', 'currencies.code')
            ->update(['accounts.currency_id' => DB::raw('currencies.id')]);

        Schema::table('accounts', function (Blueprint $table) {
            $table->foreign('currency_id')->references('id')->on('currencies');
        });

        // Optionally keep currency column, but we won't drop it to avoid data loss
        // If you really want to revert fully, uncomment the following line:
        // $table->dropColumn('currency');
    }
};
