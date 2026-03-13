<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class CompleteAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'feedback' => ['nullable', 'array'],
            'feedback.fit_yes_no' => ['nullable', 'boolean'],
            'feedback.re_adjust_yes_no' => ['nullable', 'boolean'],
            'feedback.ease_don' => ['nullable', 'string', 'in:very_easy,easy,difficult,very_difficult'],
            'feedback.ease_adjust' => ['nullable', 'string', 'in:very_easy,easy,difficult,very_difficult'],
            'feedback.comfort' => ['nullable', 'string', 'in:very_comfortable,comfortable,uncomfortable,very_uncomfortable'],
            'feedback.experience_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
        ];
    }
}
