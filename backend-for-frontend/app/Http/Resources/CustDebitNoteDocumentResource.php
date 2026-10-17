<?php

namespace App\Http\Resources;

class CustDebitNoteDocumentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'debit_note_id' => $this->debit_note_id,
            'document_name' => $this->document_name,
            'document_path' => $this->document_path,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
        ];
    }
}
