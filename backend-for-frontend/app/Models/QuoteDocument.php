<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteDocument extends Model
{
    protected $table = 'quote_documents';

    protected $fillable = [
        'quotation_id',
        'document_path',
        'document_type',
        'attachments',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

    public function getDocumentUrlAttribute()
    {
        return asset('storage/' . $this->document_path);
    }

    public function getDocumentTypeNameAttribute()
    {
        $types = [
            'proposal' => 'Proposal',
            'specification' => 'Specification',
            'contract' => 'Contract',
        ];

        return $types[$this->document_type] ?? 'Unknown';
    }
}