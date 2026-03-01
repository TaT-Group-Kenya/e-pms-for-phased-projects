<?php

namespace App\Http\Resources;

class ProjectResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'customer_id' => $this->customer_id,
            'project_category_id' => $this->project_category_id,
            'project_source_origin_id' => $this->project_source_origin_id,
            'project_location_id' => $this->project_location_id,
            'no_of_phases' => $this->no_of_phases,
            'start_date' => $this->formatTimestamp($this->start_date),
            'end_date' => $this->formatTimestamp($this->end_date),
            'budget_estimate' => $this->budget_estimate,
            'status' => $this->status,
            'priority' => $this->priority,
            'progress' => $this->progress,
            'tags' => $this->tags,
            'currency' => $this->currency,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            'category' => new ProjectCategoryResource($this->whenLoaded('category')),

            'source_origin' => new ProjectSourceOriginResource($this->whenLoaded('sourceOrigin')),

            'location' => new ProjectLocationResource($this->whenLoaded('location')),

            'phases' => ProjectPhaseResource::collection($this->whenLoaded('phases')),

            'order' => new OrderResource($this->whenLoaded('order')),

            'quotation' => new QuotationResource($this->whenLoaded('quotation')),

            'customer_invoices' => CustInvoiceResource::collection($this->whenLoaded('customer_invoices')),
            
            'company_invoices' => CompanyInvoiceResource::collection($this->whenLoaded('company_invoices')),
            
            'in_coming_payments' => CustPaymentResource::collection(collect($this->in_coming_payments ?? [])),

            'out_going_payments' => CompanyPaymentResource::collection(collect($this->out_going_payments ?? [])),

        ];
    }
}
