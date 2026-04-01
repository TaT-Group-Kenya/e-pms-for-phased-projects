<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectsSummaryResource extends JsonResource
{
    public function toArray($request)
    {
        $creator = $this->creator;
        $createdByName = null;

        if ($creator) {
            $fullName = trim(($creator->first_name ?? '') . ' ' . ($creator->last_name ?? ''));
            if ($fullName !== '') {
                $createdByName = $fullName;
            } else {
                $createdByName = $creator->email ?? null;
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'job_reference_id' => $this->job_reference_id,
            'order_id' => $this->order_id,
            'order_title' => optional($this->order)->title,
            'customer_id' => $this->customer_id,
            'customer_name' => optional($this->customer)->name,
            'project_category_id' => $this->project_category_id,
            'project_category' => optional($this->category)->name,
            'project_source_origin_id' => $this->project_source_origin_id,
            'project_source_origin' => optional($this->sourceOrigin)->name,
            'project_location_id' => $this->project_location_id,
            'project_location' => optional($this->location)->name,
            'status' => $this->status,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'budget_estimate' => $this->budget_estimate,
            'currency' => $this->currency,
            'assigned_companies' => $this->assigned_companies ? $this->assigned_companies->map(function($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                ];
            }) : [],
            'created_at' => $this->created_at,
            'created_by_name' => $createdByName,
        ];
    }
}
