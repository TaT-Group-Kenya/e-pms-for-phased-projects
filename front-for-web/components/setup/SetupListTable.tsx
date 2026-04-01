"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/auth/selectors";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../common/Toast";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import Can from "../auth/Can";
import type { RoleName } from "../../store/auth/roles";

export interface SetupItemBase {
  id: number;
  [key: string]: any;
}

export interface SetupColumn<T extends SetupItemBase> {
  key: keyof T | string;
  label: string;
}

export interface SetupListTableProps<T extends SetupItemBase> {
  title: string;
  entityName: string; // e.g. "Department"
  listEndpoint: string; // e.g. "/api/departments/list"
  createEndpoint: string; // e.g. "/api/departments/create"
  updateEndpoint: string; // e.g. "/api/departments/update"
  deleteEndpoint: string; // e.g. "/api/departments/delete"
  columns: SetupColumn<T>[];
  /** Keys used for quick text search */
  searchableKeys?: (keyof T | string)[];
  /** Optional form field order; defaults to columns minus id */
  formFields?: string[];
  /** Optional roles required to create, edit, delete items */
  canCreateRoles?: RoleName[];
  canEditRoles?: RoleName[];
  canDeleteRoles?: RoleName[];
}

function toCsv<T extends SetupItemBase>(columns: SetupColumn<T>[], rows: T[]): string {
  const header = columns.map((c) => `"${String(c.label).replace(/"/g, '""')}"`).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const v = row[c.key as keyof T];
        const s = v === null || v === undefined ? "" : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [header, ...lines].join("\n");
}

const SetupListTable = <T extends SetupItemBase>(props: SetupListTableProps<T>) => {
  const {
    title,
    entityName,
    listEndpoint,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    columns,
    searchableKeys,
    formFields,
    canCreateRoles,
    canEditRoles,
    canDeleteRoles,
  } = props;

  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  const perPage = 15000;

  const effectiveSearchKeys = useMemo(
    () => searchableKeys && searchableKeys.length ? searchableKeys : columns.filter(c => c.key !== "id").map(c => c.key),
    [searchableKeys, columns]
  );

  const effectiveFormFields = useMemo(
    () => formFields && formFields.length ? formFields : columns.filter(c => c.key !== "id").map(c => String(c.key)),
    [formFields, columns]
  );

  // Fetch list
  useEffect(() => {
    const controller = new AbortController();

    const fetchItems = async () => {
      setLoading(true);
      try {
        const url = new URL(window.location.origin + listEndpoint.replace(/^\//, "/"));
        url.searchParams.append("page", String(currentPage));
        url.searchParams.append("per_page", String(perPage));

        const resp = await fetch(url.toString().replace(window.location.origin, ""), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data = await resp.json();
        if (!resp.ok) {
          addToast(`Failed to load ${title.toLowerCase()}`, "error");
          setItems([]);
          return;
        }

        const raw = (data.data ?? data) as T[];
        setItems(Array.isArray(raw) ? raw : []);
        setTotalPages(data.last_page || 1);
        setTotalCount(data.total || raw.length || 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error(`Error fetching ${title.toLowerCase()}:`, err);
        addToast(`Error loading ${title.toLowerCase()}. Please refresh the page.`, "error");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchItems();
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [accessToken, addToast, currentPage, listEndpoint, title, reloadKey]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return effectiveSearchKeys.some((k) => {
      const val = item[k as keyof T];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(term);
    });
  });

  const indexOfFirst = (currentPage - 1) * perPage + 1;
  const indexOfLast = Math.min(currentPage * perPage, totalCount);

  const openDeleteModal = (item: T) => {
    setDeleteItemId(item.id);
    const labelKey = columns.find((c) => c.key === "name")?.key ?? columns[0]?.key;
    const label = item[labelKey as keyof T];
    setDeleteItemName(label ? String(label) : `${entityName} #${item.id}`);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteItemId(null);
    setDeleteItemName("");
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const url = `${deleteEndpoint}?id=${deleteItemId}`;
      const resp = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        const msg = data?.message || `Failed to delete ${entityName.toLowerCase()}`;
        throw new Error(msg);
      }
      addToast(`${entityName} deleted successfully`, "success");
      closeDeleteModal();
      // Refresh data after successful delete
      setReloadKey((key) => key + 1);
    } catch (err: any) {
      const msg = err?.message || `Failed to delete ${entityName.toLowerCase()}`;
      setDeleteError(msg);
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    const init: Record<string, string> = {};
    effectiveFormFields.forEach((f) => {
      init[f] = "";
    });
    setFormData(init);
    setFormError(null);
    setFormModalOpen(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    const init: Record<string, string> = {};
    effectiveFormFields.forEach((f) => {
      const v = item[f as keyof T];
      init[f] = v === null || v === undefined ? "" : String(v);
    });
    setFormData(init);
    setFormError(null);
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingItem(null);
    setFormError(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const payload: Record<string, any> = {};
      effectiveFormFields.forEach((f) => {
        payload[f] = formData[f];
      });

      const isEdit = !!editingItem;
      const endpoint = isEdit ? `${updateEndpoint}?id=${editingItem?.id}` : createEndpoint;
      const method = isEdit ? "PUT" : "POST";

      const resp = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = data?.message || `Failed to ${isEdit ? "update" : "create"} ${entityName.toLowerCase()}`;
        throw new Error(msg);
      }

      addToast(
        `${entityName} ${isEdit ? "updated" : "created"} successfully`,
        "success"
      );
      closeFormModal();
      // Refresh data after successful create/update
      setReloadKey((key) => key + 1);
    } catch (err: any) {
      const msg = err?.message || `Failed to save ${entityName.toLowerCase()}`;
      setFormError(msg);
      addToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCsv = () => {
    try {
      const csv = toCsv(columns, filteredItems);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export error", err);
      addToast("Failed to export CSV", "error");
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title={`Delete ${entityName}`}
        message={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`}
        itemName={deleteItemName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Header card */}
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">{title}</h5>
        </div>

        <div className="flex items-center gap-[10px] w-full md:w-auto flex-wrap md:flex-nowrap">
          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                download
              </i>
              Export CSV
            </span>
          </button>

          <Can any={canCreateRoles}>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                {`Create ${entityName}`}
              </span>
            </button>
          </Can>
        </div>
      </div>

      {/* Table card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        {loading ? (
          <div className="p-[20px] md:p-[25px]">
            <div className="space-y-[10px]">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredItems.length ? (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        {columns.map((col) => (
                          <td
                            key={String(col.key)}
                            className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm"
                          >
                            {String(item[col.key as keyof T] ?? "")}
                          </td>
                        ))}
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Can any={canEditRoles}>
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                                title={`Edit ${entityName}`}
                              >
                                <i className="material-symbols-outlined !text-[18px]">edit</i>
                              </button>
                            </Can>
                            <Can any={canDeleteRoles}>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(item)}
                                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                                title={`Delete ${entityName}`}
                              >
                                <i className="material-symbols-outlined !text-[18px]">delete</i>
                              </button>
                            </Can>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm
                          ? `No ${title.toLowerCase()} match your search`
                          : `No ${title.toLowerCase()} found`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-[20px] py-[12px] md:py-[14px] border-t border-gray-100 dark:border-[#172036] flex items-center justify-between flex-wrap gap-[10px]">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirst} to {indexOfLast} of {totalCount} results
                </p>
                <div className="flex gap-[5px]">
                  <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="material-symbols-outlined">chevron_left</i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageClick(i + 1)}
                      className={`w-[31px] h-[31px] flex items-center justify-center rounded-md border transition-all ${
                        currentPage === i + 1
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="material-symbols-outlined">chevron_right</i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="trezo-card w-full max-w-md bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md shadow-xl">
            <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
              <div className="trezo-card-title">
                <h5 className="!mb-0">{editingItem ? `Edit ${entityName}` : `Create ${entityName}`}</h5>
              </div>
              <div className="trezo-card-subtitle">
                <button
                  type="button"
                  className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-danger-500"
                  onClick={closeFormModal}
                  disabled={isSaving}
                >
                  <i className="ri-close-fill"></i>
                </button>
              </div>
            </div>

            {formError && (
              <div className="mb-[15px] p-[12px] bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-md">
                <div className="text-danger-600 dark:text-danger-400 text-sm flex items-start gap-[8px]">
                  <i className="ri-error-warning-line mt-[2px] flex-shrink-0"></i>
                  <span className="break-words">{formError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-[15px]">
              {effectiveFormFields.map((field) => field !== "readonly" && (
                <div key={field}>
                  <label className="block text-sm font-medium mb-[6px] text-gray-700 dark:text-gray-300 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    disabled={Number(formData["readonly"]) === 1 && field === "name"}
                    value={formData[field] ?? ""}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#15203c] border border-gray-200 dark:border-[#172036] rounded-md px-[13px] py-[9px] text-sm text-black dark:text-white outline-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              ))}

              <div className="mt-[10px] flex justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSaving}
                  className="rounded-md inline-block transition-all font-medium px-[18px] py-[9px] bg-gray-200 dark:bg-[#172036] text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#1a2847] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-block bg-primary-500 text-white py-[9px] px-[18px] transition-all rounded-md hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[8px] justify-center"
                >
                  {isSaving ? "Saving..." : editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SetupListTable;
