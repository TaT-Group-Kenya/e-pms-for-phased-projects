<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'project_phase_id',
        'item_name',
        'item_description',
        'order_amount',
        'custom_note',
        'is_taxable',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}