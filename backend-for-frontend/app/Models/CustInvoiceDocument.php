<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustInvoiceDocument extends Model
{
    protected $table = 'cust_invoice_documents';

    protected $fillable = [
        'invoice_id',
        'document_path',
        'document_type',
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
}