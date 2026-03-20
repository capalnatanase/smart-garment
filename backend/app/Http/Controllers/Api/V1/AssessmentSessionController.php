<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CompleteAssessmentRequest;
use App\Http\Requests\Api\V1\StoreAssessmentSessionRequest;
use App\Http\Requests\Api\V1\StoreMovementResponseRequest;
use App\Models\AssessmentSession;
use App\Models\MovementResponse;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentSessionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        $sessions = $subject->assessmentSessions()
            ->with(['garment', 'size', 'movementResponses'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $sessions->map(fn (AssessmentSession $s) => $this->formatSession($s)),
        ]);
    }

    public function current(Request $request): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        $session = $subject->assessmentSessions()
            ->with(['garment', 'size', 'movementResponses.movement', 'movementResponses.bodyZones'])
            ->whereNull('completed_at')
            ->latest()
            ->first();

        if (! $session) {
            return response()->json(['data' => null]);
        }

        return response()->json([
            'data' => $this->formatSession($session),
        ]);
    }

    public function store(StoreAssessmentSessionRequest $request): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        $session = $subject->assessmentSessions()->create([
            'garment_id' => $request->validated('garment_id'),
            'size_id' => $request->validated('size_id'),
            'started_at' => now(),
        ]);

        $session->load(['garment', 'size']);

        return response()->json([
            'data' => $this->formatSession($session),
        ], 201);
    }

    public function show(Request $request, AssessmentSession $session): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        if ($session->subject_id !== $subject->id) {
            abort(403);
        }

        $session->load(['garment', 'size', 'movementResponses.movement', 'movementResponses.bodyZones' => fn ($q) => $q->withPivot('severity', 'restriction', 'discomfort', 'comments')]);

        return response()->json([
            'data' => $this->formatSession($session),
        ]);
    }

    public function storeMovementResponse(StoreMovementResponseRequest $request, AssessmentSession $session): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        if ($session->subject_id !== $subject->id) {
            abort(403);
        }

        if ($session->completed_at) {
            return response()->json(['message' => 'Session already completed.'], 422);
        }

        $movementId = $request->validated('movement_id');
        $noIssues = $request->boolean('no_issues', false);
        $bodyZoneIds = $request->validated('body_zone_ids', []);
        $bodyZones = $request->validated('body_zones', []);

        $response = MovementResponse::updateOrCreate(
            [
                'assessment_session_id' => $session->id,
                'movement_id' => $movementId,
            ],
            ['no_issues' => $noIssues]
        );

        if (! $noIssues) {
            if (! empty($bodyZones)) {
                $sync = [];
                foreach ($bodyZones as $item) {
                    $sync[$item['id']] = [
                        'severity' => $item['severity'] ?? null,
                        'restriction' => isset($item['restriction']) ? (int) $item['restriction'] : null,
                        'discomfort' => isset($item['discomfort']) ? (int) $item['discomfort'] : null,
                        'comments' => $item['comments'] ?? null,
                    ];
                }
                $response->bodyZones()->sync($sync);
            } elseif (! empty($bodyZoneIds)) {
                $response->bodyZones()->sync(
                    array_fill_keys($bodyZoneIds, ['severity' => null, 'restriction' => null, 'discomfort' => null, 'comments' => null])
                );
            } else {
                $response->bodyZones()->detach();
            }
        } else {
            $response->bodyZones()->detach();
        }

        return response()->json([
            'data' => [
                'movement_response_id' => $response->id,
                'movement_id' => $response->movement_id,
                'no_issues' => $response->no_issues,
            ],
        ], 201);
    }

    public function destroy(Request $request, AssessmentSession $session): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        if ($session->subject_id !== $subject->id) {
            abort(403);
        }

        $session->delete();

        return response()->json(['message' => 'Session deleted.']);
    }

    public function complete(CompleteAssessmentRequest $request, AssessmentSession $session): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        if ($session->subject_id !== $subject->id) {
            abort(403);
        }

        $feedback = $request->validated('feedback');
        $update = ['completed_at' => now()];
        if ($feedback !== null) {
            $update['feedback'] = $feedback;
        }
        $session->update($update);

        return response()->json([
            'data' => $this->formatSession($session->fresh(['garment', 'size'])),
        ]);
    }

    private function formatSession(AssessmentSession $session): array
    {
        $data = [
            'id' => $session->id,
            'garment_id' => $session->garment_id,
            'size_id' => $session->size_id,
            'garment' => $session->garment ? ['id' => $session->garment->id, 'name' => $session->garment->name] : null,
            'size' => $session->size ? ['id' => $session->size->id, 'name' => $session->size->name] : null,
            'started_at' => $session->started_at?->toIso8601String(),
            'completed_at' => $session->completed_at?->toIso8601String(),
            'feedback' => $session->feedback,
        ];

        if ($session->relationLoaded('movementResponses')) {
            $data['movement_responses'] = $session->movementResponses->map(fn (MovementResponse $r) => [
                'id' => $r->id,
                'movement_id' => $r->movement_id,
                'movement' => $r->movement ? ['id' => $r->movement->id, 'name' => $r->movement->name] : null,
                'no_issues' => $r->no_issues,
                'body_zone_ids' => $r->relationLoaded('bodyZones') ? $r->bodyZones->pluck('id')->all() : [],
                'body_zones' => $r->relationLoaded('bodyZones') ? $r->bodyZones->map(fn ($z) => [
                    'id' => $z->id,
                    'name' => $z->name,
                    'slug' => $z->slug,
                    'side' => $z->side,
                    'severity' => $z->pivot->severity ?? null,
                    'restriction' => $z->pivot->restriction ?? null,
                    'discomfort' => $z->pivot->discomfort ?? null,
                    'comments' => $z->pivot->comments ?? null,
                ])->all() : [],
            ]);
        }

        return $data;
    }
}
