<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Garment;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GarmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var Subject $subject */
        $subject = $request->user();

        if (! $subject->organisation_id) {
            return response()->json(['data' => []]);
        }

        $garments = Garment::query()
            ->with('sizes')
            ->where('organisation_id', $subject->organisation_id)
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $garments->map(fn (Garment $g) => [
                'id' => $g->id,
                'name' => $g->name,
                'sizes' => $g->sizes->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
            ]),
        ]);
    }
}
