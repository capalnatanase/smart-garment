<?php

namespace App\Http\Requests\Api\V1;

use App\Models\Size;
use App\Models\Subject;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssessmentSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var Subject $subject */
        $subject = $this->user();
        $orgId = $subject->organisation_id;

        return [
            'garment_id' => [
                'required',
                'integer',
                Rule::exists('garments', 'id')->where(fn ($q) => $q->where('organisation_id', $orgId)),
            ],
            'size_id' => [
                'required',
                'integer',
                Rule::exists('sizes', 'id'),
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            /** @var Subject $subject */
            $subject = $this->user();
            if (! $subject->organisation_id) {
                $validator->errors()->add('garment_id', 'Your account is not linked to an organisation with a garment catalog.');

                return;
            }

            $garmentId = (int) $this->input('garment_id');
            $sizeId = (int) $this->input('size_id');
            if (! $garmentId || ! $sizeId) {
                return;
            }

            $sizeBelongs = Size::query()
                ->where('id', $sizeId)
                ->where('garment_id', $garmentId)
                ->exists();

            if (! $sizeBelongs) {
                $validator->errors()->add('size_id', 'The selected size does not belong to the selected garment.');
            }
        });
    }
}
