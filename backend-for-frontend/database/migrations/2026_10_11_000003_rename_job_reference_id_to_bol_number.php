<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The job_reference_id columns physically store the Bill of Lading number
     * (the app already labels these fields "BOL Number"); align the column
     * names so models and schema agree.
     */
    private const TABLES = ['quotations', 'orders', 'cust_invoices', 'projects'];

    public function up(): void
    {
        foreach (self::TABLES as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->renameColumn('job_reference_id', 'bol_number');
            });
        }
    }

    public function down(): void
    {
        foreach (array_reverse(self::TABLES) as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->renameColumn('bol_number', 'job_reference_id');
            });
        }
    }
};
