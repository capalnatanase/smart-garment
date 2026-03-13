<?php

namespace Database\Seeders;

use App\Models\BodyZone;
use Illuminate\Database\Seeder;

class BodyZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            ['name' => 'Head', 'slug' => 'front-head', 'side' => 'front'],
            ['name' => 'Head', 'slug' => 'back-head', 'side' => 'back'],
            ['name' => 'Head', 'slug' => 'side-head', 'side' => 'side'],
            ['name' => 'Right shoulder', 'slug' => 'front-right-shoulder', 'side' => 'front'],
            ['name' => 'Left shoulder', 'slug' => 'front-left-shoulder', 'side' => 'front'],
            ['name' => 'Right shoulder', 'slug' => 'back-right-shoulder', 'side' => 'back'],
            ['name' => 'Left shoulder', 'slug' => 'back-left-shoulder', 'side' => 'back'],
            ['name' => 'Shoulder', 'slug' => 'side-shoulder', 'side' => 'side'],
            ['name' => 'Right wrist', 'slug' => 'front-right-wrist', 'side' => 'front'],
            ['name' => 'Left wrist', 'slug' => 'front-left-wrist', 'side' => 'front'],
            ['name' => 'Right wrist', 'slug' => 'back-right-wrist', 'side' => 'back'],
            ['name' => 'Left wrist', 'slug' => 'back-left-wrist', 'side' => 'back'],
            ['name' => 'Lower torso and crotch', 'slug' => 'front-lower-torso-crotch', 'side' => 'front'],
            ['name' => 'Lower torso and crotch', 'slug' => 'back-lower-torso-crotch', 'side' => 'back'],
            ['name' => 'Hip', 'slug' => 'side-hip', 'side' => 'side'],
            ['name' => 'Thighs', 'slug' => 'front-thighs', 'side' => 'front'],
            ['name' => 'Thighs', 'slug' => 'back-thighs', 'side' => 'back'],
            ['name' => 'Leg', 'slug' => 'side-leg', 'side' => 'side'],
            ['name' => 'Left shin and ankle', 'slug' => 'front-left-shin-ankle', 'side' => 'front'],
            ['name' => 'Right shin and ankle', 'slug' => 'front-right-shin-ankle', 'side' => 'front'],
            ['name' => 'Left shin and ankle', 'slug' => 'back-left-shin-ankle', 'side' => 'back'],
            ['name' => 'Right shin and ankle', 'slug' => 'back-right-shin-ankle', 'side' => 'back'],
        ];

        foreach ($zones as $z) {
            BodyZone::create($z);
        }
    }
}
