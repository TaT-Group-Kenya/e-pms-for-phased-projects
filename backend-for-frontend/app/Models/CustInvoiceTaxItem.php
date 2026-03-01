<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustInvoiceTaxItem extends Model
{
    use HasLogicalDeletion;
    protected $table = 'cust_invoice_tax_items';

    protected $fillable = [
        'invoice_id',
        'tax_id',
        'item_name',
        'item_type',
        'item_value',
        'item_amount',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }
}