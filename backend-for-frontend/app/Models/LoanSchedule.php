<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanSchedule extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_PARTIAL = 'partial';
    public const STATUS_OVERDUE = 'overdue';
    public const STATUS_WAIVED = 'waived';

    protected $table = 'loan_schedules';

    public $timestamps = false;

    protected $fillable = [
        'loan_id',
        'installment_number',
        'due_date',
        'expected_principal',
        'expected_interest',
        'status',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'expected_principal' => 'float',
        'expected_interest' => 'float',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class, 'loan_id');
    }

    public function repayments()
    {
        return $this->hasMany(LoanRepayment::class, 'schedule_installment_id');
    }
}