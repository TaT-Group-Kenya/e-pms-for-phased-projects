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
            'job_reference_id' => $this->job_reference_id,
            'description' => $this->description,
            'order_id' => $this->order_id,
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

            'quotation' => $this->when(
                $this->relationLoaded('order') && $this->order && $this->order->relationLoaded('quotation'),
                function () {
                    return new QuotationResource($this->order->quotation);
                }
            ),

            'customer_invoices' => CustInvoiceResource::collection($this->whenLoaded('customer_invoices')),
            
            'company_invoices' => CompanyInvoiceResource::collection($this->whenLoaded('company_invoices')),
            
            'in_coming_payments' => CustPaymentResource::collection(collect($this->in_coming_payments ?? [])),

            'out_going_payments' => CompanyPaymentResource::collection(collect($this->out_going_payments ?? [])),

            'created_by_user' => new UserResource($this->whenLoaded('creator')),

            'project_owner' => new ProjectOwnerResource($this->whenLoaded('projectOwner')),

        ];
    }
}
