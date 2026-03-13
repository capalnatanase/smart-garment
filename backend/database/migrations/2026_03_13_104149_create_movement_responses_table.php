<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movement_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('movement_id')->constrained()->cascadeOnDelete();
            $table->boolean('no_issues')->default(false);
            $table->timestamps();

            $table->unique(['assessment_session_id', 'movement_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movement_responses');
    }
};
