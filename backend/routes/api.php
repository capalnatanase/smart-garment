<?php

use App\Http\Controllers\Api\V1\AssessmentSessionController;
use App\Http\Controllers\Api\V1\BodyZoneController;
use App\Http\Controllers\Api\V1\GarmentController;
use App\Http\Controllers\Api\V1\MovementController;
use App\Http\Controllers\Api\V1\SubjectAuthController;
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
        Route::post('subjects/login', [SubjectAuthController::class, 'login']);
        Route::post('subjects/signup', [SubjectAuthController::class, 'signup']);
    });

    // Public: config (movements, body-zones) – can be read without auth for dropdowns
    Route::get('movements', [MovementController::class, 'index']);
    Route::get('body-zones', [BodyZoneController::class, 'index']);

    // Protected: assessment flow (requires subject token)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('garments', [GarmentController::class, 'index']);
        Route::get('assessment-sessions', [AssessmentSessionController::class, 'index']);
        Route::get('assessment-sessions/current', [AssessmentSessionController::class, 'current']);
        Route::post('assessment-sessions', [AssessmentSessionController::class, 'store']);
        Route::get('assessment-sessions/{session}', [AssessmentSessionController::class, 'show']);
        Route::post('assessment-sessions/{session}/movement-responses', [AssessmentSessionController::class, 'storeMovementResponse']);
        Route::delete('assessment-sessions/{session}', [AssessmentSessionController::class, 'destroy']);
        Route::post('assessment-sessions/{session}/complete', [AssessmentSessionController::class, 'complete']);
    });
});
