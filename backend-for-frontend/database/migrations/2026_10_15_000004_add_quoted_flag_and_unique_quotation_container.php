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
            $table->boolean('quoted')->default(false)->after('project_owner_id');
        });

        DB::table('ship_containers')
            ->whereIn('id', DB::table('quotations')->select('ship_container_id')->whereNotNull('ship_container_id'))
            ->update(['quoted' => true]);

        Schema::table('quotations', function (Blueprint $table) {
            $table->unique('ship_container_id', 'quotations_ship_container_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropUnique('quotations_ship_container_id_unique');
        });

        Schema::table('ship_containers', function (Blueprint $table) {
            $table->dropColumn('quoted');
        });
    }
};
