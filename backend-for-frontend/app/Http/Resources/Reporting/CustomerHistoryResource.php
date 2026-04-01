<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerHistoryResource extends JsonResource
{
    public function toArray($request)
    {
        $project = $this;
        $customer = $this->customer;

        $createdByName = null;
        if ($customer && $customer->creator) {
            $creator = $customer->creator;
            $fullName = trim(($creator->first_name ?? '') . ' ' . ($creator->last_name ?? ''));
            if ($fullName !== '') {
                $createdByName = $fullName;
            } else {
                $createdByName = $creator->email ?? null;
            }
        }

        return [
            'project_id' => $project->id,
            'created_at' => $project->created_at,
            'job_reference_id' => $project->job_reference_id,
            'customer_id' => $customer ? $customer->id : null,
            'customer_name' => $customer ? $customer->name : null,
            'title' => $project->name,
            'project_category' => optional($project->category)->name,
            'project_source_origin' => optional($project->sourceOrigin)->name,
            'project_location' => optional($project->location)->name,
            'currency' => $project->currency,
            'amount' => $project->budget_estimate,
            'created_by_name' => $createdByName,
        ];
    }
}
