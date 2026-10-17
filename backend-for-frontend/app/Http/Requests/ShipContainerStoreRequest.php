<?php

namespace App\Http\Requests;

use App\Models\ProjectLocation;
use App\Models\ShipContainer;
use App\Models\ShipContainerNumber;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShipContainerStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function validationData(): array
    {
        $data = parent::validationData();
        if (isset($data['container_numbers']) && is_array($data['container_numbers'])) {
            $data['container_numbers'] = array_map(
                fn ($number) => is_string($number) ? ['container_no' => $number] : $number,
                $data['container_numbers']
            );
        }

        return $data;
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

        $rules = array_merge($rules, $this->sharedRules(false), $this->auditRules(false));

        if ($type !== ShipContainer::TYPE_CONTAINER_EXPORT) {
            $rules['status'] = ['prohibited'];
        }

        return $rules;
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
                $rules[$attribute.'.*'] = ['required', 'array'];
                $rules[$attribute.'.*.container_no'] = ['required', 'string', 'max:64', 'distinct:ignore-case'];
                $rules[$attribute.'.*.size'] = ['nullable', 'integer', 'min:1'];
                $rules[$attribute.'.*.size_unit'] = ['nullable', Rule::in(ShipContainerNumber::SIZE_UNITS)];
                $rules[$attribute.'.*.goods_description'] = ['nullable', 'string', 'max:2000'];
                $rules[$attribute.'.*.entry_number'] = ['nullable', 'string', 'max:255'];
                $rules['quantity'] = ['prohibited'];

                continue;
            }

            if ($attribute === 'quantity') {
                // Always derived from the container numbers; not accepted directly
                $rules[$attribute] = ['prohibited'];

                continue;
            }

            if (in_array($attribute, ['allocation', 'cfs'], true) && ! empty($meta['entity'])) {
                // CFS dropdowns are sourced from project locations.
                $locationRule = Rule::exists('project_locations', 'id')->where('is_deleted', false);

                if ($attribute === 'cfs' && in_array($this->method(), ['PUT', 'PATCH'], true)) {
                    $existingCfs = $this->routeContainer()?->cfs;
                    if ($existingCfs !== null) {
                        $locationIds = ProjectLocation::query()
                            ->where('is_deleted', false)
                            ->pluck('id')
                            ->map(fn ($id) => (string) $id)
                            ->all();

                        if (! in_array((string) $existingCfs, $locationIds, true)) {
                            $locationIds[] = (string) $existingCfs;
                            $locationRule = Rule::in($locationIds);
                        }
                    }
                }

                $rules[$attribute] = [
                    'nullable',
                    $locationRule,
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

        if ($param instanceof ShipContainer) {
            return $param;
        }

        return is_numeric($param) ? ShipContainer::withDeleted()->find((int) $param) : null;
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
