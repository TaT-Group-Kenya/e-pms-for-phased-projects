<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('ship_containers')->where('guarantee_status', 'pending')->update(['guarantee_status' => 'Pending']);
        DB::table('ship_containers')->whereIn('guarantee_status', ['active', 'released'])->update(['guarantee_status' => 'Received']);
        DB::table('ship_containers')
            ->whereNotNull('guarantee_status')
            ->whereNotIn('guarantee_status', ['Pending', 'Received'])
            ->update(['guarantee_status' => 'Waiting interchange']);

        Schema::table('ship_containers', function (Blueprint $table) {
            $table->enum('guarantee_status', ['Pending', 'Received', 'Waiting interchange'])->nullable()->change();
            $table->date('gt_expiry_date')->nullable()->after('guarantee_status');
        });

        Schema::table('ship_container_numbers', function (Blueprint $table) {
            $table->unsignedInteger('size')->nullable()->after('container_no');
            $table->enum('size_unit', ['feet', 'cm', 'm'])->default('feet')->after('size');
            $table->text('goods_description')->nullable()->after('size_unit');
            $table->string('entry_number')->nullable()->after('goods_description');
        });
    }

    public function down(): void
    {
        Schema::table('ship_container_numbers', function (Blueprint $table) {
            $table->dropColumn(['size', 'size_unit', 'goods_description', 'entry_number']);
        });

        Schema::table('ship_containers', function (Blueprint $table) {
            $table->string('guarantee_status')->nullable()->change();
            $table->dropColumn('gt_expiry_date');
        });
    }
};
