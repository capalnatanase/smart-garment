<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Runs after create_movement_responses_table: both migrations used the same
     * second (104149), and PostgreSQL/Laravel orders filenames alphabetically —
     * "movement_response_zones" sorts before "movement_responses" (_ before s),
     * so the FK to movement_responses failed. This file uses 104150 so order is correct.
     */
    public function up(): void
    {
        Schema::create('movement_response_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movement_response_id')->constrained()->cascadeOnDelete();
            $table->foreignId('body_zone_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['movement_response_id', 'body_zone_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movement_response_zones');
    }
};
