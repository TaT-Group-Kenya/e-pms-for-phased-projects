<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaxTransaction extends Model
{
    use HasLogicalDeletion;

    // dr = liability/receivable opened (full tax at document creation)
    // cr = movement against it (collection, settlement, adjustment)
    public const SIDE_DR = 'dr';
    public const SIDE_CR = 'cr';

    protected $fillable = [
        'transaction_number',
        'tax_id',
        'side',
        'direction',
        'chart_of_account',
        'amount',
        'transaction_currency',
        'exchange_rate',
        'converted_amount',
        'transaction_date',
        'posted_date',
        'customer_id',
        'company_id',
        'source_type',
        'source_id',
        'payment_id',
        'narration',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    public function chartOfAccount(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
    }
}
