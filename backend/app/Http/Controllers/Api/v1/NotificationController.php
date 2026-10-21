<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $notifications = Notification::where('company_id', $user->company_id)
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            })
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return $this->successResponse($notifications, 'Notifications retrieved successfully');
    }

    public function markAsRead(int $id, Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || !$user->company_id) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $notification = Notification::where('id', $id)
            ->where('company_id', $user->company_id)
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            })
            ->first();

        if ($notification) {
            $notification->update(['is_read' => true]);
            return $this->successResponse($notification, 'Notification marked as read');
        }

        return $this->errorResponse('Notification not found', null, 404);
    }
}
