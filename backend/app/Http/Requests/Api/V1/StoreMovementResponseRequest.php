<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovementResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'movement_id' => ['required', 'integer', 'exists:movements,id'],
            'no_issues' => ['sometimes', 'boolean'],
            'body_zone_ids' => ['nullable', 'array'],
            'body_zone_ids.*' => ['integer', 'exists:body_zones,id'],
            'body_zones' => ['nullable', 'array'],
            'body_zones.*.id' => ['required_with:body_zones', 'integer', 'exists:body_zones,id'],
            'body_zones.*.severity' => ['nullable', 'string', 'in:mild,moderate,severe'],
            'body_zones.*.restriction' => ['nullable', 'integer', 'min:1', 'max:5'],
            'body_zones.*.discomfort' => ['nullable', 'integer', 'min:1', 'max:5'],
            'body_zones.*.comments' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
