<?php

namespace Database\Seeders;

use App\Models\Organisation;
use App\Services\OrganisationDefaultCatalog;
use Illuminate\Database\Seeder;

class GarmentSeeder extends Seeder
{
    /**
     * Creates a demo organisation with the default catalog for local development.
     * Production data is created per organisation on signup / login sync.
     */
    public function run(): void
    {
        $organisation = Organisation::firstOrCreate(
            ['name' => 'Local development']
        );
        OrganisationDefaultCatalog::ensure($organisation);
    }
}
