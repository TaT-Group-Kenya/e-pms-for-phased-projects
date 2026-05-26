<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class PdcIssuedCompany extends Model
{
    use HasLogicalDeletion;

    protected $table = 'pdc_issued_companies';

    public $timestamps = false;

    protected $fillable = [
        'transaction_number',
        'company_id',
        'invoice_id',
        'forex_rate',
        'cheque_number',
        'cheque_date',
        'issued_date',
        'amount',
        'currency',
        'bank',
        'bank_branch',
        'bank_account_id',
        'status',
        'narration',
        'related_transaction_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function invoice()
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }

    public function bankAccount()
    {
        return $this->belongsTo(Account::class, 'bank_account_id');
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
