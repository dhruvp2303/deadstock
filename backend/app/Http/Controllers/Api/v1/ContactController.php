<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDemoRequest;
use App\Http\Traits\ApiResponse;
use App\Models\DemoRequest;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    use ApiResponse;

    public function requestDemo(StoreDemoRequest $request): JsonResponse
    {
        $lead = DemoRequest::create($request->validated());

        return $this->successResponse(
            $lead,
            'Demo request submitted successfully. Our team will contact you within 24 hours.',
            201
        );
    }
}
