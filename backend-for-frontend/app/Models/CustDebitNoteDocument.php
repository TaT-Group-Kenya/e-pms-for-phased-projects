<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class CustDebitNoteDocument extends Model
{
    use HasLogicalDeletion;

    protected $table = 'cust_debit_note_documents';

    protected $fillable = [
        'debit_note_id', 'document_name', 'document_path', 'created_at',
        'created_by', 'updated_at', 'updated_by', 'is_deleted', 'deleted_at',
        'deleted_by',
    ];

    public function debitNote()
    {
        return $this->belongsTo(CustDebitNote::class, 'debit_note_id');
    }
}
