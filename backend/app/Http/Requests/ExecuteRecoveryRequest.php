<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExecuteRecoveryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sku' => ['required_without:inventory_id', 'string'],
            'inventory_id' => ['required_without:sku', 'integer', 'exists:inventories,id'],
            'action_type' => ['required', 'string', 'in:sell,transfer,return,recycle,discount,b2b_sale'],
            'quantity' => ['required', 'integer', 'min:1'],
            'deal_amount' => ['required', 'numeric', 'min:0'],
            'buyer_company_id' => ['nullable', 'integer', 'exists:companies,id'],
            'channel_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
