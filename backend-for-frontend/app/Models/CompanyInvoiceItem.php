<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInvoiceItem extends Model
{
    protected $table = 'company_invoice_items';

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'item_name',
        'item_description',
        'quantity',
        'unit_price',
        'total_price',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }
}