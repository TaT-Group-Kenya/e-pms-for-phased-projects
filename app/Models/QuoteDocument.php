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
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}