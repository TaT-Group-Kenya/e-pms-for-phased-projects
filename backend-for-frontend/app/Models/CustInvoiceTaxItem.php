<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustInvoiceTaxItem extends Model
{
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