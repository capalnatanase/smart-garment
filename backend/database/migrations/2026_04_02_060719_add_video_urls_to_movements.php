<?php

use App\Models\Movement;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $videoUrls = [
            'Arms Raised' => '/videos/Avatar Arms Raised (1).mp4',
            'Squat' => '/videos/Avatar Squat.mp4',
            'Toe Touch' => '/videos/Avatar Forward Bend .mp4',
            'Step Up Ladder Reach' => '/videos/Step up (ladder reach).mp4',
            'Seatbelt reach' => '/videos/seatbelt reach female.mp4',
        ];

        foreach ($videoUrls as $name => $url) {
            Movement::where('name', $name)->update(['video_url' => $url]);
        }
    }

    public function down(): void
    {
        Movement::whereNotNull('video_url')->update(['video_url' => null]);
    }
};
