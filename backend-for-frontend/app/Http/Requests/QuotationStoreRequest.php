<?php

namespace App\Http\Requests;

use App\Models\ProjectOwner;
use App\Models\Quotation;
use App\Models\ShipContainer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuotationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_number' => ['nullable', 'string', 'max:255'],
            'customer_id' => ['required', Rule::exists('customers', 'id')->where('is_deleted', false)],
            'project_owner_id' => [
                'required',
                // The trio is validated against the request inputs; on update
                // QuotationUpdateRequest::validationData() injects the stored
                // linkage values for any missing members.
                function ($attribute, $value, $fail) {
                    $customer = $this->input('customer_id');

                    if (! is_numeric($customer)) {
                        $fail('A linked customer is required.');

                        return;
                    }

                    $owner = ProjectOwner::where('id', $value)
                        ->where('is_deleted', false)
                        ->where('customer_id', (int) $customer)
                        ->exists();

                    if (! $owner) {
                        $fail('The selected consignee must belong to the selected customer.');
                    }
                },
            ],
            'ship_container_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $query = Quotation::where('ship_container_id', $value)
                        ->where('is_deleted', false);
                    $routeQuotation = $this->routeQuotation();
                    if ($routeQuotation) {
                        $query->where('id', '!=', $routeQuotation->id);
                    }
                    if ($query->exists()) {
                        $fail('This ship container entry is already linked to another quotation (1 quote per container).');
                    }
                },
                function ($attribute, $value, $fail) {
                    $customer = $this->input('customer_id');
                    $owner = $this->input('project_owner_id');

                    if (! is_numeric($customer) || ! is_numeric($owner)) {
                        $fail('A linked customer and consignee are required.');

                        return;
                    }

                    $exists = ShipContainer::where('id', $value)
                        ->where('is_deleted', false)
                        ->where('customer_id', (int) $customer)
                        ->where('project_owner_id', (int) $owner)
                        ->exists();

                    if (! $exists) {
                        $fail('The selected container must belong to the selected customer and consignee.');
                    }
                },
                function ($attribute, $value, $fail) {
                    $container = ShipContainer::find($value);
                    $routeQuotation = $this->routeQuotation();

                    if ($container?->quoted && (! $routeQuotation || (int) $routeQuotation->ship_container_id !== (int) $value)) {
                        $fail('This ship container has already been quoted and cannot be assigned to another quotation.');
                    }
                },
            ],
            // Legacy free-text removed: bol_number is derived from the linked
            // ship container entry (kept for orders/invoices that read the column).
            'bol_number' => ['prohibited'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'sent', 'approved', 'rejected', 'revised'])],
            'valid_until_date' => ['required', 'date'],
            'clearance_deadline' => ['nullable', 'date'],
            'subtotal_amount' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'discount_percentage' => ['required', 'numeric', 'min:0'],
            'discount_amount' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:255'],
            'payment_receiving_method_id' => ['nullable', 'integer', 'exists:payment_receiving_methods,id'],
            'payment_terms' => ['nullable', 'string', 'max:255'],
            'min_approval_count' => ['nullable', 'numeric', 'min:1'],
            'notes_to_customer' => ['nullable', 'string', 'max:255'],
            'creationDate' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'ship_container_id.required' => 'A ship container entry is required for the quotation.',
            'ship_container_id.unique' => 'This ship container entry is already linked to another quotation (1 quote per container).',
            'ship_container_id.exists' => 'The selected container must belong to the selected customer and consignee.',
            'project_owner_id.required' => 'A consignee (client) is required.',
            'project_owner_id.exists' => 'The selected consignee must belong to the selected customer.',
        ];
    }

    private function routeQuotation(): ?Quotation
    {
        $routeQuotation = $this->route('quotation');
        if ($routeQuotation instanceof Quotation) {
            return $routeQuotation;
        }
        if (is_numeric($routeQuotation)) {
            return Quotation::withDeleted()->find((int) $routeQuotation);
        }

        return null;
    }
}
