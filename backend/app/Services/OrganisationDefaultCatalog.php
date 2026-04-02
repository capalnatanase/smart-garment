<?php

namespace App\Services;

use App\Models\Garment;
use App\Models\Organisation;

/**
 * Ensures every organisation has the default garment catalog (names + height-chest-length sizes).
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

    /** Height–chest–length codes (e.g. 170-105-S = 170 cm, 105 cm chest, short). */
    public const DEFAULT_SIZE_NAMES = [
        '170-105-S', '170-105-R', '170-105-L',
        '170-115-S', '170-115-R', '170-115-L',
        '170-125-S', '170-125-R', '170-125-L',
        '180-105-S', '180-105-R', '180-105-L',
        '180-115-S', '180-115-R', '180-115-L',
        '180-125-S', '180-125-R', '180-125-L',
        '190-105-S', '190-105-R', '190-105-L',
        '190-115-S', '190-115-R', '190-115-L',
        '190-125-S', '190-125-R', '190-125-L',
        '200-105-S', '200-105-R', '200-105-L',
        '200-115-S', '200-115-R', '200-115-L',
        '200-125-S', '200-125-R', '200-125-L',
    ];

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
