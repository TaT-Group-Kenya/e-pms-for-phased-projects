<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ship_containers', function (Blueprint $table) {
            // Gate In / Gate Out are free-text PORT names (where the cargo
            // entered/exited the country), Gate In applies to import+transit,
            // Gate Out to export+transit.
            $table->string('gate_in')->nullable()->change();
            $table->string('gate_out')->nullable()->change();

            // Get In / Get Out are the arrival/departure DATES and apply to
            // transit types only (entered / exited the country).
            $table->date('get_in')->nullable()->index()->after('gate_in');
            $table->date('get_out')->nullable()->after('gate_out');
        });
    }

    public function down(): void
    {
        Schema::table('ship_containers', function (Blueprint $table) {
            $table->dropColumn(['get_in', 'get_out']);
            $table->date('gate_in')->nullable()->change();
            $table->date('gate_out')->nullable()->change();
        });
    }
};