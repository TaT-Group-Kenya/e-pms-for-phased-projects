<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('company_credit_note_tax_items')) {
            return;
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('company_credit_note_tax_items');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    public function down(): void
    {
        if (Schema::hasTable('company_credit_note_tax_items')) {
            return;
        }

        Schema::create('company_credit_note_tax_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('credit_note_id');
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->string('item_name');
            $table->enum('item_type', ['fixed', 'percent']);
            $table->decimal('item_value', 15, 2)->nullable();
            $table->decimal('item_amount', 15, 2)->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('credit_note_id')
                ->references('id')
                ->on('company_credit_notes')
                ->onDelete('cascade');

            $table->foreign('tax_id')
                ->references('id')
                ->on('taxes')
                ->onDelete('set null');
        });
    }
};
