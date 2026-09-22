<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventory extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'quantity' => 'integer',
        'monthly_demand' => 'integer',
        'age_months' => 'integer',
        'unit_cost' => 'float',
        'current_value' => 'float',
        'selling_price' => 'float',
        'risk_score' => 'float',
        'estimated_loss' => 'float',
        'estimated_recovery' => 'float',
        'demand_forecast_history' => 'array',
        'last_sold_date' => 'date',
        'last_movement_date' => 'date',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    public function buyerMatches(): HasMany
    {
        return $this->hasMany(BuyerMatch::class);
    }

    public function marketplaceListings(): HasMany
    {
        return $this->hasMany(MarketplaceListing::class);
    }

    public function recoveryActions(): HasMany
    {
        return $this->hasMany(RecoveryAction::class);
    }
}
