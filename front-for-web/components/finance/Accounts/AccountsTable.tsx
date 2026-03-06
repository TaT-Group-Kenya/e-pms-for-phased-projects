"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal/DeleteConfirmationModal";
import Can from "../../auth/Can";

interface AccountSummary {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  group: string;
  balance: string;
  overdraft_allowed: number;
  currency?: string;
}

interface CurrencyOption {
  id: number;
  code: string;
  name: string;
}

const AccountsTable: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountSummary | null>(null);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<"cash" | "mpesa" | "bank">("cash");
  const [formGroup, setFormGroup] = useState<"Petty" | "Checking" | "Savings">("Petty");
  const [formCurrency, setFormCurrency] = useState("");
  const [formBalance, setFormBalance] = useState("0.00");
  const [formOverdraft, setFormOverdraft] = useState("0");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AccountSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAccounts = async () => {
      if (!accessToken) {
        setLoading(false);
        setAccounts([]);
        return;
      }

      setLoading(true);

      try {
        const url = "/api/accounts/list?page=1&per_page=100";
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);

        if (!resp.ok) {
          addToast(data?.message || "Failed to load accounts", "error");
          setAccounts([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: AccountSummary[] = (items || []).map((acc: any) => ({
          id: Number(acc.id),
          code: String(acc.code ?? ""),
          name: String(acc.name ?? ""),
          description: String(acc.description ?? ""),
          type: String(acc.type ?? ""),
          group: String(acc.group ?? ""),
          balance: String(acc.balance ?? "0"),
          overdraft_allowed: Number(acc.overdraft_allowed ?? 0),
          currency: String(acc.currency ?? acc.currency_code ?? acc.currency?.code ?? ""),
        }));

        setAccounts(mapped);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch accounts error", err);
        addToast("Error loading accounts. Please try again.", "error");
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();

    return () => controller.abort();
  }, [accessToken, addToast, reloadKey]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCurrencies = async () => {
      if (!accessToken) {
        setCurrencies([]);
        return;
      }

      setCurrenciesLoading(true);

      try {
        const url = "/api/currencies/list";
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);

        if (!resp.ok) {
          addToast(data?.message || "Failed to load currencies", "error");
          setCurrencies([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CurrencyOption[] = (items || []).map((c: any) => ({
          id: Number(c.id),
          code: String(c.code ?? ""),
          name: String(c.name ?? ""),
        }));

        setCurrencies(mapped);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch currencies error", err);
        addToast("Error loading currencies. Please try again.", "error");
        setCurrencies([]);
      } finally {
        setCurrenciesLoading(false);
      }
    };

    fetchCurrencies();

    return () => controller.abort();
  }, [accessToken, addToast]);

  const filteredAccounts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return accounts.filter((acc) => {
      const overdraft = acc.overdraft_allowed;
      const overdraftLabel = overdraft === 1 ? "yes" : "no";

      const currencyCode = (acc.currency || "").toLowerCase();

      return (
        acc.code.toLowerCase().includes(term) ||
        acc.name.toLowerCase().includes(term) ||
        acc.description.toLowerCase().includes(term) ||
        acc.type.toLowerCase().includes(term) ||
        acc.group.toLowerCase().includes(term) ||
        currencyCode.includes(term) ||
        overdraftLabel.toLowerCase().includes(term)
      );
    });
  }, [accounts, searchTerm]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormType("cash");
    setFormGroup("Petty");
    setFormCurrency("");
    setFormBalance("0.00");
    setFormOverdraft("0");
  };

  const handleOpenCreate = () => {
    setEditingAccount(null);
    resetForm();
    setFormCurrency("");
    setShowModal(true);
  };

  const handleOpenEdit = (acc: AccountSummary) => {
    setEditingAccount(acc);
    setFormName(acc.name);
    setFormDescription(acc.description);
    setFormType((acc.type as any) || "cash");
    setFormGroup((acc.group as any) || "Petty");
    setFormBalance(acc.balance ?? "0.00");
    const overdraft = acc.overdraft_allowed;
    const value = overdraft === 1 ? "1" : "0";
    setFormOverdraft(value);
    setFormCurrency(acc.currency || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    if (!formName.trim()) {
      addToast("Name is required.", "error");
      return;
    }

    if (!formCurrency) {
      addToast("Currency is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        type: formType,
        group: formGroup,
        currency: formCurrency,
        overdraft_allowed: Number(formOverdraft),
      };

      const isEdit = !!editingAccount;
      const url = isEdit
        ? `/api/accounts/${editingAccount!.id}`
        : "/api/accounts/create";

      const resp = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        const message =
          typeof data === "string"
            ? data
            : data?.message || "Failed to save account";
        addToast(message, "error");
        return;
      }

      addToast(isEdit ? "Account updated successfully." : "Account created successfully.", "success");
      setShowModal(false);
      setEditingAccount(null);
      resetForm();
      setReloadKey((k) => k + 1);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("save account error", err);
      addToast("Failed to save account.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = (acc: AccountSummary) => {
    setDeleteTarget(acc);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setDeleting(true);

    try {
      const resp = await fetch(`/api/accounts/${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        addToast(data?.message || "Failed to delete account", "error");
        return;
      }

      addToast("Account deleted successfully.", "success");
      setReloadKey((k) => k + 1);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("delete account error", err);
      addToast("Failed to delete account.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (!accounts.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "ID",
      "Code",
      "Name",
      "Description",
      "Type",
      "Group",
      "Currency",
      "Balance",
      "OverdraftAllowed",
    ];

    const rows = accounts.map((acc) => [
      acc.id,
      acc.code,
      acc.name,
      acc.description,
      acc.type,
      acc.group,
      acc.currency ?? "",
      acc.balance,
      acc.overdraft_allowed,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "accounts.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const renderOverdraftLabel = (value: AccountSummary["overdraft_allowed"]) => {
    const yes = value === 1;
    const no = value === 0;

    if (yes) return "Yes";
    if (no) return "No";
    return String(value ?? "-");
  };

  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 flex flex-col gap-2 w-full md:w-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Account codes are generated automatically in the backend.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by code, name, type, group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
          >
            Export CSV
          </button>
          <Can any={["ROLE_ADD_ACCOUNT"]}>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
            >
              Add Account
            </button>
          </Can>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Code</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Name</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Type</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Group</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Currency</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Balance</th>
                <th className="font-medium text-center px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Overdraft</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-sm px-[10px] py-[8px] text-gray-500 dark:text-gray-400"
                  >
                    Loading accounts...
                  </td>
                </tr>
              )}

              {!loading && filteredAccounts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-sm px-[10px] py-[16px] text-gray-500 dark:text-gray-400"
                  >
                    No accounts found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b border-gray-100 dark:border-[#172036] align-middle hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                  >
                    <td className="text-sm px-[10px] py-[6px] font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {acc.code}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">{acc.name}</td>
                    <td className="text-sm px-[10px] py-[6px] capitalize whitespace-nowrap">{acc.type}</td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">{acc.group}</td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">{acc.currency || "-"}</td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {Number(acc.balance ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-center whitespace-nowrap">
                      {renderOverdraftLabel(acc.overdraft_allowed)}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => router.push(`/finance/accounts/${acc.id}`)}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                      >
                        View Account Detail
                      </button>
                      <Can any={["ROLE_EDIT_ACCOUNT"]}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(acc)}
                          className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                        >
                          Edit
                        </button>
                      </Can>
                      <Can any={["ROLE_DELETE_ACCOUNT"]}>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(acc)}
                          className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-danger-200 text-xs font-medium text-danger-600 hover:bg-danger-50"
                        >
                          Delete
                        </button>
                      </Can>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              {editingAccount ? "Edit Account" : "Add Account"}
            </h3>

            <div className="space-y-[12px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-xs font-medium mb-[5px]">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Group</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as any)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="Petty">Petty</option>
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Currency</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    // disabled={currenciesLoading || !!editingAccount}
                  >
                    <option value="">Select currency</option>
                    {currencies.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Opening Balance</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formBalance}
                    onChange={(e) => setFormBalance(e.target.value)}
                    disabled
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-gray-50 dark:bg-[#111827] text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Overdraft Allowed</label>
                  <select
                    value={formOverdraft}
                    onChange={(e) => setFormOverdraft(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingAccount(null);
                }}
                disabled={saving}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Account"
        message={
          deleteTarget
            ? `Are you sure you want to delete account "${deleteTarget.name}" (${deleteTarget.code})? This action cannot be undone.`
            : "Are you sure you want to delete this account? This action cannot be undone."
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        isDeleting={deleting}
      />
    </>
  );
};

export default AccountsTable;
