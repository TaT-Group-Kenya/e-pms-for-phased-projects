<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ship_containers', function (Blueprint $table) {
            $table->string('status')->nullable()->default(null)->change();
        });

        DB::table('ship_containers')->whereNotNull('status')->update(['status' => null]);

        Schema::table('ship_containers', function (Blueprint $table) {
            $table->enum('status', ['BOOKED', 'EMPTY COLLECTED', 'LOADED', 'RELEASED CUSTOMS', 'RECEIVED AT KPA', 'CONFIRMED LOADING', 'SAILED'])
                ->nullable()
                ->default(null)
                ->change();
        });

        DB::table('ship_containers')
            ->whereNotNull('coe')
            ->whereNotIn('coe', ['PENDING', 'GENERATED'])
            ->update(['coe' => 'GENERATED']);
        DB::table('ship_containers')->where('coe', '')->update(['coe' => null]);

        Schema::table('ship_containers', function (Blueprint $table) {
            $table->enum('coe', ['PENDING', 'GENERATED'])->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('ship_containers')->whereNotNull('status')->update(['status' => 'pending']);
        DB::table('ship_containers')->whereNull('status')->update(['status' => 'pending']);

        Schema::table('ship_containers', function (Blueprint $table) {
            $table->enum('status', ['pending', 'in_progress', 'cleared', 'exited', 'on_hold'])
                ->default('pending')
                ->change();
            $table->string('coe')->nullable()->change();
        });
    }
};
