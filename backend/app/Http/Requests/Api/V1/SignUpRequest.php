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
            'subject_id' => ['required', 'string', 'max:255', 'unique:subjects,subject_id'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'job_role' => ['required', 'string', 'max:255'],
        ];
    }
}
