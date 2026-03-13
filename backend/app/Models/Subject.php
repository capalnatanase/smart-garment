<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class Subject extends Model
{
    use HasApiTokens;

    protected $fillable = [
        'subject_id',
        'organisation',
        'job_role',
    ];

    public function assessmentSessions(): HasMany
    {
        return $this->hasMany(AssessmentSession::class);
    }
}
