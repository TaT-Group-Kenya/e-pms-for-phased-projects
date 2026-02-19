<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustInvoiceItem extends Model
{
    protected $table = 'cust_invoice_items';

    protected $fillable = [
        'invoice_id',
        'project_phase_id',
        'item_name',
        'item_description',
        'item_amount',
        'is_taxable',
        'custom_note',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }
}