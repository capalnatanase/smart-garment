<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BodyZone;
use Illuminate\Http\JsonResponse;

class BodyZoneController extends Controller
{
    public function index(): JsonResponse
    {
        $zones = BodyZone::orderBy('side')->orderBy('name')->get();

        return response()->json([
            'data' => $zones->map(fn (BodyZone $z) => [
                'id' => $z->id,
                'name' => $z->name,
                'slug' => $z->slug,
                'side' => $z->side,
            ]),
        ]);
    }
}
