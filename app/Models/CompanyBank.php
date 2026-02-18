<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyBank extends Model
{
    protected $table = 'company_banks';

    protected $fillable = [
        'company_id',
        'type',
        'account_no',
        'swiftcode',
        'branch',
        'account_holder_name',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
    public function company():BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}