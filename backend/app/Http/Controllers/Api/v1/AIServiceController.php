<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AIServiceController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function ask(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Query is required',
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->user()?->id;
        $companyId = $request->user()?->company_id;

        $result = $this->aiService->ask($request->query('query', $request->input('query')), $userId, $companyId);

        return response()->json($result);
    }
}
