<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All API routes are prefixed with /api in AppServiceProvider or bootstrap.
| Use /api/v1/ for versioning.
*/

Route::prefix('v1')->group(function () {
    // Public: subject auth (rate limited: 10 attempts per minute)
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('subjects/login', [App\Http\Controllers\Api\V1\SubjectAuthController::class, 'login']);
        Route::post('subjects/signup', [App\Http\Controllers\Api\V1\SubjectAuthController::class, 'signup']);
    });

    // Public: config (garments, movements, body-zones) – can be read without auth for dropdowns
    Route::get('garments', [App\Http\Controllers\Api\V1\GarmentController::class, 'index']);
    Route::get('movements', [App\Http\Controllers\Api\V1\MovementController::class, 'index']);
    Route::get('body-zones', [App\Http\Controllers\Api\V1\BodyZoneController::class, 'index']);

    // Protected: assessment flow (requires subject token)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('assessment-sessions', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'index']);
        Route::get('assessment-sessions/current', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'current']);
        Route::post('assessment-sessions', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'store']);
        Route::get('assessment-sessions/{session}', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'show']);
        Route::post('assessment-sessions/{session}/movement-responses', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'storeMovementResponse']);
        Route::delete('assessment-sessions/{session}', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'destroy']);
        Route::post('assessment-sessions/{session}/complete', [App\Http\Controllers\Api\V1\AssessmentSessionController::class, 'complete']);
    });
});
