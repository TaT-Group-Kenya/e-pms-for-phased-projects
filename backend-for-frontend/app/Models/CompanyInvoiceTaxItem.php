<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInvoiceTaxItem extends Model
{
    protected $table = 'company_invoice_tax_items';

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'tax_id',
        'item_name',
        'item_type',
        'item_value',
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
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }
}