<?php

namespace Database\Seeders;

use App\Models\BodyZone;
use Illuminate\Database\Seeder;

class BodyZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            // Front (1–9)
            ['name' => 'Head/Face', 'slug' => 'front-head-face', 'side' => 'front'],
            ['name' => 'Right shoulder', 'slug' => 'front-right-shoulder', 'side' => 'front'],
            ['name' => 'Left shoulder', 'slug' => 'front-left-shoulder', 'side' => 'front'],
            ['name' => 'Right wrist', 'slug' => 'front-right-wrist', 'side' => 'front'],
            ['name' => 'Lower torso and crotch', 'slug' => 'front-lower-torso-crotch', 'side' => 'front'],
            ['name' => 'Left wrist', 'slug' => 'front-left-wrist', 'side' => 'front'],
            ['name' => 'Thighs', 'slug' => 'front-thighs', 'side' => 'front'],
            ['name' => 'Right shin and ankle', 'slug' => 'front-right-shin-ankle', 'side' => 'front'],
            ['name' => 'Left shin and ankle', 'slug' => 'front-left-shin-ankle', 'side' => 'front'],
            // Back (10–18)
            ['name' => 'Head/Face', 'slug' => 'back-head-face', 'side' => 'back'],
            ['name' => 'Left shoulder', 'slug' => 'back-left-shoulder', 'side' => 'back'],
            ['name' => 'Right shoulder', 'slug' => 'back-right-shoulder', 'side' => 'back'],
            ['name' => 'Left wrist', 'slug' => 'back-left-wrist', 'side' => 'back'],
            ['name' => 'Lower torso and crotch', 'slug' => 'back-lower-torso-crotch', 'side' => 'back'],
            ['name' => 'Right wrist', 'slug' => 'back-right-wrist', 'side' => 'back'],
            ['name' => 'Thighs', 'slug' => 'back-thighs', 'side' => 'back'],
            ['name' => 'Left shin and ankle', 'slug' => 'back-left-shin-ankle', 'side' => 'back'],
            ['name' => 'Right shin and ankle', 'slug' => 'back-right-shin-ankle', 'side' => 'back'],
            // Side (19–22)
            ['name' => 'Head', 'slug' => 'side-head', 'side' => 'side'],
            ['name' => 'Shoulder and top arm', 'slug' => 'side-shoulder-top-arm', 'side' => 'side'],
            ['name' => 'Hips and wrist', 'slug' => 'side-hips-wrist', 'side' => 'side'],
            ['name' => 'Lower legs', 'slug' => 'side-lower-legs', 'side' => 'side'],
        ];

        foreach ($zones as $z) {
            BodyZone::create($z);
        }
    }
}
