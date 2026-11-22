"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { ToastContainer } from "../../common/Toast";
import PaginationFooter from "../../common/PaginationFooter";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

interface SysRole {
  id: number;
  name: string;
  description?: string | null;
}

const RolesTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken) as string | null;
  const { toasts, addToast, removeToast } = useToast();

  // Server-side listing: pagination and debounced search live in useListQuery.
  const {
    searchInput,
    setSearchInput,
    page,
    setPage,
    perPage,
    changePerPage,
    rows: roles,
    loading,
    error,
    meta,
    refresh,
  } = useListQuery<SysRole>("/api/sys-roles/list", {
    accessToken,
    onError: (message) => addToast(message, "error"),
  });

  const [editingRole, setEditingRole] = useState<SysRole | null>(null);
  const [form, setForm] = useState<{ name: string; description: string }>(
    { name: "", description: "" }
  );
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [deleteRoleName, setDeleteRoleName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const resetForm = () => {
    setEditingRole(null);
    setForm({ name: "", description: "" });
  };

  const startCreate = () => {
    resetForm();
  };

  const startEdit = (role: SysRole) => {
    setEditingRole(role);
    setForm({ name: role.name, description: role.description || "" });
  };

  const handleSaveRole = async () => {
    if (!accessToken) return;
    if (!form.name.trim()) {
      addToast("Role name is required", "error");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingRole;
      const url = isEdit
        ? `/api/sys-roles/${editingRole!.id}`
        : `/api/sys-roles/create`;

      const resp = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        const msg = (data as any).message || "Failed to save role";
        addToast(msg, "error");
        return;
      }

      addToast(
        editingRole ? "Role updated successfully" : "Role created successfully",
        "success"
      );
      refresh();
      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving role", err);
      addToast("Failed to save role", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const openDeleteModal = (role: SysRole) => {
    setDeleteRoleId(role.id);
    setDeleteRoleName(role.name);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteRoleId(null);
    setDeleteRoleName("");
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteRoleId || !accessToken) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const resp = await fetch(`/api/sys-roles/${deleteRoleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = (data as any).message || "Failed to delete role";
        setDeleteError(msg);
        addToast(msg, "error");
        return;
      }

      addToast("Role deleted", "success");
      closeDeleteModal();
      // Refetch on the current page (list is server-paginated)
      refresh();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting role", err);
      const msg = (err as any)?.message || "Failed to delete role";
      setDeleteError(msg);
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Role"
        message="Are you sure you want to delete this role? Groups using it will lose this permission."
        itemName={deleteRoleName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      <div className="trezo-card mb-[25px] bg-white dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#1f2937]">
        <div className="trezo-card-header flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-[#1f2937]">
          <div>
            <h5 className="!mb-1">Roles</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Define granular roles that can be attached to user groups.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search roles (name, description)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-100 dark:border-[#1f2937] h-[36px] rounded-md w-full text-xs text-black dark:text-white pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="h-[36px] px-2 text-xs rounded-md border border-gray-100 dark:border-[#1f2937] text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 whitespace-nowrap"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">
                  filter_alt_off
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="trezo-card-body p-5 overflow-x-auto">
          {/* Inline create/edit form */}
          <div className="mb-4 p-3 rounded-md bg-gray-50 dark:bg-[#111827] border border-dashed border-gray-200 dark:border-[#1f2937] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                {/* <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Role Name
                </label> */}
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-[34px] rounded-md border border-gray-200 dark:border-[#1f2937] bg-white dark:bg-[#020617] text-xs text-black dark:text-white px-2.5"
                  placeholder="Role Name"
                />
              </div>
              <div className="flex-1">
                {/* <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label> */}
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full h-[34px] rounded-md border border-gray-200 dark:border-[#1f2937] bg-white dark:bg-[#020617] text-xs text-black dark:text-white px-2.5"
                  placeholder="Description (optional)"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              {editingRole && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#020617]"
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-3 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1"
                disabled={saving}
              >
                {saving && (
                  <span className="material-symbols-outlined animate-spin text-[16px]">
                    progress_activity
                  </span>
                )}
                {editingRole ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-[10px]">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-[52px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-3 text-sm text-danger-500">{error}</div>
              )}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#1f2937] text-xs text-gray-500 dark:text-gray-400">
                    <th className="py-2 px-3 text-left font-medium">Role</th>
                    <th className="py-2 px-3 text-left font-medium">Description</th>
                    <th className="py-2 px-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 && !error ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        {searchInput
                          ? "No roles match your search."
                          : "No roles defined yet."}
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                    <tr
                      key={role.id}
                      className="border-b border-gray-50 dark:border-[#111827] last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-[#111827] transition-colors"
                    >
                      <td className="py-3 px-3 align-top text-sm font-medium text-black dark:text-white">
                        {role.name}
                      </td>
                      <td className="py-3 px-3 align-top text-xs text-gray-600 dark:text-gray-300 min-w-[220px]">
                        {role.description || (
                          <span className="text-gray-400 dark:text-gray-500">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top text-right text-xs">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(role)}
                            className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#020617] flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(role)}
                            className="px-2.5 py-1 rounded-md border border-red-100 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>

              <PaginationFooter
                meta={meta}
                page={page}
                perPage={perPage}
                loading={loading}
                onPageChange={setPage}
                onPerPageChange={changePerPage}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RolesTable;
