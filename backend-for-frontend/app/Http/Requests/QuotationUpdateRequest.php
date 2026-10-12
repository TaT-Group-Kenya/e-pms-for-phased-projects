<?php

namespace App\Http\Requests;

use App\Models\Quotation;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class QuotationUpdateRequest extends QuotationStoreRequest
{
    /**
     * The quotation's customer/consignee/container trio: changing one forces
     * all three to be re-selected, so validation re-runs the linkage rules
     * against whichever combination the request provides.
     */
    public function validationData(): array
    {
        $data = parent::validationData();

        // Linkage fields default to the stored record so trio rules always
        // validate against a complete, current set.
        //
        // IMPORTANT: the defaults are written back into the request itself so
        // `$this->input(...)` used by closure rules sees them too.
        $routeContainer = $this->route('quotation');
        if ($routeContainer && ! $routeContainer instanceof Quotation && is_numeric($routeContainer)) {
            $routeContainer = Quotation::withDeleted()->find((int) $routeContainer);
        }

        if ($routeContainer) {
            foreach (['customer_id', 'project_owner_id', 'ship_container_id'] as $key) {
                if ($this->input($key) === null || $this->input($key) === '') {
                    $this->merge([$key => $routeContainer->{$key}]);
                }
            }
            $data = parent::validationData();
        }

        return $data;
    }

    public function rules(): array
    {
        $routeValue = $this->route('quotation') ?? $this->route('id');
        $quotationId = $routeValue instanceof Quotation ? (int) $routeValue->getKey() : (is_numeric($routeValue) ? (int) $routeValue : null);

        $rules = parent::rules();

        // Container linkage: unique rule must ignore this quotation itself.
        // Illuminate\Validation\Rules\Unique is a rule OBJECT (not an instance
        // of the static Rule facade class), so check object types directly.
        $rules['ship_container_id'] = collect($rules['ship_container_id'])
            ->map(function ($rule) use ($quotationId) {
                if ($rule instanceof Unique) {
                    return Rule::unique('quotations', 'ship_container_id')
                        ->ignore($quotationId)
                        ->where(fn ($q) => $q->where('is_deleted', false));
                }

                return $rule;
            })
            ->values()
            ->all();

        // Everything else is partial on update
        foreach (['customer_id', 'project_owner_id', 'ship_container_id', 'title', 'status', 'valid_until_date', 'subtotal_amount', 'tax_amount', 'discount_percentage', 'discount_amount', 'total_amount', 'currency', 'creationDate'] as $key) {
            if (isset($rules[$key]) && is_array($rules[$key]) && ($position = array_search('required', $rules[$key])) !== false) {
                $rules[$key][$position] = 'sometimes';
            }
        }

        foreach (['bol_number', 'description', 'payment_receiving_method_id', 'payment_terms', 'min_approval_count', 'notes_to_customer'] as $key) {
            if (isset($rules[$key]) && is_array($rules[$key])) {
                $rules[$key] = array_map(fn ($r) => $r === 'prohibited' ? 'sometimes' : $r, $rules[$key]);
            }
        }

        return $rules;
    }
}
