"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";

interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  avatar_pic?: string;
  category: string;
  is_active: boolean;
  company_id?: number;
  customer_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface CompanyDetailsData {
  id: number;
  name: string;
  email: string;
  phone: string;
  contact_person_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  description?: string;
  kra_pin?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by?: number;
  users: User[];
  assignments: any[];
  bank_accounts: any[];
  invoices: any[];
}

interface UsersTabProps {
  companyId: string;
  company: CompanyDetailsData;
  onRefresh: () => Promise<void>;
  accessToken: string;
}

const UsersTab: React.FC<UsersTabProps> = ({
  companyId,
  company,
  onRefresh,
  accessToken,
}) => {
  const { addToast } = useToast();
  const [userMessage, setUserMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    category: "company",
    is_active: true,
  });
  const [submittingUser, setSubmittingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUserForm, setEditingUserForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    category: "company",
    is_active: true,
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Auto-dismiss user message after 5 seconds
  useEffect(() => {
    if (userMessage) {
      const timer = setTimeout(() => {
        setUserMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userMessage]);

  const handleCreateUser = async () => {
    if (!userForm.first_name || !userForm.last_name || !userForm.email) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    setSubmittingUser(true);
    try {
      const response = await fetch(`/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          first_name: userForm.first_name,
          middle_name: userForm.middle_name || null,
          last_name: userForm.last_name,
          email: userForm.email,
          category: userForm.category,
          is_active: userForm.is_active,
          company_id: userForm.category === "company" ? companyId : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to create user";
        addToast(errorMsg, "error");
        setUserMessage({ type: 'error', text: errorMsg });
        setSubmittingUser(false);
        return;
      }

      addToast("User added successfully", "success");
      setUserMessage({ type: 'success', text: 'User added successfully' });

      // Re-fetch company data to get updated users
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      // Reset form and close modal
      setUserForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        category: "company",
        is_active: true,
      });
      setShowAddUserModal(false);
    } catch (err) {
      console.error("Error creating user:", err);
      const errorMsg = "Error creating user";
      addToast(errorMsg, "error");
      setUserMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditingUserForm({
      first_name: user.first_name,
      middle_name: user.middle_name || "",
      last_name: user.last_name,
      email: user.email,
      category: user.category,
      is_active: user.is_active,
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUserId || !editingUserForm.first_name || !editingUserForm.last_name || !editingUserForm.email) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUserForm.email)) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    setSubmittingUser(true);
    try {
      const response = await fetch(`/api/users/${editingUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          first_name: editingUserForm.first_name,
          middle_name: editingUserForm.middle_name || null,
          last_name: editingUserForm.last_name,
          email: editingUserForm.email,
          category: editingUserForm.category,
          is_active: editingUserForm.is_active,
          company_id: editingUserForm.category === "company" ? companyId : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to update user";
        addToast(errorMsg, "error");
        setUserMessage({ type: 'error', text: errorMsg });
        setSubmittingUser(false);
        return;
      }

      addToast("User updated successfully", "success");
      setUserMessage({ type: 'success', text: 'User updated successfully' });

      // Re-fetch company data to get updated users
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      setEditingUserId(null);
      setEditingUserForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        category: "company",
        is_active: true,
      });
    } catch (err) {
      console.error("Error updating user:", err);
      const errorMsg = "Error updating user";
      addToast(errorMsg, "error");
      setUserMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleDeleteUserClick = (userId: number) => {
    setDeleteConfirmId(userId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    setShowDeleteConfirmModal(false);
    setSubmittingUser(true);

    try {
      const response = await fetch(`/api/users/${deleteConfirmId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to delete user";
        addToast(errorMsg, "error");
        setUserMessage({ type: 'error', text: errorMsg });
        setSubmittingUser(false);
        return;
      }

      addToast("User deleted successfully", "success");
      setUserMessage({ type: 'success', text: 'User deleted successfully' });

      // Re-fetch company data to get updated users
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMsg = "Error deleting user";
      addToast(errorMsg, "error");
      setUserMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmittingUser(false);
      setDeleteConfirmId(null);
    }
  };

  const filterData = (data: User[], term: string) => {
    if (!term) return data;
    return data.filter((item) =>
      ["first_name", "middle_name", "last_name", "email", "category"].some((field) =>
        String(item[field as keyof User] || "")
          .toLowerCase()
          .includes(term.toLowerCase())
      )
    );
  };

  const filteredUsers = filterData(company.users, searchTerm);

  return (
    <div>
      <div className="flex items-center justify-between mb-[15px]">
        <h6 className="font-semibold text-black dark:text-white">
          Users
        </h6>
        <button
          type="button"
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center gap-[8px] bg-primary-500 hover:bg-primary-600 text-white font-medium py-[8px] px-[16px] rounded-md transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add User
        </button>
      </div>

      {userMessage && (
        <div
          className={`mb-[20px] p-[15px] rounded-md flex items-center gap-[10px] animate-pulse ${
            userMessage.type === 'success'
              ? 'bg-green-50 dark:bg-[#1a3a2a] border border-green-200 dark:border-green-900'
              : 'bg-red-50 dark:bg-[#3a1a1a] border border-red-200 dark:border-red-900'
          }`}
        >
          <i
            className={`material-symbols-outlined !text-[20px] ${
              userMessage.type === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {userMessage.type === 'success' ? 'check_circle' : 'error'}
          </i>
          <p
            className={`${
              userMessage.type === 'success'
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}
          >
            {userMessage.text}
          </p>
        </div>
      )}

      {company.users.length === 0 ? (
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">
            There are no users yet, when there are, they will be shown here
          </p>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#0c1427] text-black dark:text-white"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-[8px]">
                        {user.avatar_pic && (
                          <img
                            src={user.avatar_pic}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span>
                          {user.first_name} {user.middle_name ? user.middle_name + " " : ""}{user.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-[#172036] text-blue-700 dark:text-blue-300">
                        {user.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 dark:bg-[#1a3a2a] text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-[#172036] text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-[8px]">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit user"
                          disabled={submittingUser || editingUserId !== null}
                        >
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUserClick(user.id)}
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete user"
                          disabled={submittingUser}
                        >
                          <span className="material-symbols-outlined !text-[16px] text-danger-500">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {(showAddUserModal || editingUserId !== null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[500px] w-full mx-[20px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                {editingUserId !== null ? 'Edit User' : 'Add New User'}
              </h5>
              <button
                type="button"
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUserId(null);
                  setEditingUserForm({
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    email: "",
                    category: "company",
                    is_active: true,
                  });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-[15px]">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingUserId !== null ? editingUserForm.first_name : userForm.first_name}
                  onChange={(e) => {
                    if (editingUserId !== null) {
                      setEditingUserForm({ ...editingUserForm, first_name: e.target.value });
                    } else {
                      setUserForm({ ...userForm, first_name: e.target.value });
                    }
                  }}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={editingUserId !== null ? editingUserForm.middle_name : userForm.middle_name}
                  onChange={(e) => {
                    if (editingUserId !== null) {
                      setEditingUserForm({ ...editingUserForm, middle_name: e.target.value });
                    } else {
                      setUserForm({ ...userForm, middle_name: e.target.value });
                    }
                  }}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter middle name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingUserId !== null ? editingUserForm.last_name : userForm.last_name}
                  onChange={(e) => {
                    if (editingUserId !== null) {
                      setEditingUserForm({ ...editingUserForm, last_name: e.target.value });
                    } else {
                      setUserForm({ ...userForm, last_name: e.target.value });
                    }
                  }}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editingUserId !== null ? editingUserForm.email : userForm.email}
                  onChange={(e) => {
                    if (editingUserId !== null) {
                      setEditingUserForm({ ...editingUserForm, email: e.target.value });
                    } else {
                      setUserForm({ ...userForm, email: e.target.value });
                    }
                  }}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingUserId !== null ? editingUserForm.category : userForm.category}
                  onChange={(e) => {
                    if (editingUserId !== null) {
                      setEditingUserForm({ ...editingUserForm, category: e.target.value });
                    } else {
                      setUserForm({ ...userForm, category: e.target.value });
                    }
                  }}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {/* <option value="internal">Internal</option> */}
                  <option value="company">Company</option>
                  {/* <option value="customer">Customer</option> */}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-[8px] text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUserId !== null ? editingUserForm.is_active : userForm.is_active}
                    onChange={(e) => {
                      if (editingUserId !== null) {
                        setEditingUserForm({ ...editingUserForm, is_active: e.target.checked });
                      } else {
                        setUserForm({ ...userForm, is_active: e.target.checked });
                      }
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  Active
                </label>
              </div>

              {editingUserId === null && (
                <div className="bg-blue-50 dark:bg-[#1a2942] border border-blue-200 dark:border-[#2a3f5f] p-3 rounded-md">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> A random password will be generated and sent to the user's email.
                  </p>
                </div>
              )}

              <div className="flex gap-[10px] pt-[15px]">
                <button
                  type="button"
                  onClick={() => {
                    if (editingUserId !== null) {
                      handleUpdateUser();
                    } else {
                      handleCreateUser();
                    }
                  }}
                  disabled={submittingUser}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-[10px] px-[16px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingUser ? 'Processing...' : editingUserId !== null ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditingUserId(null);
                    setEditingUserForm({
                      first_name: "",
                      middle_name: "",
                      last_name: "",
                      email: "",
                      category: "company",
                      is_active: true,
                    });
                  }}
                  disabled={submittingUser}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-[10px] px-[16px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[400px] w-full mx-[20px]">
            <div className="flex items-center justify-between mb-[15px]">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                Delete User
              </h5>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-[20px]">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="flex gap-[10px]">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={submittingUser}
                className="flex-1 bg-danger-500 hover:bg-danger-600 text-white font-medium py-[10px] px-[16px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingUser ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                disabled={submittingUser}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-[10px] px-[16px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
