<?php

namespace App\Http\Resources;

class CompanyInvoiceDocumentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'document_name' => $this->document_name,
            'document_path' => $this->document_path,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

        ];
    }
}
