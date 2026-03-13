<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    protected $fillable = ['name', 'order', 'video_url'];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }
}
