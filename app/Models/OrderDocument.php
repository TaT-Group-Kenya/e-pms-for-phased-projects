<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDocument extends Model
{
    protected $table = 'order_documents';

    protected $fillable = [
        'order_id',
        'document_path',
        'document_type',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
    
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getDocumentUrlAttribute()
    {
        return asset('storage/' . $this->document_path);
    }
}