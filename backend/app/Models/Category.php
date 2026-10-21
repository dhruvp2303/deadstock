<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = [
        'is_active',
    ];

    protected $casts = [
        'default_decay_rate' => 'float',
    ];

    public function getIsActiveAttribute(): bool
    {
        return true;
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    public function buyerRequirements(): HasMany
    {
        return $this->hasMany(BuyerRequirement::class);
    }

    public function marketplaceListings(): HasMany
    {
        return $this->hasMany(MarketplaceListing::class, 'category', 'name');
    }
}
