<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            if (! Schema::hasColumn('quotations', 'job_reference_id')) {
                $table->string('job_reference_id', 32)->nullable()->after('quotation_number');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'job_reference_id')) {
                $table->string('job_reference_id', 32)->nullable()->after('order_number');
            }
        });

        // Prefill existing quotations and their related orders with a shared job_reference_id
        DB::table('quotations')
            ->select('id')
            ->orderBy('id')
            ->chunkById(100, function ($quotes) {
                foreach ($quotes as $quote) {
                    $jobRef = Str::upper(Str::random(8));

                    DB::table('quotations')
                        ->where('id', $quote->id)
                        ->update(['job_reference_id' => $jobRef]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'job_reference_id')) {
                $table->dropColumn('job_reference_id');
            }
        });

        Schema::table('quotations', function (Blueprint $table) {
            if (Schema::hasColumn('quotations', 'job_reference_id')) {
                $table->dropColumn('job_reference_id');
            }
        });
    }
};
