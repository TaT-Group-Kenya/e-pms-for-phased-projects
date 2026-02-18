<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_roles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('role_id');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('group_id')->references('id')->on('sys_groups')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('sys_roles')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_roles');
    }
};