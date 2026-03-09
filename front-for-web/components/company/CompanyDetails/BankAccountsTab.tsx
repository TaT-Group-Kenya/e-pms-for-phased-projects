"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../../../hooks/useToast";
import { formatApiError } from "../../../utils/errorHandler";
import Can from "../../auth/Can";

interface BankAccount {
  id: number;
  company_id: number;
  type: string;
  account_no: string;
  swiftcode?: string;
  branch?: string;
  account_holder_name: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
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
  users: any[];
  assignments: any[];
  bank_accounts: BankAccount[];
  invoices: any[];
}

interface BankAccountsTabProps {
  companyId: string;
  company: CompanyDetailsData;
  onRefresh: () => Promise<void>;
  accessToken: string;
}
const bankAccountSchema = z.object({
  type: z.string().min(1, "Account type is required"),
  account_no: z.string().min(1, "Account number is required"),
  swiftcode: z.string().optional(),
  branch: z.string().min(1, "Branch is required"),
  account_holder_name: z.string().min(1, "Account holder name is required"),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;
type BankAccountFormField = "type" | "account_no" | "swiftcode" | "branch" | "account_holder_name";

const BankAccountsTab: React.FC<BankAccountsTabProps> = ({
  companyId,
  company,
  onRefresh,
  accessToken,
}) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddBankAccountModal, setShowAddBankAccountModal] = useState(false);
  const [accountTypes, setAccountTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingAccountTypes, setLoadingAccountTypes] = useState(false);
  const [submittingBankAccount, setSubmittingBankAccount] = useState(false);
  const [editingBankAccountId, setEditingBankAccountId] = useState<number | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    setError: setCreateFieldError,
    formState: { errors: createErrors },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onBlur",
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setError: setEditFieldError,
    formState: { errors: editErrors },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const fetchAccountTypes = async () => {
      setLoadingAccountTypes(true);
      try {
        const response = await fetch("/api/companies/accounts/account-types", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          const types = data.data || data;
          setAccountTypes(Array.isArray(types) ? types : []);
        }
      } catch (err) {
        console.error("Error fetching account types:", err);
      } finally {
        setLoadingAccountTypes(false);
      }
    };

    if (accessToken) {
      fetchAccountTypes();
    }
  }, [accessToken]);

  const handleCreateBankAccount = async (formData: BankAccountFormData) => {
    setSubmittingBankAccount(true);
    try {
      const response = await fetch(`/api/companies/accounts/company-bank-accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          company_id: companyId,
          type: formData.type,
          account_no: formData.account_no,
          swiftcode: formData.swiftcode,
          branch: formData.branch,
          account_holder_name: formData.account_holder_name,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const formattedError = data ? formatApiError(data) : "Failed to create bank account";

        if (data && data.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([field, messages]) => {
            const key = field as BankAccountFormField;
            if (!( ["type", "account_no", "swiftcode", "branch", "account_holder_name"] as string[]).includes(key)) {
              return;
            }

            let message: string | undefined;
            if (Array.isArray(messages) && messages.length > 0) {
              message = String(messages[0]);
            } else if (typeof messages === "string") {
              message = messages;
            }

            if (message) {
              setCreateFieldError(key, { type: "server", message });
            }
          });
        }

        addToast(formattedError, "error");
        return;
      }

      addToast("Bank account added successfully", "success");

      // Re-fetch company data to get updated bank accounts
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      // Reset form and close modal
      resetCreateForm();
      setShowAddBankAccountModal(false);
    } catch (err) {
      console.error("Error creating bank account:", err);
      const errorMsg = "Error creating bank account";
      addToast(errorMsg, "error");
    } finally {
      setSubmittingBankAccount(false);
    }
  };

  const handleEditBankAccount = (account: BankAccount) => {
    setEditingBankAccountId(account.id);
    resetEditForm({
      type: account.type || "",
      account_no: account.account_no || "",
      swiftcode: account.swiftcode || "",
      branch: account.branch || "",
      account_holder_name: account.account_holder_name || "",
    });
  };

  const handleUpdateBankAccount = async (formData: BankAccountFormData) => {
    if (!editingBankAccountId) {
      addToast("Invalid bank account selection", "error");
      return;
    }

    setSubmittingBankAccount(true);
    try {
      const response = await fetch(`/api/companies/accounts/${editingBankAccountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const formattedError = data ? formatApiError(data) : "Failed to update bank account";

        if (data && data.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([field, messages]) => {
            const key = field as BankAccountFormField;
            if (!( ["type", "account_no", "swiftcode", "branch", "account_holder_name"] as string[]).includes(key)) {
              return;
            }
            let message: string | undefined;
            if (Array.isArray(messages) && messages.length > 0) {
              message = String(messages[0]);
            } else if (typeof messages === "string") {
              message = messages;
            }
            if (message) {
              setEditFieldError(key, { type: "server", message });
            }
          });
        }

        addToast(formattedError, "error");
        setSubmittingBankAccount(false);
        return;
      }

      addToast("Bank account updated successfully", "success");

      // Re-fetch company data to get updated bank accounts
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      setEditingBankAccountId(null);
      resetEditForm();
    } catch (err) {
      console.error("Error updating bank account:", err);
      const errorMsg = "Error updating bank account";
      addToast(errorMsg, "error");
    } finally {
      setSubmittingBankAccount(false);
    }
  };

  const handleDeleteBankAccountClick = (accountId: number) => {
    setDeleteConfirmId(accountId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    setShowDeleteConfirmModal(false);
    setSubmittingBankAccount(true);

    try {
      const response = await fetch(`/api/companies/accounts/${deleteConfirmId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to delete bank account";
        addToast(errorMsg, "error");
        setSubmittingBankAccount(false);
        return;
      }

      addToast("Bank account deleted successfully", "success");

      // Re-fetch company data to get updated bank accounts
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }
    } catch (err) {
      console.error("Error deleting bank account:", err);
      const errorMsg = "Error deleting bank account";
      addToast(errorMsg, "error");
    } finally {
      setSubmittingBankAccount(false);
      setDeleteConfirmId(null);
    }
  };

  const filterData = (data: BankAccount[], term: string) => {
    if (!term) return data;
    return data.filter((item) =>
      ["account_holder_name", "account_no", "type", "branch"].some((field) =>
        String(item[field as keyof BankAccount] || "")
          .toLowerCase()
          .includes(term.toLowerCase())
      )
    );
  };

  const filteredAccounts = filterData(company.bank_accounts, searchTerm);

  return (
    <div>
      <div className="flex items-center justify-between mb-[15px]">
        <h6 className="font-semibold text-black dark:text-white">
          Bank Accounts
        </h6>
        <Can any={["ROLE_ADD_COMPANY_BANK"]}>
          <button
            type="button"
            onClick={() => setShowAddBankAccountModal(true)}
            className="inline-flex items-center gap-[8px] bg-primary-500 hover:bg-primary-600 text-white font-medium py-[8px] px-[16px] rounded-md transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Account
          </button>
        </Can>
      </div>

      {company.bank_accounts.length === 0 ? (
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">
            There are no bank accounts yet, when there are, they will be shown here
          </p>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search bank accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#0c1427] text-black dark:text-white"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Account Holder
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Account Number
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Branch
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Swift Code
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">{account.account_holder_name}</td>
                    <td className="py-3 px-4">{account.account_no}</td>
                    <td className="py-3 px-4">{account.type}</td>
                    <td className="py-3 px-4">{account.branch || "N/A"}</td>
                    <td className="py-3 px-4">{account.swiftcode || "N/A"}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-[8px]">
                        <Can any={["ROLE_EDIT_COMPANY_BANK"]}>
                          <button
                            onClick={() => handleEditBankAccount(account)}
                            className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit account"
                            disabled={submittingBankAccount}
                          >
                            <span className="material-symbols-outlined !text-[16px]">edit</span>
                          </button>
                        </Can>
                        <Can any={["ROLE_DELETE_COMPANY_BANK"]}>
                          <button
                            onClick={() => handleDeleteBankAccountClick(account.id)}
                            className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete account"
                            disabled={submittingBankAccount}
                          >
                            <span className="material-symbols-outlined !text-[16px] text-danger-500">delete</span>
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddBankAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[500px] w-full mx-[20px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                Add Bank Account for {company.name}
              </h5>
              <button
                type="button"
                onClick={() => {
                  resetCreateForm();
                  setShowAddBankAccountModal(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit(handleCreateBankAccount)}>
              <div className="space-y-[15px]">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Type
                  </label>
                  <select
                    {...registerCreate("type")}
                    disabled={loadingAccountTypes}
                    className={`w-full px-[12px] py-[10px] rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border ${
                      createErrors.type ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select account type</option>
                    {accountTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {createErrors.type && (
                    <p className="text-danger-500 text-xs mt-1">{createErrors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    {...registerCreate("account_holder_name")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      createErrors.account_holder_name ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter account holder name"
                  />
                  {createErrors.account_holder_name && (
                    <p className="text-danger-500 text-xs mt-1">{createErrors.account_holder_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    {...registerCreate("account_no")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      createErrors.account_no ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter account number"
                  />
                  {createErrors.account_no && (
                    <p className="text-danger-500 text-xs mt-1">{createErrors.account_no.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    {...registerCreate("branch")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      createErrors.branch ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter branch name"
                  />
                  {createErrors.branch && (
                    <p className="text-danger-500 text-xs mt-1">{createErrors.branch.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Swift Code
                  </label>
                  <input
                    type="text"
                    {...registerCreate("swiftcode")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      createErrors.swiftcode ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter swift code"
                  />
                  {createErrors.swiftcode && (
                    <p className="text-danger-500 text-xs mt-1">{createErrors.swiftcode.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-[10px] mt-[25px]">
                <button
                  type="button"
                  onClick={() => {
                    resetCreateForm();
                    setShowAddBankAccountModal(false);
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-[10px] px-[15px] rounded-md transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBankAccount}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium py-[10px] px-[15px] rounded-md transition-all"
                >
                  {submittingBankAccount ? "Adding..." : "Add Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bank Account Modal */}
      {editingBankAccountId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[500px] w-full mx-[20px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                Edit Bank Account for {company.name}
              </h5>
              <button
                type="button"
                onClick={() => {
                  resetEditForm();
                  setEditingBankAccountId(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit(handleUpdateBankAccount)}>
              <div className="space-y-[15px]">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Type
                  </label>
                  <select
                    {...registerEdit("type")}
                    disabled={loadingAccountTypes}
                    className={`w-full px-[12px] py-[10px] rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border ${
                      editErrors.type ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select account type</option>
                    {accountTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.type && (
                    <p className="text-danger-500 text-xs mt-1">{editErrors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    {...registerEdit("account_holder_name")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      editErrors.account_holder_name ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter account holder name"
                  />
                  {editErrors.account_holder_name && (
                    <p className="text-danger-500 text-xs mt-1">{editErrors.account_holder_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    {...registerEdit("account_no")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      editErrors.account_no ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter account number"
                  />
                  {editErrors.account_no && (
                    <p className="text-danger-500 text-xs mt-1">{editErrors.account_no.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    {...registerEdit("branch")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      editErrors.branch ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter branch name"
                  />
                  {editErrors.branch && (
                    <p className="text-danger-500 text-xs mt-1">{editErrors.branch.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Swift Code
                  </label>
                  <input
                    type="text"
                    {...registerEdit("swiftcode")}
                    className={`w-full px-[12px] py-[10px] rounded-md text-black dark:text-white border ${
                      editErrors.swiftcode ? "border-danger-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-[#1a2942] focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter swift code"
                  />
                  {editErrors.swiftcode && (
                    <p className="text-danger-500 text-xs mt-1">{editErrors.swiftcode.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-[10px] mt-[25px]">
                <button
                  type="button"
                  onClick={() => {
                    resetEditForm();
                    setEditingBankAccountId(null);
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-[10px] px-[15px] rounded-md transition-all"
                >
                  Cancel
                </button>
                <Can any={["ROLE_EDIT_COMPANY_BANK"]}>
                  <button
                    type="submit"
                    disabled={submittingBankAccount}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium py-[10px] px-[15px] rounded-md transition-all"
                  >
                    {submittingBankAccount ? "Updating..." : "Update Account"}
                  </button>
                </Can>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[400px] w-full mx-[20px]">
            <div className="flex items-center justify-center mb-[20px]">
              <div className="w-[56px] h-[56px] rounded-full bg-danger-100 dark:bg-danger-900/20 flex items-center justify-center">
                <i className="material-symbols-outlined text-danger-500 text-[32px]">warning</i>
              </div>
            </div>

            <h5 className="text-lg font-semibold text-black dark:text-white text-center mb-[10px]">
              Delete Bank Account
            </h5>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-[25px]">
              Are you sure you want to delete this bank account? This action cannot be undone.
            </p>

            <div className="flex gap-[10px]">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-[10px] px-[15px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submittingBankAccount}
              >
                Cancel
              <Can any={["ROLE_DELETE_COMPANY_BANK"]}>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-danger-500 hover:bg-danger-600 text-white font-medium py-[10px] px-[15px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submittingBankAccount}
                >
                  {submittingBankAccount ? "Deleting..." : "Delete"}
                </button>
              </Can>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsTab;
