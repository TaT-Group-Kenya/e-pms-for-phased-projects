<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInvoiceItem extends Model
{
    protected $table = 'company_invoice_items';

    protected $fillable = [
        'invoice_id',
        'project_phase_id',
        'item_name',
        'item_description',
        'item_amount',
        'is_taxable',
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

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }
}