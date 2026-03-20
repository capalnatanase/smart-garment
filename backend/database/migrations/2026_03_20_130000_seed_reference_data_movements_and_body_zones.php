<?php

use App\Models\BodyZone;
use App\Models\Movement;
use Illuminate\Database\Migrations\Migration;

/**
 * Ensures global reference data exists in production (deploys often run migrate without db:seed).
 */
return new class extends Migration
{
    public function up(): void
    {
        $movements = [
            ['name' => 'Arms Raised', 'order' => 1],
            ['name' => 'Squat', 'order' => 2],
            ['name' => 'Toe Touch', 'order' => 3],
            ['name' => 'Step Up Ladder Reach', 'order' => 4],
            ['name' => 'Seatbelt reach', 'order' => 5],
        ];

        foreach ($movements as $m) {
            Movement::updateOrCreate(
                ['name' => $m['name']],
                ['order' => $m['order'], 'video_url' => null]
            );
        }

        $zones = [
            ['name' => 'Head/Face', 'slug' => 'front-head-face', 'side' => 'front'],
            ['name' => 'Right shoulder', 'slug' => 'front-right-shoulder', 'side' => 'front'],
            ['name' => 'Left shoulder', 'slug' => 'front-left-shoulder', 'side' => 'front'],
            ['name' => 'Right wrist', 'slug' => 'front-right-wrist', 'side' => 'front'],
            ['name' => 'Lower torso and crotch', 'slug' => 'front-lower-torso-crotch', 'side' => 'front'],
            ['name' => 'Left wrist', 'slug' => 'front-left-wrist', 'side' => 'front'],
            ['name' => 'Thighs', 'slug' => 'front-thighs', 'side' => 'front'],
            ['name' => 'Right shin and ankle', 'slug' => 'front-right-shin-ankle', 'side' => 'front'],
            ['name' => 'Left shin and ankle', 'slug' => 'front-left-shin-ankle', 'side' => 'front'],
            ['name' => 'Head/Face', 'slug' => 'back-head-face', 'side' => 'back'],
            ['name' => 'Left shoulder', 'slug' => 'back-left-shoulder', 'side' => 'back'],
            ['name' => 'Right shoulder', 'slug' => 'back-right-shoulder', 'side' => 'back'],
            ['name' => 'Left wrist', 'slug' => 'back-left-wrist', 'side' => 'back'],
            ['name' => 'Lower torso and crotch', 'slug' => 'back-lower-torso-crotch', 'side' => 'back'],
            ['name' => 'Right wrist', 'slug' => 'back-right-wrist', 'side' => 'back'],
            ['name' => 'Thighs', 'slug' => 'back-thighs', 'side' => 'back'],
            ['name' => 'Left shin and ankle', 'slug' => 'back-left-shin-ankle', 'side' => 'back'],
            ['name' => 'Right shin and ankle', 'slug' => 'back-right-shin-ankle', 'side' => 'back'],
            ['name' => 'Head', 'slug' => 'side-head', 'side' => 'side'],
            ['name' => 'Shoulder and top arm', 'slug' => 'side-shoulder-top-arm', 'side' => 'side'],
            ['name' => 'Hips and wrist', 'slug' => 'side-hips-wrist', 'side' => 'side'],
            ['name' => 'Lower legs', 'slug' => 'side-lower-legs', 'side' => 'side'],
        ];

        foreach ($zones as $z) {
            BodyZone::updateOrCreate(
                ['slug' => $z['slug']],
                ['name' => $z['name'], 'side' => $z['side']]
            );
        }
    }

    public function down(): void
    {
        // Reference data: leave rows in place on rollback to avoid breaking FKs.
    }
};
