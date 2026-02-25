"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

interface SysGroup {
  id: number;
  name: string;
  description?: string | null;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  category?: string | null;
  is_active: boolean;
  company_id?: number | null;
  customer_id?: number | null;
  groups?: SysGroup[];
}

interface PaginationData<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface UserGroupAssignment {
  id: number;
  user_id: number;
  sys_group_id: number;
}

const UsersTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken) as string | null;
  const { toasts, addToast, removeToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deleteUserName, setDeleteUserName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Group assignment state
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupModalUser, setGroupModalUser] = useState<User | null>(null);
  const [allGroups, setAllGroups] = useState<SysGroup[]>([]);
  const [userGroupAssignments, setUserGroupAssignments] = useState<
    UserGroupAssignment[]
  >([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [savingGroups, setSavingGroups] = useState(false);

  const perPage = 15;

  // Fetch users
  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const url = new URL(`/api/users/list`, window.location.origin);
        url.searchParams.append("page", String(currentPage));
        url.searchParams.append("per_page", String(perPage));
        // Ask backend to include related groups
        url.searchParams.append("with", "company,customer,groups");

        const resp = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const data: PaginationData<User> = await resp.json();
        if (!resp.ok) {
          addToast("Failed to load users", "error");
          setUsers([]);
          return;
        }

        const list = data.data || (Array.isArray(data) ? (data as any) : []);
        setUsers(list as User[]);
        setTotalPages(data.last_page || 1);
        setTotalCount(data.total || list.length || 0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("Error fetching users", err);
        addToast("Error loading users. Please refresh.", "error");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [accessToken, currentPage, perPage, addToast]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Delete helpers
  const openDeleteModal = (user: User) => {
    setDeleteUserId(user.id);
    setDeleteUserName(`${user.first_name} ${user.last_name}`.trim());
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteUserId(null);
    setDeleteUserName("");
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUserId || !accessToken) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const resp = await fetch(`/api/users/${deleteUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = (data as any).message || "Failed to delete user";
        setDeleteError(msg);
        addToast(msg, "error");
        return;
      }

      addToast("User deleted successfully", "success");
      closeDeleteModal();
      // Optimistic refresh
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      setTotalCount((prev) => Math.max(prev - 1, 0));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Error deleting user", err);
      const msg = err?.message || "Failed to delete user";
      setDeleteError(msg);
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Group assignment
  const openGroupModal = async (user: User) => {
    if (!accessToken) return;

    setGroupModalUser(user);
    setGroupModalOpen(true);
    setSavingGroups(false);

    try {
      // Fetch all groups
      const groupsResp = await fetch(
        `/api/sys-groups/list?page=1&per_page=500`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const groupsData: PaginationData<SysGroup> = await groupsResp.json();
      const groups = (groupsData.data || []) as SysGroup[];
      setAllGroups(groups);

      // Fetch existing assignments for this user
      const ugResp = await fetch(
        `/api/user-groups/list?page=1&per_page=500&user_id=${user.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const ugData: PaginationData<UserGroupAssignment> = await ugResp.json();
      const assignments = (ugData.data || []) as UserGroupAssignment[];
      setUserGroupAssignments(assignments);
      setSelectedGroupIds(assignments.map((a) => a.sys_group_id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error loading groups/assignments", err);
      addToast("Failed to load groups for user", "error");
    }
  };

  const closeGroupModal = () => {
    setGroupModalOpen(false);
    setGroupModalUser(null);
    setAllGroups([]);
    setUserGroupAssignments([]);
    setSelectedGroupIds([]);
    setSavingGroups(false);
  };

  const toggleGroupSelection = (groupId: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSaveGroups = async () => {
    if (!groupModalUser || !accessToken) return;

    setSavingGroups(true);

    try {
      const currentIds = new Set(userGroupAssignments.map((a) => a.sys_group_id));
      const selectedIds = new Set(selectedGroupIds);

      const toAdd = Array.from(selectedIds).filter((id) => !currentIds.has(id));
      const toRemove = userGroupAssignments.filter(
        (a) => !selectedIds.has(a.sys_group_id)
      );

      // Create new assignments
      for (const groupId of toAdd) {
        const resp = await fetch(`/api/user-groups/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: groupModalUser.id,
            sys_group_id: groupId,
          }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          const msg = (data as any).message || "Failed to assign group";
          addToast(msg, "error");
        }
      }

      // Remove unselected assignments
      for (const assignment of toRemove) {
        const resp = await fetch(`/api/user-groups/${assignment.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          const msg = (data as any).message || "Failed to remove group";
          addToast(msg, "error");
        }
      }

      addToast("User groups updated", "success");

      // Update local users state to reflect new groups
      setUsers((prev) =>
        prev.map((u) =>
          u.id === groupModalUser.id
            ? {
                ...u,
                groups: allGroups.filter((g) => selectedGroupIds.includes(g.id)),
              }
            : u
        )
      );

      closeGroupModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving user groups", err);
      addToast("Failed to update user groups", "error");
    } finally {
      setSavingGroups(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) => {
      const fullName = `${u.first_name} ${u.middle_name || ""} ${u.last_name}`
        .toLowerCase()
        .trim();
      return (
        fullName.includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.category || "").toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  const indexOfFirst = (currentPage - 1) * perPage + 1;
  const indexOfLast = Math.min(currentPage * perPage, totalCount);

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={deleteUserName}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Group assignment modal */}
      {groupModalOpen && groupModalUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-semibold text-black dark:text-white">
                Manage Groups for {groupModalUser.first_name} {groupModalUser.last_name}
              </h5>
              <button
                type="button"
                onClick={closeGroupModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2 mb-4">
              {allGroups.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No groups found. Create groups first in the User Groups tab.
                </p>
              )}

              {allGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-start gap-3 p-2 rounded-md border border-gray-100 dark:border-[#1f2937] hover:bg-gray-50 dark:hover:bg-[#111827] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    checked={selectedGroupIds.includes(group.id)}
                    onChange={() => toggleGroupSelection(group.id)}
                  />
                  <div>
                    <div className="font-medium text-sm text-black dark:text-white">
                      {group.name}
                    </div>
                    {group.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {group.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeGroupModal}
                className="px-4 py-2 rounded-md border border-gray-200 dark:border-[#1f2937] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#111827]"
                disabled={savingGroups}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGroups}
                className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                disabled={savingGroups}
              >
                {savingGroups && (
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
            <h5 className="!mb-1">Users</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage application users and quickly review their group memberships.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 dark:bg-[#111827] border border-gray-100 dark:border-[#1f2937] h-[38px] rounded-md w-full text-xs text-black dark:text-white pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="trezo-card-body p-5 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
              No users found.
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#1f2937] text-xs text-gray-500 dark:text-gray-400">
                    <th className="py-2 px-3 text-left font-medium">User</th>
                    <th className="py-2 px-3 text-left font-medium">Email</th>
                    <th className="py-2 px-3 text-left font-medium">Category</th>
                    <th className="py-2 px-3 text-left font-medium">Groups</th>
                    <th className="py-2 px-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 dark:border-[#111827] last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-[#111827] transition-colors"
                    >
                      <td className="py-3 px-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-black dark:text-white">
                            {user.first_name} {user.middle_name || ""} {user.last_name}
                          </span>
                          <span className="text-[11px] mt-0.5 inline-flex items-center gap-1">
                            <span
                              className={`inline-flex h-[18px] px-2 rounded-full items-center justify-center text-[10px] font-medium capitalize ${
                                user.is_active
                                  ? "bg-green-50 text-green-600 dark:bg-[#064e3b] dark:text-green-200"
                                  : "bg-gray-100 text-gray-500 dark:bg-[#111827] dark:text-gray-400"
                              }`}
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top text-xs text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="py-3 px-3 align-top text-xs">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-200 capitalize">
                          {user.category || "n/a"}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top text-xs">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(user.groups || []).length === 0 && (
                            <span className="text-gray-400 dark:text-gray-500 text-[11px]">
                              No groups
                            </span>
                          )}
                          {(user.groups || []).map((g) => (
                            <span
                              key={g.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-[#111827] dark:text-gray-200 text-[11px]"
                            >
                              {g.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top text-right text-xs">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openGroupModal(user)}
                            className="px-2.5 py-1 rounded-md border border-primary-100 text-primary-600 hover:bg-primary-50 dark:border-primary-500/40 dark:text-primary-200 dark:hover:bg-primary-500/10 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              group
                            </span>
                            Groups
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(user)}
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
                  <span className="font-medium text-black dark:text-white"> {totalCount}</span> users
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

export default UsersTable;
