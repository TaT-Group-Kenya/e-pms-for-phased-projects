"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";

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

const BankAccountsTab: React.FC<BankAccountsTabProps> = ({
  companyId,
  company,
  onRefresh,
  accessToken,
}) => {
  const { addToast } = useToast();
  const [bankAccountMessage, setBankAccountMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddBankAccountModal, setShowAddBankAccountModal] = useState(false);
  const [bankAccountForm, setBankAccountForm] = useState({
    type: "",
    account_no: "",
    swiftcode: "",
    branch: "",
    account_holder_name: "",
  });
  const [accountTypes, setAccountTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingAccountTypes, setLoadingAccountTypes] = useState(false);
  const [submittingBankAccount, setSubmittingBankAccount] = useState(false);
  const [editingBankAccountId, setEditingBankAccountId] = useState<number | null>(null);
  const [editingBankAccountForm, setEditingBankAccountForm] = useState({
    type: "",
    account_no: "",
    swiftcode: "",
    branch: "",
    account_holder_name: "",
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Auto-dismiss bank account message after 5 seconds
  useEffect(() => {
    if (bankAccountMessage) {
      const timer = setTimeout(() => {
        setBankAccountMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [bankAccountMessage]);

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

  const handleCreateBankAccount = async () => {
    if (!bankAccountForm.type || !bankAccountForm.account_no || !bankAccountForm.swiftcode || 
        !bankAccountForm.branch || !bankAccountForm.account_holder_name) {
      addToast("Please fill in all required fields", "error");
      return;
    }

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
          type: bankAccountForm.type,
          account_no: bankAccountForm.account_no,
          swiftcode: bankAccountForm.swiftcode,
          branch: bankAccountForm.branch,
          account_holder_name: bankAccountForm.account_holder_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to create bank account";
        addToast(errorMsg, "error");
        setBankAccountMessage({ type: 'error', text: errorMsg });
        setSubmittingBankAccount(false);
        return;
      }

      addToast("Bank account added successfully", "success");
      setBankAccountMessage({ type: 'success', text: 'Bank account added successfully' });

      // Re-fetch company data to get updated bank accounts
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      // Reset form and close modal
      setBankAccountForm({
        type: "",
        account_no: "",
        swiftcode: "",
        branch: "",
        account_holder_name: "",
      });
      setShowAddBankAccountModal(false);
    } catch (err) {
      console.error("Error creating bank account:", err);
      const errorMsg = "Error creating bank account";
      addToast(errorMsg, "error");
      setBankAccountMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmittingBankAccount(false);
    }
  };

  const handleEditBankAccount = (account: BankAccount) => {
    setEditingBankAccountId(account.id);
    setEditingBankAccountForm({
      type: account.type,
      account_no: account.account_no,
      swiftcode: account.swiftcode || "",
      branch: account.branch || "",
      account_holder_name: account.account_holder_name,
    });
  };

  const handleUpdateBankAccount = async () => {
    if (!editingBankAccountId || !editingBankAccountForm.type || !editingBankAccountForm.account_no || 
        !editingBankAccountForm.swiftcode || !editingBankAccountForm.branch || !editingBankAccountForm.account_holder_name) {
      addToast("Please fill in all required fields", "error");
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
        body: JSON.stringify(editingBankAccountForm),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to update bank account";
        addToast(errorMsg, "error");
        setBankAccountMessage({ type: 'error', text: errorMsg });
        setSubmittingBankAccount(false);
        return;
      }

      addToast("Bank account updated successfully", "success");
      setBankAccountMessage({ type: 'success', text: 'Bank account updated successfully' });

      // Re-fetch company data to get updated bank accounts
      try {
        await onRefresh();
      } catch (refetchErr) {
        console.error("Error refetching company:", refetchErr);
      }

      setEditingBankAccountId(null);
      setEditingBankAccountForm({
        type: "",
        account_no: "",
        swiftcode: "",
        branch: "",
        account_holder_name: "",
      });
    } catch (err) {
      console.error("Error updating bank account:", err);
      const errorMsg = "Error updating bank account";
      addToast(errorMsg, "error");
      setBankAccountMessage({ type: 'error', text: errorMsg });
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
        setBankAccountMessage({ type: 'error', text: errorMsg });
        setSubmittingBankAccount(false);
        return;
      }

      addToast("Bank account deleted successfully", "success");
      setBankAccountMessage({ type: 'success', text: 'Bank account deleted successfully' });

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
      setBankAccountMessage({ type: 'error', text: errorMsg });
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
        <button
          type="button"
          onClick={() => setShowAddBankAccountModal(true)}
          className="inline-flex items-center gap-[8px] bg-primary-500 hover:bg-primary-600 text-white font-medium py-[8px] px-[16px] rounded-md transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Account
        </button>
      </div>

      {bankAccountMessage && (
        <div
          className={`mb-[20px] p-[15px] rounded-md flex items-center gap-[10px] animate-pulse ${
            bankAccountMessage.type === 'success'
              ? 'bg-green-50 dark:bg-[#1a3a2a] border border-green-200 dark:border-green-900'
              : 'bg-red-50 dark:bg-[#3a1a1a] border border-red-200 dark:border-red-900'
          }`}
        >
          <i
            className={`material-symbols-outlined !text-[20px] ${
              bankAccountMessage.type === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {bankAccountMessage.type === 'success' ? 'check_circle' : 'error'}
          </i>
          <p
            className={`${
              bankAccountMessage.type === 'success'
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}
          >
            {bankAccountMessage.text}
          </p>
        </div>
      )}

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
                        <button
                          onClick={() => handleEditBankAccount(account)}
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit account"
                          disabled={submittingBankAccount}
                        >
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBankAccountClick(account.id)}
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-[#172036] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete account"
                          disabled={submittingBankAccount}
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

      {/* Add Bank Account Modal */}
      {showAddBankAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[500px] w-full mx-[20px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                Add Bank Account
              </h5>
              <button
                type="button"
                onClick={() => setShowAddBankAccountModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-[15px]">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  value={bankAccountForm.type}
                  onChange={(e) => setBankAccountForm({ ...bankAccountForm, type: e.target.value })}
                  disabled={loadingAccountTypes}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select account type</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankAccountForm.account_holder_name}
                  onChange={(e) => setBankAccountForm({ ...bankAccountForm, account_holder_name: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter account holder name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankAccountForm.account_no}
                  onChange={(e) => setBankAccountForm({ ...bankAccountForm, account_no: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={bankAccountForm.branch}
                  onChange={(e) => setBankAccountForm({ ...bankAccountForm, branch: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter branch name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Swift Code
                </label>
                <input
                  type="text"
                  value={bankAccountForm.swiftcode}
                  onChange={(e) => setBankAccountForm({ ...bankAccountForm, swiftcode: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter swift code"
                />
              </div>
            </div>

            <div className="flex gap-[10px] mt-[25px]">
              <button
                type="button"
                onClick={() => setShowAddBankAccountModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-[10px] px-[15px] rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBankAccount}
                disabled={submittingBankAccount}
                className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium py-[10px] px-[15px] rounded-md transition-all"
              >
                {submittingBankAccount ? "Adding..." : "Add Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bank Account Modal */}
      {editingBankAccountId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg p-[25px] max-w-[500px] w-full mx-[20px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                Edit Bank Account
              </h5>
              <button
                type="button"
                onClick={() => setEditingBankAccountId(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-[15px]">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  value={editingBankAccountForm.type}
                  onChange={(e) => setEditingBankAccountForm({ ...editingBankAccountForm, type: e.target.value })}
                  disabled={loadingAccountTypes}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select account type</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={editingBankAccountForm.account_holder_name}
                  onChange={(e) => setEditingBankAccountForm({ ...editingBankAccountForm, account_holder_name: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter account holder name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={editingBankAccountForm.account_no}
                  onChange={(e) => setEditingBankAccountForm({ ...editingBankAccountForm, account_no: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={editingBankAccountForm.branch}
                  onChange={(e) => setEditingBankAccountForm({ ...editingBankAccountForm, branch: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter branch name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Swift Code
                </label>
                <input
                  type="text"
                  value={editingBankAccountForm.swiftcode}
                  onChange={(e) => setEditingBankAccountForm({ ...editingBankAccountForm, swiftcode: e.target.value })}
                  className="w-full px-[12px] py-[10px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a2942] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter swift code"
                />
              </div>
            </div>

            <div className="flex gap-[10px] mt-[25px]">
              <button
                type="button"
                onClick={() => setEditingBankAccountId(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-[10px] px-[15px] rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateBankAccount}
                disabled={submittingBankAccount}
                className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-medium py-[10px] px-[15px] rounded-md transition-all"
              >
                {submittingBankAccount ? "Updating..." : "Update Account"}
              </button>
            </div>
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
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-danger-500 hover:bg-danger-600 disabled:bg-gray-400 text-white font-medium py-[10px] px-[15px] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submittingBankAccount}
              >
                {submittingBankAccount ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsTab;
