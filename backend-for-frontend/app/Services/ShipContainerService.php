<?php

namespace App\Services;

use App\Models\ShipContainer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ShipContainerService
{
    /**
     * Filterable attributes for index listings.
     */
    private const FILTERABLE = [
        'container_type',
        'status',
        'entry_status',
        'tr10_entry_status',
        'tr12_entry_status',
        'do_status',
        'empty_status',
        'guarantee_status',
        'shipping_line',
        'shipping_agent',
        'reference_number',
        'bol_no',
        'bl_no',
        'project_owner_id',
    ];

    public function index(array $filters = [], int $perPage = 15, int $page = 1, int $offset = 0, array $with = []): LengthAwarePaginator
    {
        $query = ShipContainer::query();
        if (! empty($with)) {
            $query->with($with);
        }

        $withDeleted = filter_var($filters['with_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);
        $onlyDeleted = filter_var($filters['only_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);

        unset($filters['with_deleted'], $filters['only_deleted']);

        if ($onlyDeleted) {
            $query->onlyDeleted();
        } elseif ($withDeleted) {
            $query->withDeleted();
        }

        // free-text search across common identifiers
        $search = trim((string) ($filters['search'] ?? ''));
        unset($filters['search']);
        if ($search !== '') {
            $like = '%'.strtolower($search).'%';
            $query->where(function ($q) use ($like) {
                $q->orWhereRaw('LOWER(reference_number) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(bl_no, "")) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(bol_no, "")) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(shipping_line, "")) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(shipping_agent, "")) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(COALESCE(booking_no, "")) LIKE ?', [$like])
                    ->orWhereIn('id', function ($nq) use ($like) {
                        $nq->select('ship_container_id')
                            ->from('ship_container_numbers')
                            ->whereRaw('LOWER(container_no) LIKE ?', [$like]);
                    })
                    ->orWhereHas('projectOwner', function ($oq) use ($like) {
                        $oq->whereRaw('LOWER(name) LIKE ?', [$like]);
                    });
            });
        }

        // multi-type filter: container_type=a,b
        if (isset($filters['container_type']) && is_string($filters['container_type']) && str_contains($filters['container_type'], ',')) {
            $types = collect(explode(',', $filters['container_type']))
                ->map(fn ($t) => trim($t))
                ->filter(fn ($t) => in_array($t, ShipContainer::TYPES, true))
                ->values()
                ->all();
            $query->whereIn('container_type', $types);
            unset($filters['container_type']);
        }

        foreach ($filters as $key => $value) {
            if (in_array($key, self::FILTERABLE, true) && $value !== null && $value !== '') {
                $query->where($key, $value);
            } elseif ($key === 'customer_id' && (is_numeric($value) || (int) $value)) {
                $query->where('customer_id', (int) $value);
            } elseif ($key === 'eta_from' && $value) {
                $query->whereDate('eta', '>=', $value);
            } elseif ($key === 'eta_to' && $value) {
                $query->whereDate('eta', '<=', $value);
            } elseif ($key === 'etd_from' && $value) {
                $query->whereDate('etd', '>=', $value);
            } elseif ($key === 'etd_to' && $value) {
                $query->whereDate('etd', '<=', $value);
            } elseif ($key === 'get_in_from' && $value) {
                $query->whereDate('get_in', '>=', $value);
            } elseif ($key === 'get_in_to' && $value) {
                $query->whereDate('get_in', '<=', $value);
            } elseif ($key === 'not_yet_exited' && filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
                $query->whereNull('exit_date');
            }
        }

        return $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = []): ShipContainer
    {
        $query = ShipContainer::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data): ShipContainer
    {
        return DB::transaction(function () use ($data) {
            $data['reference_number'] = $this->nextReferenceNumber();

            $numbers = $this->extractNumbers($data);
            // quantity reflects the tracked container numbers
            if ($numbers !== null) {
                $data['quantity'] = count($numbers);
            }

            $container = ShipContainer::create($data);

            if ($numbers !== null) {
                $this->syncNumbers($container, $numbers, $data['created_by'] ?? null);
                $container->setRelation('numbers', $container->numbers()->get());
            }

            return $container;
        });
    }

    public function update(int $id, array $data): ShipContainer
    {
        return DB::transaction(function () use ($id, $data) {
            $model = ShipContainer::findOrFail($id);

            // Type change is not supported once created, keeps history coherent
            unset($data['container_type']);

            $numbers = $this->extractNumbers($data);
            if ($numbers !== null) {
                $data['quantity'] = count($numbers);
            }

            $model->update($data);

            if ($numbers !== null) {
                $this->syncNumbers($model, $numbers, $data['updated_by'] ?? null);
            }

            $model->refresh();
            $model->setRelation('numbers', $model->numbers()->get());

            return $model;
        });
    }

    /**
     * Pull the container numbers list out of the payload, if present.
     *
     * @return list<string>|null null when the payload does not contain numbers
     */
    private function extractNumbers(array &$data): ?array
    {
        if (! array_key_exists('container_numbers', $data)) {
            return null;
        }

        $raw = $data['container_numbers'];
        unset($data['container_numbers']);

        if (! is_array($raw)) {
            return [];
        }

        $numbers = collect($raw)
            ->map(fn ($n) => strtoupper(trim((string) $n)))
            ->filter(fn ($n) => $n !== '')
            ->unique()
            ->values()
            ->all();

        return $numbers;
    }

    /**
     * Replace the entry's container numbers with the given list, recomputing
     * the quantity to the count of numbers.
     *
     * @param  list<string>  $numbers
     */
    private function syncNumbers(ShipContainer $container, array $numbers, ?int $userId = null): void
    {
        $container->numbers()->delete();

        foreach ($numbers as $number) {
            $container->numbers()->create([
                'container_no' => $number,
                'created_by' => $userId,
            ]);
        }

        $container->quantity = count($numbers);
        $container->save();
    }

    public function delete(int $id, ?int $deletedBy = null): bool
    {
        $model = ShipContainer::withDeleted()->findOrFail($id);

        return $model->softDelete($deletedBy);
    }

    /**
     * Record the Get In date - the day transit cargo entered the country.
     * Applies to transit types only.
     */
    /**
     * Record (or update) the Get In date & time - when the shipment arrived
     * (entered the country). Nullable; applies to all types.
     */
    public function getIn(int $id, ?string $datetime = null): ShipContainer
    {
        $model = ShipContainer::findOrFail($id);

        $model->get_in = $datetime ? Carbon::parse($datetime) : now();
        $model->updated_at = now();
        $model->save();

        return $model;
    }

    /**
     * Record the date/time transit cargo exits Kenya borders.
     */
    public function recordExit(int $id, array $data): ShipContainer
    {
        return DB::transaction(function () use ($id, $data) {
            $model = ShipContainer::findOrFail($id);

            if (! in_array($model->container_type, [ShipContainer::TYPE_CONTAINER_TRANSIT, ShipContainer::TYPE_UNIT_TRANSIT], true)) {
                abort(422, 'Only transit containers and transit units can be recorded as exited.');
            }

            if ($model->exit_date !== null) {
                abort(422, 'Exit has already been recorded for this cargo.');
            }

            $exitDate = Carbon::parse($data['exit_date']);

            if ($model->get_in && $exitDate->lt(Carbon::parse($model->get_in))) {
                abort(422, 'Exit date cannot be before the Get In date & time.');
            }

            $model->exit_date = $exitDate;
            $model->get_out = $exitDate;
            $model->exit_border = $data['exit_border'] ?? null;
            $model->exit_remarks = $data['exit_remarks'] ?? null;
            $model->bond_extension_days = isset($data['bond_extension_days']) ? (int) $data['bond_extension_days'] : null;

            // Cargo physically left the country; status no longer reflects an
            // in-country clearing stage.
            $model->status = ShipContainer::STATUS_EXITED;

            $model->updated_at = now();
            $model->save();

            return $model;
        });
    }

    /**
     * Containers that are due for the transit exit / bond extension notification:
     * on or after the configured notification day (default day 25) within the
     * 30-day window, or overdue, and not yet exited.
     */
    public function transitExitNotifications(array $with = []): array
    {
        $rows = collect();

        foreach ([ShipContainer::TYPE_CONTAINER_TRANSIT, ShipContainer::TYPE_UNIT_TRANSIT] as $type) {
            $query = ShipContainer::where('container_type', $type)
                ->whereNull('exit_date')
                ->whereDate('get_in', '<=', now()->toDateString())
                ->with(['numbers'])
                ->when(! empty($with), fn ($q) => $q->with($with))
                ->get();

            $rows = $rows->merge($query);
        }

        return $rows
            ->filter(fn (ShipContainer $container) => $container->needsExitNotification())
            ->map(fn (ShipContainer $container) => [
                'id' => $container->id,
                'reference_number' => $container->reference_number,
                'container_type' => $container->container_type,
                'container_numbers' => $container->numbers->pluck('container_no')->all(),
                'container_identifier' => $container->containerIdentifier(),
                'client' => $container->projectOwner?->name,
                'customer' => $container->customer?->name,
                'bol_no' => $container->bol_no,
                'get_in' => $container->get_in?->format('Y-m-d H:i'),
                'get_out' => $container->get_out?->format('Y-m-d H:i'),
                'port_in' => $container->port_in,
                'port_out' => $container->port_out,
                'eta' => $container->eta?->format('Y-m-d'),
                'transit_start' => $container->transitStartDate()?->format('Y-m-d'),
                'exit_deadline' => $container->transitExitDeadline()?->format('Y-m-d'),
                'day_number' => $container->transitDayNumber(),
                'exit_days' => $container->transitExitDays(),
                'notify_day' => $container->transitNotifyDay(),
                'days_remaining' => $this->daysRemaining($container),
                'overdue' => ($container->transitDayNumber() ?? 0) >= $container->transitExitDays(),
                'status' => $container->status,
            ])
            ->sortByDesc('day_number')
            ->values()
            ->all();
    }

    private function daysRemaining(ShipContainer $container): ?int
    {
        $deadline = $container->transitExitDeadline();
        if ($deadline === null) {
            return null;
        }

        return (int) now()->startOfDay()->diffInDays($deadline, false);
    }

    /**
     * Reference number generator honouring the configured prefix/increment/length.
     */
    private function nextReferenceNumber(): string
    {
        $common = new CommonService;

        return $common->getNextShipContainerReference();
    }

    public function statistics(): array
    {
        $byType = ShipContainer::query()
            ->select('container_type', DB::raw('count(*) as total'))
            ->groupBy('container_type')
            ->pluck('total', 'container_type');

        $byStatus = ShipContainer::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $exitOverdue = ShipContainer::query()
            ->whereIn('container_type', [ShipContainer::TYPE_CONTAINER_TRANSIT, ShipContainer::TYPE_UNIT_TRANSIT])
            ->whereNull('exit_date')
            ->get()
            ->filter(fn (ShipContainer $c) => ($c->transitDayNumber() ?? -1) >= $c->transitExitDays())
            ->count();

        return [
            'total' => array_sum($byType->all()),
            'by_type' => $byType->all(),
            'by_status' => $byStatus->all(),
            'exited' => (int) ShipContainer::whereNotNull('exit_date')->count(),
            'pending_exit' => (int) ShipContainer::whereNull('exit_date')->count(),
            'exit_overdue' => $exitOverdue,
        ];
    }
}
