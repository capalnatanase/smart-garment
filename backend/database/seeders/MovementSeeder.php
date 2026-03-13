<?php

namespace Database\Seeders;

use App\Models\Movement;
use Illuminate\Database\Seeder;

class MovementSeeder extends Seeder
{
    public function run(): void
    {
        $movements = [
            ['name' => 'Arms Raised', 'order' => 1],
            ['name' => 'Squat', 'order' => 2],
            ['name' => 'Toe Touch', 'order' => 3],
            ['name' => 'Step Up Ladder Reach', 'order' => 4],
            ['name' => 'Seatbelt reach', 'order' => 5],
        ];

        foreach ($movements as $m) {
            Movement::create(array_merge($m, ['video_url' => null]));
        }
    }
}
