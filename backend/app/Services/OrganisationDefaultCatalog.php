<?php

namespace App\Services;

use App\Models\Garment;
use App\Models\Organisation;

/**
 * Ensures every organisation has the default garment catalog (names + S/R/L sizes).
 */
final class OrganisationDefaultCatalog
{
    /** Order matches product list (Tychem first, then Tyvek coveralls, then overboot). */
    public const DEFAULT_GARMENT_NAMES = [
        'Tychem Coverall - Camo',
        'Tychem Coverall - Charcoal',
        'Tyvek Coverall - Camo',
        'Tyvek Coverall - Charcoal',
        'Tyvek Overboot',
    ];

    /** Short / regular / long — stored as displayed to users. */
    public const DEFAULT_SIZE_NAMES = ['S', 'R', 'L'];

    public static function ensure(Organisation $organisation): void
    {
        foreach (self::DEFAULT_GARMENT_NAMES as $name) {
            $garment = Garment::firstOrCreate(
                [
                    'organisation_id' => $organisation->id,
                    'name' => $name,
                ]
            );

            if ($garment->sizes()->count() === 0) {
                $garment->sizes()->createMany(
                    array_map(fn (string $sizeName) => ['name' => $sizeName], self::DEFAULT_SIZE_NAMES)
                );
            }
        }
    }
}
