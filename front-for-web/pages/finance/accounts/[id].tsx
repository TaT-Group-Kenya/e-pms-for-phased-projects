"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";

interface AccountMeta {
  id: number;
  code: string;
  name: string;
  description?: string;
  type?: string;
  group?: string;
  currency?: string;
}

interface AccountStatementRow {
  source: string;
  source_id: number;
  transaction_number: string | null;
  transaction_type: string | null;
  transaction_date: string | null;
  posted_date: string | null;
  narration: string | null;
  transaction_currency: string | null;
  base_currency: string | null;
  amount: number | null;
  converted_amount: number | null;
  tax_amount: number | null;
  net_amount: number | null;
  converted_tax_amount: number | null;
  converted_net_amount: number | null;
  customer_name: string | null;
  company_name: string | null;
  debit_base: number;
  credit_base: number;
  running_balance_base: number;
}

interface AccountStatementResponse {
  data: AccountStatementRow[];
  meta: {
    account: AccountMeta | null;
    total_debit_base: number;
    total_credit_base: number;
    closing_balance_base: number;
    from?: string | null;
    to?: string | null;
  };
}

const AccountStatementPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [statement, setStatement] = useState<AccountStatementResponse | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);

  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState<string>("");
  const [topupDate, setTopupDate] = useState<string>("");
  const [topupNarration, setTopupNarration] = useState<string>("");
  const [toppingUp, setToppingUp] = useState(false);

  useEffect(() => {
    if (!id || !accessToken) return;

    const controller = new AbortController();

    const fetchStatement = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (fromDate) params.append("from", fromDate);
        if (toDate) params.append("to", toDate);

        const url = `/api/accounts/${id}/statement${params.toString() ? `?${params.toString()}` : ""}`;

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load account statement", "error");
          setStatement(null);
          return;
        }

        setStatement(data as AccountStatementResponse);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch account statement error", err);
        addToast("Error loading account statement. Please try again.", "error");
        setStatement(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();

    return () => controller.abort();
  }, [id, accessToken, fromDate, toDate, reloadKey, addToast]);

  const account = statement?.meta.account ?? null;

  const rows = useMemo(() => statement?.data ?? [], [statement]);

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setReloadKey((k) => k + 1);
  };

  const handleOpenTopup = () => {
    if (!account) {
      addToast("Account details not loaded yet.", "error");
      return;
    }

    setTopupAmount("");
    setTopupNarration("Account top-up");
    setTopupDate(new Date().toISOString().slice(0, 10));
    setShowTopupModal(true);
  };

  const handleSubmitTopup = async () => {
    if (!id) return;

    if (!accessToken) {
      addToast("You must be logged in to top up this account.", "error");
      return;
    }

    const amount = parseFloat(topupAmount || "0");
    if (!topupAmount || Number.isNaN(amount) || amount <= 0) {
      addToast("Please enter a valid top-up amount greater than zero.", "error");
      return;
    }

    setToppingUp(true);
    try {
      const payload: any = {
        amount,
        narration: topupNarration.trim() || undefined,
      };
      if (topupDate) {
        payload.transaction_date = topupDate;
      }

      const resp = await fetch(`/api/accounts/${id}/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        const message = data?.message || "Failed to top up account";
        addToast(message, "error");
        return;
      }

      addToast("Account topped up successfully.", "success");
      setShowTopupModal(false);
      setTopupAmount("");
      setTopupNarration("");
      setReloadKey((k) => k + 1);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("account topup error", err);
      addToast("Failed to top up account.", "error");
    } finally {
      setToppingUp(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;
    if (!accessToken) {
      addToast("You must be logged in to download.", "error");
      return;
    }

    try {
      const params = new URLSearchParams();
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const url = `/api/accounts/statement-pdf?id=${encodeURIComponent(
        String(id),
      )}${params.toString() ? `&${params.toString()}` : ""}`;

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!resp.ok) {
        let message = "Failed to download PDF";
        try {
          const data: any = await resp.json();
          message = data?.message || message;
        } catch {
          // ignore
        }
        addToast(message, "error");
        return;
      }

      const blob = await resp.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `account-${account?.code || id}-statement.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("account statement pdf download error", err);
      addToast("Error downloading PDF.", "error");
    }
  };

  const handleExportCsv = () => {
    if (!rows.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "Source",
      "TransactionNumber",
      "TransactionDate",
      "PostedDate",
      "CustomerName",
      "CompanyName",
      "Narration",
      "DebitBase",
      "CreditBase",
      "RunningBalanceBase",
    ];

    const dataRows = rows.map((row) => [
      row.source,
      row.transaction_number ?? "",
      row.transaction_date ?? "",
      row.posted_date ?? "",
      row.customer_name ?? "",
      row.company_name ?? "",
      row.narration ?? "",
      row.debit_base ?? 0,
      row.credit_base ?? 0,
      row.running_balance_base ?? 0,
    ]);

    const csv = [headers, ...dataRows]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `account-${account?.code || id}-statement.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-[12px] md:space-y-[16px]">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/finance/accounts")}
            className="inline-flex items-center px-[10px] py-[6px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
          >
            <i className="material-symbols-outlined text-[16px] mr-[4px]">arrow_back</i>
            Back to accounts
          </button>
        </div>

        <div className="space-y-[20px] md:space-y-[25px]">
        <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] flex flex-col md:flex-row md:items-center md:justify-between gap-[15px]">
          <div className="space-y-[6px]">
            <h1 className="text-base md:text-lg font-semibold text-black dark:text-white">
              {account ? `${account.name} (${account.code})` : "Account Statement"}
            </h1>
            {account?.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl">
                {account.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 dark:text-gray-300">
              {account?.type && (
                <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-gray-100 dark:bg-[#111827]">
                  Type: {account.type}
                </span>
              )}
              {account?.group && (
                <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-gray-100 dark:bg-[#111827]">
                  Group: {account.group}
                </span>
              )}
              {account?.currency && (
                <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  Currency: {account.currency}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-[6px]">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Closing Balance
            </div>
            <div className="text-lg font-semibold text-black dark:text-white">
              {statement
                ? `${account?.currency || "KES"} ${Number(
                    statement.meta.closing_balance_base ?? 0,
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "-"}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500">
              Debits: {Number(statement?.meta.total_debit_base ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              | Credits: {Number(statement?.meta.total_credit_base ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <button
              type="button"
              onClick={handleOpenTopup}
              className="mt-[6px] inline-flex items-center px-[10px] py-[6px] rounded-md bg-primary-500 text-white text-xs font-medium hover:bg-primary-600"
            >
              <i className="material-symbols-outlined text-[16px] mr-[4px]">account_balance_wallet</i>
              Top up account
            </button>
          </div>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[16px] md:p-[20px]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[12px] mb-[12px] md:mb-[15px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <div className="flex flex-col gap-[4px]">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Date from</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-[10px] py-[6px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="text-[11px] text-gray-500 dark:text-gray-400">Date to</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-[10px] py-[6px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-[18px] px-[10px] py-[6px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
              >
                Clear filters
              </button>
            </div>

            <div className="flex items-center gap-[8px] self-stretch md:self-auto justify-start md:justify-end w-full md:w-auto">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="ml-auto px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
            <table className="min-w-[900px] w-full">
              <thead className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#15203c]">
                <tr>
                  <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Date</th>
                  <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Posted</th>
                  <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Trans No.</th>
                  <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Customer</th>
                  <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Company</th>
                  <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Narration</th>
                  <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Debit</th>
                  <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Credit</th>
                  <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Running Balance</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-900 dark:text-gray-100">
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-[10px] py-[10px] text-center text-sm text-gray-500 dark:text-gray-400">
                      Loading statement...
                    </td>
                  </tr>
                )}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-[10px] py-[12px] text-center text-sm text-gray-500 dark:text-gray-400">
                      No transactions found for this account.
                    </td>
                  </tr>
                )}

                {!loading &&
                  rows.map((row, index) => (
                    <tr
                      key={`${row.source}-${row.source_id}-${index}`}
                      className="border-t border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#111827]"
                    >
                      <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">
                        {row.transaction_date ? new Date(row.transaction_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">
                        {row.posted_date ? new Date(row.posted_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">{row.transaction_number || "-"}</td>
                      <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">{row.customer_name || "-"}</td>
                      <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">{row.company_name || "-"}</td>
                      <td className="px-[10px] py-[6px] text-xs max-w-[260px] truncate" title={row.narration || undefined}>
                        {row.narration || "-"}
                      </td>
                      <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                        {Number(row.debit_base ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                        {Number(row.credit_base ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap font-medium">
                        {Number(row.running_balance_base ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>

      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-[20px] md:p-[24px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">Top up account</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[16px]">
              Record a manual top-up to increase this account&apos;s balance. A transaction entry
              will be created in the finance ledger.
            </p>

            <div className="space-y-[12px] mb-[18px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Amount ({account?.currency || "KES"})</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Date</label>
                <input
                  type="date"
                  value={topupDate}
                  onChange={(e) => setTopupDate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Narration</label>
                <textarea
                  rows={3}
                  value={topupNarration}
                  onChange={(e) => setTopupNarration(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setShowTopupModal(false)}
                disabled={toppingUp}
                className="px-[12px] py-[7px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitTopup}
                disabled={toppingUp}
                className="px-[12px] py-[7px] rounded-md bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {toppingUp ? "Topping up..." : "Confirm top up"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AuthenticatedLayout>
  );
};

export default AccountStatementPage;
