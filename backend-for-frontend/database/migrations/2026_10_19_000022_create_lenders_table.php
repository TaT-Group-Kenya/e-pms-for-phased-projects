<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lenders', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // full name (person) or company name
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('kra_pin')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        // Link loans to lenders. Existing loans keep their free-text
        // lender_name; the FK is nullable and NULL where no match exists.
        Schema::table('loans', function (Blueprint $table) {
            $table->unsignedBigInteger('lender_id')->nullable()->after('lender_name');
            $table->foreign('lender_id')->references('id')->on('lenders');
        });

        // Backfill: match loans to lenders by trimmed lender_name.
        DB::statement(
            'UPDATE loans JOIN lenders ON lenders.name COLLATE utf8mb4_unicode_ci = TRIM(loans.lender_name)
             SET loans.lender_id = lenders.id WHERE loans.lender_name IS NOT NULL'
        );
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['lender_id']);
            $table->dropColumn('lender_id');
        });

        Schema::dropIfExists('lenders');
    }
};
