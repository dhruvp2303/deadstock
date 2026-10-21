<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim((string) $this->email)),
            ]);
        }
        if ($this->has('name')) {
            $this->merge([
                'name' => strip_tags(trim((string) $this->name)),
            ]);
        }
        if ($this->has('company_name')) {
            $this->merge([
                'company_name' => strip_tags(trim((string) $this->company_name)),
            ]);
        }
        if ($this->has('industry')) {
            $this->merge([
                'industry' => strip_tags(trim((string) $this->industry)),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'string', 'email:rfc,filter', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers()],
            'company_name' => ['required', 'string', 'min:2', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]; 
    }
}
