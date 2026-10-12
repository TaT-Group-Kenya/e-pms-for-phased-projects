<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipContainerNumber extends Model
{
    protected $table = 'ship_container_numbers';

    protected $fillable = [
        'ship_container_id',
        'container_no',
        'created_by',
    ];

    /**
     * Normalise container numbers to uppercase without spaces.
     */
    public function setContainerNoAttribute($value): void
    {
        $this->attributes['container_no'] = strtoupper(trim((string) $value));
    }

    public function shipContainer()
    {
        return $this->belongsTo(ShipContainer::class, 'ship_container_id');
    }
}
