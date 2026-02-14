<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderTaxItems extends Model
{
    protected $table = 'order_tax_items';

    protected $fillable = [
        'order_id',
        'item_name',
        'item_type',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}