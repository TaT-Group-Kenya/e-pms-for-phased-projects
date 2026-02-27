<?php

namespace App\Services;

use App\Models\ProjectPhase;

class CommonService
{
    
    /**
     * Generate unique code with format {}-XXXX-XXXX (numeric)
    */
    public function generateUniqueCode($prefix = 'PRP-'): string
    {
       return $prefix . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT) . '-' . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
    }
}