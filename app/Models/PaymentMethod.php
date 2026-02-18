<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $table = 'payment_methods';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}