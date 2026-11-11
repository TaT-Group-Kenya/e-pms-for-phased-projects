<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lender extends Model
{
    use HasLogicalDeletion;

    protected $table = 'lenders';

    protected $fillable = [
        'name',
        'address',
        'email',
        'phone',
        'kra_pin',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'lender_id');
    }
}
