<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\DemoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function requestDemo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'work_email' => 'required|email|max:255',
            'industry' => 'nullable|string|max:255',
            'inventory_size' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $lead = DemoRequest::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Demo request submitted successfully. Our team will contact you within 24 hours.',
            'data' => $lead,
        ], 201);
    }
}
