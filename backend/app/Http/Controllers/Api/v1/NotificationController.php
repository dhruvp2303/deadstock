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
        $companyId = $request->user()?->company_id ?: 1;

        $notifications = Notification::where('company_id', $companyId)
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($notifications, 'Notifications retrieved successfully');
    }

    public function markAsRead(int $id, Request $request): JsonResponse
    {
        $companyId = $request->user()?->company_id ?: 1;
        $notification = Notification::where('id', $id)
            ->where(function ($q) use ($companyId) {
                $q->where('company_id', $companyId)->orWhereNull('company_id');
            })
            ->first();

        if ($notification) {
            $notification->update(['is_read' => true]);
            return $this->successResponse($notification, 'Notification marked as read');
        }

        return $this->errorResponse('Notification not found', null, 404);
    }
}
