<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteApproval extends Model
{
    protected $table = 'quote_approval';

    protected $fillable = [
        'user_id',
        'quote_id',
        'action',
    ];
}