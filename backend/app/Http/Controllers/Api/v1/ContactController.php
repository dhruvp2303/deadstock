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

    public function submitTicket(\Illuminate\Http\Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'subject' => 'required|string|max:200',
            'category' => 'required|string|in:general,billing_refund,listing_dispute,grievance_dpdp',
            'message' => 'required|string|min:10|max:3000',
        ]);

        $ticketId = 'DS-TKT-' . date('Ym') . '-' . strtoupper(\Illuminate\Support\Str::random(6));

        \Illuminate\Support\Facades\Log::info("Support Ticket Filed [{$ticketId}]", $validated);

        return $this->successResponse([
            'ticket_id' => $ticketId,
            'status' => 'received',
            'sla_response_time' => '24 business hours',
            'contact_email' => $validated['email'],
            'category' => $validated['category'],
        ], 'Your ticket has been logged successfully. A confirmation has been dispatched.');
    }

    public function grievanceInfo(): JsonResponse
    {
        return $this->successResponse([
            'company_name' => 'DeadStock Technologies Private Limited',
            'cin' => 'U72900HR2026PTC109842',
            'corporate_office' => 'Building 10B, DLF Cyber City, Phase 2, Gurugram, Haryana 122002, India',
            'support_email' => 'support@deadstock.in',
            'billing_email' => 'billing@deadstock.in',
            'grievance_officer' => [
                'name' => 'Rohan Sharma',
                'designation' => 'Principal Grievance & DPDP Compliance Officer',
                'email' => 'grievance@deadstock.in',
                'address' => 'Legal Dept, DeadStock Technologies, Cyber City, Gurugram, India',
                'response_sla' => 'Acknowledgment within 24 hours, resolution within 15 calendar days under Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 & Digital Personal Data Protection Act, 2023.',
            ],
        ], 'Statutory compliance details retrieved successfully');
    }
}
