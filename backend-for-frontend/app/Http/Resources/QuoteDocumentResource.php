<?php

namespace App\Http\Resources;

class QuoteDocumentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quotation_id' => $this->quotation_id,
            'document_path' => $this->document_path,
            'document_type' => $this->document_type,
            'attachments' => $this->attachments,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'quotation' => new QuotationResource($this->whenLoaded('quotation')),

        ];
    }
}
