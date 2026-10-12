<?php

namespace App\Http\Requests;

use App\Models\ShipContainer;

class ShipContainerUpdateRequest extends ShipContainerStoreRequest
{
    /**
     * The type never changes after creation. Resolve the stored record's type
     * from the route parameter (model binding may not have run at validation
     * time, so handle both model and raw id) and use it to build the rules.
     */
    private function routeContainerType(): ?string
    {
        $routeContainer = $this->route('ship_container');

        if ($routeContainer instanceof ShipContainer) {
            return $routeContainer->container_type;
        }

        if (is_numeric($routeContainer)) {
            return ShipContainer::withDeleted()->find((int) $routeContainer)?->container_type;
        }

        return null;
    }

    public function validationData(): array
    {
        $data = parent::validationData();
        unset($data['container_type']);

        $type = $this->routeContainerType();
        if ($type !== null) {
            $data['container_type'] = $type;
        }

        return $data;
    }

    public function rules(): array
    {
        $type = $this->routeContainerType();

        $rules = [];

        if (is_string($type) && in_array($type, ShipContainer::TYPES, true)) {
            $rules = $this->typeRules($type, false);
        }

        return array_merge($rules, $this->sharedRules(true));
    }
}
