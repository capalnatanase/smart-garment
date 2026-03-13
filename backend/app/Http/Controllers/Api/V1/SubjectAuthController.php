<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\SignUpRequest;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;

class SubjectAuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $subject = Subject::firstOrCreate(
            ['subject_id' => $request->validated('subject_id')],
            ['organisation' => null, 'job_role' => null]
        );

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
        $subject = Subject::create($request->validated());

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
}
