<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Size extends Model
{
    protected $fillable = ['garment_id', 'name'];

    public function garment(): BelongsTo
    {
        return $this->belongsTo(Garment::class);
    }
}
