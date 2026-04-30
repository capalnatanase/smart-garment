<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Production (Laravel Cloud + WorkOS) provisions the `users` table without a
 * `password` column because WorkOS handles authentication via SSO.
 *
 * Filament's default login is email + password, so we add a nullable
 * `password` column to allow Filament-only admin accounts to coexist with
 * WorkOS SSO users (whose `password` will simply remain NULL).
 *
 * The migration is guarded so it is a no-op on environments that already have
 * the column (e.g. local dev installed from the original create_users_table
 * migration).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'password')) {
                $table->string('password')->nullable()->after('email_verified_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'password')) {
                $table->dropColumn('password');
            }
        });
    }
};
