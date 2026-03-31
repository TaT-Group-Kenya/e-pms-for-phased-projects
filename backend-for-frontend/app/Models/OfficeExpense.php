<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;


class OfficeExpense extends Model
{
    use HasLogicalDeletion;
    protected $table = 'office_expenses';

    protected $fillable = [
        'category_id',
        'cost_center_id',
        'description',
        'amount',
        'currency',
        'date',
        'status',
        'created_by',
        'updated_by',
    ];

    protected static function booted()
    {
        static::creating(function ($expense) {
            if (empty($expense->currency)) {
                $expense->currency = 'KES';
            }
            if (empty($expense->status)) {
                $expense->status = 'pending';
            }
        });
    }

    public function getStatusAttribute($value)
    {
        return $value;
    }

    protected $dates = ['deleted_at'];

    public function category()
    {
        return $this->belongsTo(OfficeExpenseCategory::class, 'category_id');
    }

    public function costCenter()
    {
        return $this->belongsTo(Department::class, 'cost_center_id');
    }
    
    public function payments()
    {
        // Payments are stored in office_expense_payments with an expense_id foreign key
        return $this->hasMany(OfficeExpensePayment::class, 'expense_id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
