<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\SignUpRequest;
use App\Models\Organisation;
use App\Models\Subject;
use App\Services\OrganisationDefaultCatalog;
use Illuminate\Http\JsonResponse;

class SubjectAuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $subject = Subject::firstOrCreate(
            ['subject_id' => $request->validated('subject_id')],
            ['organisation' => null, 'job_role' => null]
        );

        $this->syncOrganisationFromSubject($subject);

        $token = $subject->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'subject' => [
                'id' => $subject->id,
                'subject_id' => $subject->subject_id,
                'organisation' => $subject->organisation,
                'job_role' => $subject->job_role,
            ],
        ]);
    }

    public function signup(SignUpRequest $request): JsonResponse
    {
        $data = $request->validated();
        $orgName = trim($data['organisation']);

        $organisation = Organisation::firstOrCreate(['name' => $orgName]);
        OrganisationDefaultCatalog::ensure($organisation);

        $subject = Subject::create([
            'subject_id' => $data['subject_id'],
            'organisation' => $orgName,
            'organisation_id' => $organisation->id,
            'job_role' => $data['job_role'] ?? null,
        ]);

        $token = $subject->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'subject' => [
                'id' => $subject->id,
                'subject_id' => $subject->subject_id,
                'organisation' => $subject->organisation,
                'job_role' => $subject->job_role,
            ],
        ], 201);
    }

    /**
     * Link legacy subjects (organisation string only) to an organisation row and default catalog.
     */
    private function syncOrganisationFromSubject(Subject $subject): void
    {
        $name = $subject->organisation;
        if ($name === null || $name === '') {
            return;
        }

        $name = trim($name);
        $organisation = Organisation::firstOrCreate(['name' => $name]);
        OrganisationDefaultCatalog::ensure($organisation);

        if ($subject->organisation_id !== $organisation->id) {
            $subject->forceFill([
                'organisation_id' => $organisation->id,
                'organisation' => $name,
            ])->save();
        }
    }
}
