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
        Schema::table('movement_response_zones', function (Blueprint $table) {
            $table->string('severity', 32)->nullable()->after('body_zone_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movement_response_zones', function (Blueprint $table) {
            $table->dropColumn('severity');
        });
    }
};
