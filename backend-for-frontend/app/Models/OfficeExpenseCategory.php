<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class OfficeExpenseCategory extends Model
{
    use HasLogicalDeletion;

    protected $table = 'office_expense_categories';

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $dates = ['deleted_at'];

    public function expenses()
    {
        return $this->hasMany(OfficeExpense::class, 'category_id');
    }
}
