<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecoveryAction extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'original_value' => 'decimal:2',
        'estimated_recovery' => 'decimal:2',
        'recovered_value' => 'decimal:2',
        'recovery_percentage' => 'decimal:2',
        'waste_avoided_kg' => 'decimal:2',
        'executed_at' => 'datetime',
    ];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
