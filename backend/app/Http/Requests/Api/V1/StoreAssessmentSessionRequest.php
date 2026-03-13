<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssessmentSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'garment_id' => ['required', 'integer', 'exists:garments,id'],
            'size_id' => ['required', 'integer', 'exists:sizes,id'],
        ];
    }
}
