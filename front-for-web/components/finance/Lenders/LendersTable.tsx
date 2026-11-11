"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../common/Toast"
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal/DeleteConfirmationModal"
import { formatApiError } from "../../../utils/errorHandler"

interface Lender {
  id: number
  name: string
  address: string | null
  email: string | null
  phone: string | null
  kra_pin: string | null
}

const emptyForm = {
  name: "",
  address: "",
  email: "",
  phone: "",
  kra_pin: "",
}

const LendersTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [lenders, setLenders] = useState<Lender[]>([])
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [showFormModal, setShowFormModal] = useState(false)
  const [editing, setEditing] = useState<Lender | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Lender | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchLenders = useCallback(
    async (targetPage = 1) => {
      if (!accessToken) {
        setLenders([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(targetPage), per_page: "15" })
        if (search) params.set("search", search)

        const resp = await fetch(`/api/lenders?${params.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data: any = await resp.json().catch(() => null)
        if (!resp.ok) {
          addToast(data?.message || "Failed to load lenders", "error")
          setLenders([])
          return
        }
        setLenders(Array.isArray(data?.data) ? data.data : [])
        setMeta(data?.meta ?? data?.pagination ?? null)
      } catch {
        addToast("Error loading lenders.", "error")
        setLenders([])
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, search, page],
  )

  useEffect(() => {
    fetchLenders(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchLenders(1)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowFormModal(true)
  }

  const openEdit = (lender: Lender) => {
    setEditing(lender)
    setForm({
      name: lender.name ?? "",
      address: lender.address ?? "",
      email: lender.email ?? "",
      phone: lender.phone ?? "",
      kra_pin: lender.kra_pin ?? "",
    })
    setShowFormModal(true)
  }

  const handleSave = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error")
      return
    }
    if (!form.name.trim()) {
      addToast("Name is required.", "error")
      return
    }

    setSaving(true)
    try {
      const url = editing ? `/api/lenders/${editing.id}` : "/api/lenders"
      const resp = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(formatApiError(data), "error")
        return
      }
      addToast(editing ? "Lender updated." : "Lender created.", "success")
      setShowFormModal(false)
      setEditing(null)
      await fetchLenders(page)
    } catch {
      addToast("Failed to save lender.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !accessToken) return

    setDeleting(true)
    try {
      const resp = await fetch(`/api/lenders/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(data?.message || "Failed to delete this lender.", "error")
        return
      }
      addToast(`Lender ${deleteTarget.name} deleted.`, "success")
      setShowDeleteModal(false)
      setDeleteTarget(null)
      await fetchLenders(page)
    } catch {
      addToast("Failed to delete this lender.", "error")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] p-5 rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[15px]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lenders are persons or corporates you borrow from. They are selected when onboarding a loan.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">add</i>
              Create Lender
            </span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <input
            type="text"
            placeholder="Search by name, email, phone, KRA PIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setPage(1)
              }}
              className="px-[12px] py-[8px] rounded-md text-sm text-gray-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Name</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Email</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Phone</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">KRA PIN</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Address</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center text-sm px-[10px] py-[10px]">Loading...</td>
                </tr>
              )}
              {!loading && lenders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-sm px-[10px] py-[16px] text-gray-500">
                    No lenders yet. Click "Create Lender" to add one.
                  </td>
                </tr>
              )}
              {!loading &&
                lenders.map((lender) => (
                  <tr key={lender.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]">
                    <td className="text-sm px-[10px] py-[6px] font-medium">{lender.name}</td>
                    <td className="text-sm px-[10px] py-[6px]">{lender.email ?? "-"}</td>
                    <td className="text-sm px-[10px] py-[6px]">{lender.phone ?? "-"}</td>
                    <td className="text-sm px-[10px] py-[6px]">{lender.kra_pin ?? "-"}</td>
                    <td className="text-sm px-[10px] py-[6px]">{lender.address ?? "-"}</td>
                    <td className="text-sm px-[10px] py-[6px] text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(lender)}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium mr-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(lender)
                          setShowDeleteModal(true)
                        }}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-danger-200 text-xs font-medium text-danger-600 hover:bg-danger-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {meta && (
          <div className="flex items-center justify-between px-[10px] py-[10px] text-sm">
            <span className="text-gray-500">
              Page {meta.current_page} of {meta.last_page} · {meta.total} lenders
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-[10px] py-[4px] rounded-md border border-gray-200 dark:border-[#172036] disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-[10px] py-[4px] rounded-md border border-gray-200 dark:border-[#172036] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              {editing ? "Edit Lender" : "Create Lender"}
            </h3>

            <div className="space-y-[12px] mb-[18px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">
                  Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
                  placeholder="Full name of person or company name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-[5px]">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-[5px]">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-[5px]">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-[5px]">KRA PIN</label>
                <input
                  type="text"
                  value={form.kra_pin}
                  onChange={(e) => setForm({ ...form, kra_pin: e.target.value })}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                disabled={saving}
                className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Lender"
        message={
          deleteTarget
            ? `Are you sure you want to delete lender "${deleteTarget.name}"? It will be hidden and cannot be attached to new loans.`
            : "Are you sure you want to delete this lender?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={deleting}
      />
    </>
  )
}

export default LendersTable
