<?php

namespace Database\Seeders;

use App\Models\Movement;
use Illuminate\Database\Seeder;

class MovementSeeder extends Seeder
{
    public function run(): void
    {
        $movements = [
            ['name' => 'Arms Raised', 'order' => 1, 'video_url' => '/videos/Avatar Arms Raised (1).mp4'],
            ['name' => 'Squat', 'order' => 2, 'video_url' => '/videos/Avatar Squat.mp4'],
            ['name' => 'Toe Touch', 'order' => 3, 'video_url' => '/videos/Avatar Forward Bend .mp4'],
            ['name' => 'Step Up Ladder Reach', 'order' => 4, 'video_url' => '/videos/Step up (ladder reach).mp4'],
            ['name' => 'Seatbelt reach', 'order' => 5, 'video_url' => '/videos/seatbelt reach female.mp4'],
        ];

        foreach ($movements as $m) {
            Movement::updateOrCreate(
                ['name' => $m['name']],
                ['order' => $m['order'], 'video_url' => $m['video_url']]
            );
        }
    }
}
