<?php

namespace Database\Seeders;

use App\Models\Garment;
use App\Models\Size;
use Illuminate\Database\Seeder;

class GarmentSeeder extends Seeder
{
    public function run(): void
    {
        $sizes = [
            ['name' => 'S'],
            ['name' => 'R'],
            ['name' => 'L'],
        ];

        $garmentNames = [
            'Tyvek Coverall - Camo',
            'Tyvek Coverall - Charcoal',
            'Tychem Coverall - Camo',
            'Tychem Coverall - Charcoal',
            'Tyvek Overboot',
        ];

        foreach ($garmentNames as $name) {
            $garment = Garment::firstOrCreate(['name' => $name]);
            if ($garment->sizes()->count() === 0) {
                $garment->sizes()->createMany($sizes);
            }
        }
    }
}
