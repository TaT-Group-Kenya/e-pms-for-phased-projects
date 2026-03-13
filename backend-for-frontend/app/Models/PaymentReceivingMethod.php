<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class PaymentReceivingMethod extends Model
{
    use HasLogicalDeletion;

    protected $table = 'payment_receiving_methods';

    protected $fillable = [
        'type',
        'name',
        'currency',
        'instruction',
        'paybill',
        'account_holder_name',
        'account_number',
        'bank',
        'branch',
        'swift_code',
        'iban',
        'status',
        'created_by',
        'updated_by',
        'deleted_by',
        'is_deleted',
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'is_deleted' => 'boolean',
    ];

       public function custInvoices()
    {
        return $this->hasMany(\App\Models\CustInvoice::class, 'payment_receiving_method_id');
    }
}
