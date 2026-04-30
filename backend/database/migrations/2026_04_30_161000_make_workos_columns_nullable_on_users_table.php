<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Laravel Cloud's WorkOS-flavoured `users` schema marks several columns as
 * NOT NULL because every user is assumed to come from WorkOS SSO (which
 * provides them). Filament-only admin accounts don't have a WorkOS identity,
 * so we relax these to nullable.
 *
 * This migration is idempotent and a no-op on environments that don't have
 * the WorkOS columns (e.g. local dev).
 */
return new class extends Migration
{
    /**
     * Columns added by the Laravel Cloud / WorkOS starter that should be
     * nullable for Filament-only admin accounts to coexist.
     *
     * Keep this list in sync with anything new that Laravel Cloud adds.
     */
    private const NULLABLE_COLUMNS = [
        'avatar' => 'text',
        // `workos_id` was already relaxed in the previous migration, but we
        // include it here defensively for fresh environments that run both
        // migrations in one go.
        'workos_id' => 'string',
    ];

    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            foreach (self::NULLABLE_COLUMNS as $column => $type) {
                if (! Schema::hasColumn('users', $column)) {
                    continue;
                }

                match ($type) {
                    'text' => $table->text($column)->nullable()->change(),
                    default => $table->string($column)->nullable()->change(),
                };
            }
        });
    }

    public function down(): void
    {
        // Intentionally left as a no-op — re-applying NOT NULL would fail for
        // any rows created in the meantime that legitimately have NULL values.
    }
};
