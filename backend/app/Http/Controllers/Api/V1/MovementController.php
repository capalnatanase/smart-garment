<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Movement;
use Illuminate\Http\JsonResponse;

class MovementController extends Controller
{
    public function index(): JsonResponse
    {
        $movements = Movement::orderBy('order')->get();

        return response()->json([
            'data' => $movements->map(fn (Movement $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'order' => $m->order,
                'video_url' => $m->video_url,
            ]),
        ]);
    }
}
