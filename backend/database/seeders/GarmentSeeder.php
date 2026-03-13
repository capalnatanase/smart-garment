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
            ['name' => 'M'],
            ['name' => 'L'],
            ['name' => 'XL'],
        ];

        $garmentNames = [
            'Base Layer',
            'Tychem Coverall',
            'Tyvek Coverall',
            'Trousers',
        ];

        foreach ($garmentNames as $name) {
            $garment = Garment::firstOrCreate(['name' => $name]);
            if ($garment->sizes()->count() === 0) {
                $garment->sizes()->createMany($sizes);
            }
        }
    }
}
