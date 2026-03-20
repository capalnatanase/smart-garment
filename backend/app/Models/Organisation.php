<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organisation extends Model
{
    protected $fillable = ['name'];

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }

    public function garments(): HasMany
    {
        return $this->hasMany(Garment::class);
    }
}
