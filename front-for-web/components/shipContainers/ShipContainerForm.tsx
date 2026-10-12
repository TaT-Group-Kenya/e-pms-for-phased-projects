"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../store/auth/selectors"
import { useToast } from "../../hooks/useToast"
import { ToastContainer } from "../common/Toast"
import {
  SHIP_CONTAINER_TYPES,
  SHIP_CONTAINER_TYPE_CONFIGS,
  SHIP_CONTAINER_TYPE_LABELS,
  SHIP_CONTAINER_STATUSES,
  SHIP_CONTAINER_STATUS_LABELS,
  transitLabel,
  type ShipContainerType,
} from "../../constants/shipContainers"

type FormGroup = Record<string, any>

const labelFor = (type: ShipContainerType): string => SHIP_CONTAINER_TYPE_LABELS[type]

const inputClass =
  "bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[45px] text-black dark:text-white text-[15px] rounded-md w-full block px-[17px] outline-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:opacity-60"

const textareaClass =
  "bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] text-black dark:text-white text-[15px] rounded-md w-full block px-[17px] py-[12px] outline-0 placeholder:text-gray-500 dark:placeholder:text-gray-400"

const selectClass = `${inputClass} appearance-none`

interface ShipContainerFormProps {
  /** Present when editing an existing container */
  containerId?: string | number
  /** Initial container data when editing */
  initial?: FormGroup | null
  /** Preselected type on create (e.g. from ?type= query) */
  defaultType?: ShipContainerType | null
}

/** Option for a dependent dropdown */
type RefOption = { id: number; name: string }

const ShipContainerForm: React.FC<ShipContainerFormProps> = ({ containerId, initial, defaultType }) => {
  const isEdit = !!containerId
  const accessToken = useSelector(selectAccessToken)
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  const [containerType, setContainerType] = useState<ShipContainerType | "">(
    isEdit && initial?.container_type ? initial.container_type : (defaultType ?? "")
  )
  const [form, setForm] = useState<FormGroup>({})
  const [numbers, setNumbers] = useState<string[]>([])
  const [numberInput, setNumberInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState<RefOption[]>([])
  const [owners, setOwners] = useState<RefOption[]>([])
  const [locations, setLocations] = useState<RefOption[]>([])
  const [ownersLoading, setOwnersLoading] = useState(false)

  const config = containerType ? SHIP_CONTAINER_TYPE_CONFIGS[containerType as ShipContainerType] : null

  /** Selected linked customer value (string for comparisons, '' when none) */
  const selectedCustomerId = form.customer_id != null && form.customer_id !== "" ? String(form.customer_id) : ""

  useEffect(() => {
    if (isEdit && initial) {
      setForm({ ...initial })
      // Hydrate the numbers list from the initial payload (array of strings) or type_fields
      const fromAttribute = Array.isArray(initial.container_numbers) ? initial.container_numbers : null
      const fromTypeFields = Array.isArray(initial.type_fields)
        ? (initial.type_fields.find((f: any) => f.attribute === "container_numbers")?.value ?? null)
        : null
      setNumbers((fromAttribute ?? fromTypeFields ?? []).map((n: any) => String(n)))
    } else {
      setForm({})
      setNumbers([])
    }
  }, [isEdit, initial])

  // Load linked-customer dropdown sources (active customers) once
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!accessToken) return
      try {
        const resp = await fetch("/api/customers/list?per_page=500", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const json = await resp.json().catch(() => null)
        if (cancelled || !resp.ok) return
        const body = Array.isArray(json?.data) ? json.data : json?.data?.data ?? []
        setCustomers(
          (Array.isArray(body) ? body : []).map((c: any) => ({ id: Number(c.id), name: String(c.name ?? `#${c.id}`) }))
        )
      } catch {
        // dropdown stays empty
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  // Load CFS (project locations) sources once
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!accessToken) return
      try {
        const resp = await fetch("/api/project-locations/list?per_page=500", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const json = await resp.json().catch(() => null)
        if (cancelled || !resp.ok) return
        const body = Array.isArray(json?.data) ? json.data : json?.data?.data ?? []
        setLocations(
          (Array.isArray(body) ? body : []).map((l: any) => ({ id: Number(l.id), name: String(l.name ?? `#${l.id}`) }))
        )
      } catch {
        // dropdown stays empty
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  // Client Name sources from the project owners of the linked customer;
  // disabled until a customer is chosen.
  useEffect(() => {
    if (!selectedCustomerId || !accessToken) {
      setOwners([])
      return
    }

    const controller = new AbortController()
    setOwnersLoading(true)

    const load = async () => {
      try {
        const resp = await fetch(`/api/project-owners/list?customer_id=${selectedCustomerId}&per_page=500`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        })
        const json = await resp.json().catch(() => null)
        if (controller.signal.aborted || !resp.ok) return
        const body = Array.isArray(json?.data) ? json.data : json?.data?.data ?? []
        setOwners(
          (Array.isArray(body) ? body : []).map((o: any) => ({ id: Number(o.id), name: String(o.name ?? `#${o.id}`) }))
        )
      } catch {
        if (!controller.signal.aborted) setOwners([])
      } finally {
        if (!controller.signal.aborted) setOwnersLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [selectedCustomerId, accessToken])

  const fieldError = (name: string): string | undefined => errors[name]?.[0]

  const setField = (attribute: string, value: any) => {
    setForm((prev) => ({ ...prev, [attribute]: value }))
  }

  /** Reset the client field whenever the linked customer changes. */
  const handleCustomerChange = (value: string) => {
    setForm((prev) => ({ ...prev, customer_id: value, project_owner_id: "" }))
    setOwners([])
  }

  const addNumber = () => {
    const value = numberInput.trim().toUpperCase()
    if (!value) return
    if (numbers.some((n) => n.toUpperCase() === value)) {
      addToast(`Container number ${value} is already in the list.`, "error")
      return
    }
    setNumbers((prev) => [...prev, value])
    setNumberInput("")
  }

  const removeNumber = (index: number) => {
    setNumbers((prev) => prev.filter((_, i) => i !== index))
  }

  const onNumberKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      addNumber()
    }
  }

  const renderField = (field: FormGroup) => {
    const { attribute, label, kind, options, required } = field
    const value = form[attribute] ?? ""
    const spanClass = field.span === "full" ? "sm:col-span-2" : ""

    const errorLine = fieldError(attribute) ? (
      <p className="mt-1 text-[13px] text-danger-500">{fieldError(attribute)}</p>
    ) : null

    if (attribute === "project_owner_id") {
      return (
        <div key={attribute} className={spanClass}>
          <label className="mb-[8px] block text-[15px] font-medium text-black dark:text-white">
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
          <select
            value={form[attribute] ?? ""}
            onChange={(e) => setField(attribute, e.target.value)}
            disabled={!selectedCustomerId || ownersLoading}
            className={`${selectClass} disabled:cursor-not-allowed ${
              !selectedCustomerId ? "opacity-60" : ""
            }`}
          >
            <option value="">
              {!selectedCustomerId ? "Select a customer first" : ownersLoading ? "Loading clients…" : "— Select —"}
            </option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          {errorLine}
        </div>
      )
    }

    if (attribute === "allocation") {
      // CFS (allocation) dropdown sourced from project locations
      return (
        <div key={attribute} className={spanClass}>
          <label className="mb-[8px] block text-[15px] font-medium text-black dark:text-white">
            {label}
          </label>
          <select value={value ?? ""} onChange={(e) => setField(attribute, e.target.value)} className={selectClass}>
            <option value="">— Select —</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errorLine}
        </div>
      )
    }

    if (kind === "numbers") {
      // Hidden inside the form: quantity equals the list length (shown as a hint)
      return (
        <div key={attribute} className="sm:col-span-2">
          <label className="mb-[8px] block text-[15px] font-medium text-black dark:text-white">
            {label} {required && <span className="text-danger-500">*</span>}
            <span className="ml-[8px] text-[12px] font-normal text-gray-500 dark:text-gray-400">
              ({numbers.length} added — this sets the qty)
            </span>
          </label>

          <div className="flex gap-[10px]">
            <input
              type="text"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              onKeyDown={onNumberKeyDown}
              placeholder="Type a container number and press Enter"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addNumber}
              disabled={!numberInput.trim()}
              className="shrink-0 text-[13px] text-white bg-primary-500 hover:bg-primary-600 px-[15px] rounded-md disabled:opacity-50"
            >
              <i className="material-symbols-outlined !text-[18px] align-middle">add</i>
            </button>
          </div>

          {numbers.length > 0 && (
            <div className="flex flex-wrap gap-[8px] mt-[12px]">
              {numbers.map((number, index) => (
                <span
                  key={`${number}-${index}`}
                  className="inline-flex items-center gap-[6px] bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] rounded-md px-[10px] py-[6px] text-[13px] text-black dark:text-white"
                >
                  {number}
                  <button
                    type="button"
                    onClick={() => removeNumber(index)}
                    title={`Remove ${number}`}
                    className="text-danger-500 hover:text-danger-600"
                  >
                    <i className="material-symbols-outlined !text-[15px]">cancel</i>
                  </button>
                </span>
              ))}
            </div>
          )}

          {errorLine}
        </div>
      )
    }

    return (
      <div key={attribute} className={spanClass}>
        <label className="mb-[8px] block text-[15px] font-medium text-black dark:text-white">
          {label} {kind !== "date-time" && required && <span className="text-danger-500">*</span>}
        </label>

        {kind === "textarea" ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => setField(attribute, e.target.value)}
            rows={2}
            className={textareaClass}
          />
        ) : kind === "select" ? (
          <select value={value ?? ""} onChange={(e) => setField(attribute, e.target.value)} className={selectClass}>
            <option value="">— Select —</option>
            {(options ?? []).map((option: string) => (
              <option key={option} value={option}>
                {transitLabel(option)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={kind === "date" ? "date" : kind === "date-time" ? "datetime-local" : kind === "numeric" ? "number" : "text"}
            step={kind === "numeric" ? "any" : undefined}
            value={
              kind === "date"
                ? typeof value === "string" && value
                  ? value.slice(0, 10)
                  : (value ?? "")
                : kind === "date-time"
                  ? typeof value === "string" && value
                    ? value.slice(0, 16)
                    : (value ?? "")
                  : (value ?? "")
            }
            onChange={(e) => setField(attribute, e.target.value)}
            className={inputClass}
          />
        )}

        {errorLine}
      </div>
    )
  }

  const payload = useMemo(() => {
    const data: FormGroup = { ...form }
    delete data.quantity // server derives it from container numbers

    if (!isEdit) data.container_type = containerType

    // numeric linkage fields
    for (const key of ["customer_id", "project_owner_id", "allocation"]) {
      if (data[key] === "" || data[key] == null) delete data[key]
      else data[key] = Number(data[key])
    }

    data.container_numbers = numbers

    return data
  }, [form, containerType, isEdit, numbers])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!accessToken) return

    setSaving(true)
    setErrors({})

    try {
      const url = isEdit ? `/api/ship-containers/${containerId}` : "/api/ship-containers/create"
      const resp = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(payload),
      })

      const json = await resp.json().catch(() => null)

      if (resp.status === 422 && json?.errors) {
        setErrors(json.errors)
        addToast("Please fix the highlighted fields.", "error")
        return
      }
      if (!resp.ok) throw new Error(json?.message || "Failed to save container")

      addToast(isEdit ? "Container updated" : "Container registered", "success")
      router.push("/ship-containers")
    } catch (err: any) {
      addToast(err?.message || "Failed to save container", "error")
    } finally {
      setSaving(false)
    }
  }

  if (!isEdit && !containerType) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <h5 className="!mb-0 text-black dark:text-white">What are you registering?</h5>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 mb-4">
            Choose the shipment category. Fields differ per category.
          </p>
          <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-3">
            {SHIP_CONTAINER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setContainerType(type)}
                className="text-left border border-gray-100 dark:border-[#15203c] rounded-md p-[15px] hover:border-primary-500 hover:bg-primary-50/50 transition-all"
              >
                <span className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-md bg-primary-50 text-primary-500 mb-[10px]">
                  <i className="material-symbols-outlined !text-[20px]">sailing</i>
                </span>
                <h6 className="text-[15px] font-medium text-black dark:text-white">{labelFor(type)}</h6>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-[4px]">
                  {SHIP_CONTAINER_TYPE_CONFIGS[type].description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <form onSubmit={handleSubmit}>
        <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h5 className="!mb-0 text-black dark:text-white">
              {isEdit ? `Edit ${labelFor(initial?.container_type)}` : labelFor(containerType as ShipContainerType)}
            </h5>
            {!isEdit && (
              <button
                type="button"
                onClick={() => setContainerType("")}
                className="text-[13px] text-primary-500 hover:text-primary-600"
              >
                Change category
              </button>
            )}
          </div>

          {config && (
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-[20px] -mt-[10px]">{config.description}</p>
          )}

          <div className="grid gap-[18px] sm:grid-cols-2">
            {/* Linked customer (required) — the platform customer account */}
            <div>
              <label className="mb-[8px] block text-[15px] font-medium text-black dark:text-white">
                Linked Customer <span className="text-danger-500">*</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className={selectClass}
              >
                <option value="">— Select —</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {fieldError("customer_id") && (
                <p className="mt-1 text-[13px] text-danger-500">{fieldError("customer_id")}</p>
              )}
            </div>

            {/* Status control — shared across types */}
            <div>
              <label className="mb-[8px] block text-[15px] font-medium text-black dark:text-white">
                Status
              </label>
              <select
                value={form.status ?? "pending"}
                onChange={(e) => setField("status", e.target.value)}
                className={selectClass}
              >
                {SHIP_CONTAINER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {SHIP_CONTAINER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              {fieldError("status") && <p className="mt-1 text-[13px] text-danger-500">{fieldError("status")}</p>}
            </div>

            {config?.fields
              .filter((field) => field.attribute !== "status" && field.attribute !== "customer_id")
              .map((field) => renderField(field))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-[12px] mt-[20px]">
          <button
            type="button"
            onClick={() => router.push("/ship-containers")}
            className="text-black dark:text-white py-[11px] px-[20px] rounded-md border border-gray-100 dark:border-[#15203c]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-white py-[11px] px-[20px] rounded-md bg-primary-500 hover:bg-primary-600 transition-all disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Register Container"}
          </button>
        </div>
      </form>
    </>
  )
}

export default ShipContainerForm