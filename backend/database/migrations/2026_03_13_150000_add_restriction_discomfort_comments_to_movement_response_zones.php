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
            $table->unsignedTinyInteger('restriction')->nullable()->after('severity'); // 1-5
            $table->unsignedTinyInteger('discomfort')->nullable()->after('restriction'); // 1-5
            $table->text('comments')->nullable()->after('discomfort');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movement_response_zones', function (Blueprint $table) {
            $table->dropColumn(['restriction', 'discomfort', 'comments']);
        });
    }
};
