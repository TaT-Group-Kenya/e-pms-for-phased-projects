// Central definitions for the ship-containers module.
// Mirrors App\Models\ShipContainer (TYPE_FIELDS + option constants) so forms
// and tables render the same fields per container type without hardcoding twice.

export type ShipContainerType =
  | 'container_import'
  | 'container_export'
  | 'container_transit'
  | 'unit_transit'
  | 'unit_import'

export const SHIP_CONTAINER_TYPES: ShipContainerType[] = [
  'container_import',
  'container_export',
  'container_transit',
  'unit_transit',
  'unit_import',
]

export const SHIP_CONTAINER_TYPE_LABELS: Record<ShipContainerType, string> = {
  container_import: 'Imports Container',
  container_export: 'Exports Container',
  container_transit: 'Transit Container',
  unit_transit: 'Transit Unit',
  unit_import: 'Import Unit',
}

export type ShipContainerStatus =
  | 'pending'
  | 'in_progress'
  | 'cleared'
  | 'exited'
  | 'on_hold'

export const SHIP_CONTAINER_STATUSES: ShipContainerStatus[] = [
  'pending',
  'in_progress',
  'cleared',
  'exited',
  'on_hold',
]

export const SHIP_CONTAINER_STATUS_LABELS: Record<ShipContainerStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  cleared: 'Cleared',
  exited: 'Exited',
  on_hold: 'On Hold',
}

// Enum option lists (kept in sync with backend validation constants)
export const ENTRY_STATUS_OPTIONS = ['registered', 'released', 'settled']

export const DO_STATUS_OPTIONS = ['invoice_generated', 'pending_payment', 'under_process', 'ready', 'pending_invoice']

export const EMPTY_STATUS_OPTIONS = ['loaded', 'empty_returned', 'not_loaded_out']

export const TR10_STATUS_OPTIONS = ['registered', 'released', 'settled', 'coe_generated', 'wt8', 't1']

export const TR12_STATUS_OPTIONS = ['registered', 'released', 'settled', 't1']

export const GUARANTEE_STATUS_OPTIONS = ['not_applicable', 'pending', 'active', 'expired', 'released']

export type FieldKind = 'text' | 'date' | 'date-time' | 'numeric' | 'select' | 'textarea' | 'entity-project_owner' | 'entity-project_location' | 'numbers'

export type FieldConfig = {
  attribute: string
  label: string
  required?: boolean
  kind?: FieldKind
  options?: string[]
  /** Column span hint for the create/edit form grid */
  span?: 'full' | 'half'
}

export type ShipContainerTypeConfig = {
  type: ShipContainerType
  label: string
  /** Short blurb shown at the top of the create/edit page */
  description: string
  /** Whether transit exit deadline tracking applies */
  transit: boolean
  fields: FieldConfig[]
}

const FIELD: Record<string, FieldConfig> = {
  customer_id: { attribute: 'customer_id', label: 'Linked Customer', required: true, kind: 'entity-project_owner' as never, span: 'half' },
  project_owner_id: { attribute: 'project_owner_id', label: 'Client Name', required: true, kind: 'entity-project_owner', span: 'half' },
  container_numbers: { attribute: 'container_numbers', label: 'Container Numbers', required: true, kind: 'numbers', span: 'full' },
  eta: { attribute: 'eta', label: 'ETA', kind: 'date', span: 'half' },
  etd: { attribute: 'etd', label: 'ETD', kind: 'date', span: 'half' },
  port_in: { attribute: 'port_in', label: 'Port In (Port of Entry)', span: 'half' },
  port_out: { attribute: 'port_out', label: 'Port Out (Port of Exit)', span: 'half' },
  get_in: { attribute: 'get_in', label: 'Get In (Arrival)', kind: 'date-time', span: 'half' },
  get_out: { attribute: 'get_out', label: 'Get Out (Departure)', kind: 'date-time', span: 'half' },
  bl_no: { attribute: 'bl_no', label: 'BL No', span: 'half' },
  bol_no: { attribute: 'bol_no', label: 'BOL No', span: 'half' },
  description: { attribute: 'description', label: 'Description', kind: 'textarea', span: 'full' },
  entry_status: { attribute: 'entry_status', label: 'Entry Status', kind: 'select', options: ENTRY_STATUS_OPTIONS, span: 'half' },
  person_incharge: { attribute: 'person_incharge', label: 'Person In-charge', span: 'half' },
  shipping_line: { attribute: 'shipping_line', label: 'Shipping Line', span: 'half' },
  do_status: { attribute: 'do_status', label: 'DO Status', kind: 'select', options: DO_STATUS_OPTIONS, span: 'half' },
  allocation: { attribute: 'allocation', label: 'CFS (Allocation)', kind: 'entity-project_location', span: 'half' },
  guarantee_status: { attribute: 'guarantee_status', label: 'Guarantee Status', kind: 'select', options: GUARANTEE_STATUS_OPTIONS, span: 'half' },
  empty_status: { attribute: 'empty_status', label: 'Empty Status', kind: 'select', options: EMPTY_STATUS_OPTIONS, span: 'half' },
  last_free_day: { attribute: 'last_free_day', label: 'Last Free Day', kind: 'date', span: 'half' },
  cfs: { attribute: 'cfs', label: 'CFS', span: 'half' },
  tr10_entry_status: { attribute: 'tr10_entry_status', label: 'TR10 Entry Status', kind: 'select', options: TR10_STATUS_OPTIONS, span: 'half' },
  tr12_entry_status: { attribute: 'tr12_entry_status', label: 'TR12 Entry Status', kind: 'select', options: TR12_STATUS_OPTIONS, span: 'half' },
  shipping_agent: { attribute: 'shipping_agent', label: 'Shipping Agent', span: 'half' },
  destination: { attribute: 'destination', label: 'Destination', span: 'half' },
  gt_expiration_date: { attribute: 'gt_expiration_date', label: 'GT Expiration Date', kind: 'date', span: 'half' },
  goods_description: { attribute: 'goods_description', label: 'Goods Description', span: 'full' },
  entry_number: { attribute: 'entry_number', label: 'Entry', span: 'half' },
  booking_no: { attribute: 'booking_no', label: 'Booking No', span: 'half' },
  location: { attribute: 'location', label: 'Location', span: 'half' },
  coe: { attribute: 'coe', label: 'COE', span: 'half' },
  vessel: { attribute: 'vessel', label: 'Vessel', span: 'half' },
  chassis_no: { attribute: 'chassis_no', label: 'Chassis No', span: 'half' },
  remarks: { attribute: 'remarks', label: 'Remarks', kind: 'textarea', span: 'full' },
  registration_no: { attribute: 'registration_no', label: 'Registration No', span: 'half' },
  station: { attribute: 'station', label: 'Station', span: 'half' },
}

// Backend marks 'status' as a type field for some types — it is handled by the
// shared status control; required flag resolved from backend payload when present.
const withStatus = (fields: FieldConfig[]): FieldConfig[] => [
  ...fields,
  { attribute: 'status', label: 'Status', kind: 'select', options: SHIP_CONTAINER_STATUSES, span: 'half' },
]

export const SHIP_CONTAINER_TYPE_CONFIGS: Record<ShipContainerType, ShipContainerTypeConfig> = {
  container_import: {
    type: 'container_import',
    label: 'Imports Container',
    description: 'Inbound containers cleared through customs locally.',
    transit: false,
    fields: withStatus([
      FIELD.customer_id,
      FIELD.project_owner_id,
      { ...FIELD.eta, required: true },
      FIELD.port_in,
      FIELD.get_in,
      FIELD.get_out,
      FIELD.container_numbers,
      { ...FIELD.bl_no, required: true },
      FIELD.description,
      FIELD.entry_status,
      FIELD.person_incharge,
      { ...FIELD.shipping_line, required: true },
      FIELD.do_status,
      FIELD.allocation,
      FIELD.guarantee_status,
      FIELD.empty_status,
    ]),
  },
  container_export: {
    type: 'container_export',
    label: 'Exports Container',
    description: 'Outbound containers booked for export.',
    transit: false,
    fields: [
      FIELD.customer_id,
      FIELD.project_owner_id,
      { ...FIELD.etd, required: true },
      FIELD.goods_description,
      FIELD.container_numbers,
      { ...FIELD.entry_number, required: true },
      { ...FIELD.booking_no, required: true },
      FIELD.bl_no,
      FIELD.location,
      { ...FIELD.shipping_line, required: true },
      FIELD.port_out,
      FIELD.get_in,
      FIELD.get_out,
      FIELD.coe,
    ],
  },
  container_transit: {
    type: 'container_transit',
    label: 'Transit Container',
    description: 'Cargo in transit through Kenya (bonded) — the exit clock runs from Get In.',
    transit: true,
    fields: withStatus([
      FIELD.customer_id,
      FIELD.project_owner_id,
      { ...FIELD.eta, required: true },
      FIELD.port_in,
      FIELD.port_out,
      FIELD.get_in,
      FIELD.get_out,
      FIELD.last_free_day,
      FIELD.cfs,
      FIELD.container_numbers,
      { ...FIELD.bol_no, required: true },
      FIELD.description,
      FIELD.tr10_entry_status,
      FIELD.tr12_entry_status,
      { ...FIELD.shipping_agent, required: true },
      FIELD.do_status,
      FIELD.allocation,
      { ...FIELD.destination, required: true },
      FIELD.gt_expiration_date,
      FIELD.empty_status,
    ]),
  },
  unit_transit: {
    type: 'unit_transit',
    label: 'Transit Unit',
    description: 'Loose units shipped without a container, in transit through Kenya.',
    transit: true,
    fields: withStatus([
      FIELD.customer_id,
      FIELD.project_owner_id,
      { ...FIELD.eta, required: true },
      FIELD.port_in,
      FIELD.port_out,
      FIELD.get_in,
      FIELD.get_out,
      FIELD.vessel,
      FIELD.container_numbers,
      FIELD.description,
      FIELD.chassis_no,
      FIELD.remarks,
      FIELD.registration_no,
      FIELD.cfs,
      { ...FIELD.bol_no, required: true },
      FIELD.shipping_line,
      FIELD.station,
    ]),
  },
  unit_import: {
    type: 'unit_import',
    label: 'Import Unit',
    description: 'Loose units imported without a container.',
    transit: false,
    fields: withStatus([
      FIELD.customer_id,
      FIELD.project_owner_id,
      { ...FIELD.eta, required: true },
      FIELD.port_in,
      FIELD.get_in,
      FIELD.get_out,
      FIELD.container_numbers,
      FIELD.description,
      FIELD.registration_no,
      { ...FIELD.bl_no, required: true },
      FIELD.entry_status,
      { ...FIELD.shipping_line, required: true },
      FIELD.allocation,
      FIELD.remarks,
    ]),
  },
}

export const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-warning-50 text-warning-500',
  in_progress: 'bg-info-50 text-info-500',
  cleared: 'bg-success-50 text-success-500',
  exited: 'bg-success-50 text-success-500',
  on_hold: 'bg-danger-50 text-danger-500',
}

export const transitLabel = (value?: string | null): string => {
  if (!value) return '—'
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** Column definition for a type listing table. */
export type ListColumn = {
  key: string
  label: string
  align?: 'start' | 'end'
  /** Truncate this cell and show the full value in a title tooltip (long text fields) */
  truncate?: boolean
}

/*
 * Per-type listing columns: exactly the fields captured for that type plus
 * shared audit/id columns. `container_numbers` renders comma-joined.
 */
export const SHIP_CONTAINER_TYPE_COLUMNS: Record<ShipContainerType, ListColumn[]> = {
  container_import: [
    { key: 'reference_number', label: 'Ref' },
    { key: 'customer', label: 'Linked Customer' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'eta', label: 'ETA' },
    { key: 'port_in', label: 'Port In' },
    { key: 'get_in', label: 'Get In' },
    { key: 'get_out', label: 'Get Out' },
    { key: 'container_numbers', label: 'Container Nos' },
    { key: 'quantity', label: 'Qty', align: 'end' },
    { key: 'bl_no', label: 'BL No' },
    { key: 'description', label: 'Description', truncate: true },
    { key: 'entry_status', label: 'Entry Status' },
    { key: 'person_incharge', label: 'Person In-charge' },
    { key: 'shipping_line', label: 'Shipping Line' },
    { key: 'do_status', label: 'DO Status' },
    { key: 'allocation', label: 'CFS (Allocation)' },
    { key: 'guarantee_status', label: 'Guarantee' },
    { key: 'empty_status', label: 'Empty Status' },
    { key: 'created_by_user', label: 'Created By' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_by_user', label: 'Updated By' },
    { key: 'updated_at', label: 'Updated At' },
    { key: 'actions', label: 'Actions' },
  ],
  container_export: [
    { key: 'reference_number', label: 'Ref' },
    { key: 'customer', label: 'Linked Customer' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'etd', label: 'ETD' },
    { key: 'goods_description', label: 'Goods Description', truncate: true },
    { key: 'container_numbers', label: 'Container Nos' },
    { key: 'quantity', label: 'Qty', align: 'end' },
    { key: 'entry_number', label: 'Entry' },
    { key: 'booking_no', label: 'Booking No' },
    { key: 'bl_no', label: 'BL No' },
    { key: 'location', label: 'Location' },
    { key: 'shipping_line', label: 'Shipping Line' },
    { key: 'port_out', label: 'Port Out' },
    { key: 'get_in', label: 'Get In' },
    { key: 'get_out', label: 'Get Out' },
    { key: 'coe', label: 'COE' },
    { key: 'created_by_user', label: 'Created By' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_by_user', label: 'Updated By' },
    { key: 'updated_at', label: 'Updated At' },
    { key: 'actions', label: 'Actions' },
  ],
  container_transit: [
    { key: 'reference_number', label: 'Ref' },
    { key: 'customer', label: 'Linked Customer' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'eta', label: 'ETA' },
    { key: 'port_in', label: 'Port In' },
    { key: 'port_out', label: 'Port Out' },
    { key: 'get_in', label: 'Get In' },
    { key: 'get_out', label: 'Get Out' },
    { key: 'exit_tracker', label: 'Exit Deadline' },
    { key: 'exit_date', label: 'Date of Exit' },
    { key: 'last_free_day', label: 'Last Free Day' },
    { key: 'cfs', label: 'CFS' },
    { key: 'container_numbers', label: 'Container Nos' },
    { key: 'quantity', label: 'Qty', align: 'end' },
    { key: 'bol_no', label: 'BOL No' },
    { key: 'description', label: 'Descriptions', truncate: true },
    { key: 'tr10_entry_status', label: 'TR10 Entry' },
    { key: 'tr12_entry_status', label: 'TR12 Entry' },
    { key: 'shipping_agent', label: 'Shipping Agent' },
    { key: 'do_status', label: 'DO Status' },
    { key: 'allocation', label: 'CFS (Allocation)' },
    { key: 'destination', label: 'Destination' },
    { key: 'gt_expiration_date', label: 'GT Expiration' },
    { key: 'empty_status', label: 'Empty Status' },
    { key: 'created_by_user', label: 'Created By' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_by_user', label: 'Updated By' },
    { key: 'updated_at', label: 'Updated At' },
    { key: 'actions', label: 'Actions' },
  ],
  unit_transit: [
    { key: 'reference_number', label: 'Ref' },
    { key: 'customer', label: 'Linked Customer' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'eta', label: 'ETA' },
    { key: 'port_in', label: 'Port In' },
    { key: 'port_out', label: 'Port Out' },
    { key: 'get_in', label: 'Get In' },
    { key: 'get_out', label: 'Get Out' },
    { key: 'exit_tracker', label: 'Exit Deadline' },
    { key: 'exit_date', label: 'Date of Exit' },
    { key: 'vessel', label: 'Vessel' },
    { key: 'container_numbers', label: 'Container Numbers' },
    { key: 'quantity', label: 'Qty', align: 'end' },
    { key: 'description', label: 'Description', truncate: true },
    { key: 'chassis_no', label: 'Chassis No' },
    { key: 'remarks', label: 'Remarks', truncate: true },
    { key: 'registration_no', label: 'Reg No' },
    { key: 'cfs', label: 'CFS' },
    { key: 'bol_no', label: 'BOL No' },
    { key: 'shipping_line', label: 'Shipping Line' },
    { key: 'station', label: 'Station' },
    { key: 'created_by_user', label: 'Created By' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_by_user', label: 'Updated By' },
    { key: 'updated_at', label: 'Updated At' },
    { key: 'actions', label: 'Actions' },
  ],
  unit_import: [
    { key: 'reference_number', label: 'Ref' },
    { key: 'customer', label: 'Linked Customer' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'eta', label: 'ETA' },
    { key: 'port_in', label: 'Port In' },
    { key: 'get_in', label: 'Get In' },
    { key: 'get_out', label: 'Get Out' },
    { key: 'container_numbers', label: 'Container Numbers' },
    { key: 'quantity', label: 'Qty', align: 'end' },
    { key: 'description', label: 'Description', truncate: true },
    { key: 'registration_no', label: 'Registration No' },
    { key: 'bl_no', label: 'B/L No' },
    { key: 'entry_status', label: 'Entry Status' },
    { key: 'shipping_line', label: 'Shipping Line' },
    { key: 'allocation', label: 'CFS (Allocation)' },
    { key: 'remarks', label: 'Remarks', truncate: true },
    { key: 'created_by_user', label: 'Created By' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_by_user', label: 'Updated By' },
    { key: 'updated_at', label: 'Updated At' },
    { key: 'actions', label: 'Actions' },
  ],
}

/**
 * Secondary filter dropdowns available per container type (beyond the shared
 * status filter). Only enum-backed status filters are offered.
 */
export const SHIP_CONTAINER_TYPE_FILTERS: Record<ShipContainerType, Array<{
  key: string
  label: string
  options: string[]
}>> = {
  container_import: [
    { key: 'entry_status', label: 'Entry Status', options: ENTRY_STATUS_OPTIONS },
    { key: 'do_status', label: 'DO Status', options: DO_STATUS_OPTIONS },
    { key: 'empty_status', label: 'Empty Status', options: EMPTY_STATUS_OPTIONS },
    { key: 'guarantee_status', label: 'Guarantee', options: GUARANTEE_STATUS_OPTIONS },
  ],
  container_export: [],
  container_transit: [
    { key: 'tr10_entry_status', label: 'TR10 Entry', options: TR10_STATUS_OPTIONS },
    { key: 'tr12_entry_status', label: 'TR12 Entry', options: TR12_STATUS_OPTIONS },
    { key: 'do_status', label: 'DO Status', options: DO_STATUS_OPTIONS },
    { key: 'empty_status', label: 'Empty Status', options: EMPTY_STATUS_OPTIONS },
  ],
  unit_transit: [],
  unit_import: [
    { key: 'entry_status', label: 'Entry Status', options: ENTRY_STATUS_OPTIONS },
  ],
}

export const SHIP_CONTAINER_TYPE_IS_TRANSIT: Record<ShipContainerType, boolean> = {
  container_import: false,
  container_export: false,
  container_transit: true,
  unit_transit: true,
  unit_import: false,
}

/** Plural fragment used in empty-state copy, e.g. "No transit containers match…". */
export const SHIP_CONTAINER_TYPE_PLURAL: Record<ShipContainerType, string> = {
  container_import: 'import containers',
  container_export: 'export containers',
  container_transit: 'transit containers',
  unit_transit: 'transit units',
  unit_import: 'import units',
}