<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyInvoiceDocument extends Model
{
    protected $table = 'company_invoice_documents';

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'document_name',
        'document_path',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }
}
