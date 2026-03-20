<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('organisation_id')
                ->nullable()
                ->after('organisation')
                ->constrained()
                ->nullOnDelete();
        });

        Schema::table('garments', function (Blueprint $table) {
            $table->foreignId('organisation_id')
                ->nullable()
                ->after('name')
                ->constrained()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('garments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('organisation_id');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropConstrainedForeignId('organisation_id');
        });
    }
};
