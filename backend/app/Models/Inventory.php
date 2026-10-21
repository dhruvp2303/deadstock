<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'company_id' => 'integer',
        'user_id' => 'integer',
        'category_id' => 'integer',
        'warehouse_id' => 'integer',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function categoryModel(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function warehouseModel(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
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
