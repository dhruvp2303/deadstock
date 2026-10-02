<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.sku' => ['nullable', 'string', 'max:100'],
            'rows.*.product_name' => ['nullable', 'string', 'max:255'],
            'rows.*.category' => ['nullable', 'string', 'max:255'],
            'rows.*.quantity' => ['nullable', 'numeric'],
            'rows.*.unit_cost' => ['nullable', 'numeric'],
            'rows.*.warehouse_location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
