<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class OfficeExpenseDocument extends Model
{
    use HasLogicalDeletion;
    protected $table = 'office_expense_documents';

    protected $fillable = [
        'expense_id',
        'document_path',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];
    
    public function expense()
    {
        return $this->belongsTo(OfficeExpense::class, 'expense_id');
    }

    public function getDocumentUrlAttribute()
    {
        return asset('storage/' . $this->document_path);
    }
}
