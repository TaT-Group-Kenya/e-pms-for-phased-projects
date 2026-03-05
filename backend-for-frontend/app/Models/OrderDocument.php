<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class OrderDocument extends Model
{
    use HasLogicalDeletion;
    protected $table = 'order_documents';

    protected $fillable = [
        'order_id',
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
    
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getDocumentUrlAttribute()
    {
        return asset('storage/' . $this->document_path);
    }
}