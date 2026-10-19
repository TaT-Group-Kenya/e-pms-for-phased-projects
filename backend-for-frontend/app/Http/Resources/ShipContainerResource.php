<?php

namespace App\Http\Resources;

use App\Models\ShipContainer;
use Carbon\CarbonInterface;

class ShipContainerResource extends BaseResource
{
    public function toArray($request): array
    {
        /** @var ShipContainer $container */
        $container = $this->resource;

        $fieldMap = $container->typeFieldMap();

        $typeFields = collect($fieldMap)
            ->map(function ($meta, $attribute) use ($container) {
                if ($attribute === 'container_numbers') {
                    return [
                        'attribute' => $attribute,
                        'label' => $meta['label'],
                        'value' => $container->numbers->map(fn ($number) => [
                            'container_no' => $number->container_no,
                            'size' => $number->size,
                            'size_unit' => $number->size_unit,
                            'goods_description' => $number->goods_description,
                            'entry_number' => $number->entry_number,
                        ])->all(),
                        'required' => (bool) ($meta['required'] ?? false),
                        'type' => 'numbers',
                        'options' => null,
                        'entity' => null,
                    ];
                }

                $value = match ($attribute) {
                    'project_owner_id' => $container->projectOwner?->name ?? $container->project_owner_id,
                    'customer_id' => $container->customer?->name ?? $container->customer_id,
                    'allocation' => $container->allocationLocation?->name ?? $container->allocation,
                    'cfs' => $container->cfsLocation?->name ?? $container->cfs,
                    default => $container->{$attribute},
                };

                if ($value instanceof CarbonInterface) {
                    if (! empty($meta['datetime'])) {
                        $value = $value->format(\DateTime::ATOM);
                    } else {
                        $value = $value->format('Y-m-d');
                    }
                }

                return [
                    'attribute' => $attribute,
                    'label' => $meta['label'],
                    'value' => $value,
                    'required' => (bool) ($meta['required'] ?? false),
                    'type' => ! empty($meta['date']) ? 'date' : (! empty($meta['datetime']) ? 'datetime' : (! empty($meta['select']) ? 'select' : (! empty($meta['entity']) ? 'entity' : 'text'))),
                    'options' => $meta['select'] ?? null,
                    'entity' => $meta['entity'] ?? null,
                ];
            })
            ->values()
            ->all();

        return [
            'id' => $this->id,
            'reference_number' => $this->reference_number,
            'container_type' => $this->container_type,
            // shared identification / movement
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', new CustomerResource($this->customer)),
            'project_owner_id' => $this->project_owner_id,
            'project_owner' => $this->whenLoaded('projectOwner', new ProjectOwnerResource($this->projectOwner)),
            'client_name' => $this->projectOwner?->name,
            'quoted' => (bool) $this->quoted,
            'quotation' => $this->when(
                $this->relationLoaded('quotation') && $this->quotation,
                fn () => [
                    'id' => $this->quotation->id,
                    'quotation_number' => $this->quotation->quotation_number,
                    'title' => $this->quotation->title,
                    'status' => $this->quotation->status,
                    'total_amount' => (float) $this->quotation->total_amount,
                    'currency' => $this->quotation->currency,
                    'created_at' => $this->formatTimestamp($this->quotation->created_at),
                ]
            ),
            'container_numbers' => $this->numbers->pluck('container_no')->all(),
            'container_number_details' => $this->numbers->map(fn ($number) => [
                'id' => $number->id,
                'container_no' => $number->container_no,
                'size' => $number->size,
                'size_unit' => $number->size_unit,
                'goods_description' => $number->goods_description,
                'entry_number' => $number->entry_number,
            ])->all(),
            'eta' => $this->formatTimestamp($this->eta),
            'etd' => $this->formatTimestamp($this->etd),
            'port_in' => $this->port_in,
            'port_out' => $this->port_out,
            'get_in' => $this->formatTimestamp($this->get_in),
            'get_out' => $this->formatTimestamp($this->get_out),
            'container_identifier' => $container->containerIdentifier(),
            'description' => $this->description,
            'quantity' => $this->quantity !== null ? (float) $this->quantity : null,
            'bl_no' => $this->bl_no,
            'bol_no' => $this->bol_no,
            'shipping_line' => $this->shipping_line,
            'shipping_agent' => $this->shipping_agent,
            'vessel' => $this->vessel,
            // clearance / status
            'entry_status' => $this->entry_status,
            'tr10_entry_status' => $this->tr10_entry_status,
            'tr12_entry_status' => $this->tr12_entry_status,
            'entry_number' => $this->entry_number,
            'booking_no' => $this->booking_no,
            'do_status' => $this->do_status,
            'allocation' => $this->allocation,
            'allocation_location' => $this->whenLoaded('allocationLocation', new ProjectLocationResource($this->allocationLocation)),
            'guarantee_status' => $this->guarantee_status,
            'gt_expiry_date' => $this->formatTimestamp($this->gt_expiry_date),
            'empty_status' => $this->empty_status,
            'person_incharge' => $this->person_incharge,
            ...($container->container_type === ShipContainer::TYPE_CONTAINER_EXPORT ? ['status' => $this->status] : []),
            // transit tracking
            'last_free_day' => $this->formatTimestamp($this->last_free_day),
            'cfs' => $this->cfs,
            'cfs_location' => $this->whenLoaded('cfsLocation', new ProjectLocationResource($this->cfsLocation)),
            'destination' => $this->destination,
            'gt_expiration_date' => $this->formatTimestamp($this->gt_expiration_date),
            'exit_date' => $this->formatTimestamp($this->exit_date),
            'exit_border' => $this->exit_border,
            'exit_remarks' => $this->exit_remarks,
            'bond_extension_days' => $this->bond_extension_days,
            // exports / location columns
            'location' => $this->location,
            'goods_description' => $this->goods_description,
            'coe' => $this->coe,
            // loose unit columns
            'chassis_no' => $this->chassis_no,
            'registration_no' => $this->registration_no,
            'station' => $this->station,
            'remarks' => $this->remarks,
            // computed transit deadline info
            'transit' => $container->transitStartDate() !== null ? [
                'exit_days' => $container->transitExitDays(),
                'notify_day' => $container->transitNotifyDay(),
                'start_date' => $this->formatTimestamp($container->transitStartDate()),
                'deadline' => $this->formatTimestamp($container->transitExitDeadline()),
                'day_number' => $container->transitDayNumber(),
                'days_remaining' => $container->transitExitDeadline()
                    ? max(0, now()->startOfDay()->diffInDays($container->transitExitDeadline(), false))
                    : null,
                'needs_notification' => $container->needsExitNotification(),
                'overdue' => $container->transitDayNumber() !== null && $container->transitDayNumber() >= $container->transitExitDays() && $container->exit_date === null,
            ] : null,
            // per-type field definitions (label/types/current values) for generic forms
            'type_fields' => $typeFields,
            'created_at' => $this->formatTimestamp($this->created_at),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_by_user' => new UserResource($this->whenLoaded('createdByUser')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedByUser')),
        ];
    }
}
