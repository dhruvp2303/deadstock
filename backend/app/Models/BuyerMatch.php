<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuyerMatch extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'overall_match_score' => 'float',
        'product_compatibility' => 'float',
        'quantity_compatibility' => 'float',
        'industry_compatibility' => 'float',
        'location_compatibility' => 'float',
        'price_compatibility' => 'float',
        'potential_deal_value' => 'float',
        'compatibility_tags' => 'array',
    ];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    public function buyerCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'buyer_company_id');
    }
}
