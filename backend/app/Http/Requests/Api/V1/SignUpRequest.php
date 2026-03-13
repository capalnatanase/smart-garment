<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'string', 'max:255', 'regex:/^SUB-\d{4}-\d+$/', 'unique:subjects,subject_id'],
            'organisation' => ['required', 'string', 'max:255'],
            'job_role' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.regex' => 'The subject ID must be in the format SUB-YYYY-NNNNNN (e.g. SUB-2026-000041).',
        ];
    }
}
