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

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getItemTypeNameAttribute()
    {
        $types = [
            'vat' => 'VAT',
            'service_tax' => 'Service Tax',
            'sales_tax' => 'Sales Tax',
            'wht' => 'Withholding Tax',
        ];

        return $types[$this->item_type] ?? 'Unknown';
    }

    
    public function getItemTypes()
    {
        return [
            'vat' => 'VAT',
            'service_tax' => 'Service Tax',
            'sales_tax' => 'Sales Tax',
            'wht' => 'Withholding Tax',
        ];

    }
}