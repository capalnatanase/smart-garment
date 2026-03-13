<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Garment;
use Illuminate\Http\JsonResponse;

class GarmentController extends Controller
{
    public function index(): JsonResponse
    {
        $garments = Garment::with('sizes')->orderBy('name')->get();

        return response()->json([
            'data' => $garments->map(fn (Garment $g) => [
                'id' => $g->id,
                'name' => $g->name,
                'sizes' => $g->sizes->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
            ]),
        ]);
    }
}
