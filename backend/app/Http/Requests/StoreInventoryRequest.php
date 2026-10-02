<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $companyId = $this->user()?->company_id ?: $this->input('company_id', 1);

        return [
            'sku' => ['required', 'string', 'max:100'],
            'product_name' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'category' => ['nullable', 'string', 'max:100'],
            'warehouse_id' => [
                'nullable',
                'integer',
                Rule::exists('warehouses', 'id')->where(function ($query) use ($companyId) {
                    $query->where('company_id', $companyId)->whereNull('deleted_at');
                }),
            ],
            'warehouse_location' => ['nullable', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
            'monthly_demand' => ['nullable', 'integer', 'min:0'],
            'age_months' => ['nullable', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:100'],
            'material' => ['nullable', 'string', 'max:255'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
