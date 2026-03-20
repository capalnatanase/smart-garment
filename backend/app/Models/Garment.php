<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Garment extends Model
{
    protected $fillable = ['name', 'organisation_id'];

    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    public function sizes(): HasMany
    {
        return $this->hasMany(Size::class);
    }
}
