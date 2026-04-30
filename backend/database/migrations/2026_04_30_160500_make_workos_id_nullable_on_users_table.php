<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Production (Laravel Cloud + WorkOS) creates `users.workos_id` as NOT NULL
 * because every user is expected to authenticate via WorkOS SSO.
 *
 * To allow Filament-only admin accounts (created with email + password and
 * no WorkOS identity) to be inserted into the same table, we relax the
 * constraint to nullable. Existing WorkOS users keep their `workos_id`
 * unchanged.
 *
 * Local environments don't have a `workos_id` column at all — the migration
 * is guarded so it is a no-op there.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'workos_id')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('workos_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        // We deliberately do not re-add the NOT NULL constraint on rollback,
        // since pre-existing rows created via Filament would have NULL values
        // and would prevent the constraint from being re-applied.
    }
};
