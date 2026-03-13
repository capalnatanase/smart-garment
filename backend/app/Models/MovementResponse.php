<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MovementResponse extends Model
{
    protected $fillable = [
        'assessment_session_id',
        'movement_id',
        'no_issues',
    ];

    protected function casts(): array
    {
        return [
            'no_issues' => 'boolean',
        ];
    }

    public function assessmentSession(): BelongsTo
    {
        return $this->belongsTo(AssessmentSession::class);
    }

    public function movement(): BelongsTo
    {
        return $this->belongsTo(Movement::class);
    }

    public function bodyZones(): BelongsToMany
    {
        return $this->belongsToMany(BodyZone::class, 'movement_response_zones')
            ->withPivot('severity', 'restriction', 'discomfort', 'comments')
            ->withTimestamps();
    }
}
