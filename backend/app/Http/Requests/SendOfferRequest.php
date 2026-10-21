<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sku' => ['required_without:inventory_id', 'nullable', 'string', 'max:100'],
            'inventory_id' => ['required_without:sku', 'nullable', 'integer', 'exists:inventories,id'],
            'receiver_company_id' => ['nullable', 'integer', 'exists:companies,id'],
            'buyer_match_id' => ['nullable', 'integer', 'exists:buyer_matches,id'],
            'offered_quantity' => ['required', 'integer', 'min:1'],
            'offered_unit_price' => ['required', 'numeric', 'min:0.01'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
