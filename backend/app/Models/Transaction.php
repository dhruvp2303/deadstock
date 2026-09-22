<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'recovery_value' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function sellerCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function buyerCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'buyer_company_id');
    }

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }
}
