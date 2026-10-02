<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMarketplaceListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'inventory_id' => ['nullable', 'integer', 'exists:inventories,id'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'units_available' => ['required', 'integer', 'min:1'],
            'price_per_unit' => ['required', 'numeric', 'min:0.01'],
            'unit_label' => ['nullable', 'string', 'max:50'],
            'condition' => ['nullable', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
        ];
    }
}
