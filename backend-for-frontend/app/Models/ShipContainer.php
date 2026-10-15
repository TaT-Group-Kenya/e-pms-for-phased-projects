<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShipContainer extends Model
{
    use HasLogicalDeletion;

    public const TYPE_CONTAINER_IMPORT = 'container_import';

    public const TYPE_CONTAINER_EXPORT = 'container_export';

    public const TYPE_CONTAINER_TRANSIT = 'container_transit';

    public const TYPE_UNIT_TRANSIT = 'unit_transit';

    public const TYPE_UNIT_IMPORT = 'unit_import';

    public const TYPES = [
        self::TYPE_CONTAINER_IMPORT,
        self::TYPE_CONTAINER_EXPORT,
        self::TYPE_CONTAINER_TRANSIT,
        self::TYPE_UNIT_TRANSIT,
        self::TYPE_UNIT_IMPORT,
    ];

    public const STATUS_BOOKED = 'BOOKED';

    public const STATUS_EMPTY_COLLECTED = 'EMPTY COLLECTED';

    public const STATUS_LOADED = 'LOADED';

    public const STATUS_RELEASED_CUSTOMS = 'RELEASED CUSTOMS';

    public const STATUS_RECEIVED_AT_KPA = 'RECEIVED AT KPA';

    public const STATUS_CONFIRMED_LOADING = 'CONFIRMED LOADING';

    public const STATUS_SAILED = 'SAILED';

    public const STATUSES = [
        self::STATUS_BOOKED,
        self::STATUS_EMPTY_COLLECTED,
        self::STATUS_LOADED,
        self::STATUS_RELEASED_CUSTOMS,
        self::STATUS_RECEIVED_AT_KPA,
        self::STATUS_CONFIRMED_LOADING,
        self::STATUS_SAILED,
    ];

    public const COE_STATUSES = ['PENDING', 'GENERATED'];

    public const DO_STATUS_INVOICE_GENERATED = 'invoice_generated';

    public const DO_STATUS_PENDING_PAYMENT = 'pending_payment';

    public const DO_STATUS_UNDER_PROCESS = 'under_process';

    public const DO_STATUS_READY = 'ready';

    public const DO_STATUS_PENDING_INVOICE = 'pending_invoice';

    public const DO_STATUSES = [
        self::DO_STATUS_INVOICE_GENERATED,
        self::DO_STATUS_PENDING_PAYMENT,
        self::DO_STATUS_UNDER_PROCESS,
        self::DO_STATUS_READY,
        self::DO_STATUS_PENDING_INVOICE,
    ];

    public const EMPTY_STATUS_LOADED = 'loaded';

    public const EMPTY_STATUS_EMPTY_RETURNED = 'empty_returned';

    public const EMPTY_STATUS_NOT_LOADED_OUT = 'not_loaded_out';

    public const EMPTY_STATUSES = [
        self::EMPTY_STATUS_LOADED,
        self::EMPTY_STATUS_EMPTY_RETURNED,
        self::EMPTY_STATUS_NOT_LOADED_OUT,
    ];

    public const TR10_STATUS_REGISTERED = 'registered';

    public const TR10_STATUS_RELEASED = 'released';

    public const TR10_STATUS_SETTLED = 'settled';

    public const TR10_STATUS_COE_GENERATED = 'coe_generated';

    public const TR10_STATUS_WT8 = 'wt8';

    public const TR10_STATUS_T1 = 't1';

    public const TR10_STATUSES = [
        self::TR10_STATUS_REGISTERED,
        self::TR10_STATUS_RELEASED,
        self::TR10_STATUS_SETTLED,
        self::TR10_STATUS_COE_GENERATED,
        self::TR10_STATUS_WT8,
        self::TR10_STATUS_T1,
    ];

    public const TR12_STATUSES = [
        self::TR10_STATUS_REGISTERED,
        self::TR10_STATUS_RELEASED,
        self::TR10_STATUS_SETTLED,
        self::TR10_STATUS_T1,
    ];

    public const ENTRY_STATUSES = [
        self::TR10_STATUS_REGISTERED,
        self::TR10_STATUS_RELEASED,
        self::TR10_STATUS_SETTLED,
    ];

    /**
     * Field map per container type.
     *
     * value:     the canonical model attribute
     * label:     the human-readable column label from the requirement sheet
     * required:  whether the field must be provided for this type
     * date:      whether the field is a date input (YYYY-MM-DD)
     * datetime:  whether the field is a date-time input (Y-m-d\TH:i)
     * select:    optional list of allowed values rendered as a dropdown
     *
     * Client Name is resolved from the project owner list of the linked
     * customer (project_owner_id); Quantity equals the count of container
     * numbers and is recomputed on add/remove of a number.
     *
     * Drives backend validation (typeRules) and can drive frontend forms.
     */
    public const TYPE_FIELDS = [
        self::TYPE_CONTAINER_IMPORT => [
            'project_owner_id' => ['label' => 'Client Name', 'required' => true, 'entity' => 'project_owner'],
            'customer_id' => ['label' => 'Customer', 'required' => true, 'entity' => 'customer'],
            'eta' => ['label' => 'ETA', 'required' => true, 'date' => true],
            'port_in' => ['label' => 'Port In (Port of Entry)', 'required' => false],
            'get_in' => ['label' => 'Get In (Arrival Date & Time)', 'required' => false, 'datetime' => true],
            'get_out' => ['label' => 'Get Out (Departure Date & Time)', 'required' => false, 'datetime' => true],
            'container_numbers' => ['label' => 'Container Numbers', 'required' => true, 'numbers' => true],
            'bl_no' => ['label' => 'BL No', 'required' => true],
            'description' => ['label' => 'Description', 'required' => false],
            'entry_status' => ['label' => 'Entry Status', 'required' => false, 'select' => self::ENTRY_STATUSES],
            'person_incharge' => ['label' => 'Person In-charge', 'required' => false],
            'shipping_line' => ['label' => 'Shipping Line', 'required' => true],
            'do_status' => ['label' => 'DO Status', 'required' => false, 'select' => self::DO_STATUSES],
            'allocation' => ['label' => 'CFS (Allocation)', 'required' => false, 'entity' => 'project_location'],
            'guarantee_status' => ['label' => 'Guarantee Status', 'required' => false, 'select' => ['not_applicable', 'pending', 'active', 'expired', 'released']],
            'empty_status' => ['label' => 'Empty Status', 'required' => false, 'select' => self::EMPTY_STATUSES],
        ],
        self::TYPE_CONTAINER_EXPORT => [
            'project_owner_id' => ['label' => 'Client Name', 'required' => true, 'entity' => 'project_owner'],
            'customer_id' => ['label' => 'Customer', 'required' => true, 'entity' => 'customer'],
            'etd' => ['label' => 'ETD', 'required' => true, 'date' => true],
            'goods_description' => ['label' => 'Goods Description', 'required' => false],
            'container_numbers' => ['label' => 'Container Numbers', 'required' => true, 'numbers' => true],
            'entry_number' => ['label' => 'Entry', 'required' => true],
            'booking_no' => ['label' => 'Booking No', 'required' => true],
            'bl_no' => ['label' => 'BL No', 'required' => false],
            'location' => ['label' => 'Location', 'required' => false],
            'shipping_line' => ['label' => 'Shipping Line', 'required' => true],
            'port_out' => ['label' => 'Port Out (Port of Exit)', 'required' => false],
            'get_in' => ['label' => 'Get In (Arrival Date & Time)', 'required' => false, 'datetime' => true],
            'get_out' => ['label' => 'Get Out (Departure Date & Time)', 'required' => false, 'datetime' => true],
            'coe' => ['label' => 'COE', 'required' => false, 'select' => self::COE_STATUSES],
            'status' => ['label' => 'Status', 'required' => false, 'select' => self::STATUSES],
        ],
        self::TYPE_CONTAINER_TRANSIT => [
            'project_owner_id' => ['label' => 'Client Name', 'required' => true, 'entity' => 'project_owner'],
            'customer_id' => ['label' => 'Customer', 'required' => true, 'entity' => 'customer'],
            'eta' => ['label' => 'ETA', 'required' => true, 'date' => true],
            'port_in' => ['label' => 'Port In (Port of Entry)', 'required' => false],
            'port_out' => ['label' => 'Port Out (Port of Exit)', 'required' => false],
            'get_in' => ['label' => 'Get In (Arrival Date & Time)', 'required' => false, 'datetime' => true],
            'get_out' => ['label' => 'Get Out (Departure Date & Time)', 'required' => false, 'datetime' => true],
            'last_free_day' => ['label' => 'Last Free Day', 'required' => false, 'date' => true],
            'cfs' => ['label' => 'CFS', 'required' => false, 'entity' => 'project_location'],
            'container_numbers' => ['label' => 'Container Numbers', 'required' => true, 'numbers' => true],
            'bol_no' => ['label' => 'BOL No', 'required' => true],
            'description' => ['label' => 'Descriptions', 'required' => false],
            'tr10_entry_status' => ['label' => 'TR10 Entry Status', 'required' => false, 'select' => self::TR10_STATUSES],
            'tr12_entry_status' => ['label' => 'TR12 Entry Status', 'required' => false, 'select' => self::TR12_STATUSES],
            'shipping_agent' => ['label' => 'Shipping Agent', 'required' => true],
            'do_status' => ['label' => 'DO Status', 'required' => false, 'select' => self::DO_STATUSES],
            'allocation' => ['label' => 'CFS (Allocation)', 'required' => false, 'entity' => 'project_location'],
            'destination' => ['label' => 'Destination', 'required' => true],
            'gt_expiration_date' => ['label' => 'GT Expiration Date', 'required' => false, 'date' => true],
            'empty_status' => ['label' => 'Empty Status', 'required' => false, 'select' => self::EMPTY_STATUSES],
        ],
        self::TYPE_UNIT_TRANSIT => [
            'project_owner_id' => ['label' => 'Client Name', 'required' => true, 'entity' => 'project_owner'],
            'customer_id' => ['label' => 'Customer', 'required' => true, 'entity' => 'customer'],
            'eta' => ['label' => 'ETA', 'required' => true, 'date' => true],
            'port_in' => ['label' => 'Port In (Port of Entry)', 'required' => false],
            'port_out' => ['label' => 'Port Out (Port of Exit)', 'required' => false],
            'get_in' => ['label' => 'Get In (Arrival Date & Time)', 'required' => false, 'datetime' => true],
            'get_out' => ['label' => 'Get Out (Departure Date & Time)', 'required' => false, 'datetime' => true],
            'vessel' => ['label' => 'Vessel', 'required' => false],
            'container_numbers' => ['label' => 'Container Numbers', 'required' => true, 'numbers' => true],
            'description' => ['label' => 'Description', 'required' => false],
            'chassis_no' => ['label' => 'Chassis No', 'required' => false],
            'remarks' => ['label' => 'Remarks', 'required' => false],
            'registration_no' => ['label' => 'Registration No', 'required' => false],
            'cfs' => ['label' => 'CFS', 'required' => false, 'entity' => 'project_location'],
            'bol_no' => ['label' => 'BOL No', 'required' => true],
            'shipping_line' => ['label' => 'Shipping Line', 'required' => false],
            'station' => ['label' => 'Station', 'required' => false],
        ],
        self::TYPE_UNIT_IMPORT => [
            'project_owner_id' => ['label' => 'Client Name', 'required' => true, 'entity' => 'project_owner'],
            'customer_id' => ['label' => 'Customer', 'required' => true, 'entity' => 'customer'],
            'eta' => ['label' => 'ETA', 'required' => true, 'date' => true],
            'port_in' => ['label' => 'Port In (Port of Entry)', 'required' => false],
            'get_in' => ['label' => 'Get In (Arrival Date & Time)', 'required' => false, 'datetime' => true],
            'get_out' => ['label' => 'Get Out (Departure Date & Time)', 'required' => false, 'datetime' => true],
            'container_numbers' => ['label' => 'Container Numbers', 'required' => true, 'numbers' => true],
            'description' => ['label' => 'Description', 'required' => false],
            'registration_no' => ['label' => 'Registration No', 'required' => false],
            'bl_no' => ['label' => 'B/L No', 'required' => true],
            'entry_status' => ['label' => 'Entry Status', 'required' => false, 'select' => self::ENTRY_STATUSES],
            'shipping_line' => ['label' => 'Shipping Line', 'required' => true],
            'allocation' => ['label' => 'CFS (Allocation)', 'required' => false, 'entity' => 'project_location'],
            'remarks' => ['label' => 'Remarks', 'required' => false],
        ],
    ];

    protected $table = 'ship_containers';

    protected $fillable = [
        // reference and type
        'reference_number',
        'container_type',
        // shared identification / movement
        'customer_id',
        'project_owner_id',
        'eta',
        'etd',
        'port_in',
        'port_out',
        'get_in',
        'get_out',
        'description',
        'quantity',
        'bl_no',
        'bol_no',
        'shipping_line',
        'shipping_agent',
        'vessel',
        // status / clearance
        'entry_status',
        'tr10_entry_status',
        'tr12_entry_status',
        'entry_number',
        'booking_no',
        'do_status',
        'allocation',
        'guarantee_status',
        'empty_status',
        'person_incharge',
        'status',
        // transit tracking
        'last_free_day',
        'cfs',
        'destination',
        'gt_expiration_date',
        'exit_date',
        'exit_border',
        'exit_remarks',
        'bond_extension_days',
        // exports location columns
        'location',
        'goods_description',
        'coe',
        // loose unit columns
        'chassis_no',
        'registration_no',
        'station',
        'remarks',
        // audit / logical deletion
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'eta' => 'date:Y-m-d',
        'etd' => 'date:Y-m-d',
        'get_in' => 'datetime',
        'get_out' => 'datetime',
        'last_free_day' => 'date:Y-m-d',
        'gt_expiration_date' => 'date:Y-m-d',
        'exit_date' => 'datetime',
        'is_deleted' => 'boolean',
        'quantity' => 'decimal:4',
    ];

    public static function fieldMap(?string $type = null): array
    {
        if ($type === null) {
            return self::TYPE_FIELDS;
        }

        return self::TYPE_FIELDS[$type] ?? [];
    }

    public function typeFieldMap(): array
    {
        return self::fieldMap($this->container_type);
    }

    /**
     * Attributes that are part of the type's declared field map
     * (excluding audit/system attributes).
     */
    public static function typeAttributes(string $type): array
    {
        $map = self::fieldMap($type);

        return collect($map)
            ->keys()
            ->reject(fn ($attr) => $attr === 'status' || $attr === 'customer_id')
            ->values()
            ->all();
    }

    /**
     * Canonical container identifier regardless of type: the first tracked
     * container number, falling back to the reference.
     */
    public function containerIdentifier(): ?string
    {
        if ($this->relationLoaded('numbers')) {
            return $this->numbers->first()?->container_no;
        }

        return $this->numbers()->first()->container_no ?? null;
    }

    /**
     * All container numbers tracked by this entry.
     */
    public function numbers(): HasMany
    {
        return $this->hasMany(ShipContainerNumber::class, 'ship_container_id')->orderBy('id');
    }

    /**
     * The client (project owner) belonging to the linked customer.
     */
    public function projectOwner()
    {
        return $this->belongsTo(ProjectOwner::class, 'project_owner_id');
    }

    /**
     * CFS dropdown source (Allocation references a project location).
     */
    public function allocationLocation()
    {
        return $this->belongsTo(ProjectLocation::class, 'allocation');
    }

    public function cfsLocation()
    {
        return $this->belongsTo(ProjectLocation::class, 'cfs');
    }

    /**
     * The date the transit clock runs from (Get In = entered the country,
     * falling back to ETA), transit types only.
     */
    public function transitStartDate(): ?CarbonInterface
    {
        if (! in_array($this->container_type, [self::TYPE_CONTAINER_TRANSIT, self::TYPE_UNIT_TRANSIT], true)) {
            return null;
        }

        $date = $this->get_in ?? $this->eta;

        return $date ? $this->asDate($date) : null;
    }

    /**
     * The date the transit cargo exited the country (Get Out), null when not
     * yet exited.
     */
    public function transitGetOutDate(): ?CarbonInterface
    {
        if (! in_array($this->container_type, [self::TYPE_CONTAINER_TRANSIT, self::TYPE_UNIT_TRANSIT], true)) {
            return null;
        }

        $date = $this->get_out ?? $this->exit_date;

        return $date ? $this->asDate($date) : null;
    }

    /**
     * Day number (0-based) since the transit clock started.
     */
    public function transitDayNumber(): ?int
    {
        $start = $this->transitStartDate();
        if ($start === null) {
            return null;
        }

        return (int) $start->startOfDay()->diffInDays(now()->startOfDay(), false);
    }

    /**
     * Deadline the transit cargo must leave the country by (transit start + exit days).
     */
    public function transitExitDeadline(): ?CarbonInterface
    {
        $start = $this->transitStartDate();
        if ($start === null) {
            return null;
        }

        return $start->copy()->addDays($this->transitExitDays());
    }

    /**
     * Configurable allowed transit days (default 30).
     */
    public function transitExitDays(): int
    {
        $value = SysConfig::where('name', 'SHIP_CONTAINER_TRANSIT_EXIT_DAYS')->value('value');

        return max(1, (int) ($value ?? 30));
    }

    /**
     * Configurable notification day within the transit window (default 25).
     */
    public function transitNotifyDay(): int
    {
        $value = SysConfig::where('name', 'SHIP_CONTAINER_TRANSIT_NOTIFY_DAY')->value('value');

        return max(1, (int) ($value ?? 25));
    }

    /**
     * True when the container is on the notification day or later
     * and has not exited yet.
     */
    public function needsExitNotification(): bool
    {
        if ($this->exit_date !== null) {
            return false;
        }

        if (! in_array($this->container_type, [self::TYPE_CONTAINER_TRANSIT, self::TYPE_UNIT_TRANSIT], true)) {
            return false;
        }

        $dayNumber = $this->transitDayNumber();
        if ($dayNumber === null) {
            return false;
        }

        return $dayNumber >= $this->transitNotifyDay() && $dayNumber < $this->transitExitDays();
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
