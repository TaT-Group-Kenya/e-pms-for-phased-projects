<?php

namespace App\Http\Requests;

use App\Models\ShipContainer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShipContainerStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $type = $this->input('container_type');

        $rules = [
            'container_type' => ['required', Rule::in(ShipContainer::TYPES)],
        ];

        if (is_string($type) && in_array($type, ShipContainer::TYPES, true)) {
            $rules = array_merge($rules, $this->typeRules($type));
        }

        return array_merge($rules, $this->sharedRules(false), $this->auditRules(false));
    }

    protected function typeRules(string $type, bool $enforceRequired = true): array
    {
        $rules = [];

        foreach (ShipContainer::fieldMap($type) as $attribute => $meta) {
            if ($attribute === 'customer_id') {
                // Match the HasLogicalDeletion global scope semantics (0/false),
                // not SQL NULL, which never matches values stored with a default.
                $rules[$attribute] = [$this->required($meta, $enforceRequired), Rule::exists('customers', 'id')->where('is_deleted', false)];

                continue;
            }

            if ($attribute === 'project_owner_id') {
                $customerId = $this->input('customer_id');

                if (! is_numeric($customerId)) {
                    // Partial update changing the owner without resending the
                    // customer: validate the owner against the record's customer.
                    $customerId = $this->routeContainer()?->customer_id;
                }

                $ownerRule = Rule::exists('project_owners', 'id')->where('is_deleted', false);
                if (is_numeric($customerId)) {
                    // The client must belong to the linked customer
                    $ownerRule = $ownerRule->where('customer_id', (int) $customerId);
                }

                $rules[$attribute] = [$this->required($meta, $enforceRequired), $ownerRule];

                continue;
            }

            if ($attribute === 'status') {
                // status keeps the existing value on update when omitted
                $rules[$attribute] = ['nullable', Rule::in(ShipContainer::STATUSES)];

                continue;
            }

            if (! empty($meta['numbers'])) {
                $rules[$attribute] = [
                    $this->required($meta, $enforceRequired),
                    'array',
                    'min:1',
                    'max:500',
                ];
                $rules[$attribute.'.*'] = ['required', 'string', 'max:64', 'distinct:ignore-case'];
                $rules['quantity'] = ['prohibited'];

                continue;
            }

            if ($attribute === 'quantity') {
                // Always derived from the container numbers; not accepted directly
                $rules[$attribute] = ['prohibited'];

                continue;
            }

            if ($attribute === 'allocation' && ! empty($meta['entity'])) {
                // CFS dropdown sourced from project locations
                $rules[$attribute] = [
                    'nullable',
                    Rule::exists('project_locations', 'id')->where('is_deleted', false),
                ];

                continue;
            }

            $fieldRules = [];

            $fieldRules[] = $this->required($meta, $enforceRequired);

            switch (true) {
                case ! empty($meta['date']):
                    $fieldRules[] = 'date';
                    break;
                case ! empty($meta['datetime']):
                    $fieldRules[] = 'date';
                    break;
                case ! empty($meta['select']):
                    $fieldRules[] = Rule::in($meta['select']);
                    break;
                default:
                    $fieldRules[] = 'string';
                    if ($attribute === 'description') {
                        $fieldRules[] = 'max:2000';
                    } else {
                        $fieldRules[] = 'max:255';
                    }
            }

            $rules[$attribute] = $fieldRules;
        }

        return $rules;
    }

    private function required(array $meta, bool $enforceRequired): string
    {
        return ! empty($meta['required']) && $enforceRequired ? 'required' : 'nullable';
    }

    /**
     * The route-bound ship container, when model binding has run.
     */
    protected function routeContainer(): ?ShipContainer
    {
        $param = $this->route('ship_container');

        return $param instanceof ShipContainer ? $param : null;
    }

    protected function sharedRules(bool $isUpdate): array
    {
        return [
            'get_in' => ['nullable', 'date', 'before_or_equal:now'],
            'get_out' => ['nullable', 'date'],
            'exit_date' => ['nullable', 'date'],
            'exit_border' => ['nullable', 'string', 'max:255'],
            'exit_remarks' => ['nullable', 'string', 'max:2000'],
            'bond_extension_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ];
    }

    protected function auditRules(bool $isUpdate): array
    {
        if ($isUpdate) {
            return [];
        }

        return [
            'created_by' => ['prohibited'],
            'created_at' => ['prohibited'],
        ];
    }
}
