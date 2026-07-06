<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeExpenseDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'expense_id' => $this->expense_id,
            'document_path' => $this->document_path,
            'document_url' => $this->document_url,
            'file_name' => basename($this->document_path),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'created_by_user' => $this->whenLoaded('createdByUser', function () {
                return [
                    'id' => $this->createdByUser->id,
                    'first_name' => $this->createdByUser->first_name,
                ];
            }),
            'expense' => $this->whenLoaded('expense', function () {
                return [
                    'id' => $this->expense->id,
                    'description' => $this->expense->description,
                ];
            }),
        ];
    }
}
