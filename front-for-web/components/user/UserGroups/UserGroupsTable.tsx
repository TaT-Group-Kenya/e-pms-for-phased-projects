"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

interface SysRole {
  id: number;
  name: string;
  description?: string | null;
}

interface SysGroup {
  id: number;
  name: string;
  description?: string | null;
  roles?: SysRole[];
}

interface PaginationData<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface GroupRoleAssignment {
  id: number;
  group_id: number;
  role_id: number;
}

const UserGroupsTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken) as string | null;
  const { toasts, addToast, removeToast } = useToast();

  const [groups, setGroups] = useState<SysGroup[]>([]);
  const [roles, setRoles] = useState<SysRole[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // CRUD state
  const [editingGroup, setEditingGroup] = useState<SysGroup | null>(null);
  const [form, setForm] = useState<{ name: string; description: string }>(
    { name: "", description: "" }
  );
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const [deleteGroupName, setDeleteGroupName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Role assignment
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalGroup, setRoleModalGroup] = useState<SysGroup | null>(null);
  const [groupRoleAssignments, setGroupRoleAssignments] = useState<
    GroupRoleAssignment[]
  >([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);

  const perPage = 15;

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        // Groups with roles count info
        const groupUrl = new URL(`/api/sys-groups/list`, window.location.origin);
        groupUrl.searchParams.append("page", String(currentPage));
        groupUrl.searchParams.append("per_page", String(perPage));
        groupUrl.searchParams.append("with", "roles");

        const gResp = await fetch(groupUrl.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        const gData: PaginationData<SysGroup> = await gResp.json();
        const list = gData.data || [];
        setGroups(list as SysGroup[]);
        setTotalPages(gData.last_page || 1);
        setTotalCount(gData.total || list.length || 0);

        // All roles for assignment UI
        const rResp = await fetch(
          `/api/sys-roles/list?page=1&per_page=500`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const rData: PaginationData<SysRole> = await rResp.json();
        setRoles((rData.data || []) as SysRole[]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("Error loading groups/roles", err);
        addToast("Failed to load groups", "error");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [accessToken, currentPage, perPage, addToast]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const resetForm = () => {
    setEditingGroup(null);
    setForm({ name: "", description: "" });
  };

  const startCreate = () => {
    resetForm();
  };

  const startEdit = (group: SysGroup) => {
    setEditingGroup(group);
    setForm({ name: group.name, description: group.description || "" });
  };

  const handleSaveGroup = async () => {
    if (!accessToken) return;
    if (!form.name.trim()) {
      addToast("Group name is required", "error");
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingGroup;
      const url = isEdit
        ? `/api/sys-groups/${editingGroup!.id}`
        : `/api/sys-groups/create`;

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
        const msg = (data as any).message || "Failed to save group";
        addToast(msg, "error");
        return;
      }

      addToast(
        editingGroup ? "Group updated successfully" : "Group created successfully",
        "success"
      );

      // Refresh groups list in a simple way
      setCurrentPage(1);
      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving group", err);
      addToast("Failed to save group", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const openDeleteModal = (group: SysGroup) => {
    setDeleteGroupId(group.id);
    setDeleteGroupName(group.name);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteGroupId(null);
    setDeleteGroupName("");
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteGroupId || !accessToken) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const resp = await fetch(`/api/sys-groups/${deleteGroupId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = (data as any).message || "Failed to delete group";
        setDeleteError(msg);
        addToast(msg, "error");
        return;
      }

      addToast("Group deleted", "success");
      setGroups((prev) => prev.filter((g) => g.id !== deleteGroupId));
      setTotalCount((prev) => Math.max(prev - 1, 0));
      closeDeleteModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting group", err);
      const msg = (err as any)?.message || "Failed to delete group";
      setDeleteError(msg);
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Role assignment
  const openRoleModal = async (group: SysGroup) => {
    if (!accessToken) return;

    setRoleModalGroup(group);
    setRoleModalOpen(true);
    setSavingRoles(false);

    try {
      const resp = await fetch(
        `/api/group-roles/list?page=1&per_page=500&group_id=${group.id}&with=role`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data: PaginationData<GroupRoleAssignment> = await resp.json();
      const assignments = (data.data || []) as GroupRoleAssignment[];
      setGroupRoleAssignments(assignments);
      setSelectedRoleIds(assignments.map((a) => a.role_id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error loading group roles", err);
      addToast("Failed to load roles for group", "error");
    }
  };

  const closeRoleModal = () => {
    setRoleModalOpen(false);
    setRoleModalGroup(null);
    setGroupRoleAssignments([]);
    setSelectedRoleIds([]);
    setSavingRoles(false);
  };

  const toggleRoleSelection = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSaveRoles = async () => {
    if (!roleModalGroup || !accessToken) return;

    setSavingRoles(true);

    try {
      const currentIds = new Set(groupRoleAssignments.map((a) => a.role_id));
      const selectedIds = new Set(selectedRoleIds);

      const toAdd = Array.from(selectedIds).filter((id) => !currentIds.has(id));
      const toRemove = groupRoleAssignments.filter(
        (a) => !selectedIds.has(a.role_id)
      );

      for (const roleId of toAdd) {
        const resp = await fetch(`/api/group-roles/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ group_id: roleModalGroup.id, role_id: roleId }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          const msg = (data as any).message || "Failed to add role";
          addToast(msg, "error");
        }
      }

      for (const assignment of toRemove) {
        const resp = await fetch(`/api/group-roles/${assignment.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          const msg = (data as any).message || "Failed to remove role";
          addToast(msg, "error");
        }
      }

      addToast("Group roles updated", "success");
      closeRoleModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving group roles", err);
      addToast("Failed to update roles", "error");
    } finally {
      setSavingRoles(false);
    }
  };

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((g) =>
      `${g.name} ${g.description || ""}`.toLowerCase().includes(term)
    );
  }, [groups, searchTerm]);

  const indexOfFirst = (currentPage - 1) * perPage + 1;
  const indexOfLast = Math.min(currentPage * perPage, totalCount);

  const roleCountForGroup = (groupId: number) =>
    groupRoleAssignments.filter((a) => a.group_id === groupId).length;

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Group"
        message="Are you sure you want to delete this group? Users will lose this membership."
        itemName={deleteGroupName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Role assignment modal */}
      {roleModalOpen && roleModalGroup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-semibold text-black dark:text-white">
                Roles for group: {roleModalGroup.name}
              </h5>
              <button
                type="button"
                onClick={closeRoleModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2 mb-4">
              {roles.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No roles defined yet. Create roles first.
                </p>
              )}

              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-start gap-3 p-2 rounded-md border border-gray-100 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-[#111827] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => toggleRoleSelection(role.id)}
                  />
                  <div>
                    <div className="font-medium text-sm text-black dark:text-white">
                      {role.name}
                    </div>
                    {role.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {role.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeRoleModal}
                className="px-4 py-2 rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#111827]"
                disabled={savingRoles}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRoles}
                className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                disabled={savingRoles}
              >
                {savingRoles && (
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="trezo-card mb-[25px] bg-white dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#1f2937]">
        <div className="trezo-card-header flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-[#1f2937]">
          <div>
            <h5 className="!mb-1">User Groups</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Define logical groups and attach roles to shape permissions.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-100 dark:border-[#1f2937] h-[36px] rounded-md w-full text-xs text-black dark:text-white pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Group
            </button>
          </div>
        </div>

        <div className="trezo-card-body p-5 overflow-x-auto">
          {/* Inline create/edit form */}
          <div className="mb-4 p-3 rounded-md bg-gray-50 dark:bg-[#111827] border border-dashed border-gray-200 dark:border-[#1f2937] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-[34px] rounded-md border border-gray-200 dark:border-[#1f2937] bg-white dark:bg-[#020617] text-xs text-black dark:text-white px-2.5"
                  placeholder="e.g. Project Managers"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full h-[34px] rounded-md border border-gray-200 dark:border-[#1f2937] bg-white dark:bg-[#020617] text-xs text-black dark:text-white px-2.5"
                  placeholder="Short summary of this group"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              {editingGroup && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#020617]"
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveGroup}
                className="px-3 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1"
                disabled={saving}
              >
                {saving && (
                  <span className="material-symbols-outlined animate-spin text-[16px]">
                    progress_activity
                  </span>
                )}
                {editingGroup ? "Update Group" : "Create Group"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
              Loading groups...
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
              No groups defined yet.
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#1f2937] text-xs text-gray-500 dark:text-gray-400">
                    <th className="py-2 px-3 text-left font-medium">Group</th>
                    <th className="py-2 px-3 text-left font-medium">Description</th>
                    <th className="py-2 px-3 text-left font-medium">Roles</th>
                    <th className="py-2 px-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map((group) => (
                    <tr
                      key={group.id}
                      className="border-b border-gray-50 dark:border-[#111827] last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-[#111827] transition-colors"
                    >
                      <td className="py-3 px-3 align-top text-sm font-medium text-black dark:text-white">
                        {group.name}
                      </td>
                      <td className="py-3 px-3 align-top text-xs text-gray-600 dark:text-gray-300 min-w-[200px]">
                        {group.description || (
                          <span className="text-gray-400 dark:text-gray-500">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top text-xs">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                          <span className="material-symbols-outlined text-[14px]">
                            shield_person
                          </span>
                          {group.roles ? group.roles.length : "—"} roles
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top text-right text-xs">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openRoleModal(group)}
                            className="px-2.5 py-1 rounded-md border border-primary-100 text-primary-600 hover:bg-primary-50 dark:border-primary-500/40 dark:text-primary-200 dark:hover:bg-primary-500/10 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              shield
                            </span>
                            Roles
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(group)}
                            className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#020617] flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(group)}
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
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  Showing <span className="font-medium text-black dark:text-white">{indexOfFirst}</span>–
                  <span className="font-medium text-black dark:text-white">{indexOfLast}</span> of
                  <span className="font-medium text-black dark:text-white"> {totalCount}</span> groups
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  <span className="px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserGroupsTable;
