<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class MarginPerProjectResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'project_id' => $this['project_id'],
            'project_name' => $this['project_name'],
            'revenue_kes' => $this['revenue_kes'],
            'cost_kes' => $this['cost_kes'],
            'margin_kes' => $this['margin_kes'],
            'forex_to_kes' => $this['forex_to_kes'],
        ];
    }
}
