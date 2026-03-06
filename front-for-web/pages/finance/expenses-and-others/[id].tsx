"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";

interface TransactionDetail {
  id: number;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  posted_date?: string | null;
  amount: number;
  transaction_currency?: string | null;
  base_currency?: string | null;
  exchange_rate: number;
  converted_amount: number;
  converted_tax_amount: number;
  converted_net_amount: number;
  tax_amount: number;
  net_amount: number;
  customer_id?: number | null;
  company_id?: number | null;
  customer_name?: string | null;
  company_name?: string | null;
  source_type?: string | null;
  source_id?: number | null;
  account_debit?: number | null;
  account_credit?: number | null;
  category?: string | null;
  payment_method?: string | null;
  bank_account?: string | null;
  check_number?: string | null;
  transaction_status?: string | null;
  related_transaction_id?: number | null;
  narration?: string | null;
  is_recurring?: boolean | null;
  fiscal_year?: number | null;
  accounting_period?: string | null;
  is_adjusting_entry?: boolean | null;
  cost_center_id?: number | null;
}

const TransactionDetailPageInner: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [entry, setEntry] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const idParam = router.query.id ? String(router.query.id) : undefined;

  useEffect(() => {
    if (!idParam) return;
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/finance/transactions/${idParam}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load transaction", "error");
          setEntry(null);
          return;
        }

        const src = data?.data || data;
        setEntry({
          id: Number(src.id),
          transaction_number: src.transaction_number ?? null,
          transaction_type: src.transaction_type ?? null,
          transaction_date: src.transaction_date ?? null,
          posted_date: src.posted_date ?? null,
          amount: Number(src.amount ?? 0),
          transaction_currency: src.transaction_currency ?? null,
          base_currency: src.base_currency ?? null,
          exchange_rate: Number(src.exchange_rate ?? 1),
          converted_amount: Number(src.converted_amount ?? 0),
          converted_tax_amount: Number(src.converted_tax_amount ?? 0),
          converted_net_amount: Number(src.converted_net_amount ?? 0),
          tax_amount: Number(src.tax_amount ?? 0),
          net_amount: Number(src.net_amount ?? 0),
          customer_id: src.customer_id != null ? Number(src.customer_id) : null,
          company_id: src.company_id != null ? Number(src.company_id) : null,
          customer_name:
            src.customer && typeof src.customer === "object" && src.customer.name
              ? String(src.customer.name)
              : null,
          company_name:
            src.company && typeof src.company === "object" && src.company.name
              ? String(src.company.name)
              : null,
          source_type: src.source_type ?? null,
          source_id: src.source_id != null ? Number(src.source_id) : null,
          account_debit: src.account_debit != null ? Number(src.account_debit) : null,
          account_credit: src.account_credit != null ? Number(src.account_credit) : null,
          category: src.category ?? null,
          payment_method: src.payment_method ?? null,
          bank_account: src.bank_account ?? null,
          check_number: src.check_number ?? null,
          transaction_status: src.transaction_status ?? null,
          related_transaction_id:
            src.related_transaction_id != null ? Number(src.related_transaction_id) : null,
          narration: src.narration ?? null,
          is_recurring:
            src.is_recurring !== undefined && src.is_recurring !== null
              ? Boolean(src.is_recurring)
              : null,
          fiscal_year: src.fiscal_year != null ? Number(src.fiscal_year) : null,
          accounting_period: src.accounting_period ?? null,
          is_adjusting_entry:
            src.is_adjusting_entry !== undefined && src.is_adjusting_entry !== null
              ? Boolean(src.is_adjusting_entry)
              : null,
          cost_center_id: src.cost_center_id != null ? Number(src.cost_center_id) : null,
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("transaction detail error", err);
        addToast("Error loading transaction.", "error");
        setEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    return () => controller.abort();
  }, [idParam, accessToken, addToast]);

  const handleExportPdf = async () => {
    if (!idParam) return;
    if (!accessToken) {
      addToast("You must be logged in to download.", "error");
      return;
    }

    try {
      const resp = await fetch(
        `/api/finance/transactions/download-pdf?id=${encodeURIComponent(idParam)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transaction-${idParam}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("transaction pdf export error", err);
      addToast("Error downloading PDF.", "error");
    }
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  if (!idParam) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Missing transaction ID.</div>;
  }

  return (
    <>
      <div className="mb-[15px] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-[10px] py-[6px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
        >
          <i className="material-symbols-outlined text-[16px] mr-[4px]">arrow_back</i>
          Back
        </button>

        <button
          type="button"
          onClick={handleExportPdf}
          className="inline-flex items-center px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
        >
          Export PDF
        </button>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          {loading && (
            <div className="text-center py-[30px]">
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading transaction...</p>
            </div>
          )}

          {!loading && !entry && (
            <div className="text-center py-[30px]">
              <p className="text-sm text-gray-500 dark:text-gray-400">Transaction not found.</p>
            </div>
          )}

          {entry && (
            <>
              {/* Header summary */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[15px] mb-[20px]">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-[4px]">
                    Transaction #{entry.id}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Detailed view of the transaction and its accounting impact.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-[8px]">
                  {entry.transaction_status && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-xs font-medium bg-primary-50 dark:bg-[#15203c] text-primary-600 dark:text-primary-400">
                      <span className="w-[6px] h-[6px] rounded-full bg-primary-500 mr-[6px]"></span>
                      {entry.transaction_status}
                    </span>
                  )}
                  {entry.transaction_type && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-xs font-medium bg-gray-100 dark:bg-[#111827] text-gray-700 dark:text-gray-300">
                      {entry.transaction_type}
                    </span>
                  )}
                  <span className="inline-flex items-center px-[12px] py-[6px] rounded-md text-xs md:text-sm font-semibold bg-gray-900 text-white dark:bg-primary-500">
                    {entry.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {entry.transaction_currency || entry.base_currency || ""}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="trezo-tabs mb-[20px] md:mb-[25px]">
                <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto whitespace-nowrap">
                  <li className="nav-item inline-block ltr:mr-[30px] rtl:ml-[30px]">
                    <button
                      type="button"
                      onClick={() => handleTabClick(0)}
                      className={`nav-link flex items-center gap-[6px] pb-[10px] transition-all relative text-xs md:text-sm font-medium ${
                        activeTab === 0
                          ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <i className="material-symbols-outlined !text-[18px]">info</i>
                      Overview
                    </button>
                  </li>

                  <li className="nav-item inline-block ltr:mr-[30px] rtl:ml-[30px]">
                    <button
                      type="button"
                      onClick={() => handleTabClick(1)}
                      className={`nav-link flex items-center gap-[6px] pb-[10px] transition-all relative text-xs md:text-sm font-medium ${
                        activeTab === 1
                          ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <i className="material-symbols-outlined !text-[18px]">account_balance</i>
                      Accounting
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tab content */}
              {activeTab === 0 && (
                <div className="space-y-[20px] text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Transaction #</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Company</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.company_name || entry.company_id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Customer</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.customer_name || entry.customer_id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Transaction Date</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_date
                          ? new Date(entry.transaction_date).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Posted Date</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.posted_date
                          ? new Date(entry.posted_date).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Source</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.source_type || "-"} {entry.source_id ? `#${entry.source_id}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Category</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.category || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Payment Method</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_method || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Bank / Cheque</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.bank_account || entry.check_number
                          ? `${entry.bank_account || "-"} / ${entry.check_number || "-"}`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Related Transaction</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.related_transaction_id ?? "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[10px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Narration</p>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] px-[12px] py-[10px]">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {entry.narration || "No narration provided for this transaction."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-[20px] text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Transaction Gross</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {entry.transaction_currency || entry.base_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Transaction Tax</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.tax_amount.toFixed(2)} {entry.transaction_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Transaction Net</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.net_amount.toFixed(2)} {entry.transaction_currency || ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px] mt-[10px]">
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Base Gross</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.converted_amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {entry.base_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Base Tax</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.converted_tax_amount.toFixed(2)} {entry.base_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Base Net</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.converted_net_amount.toFixed(2)} {entry.base_currency || ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Exchange Rate</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.exchange_rate.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Converted Amount</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.converted_amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Accounts</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        Dr {entry.account_debit ?? "-"} / Cr {entry.account_credit ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Fiscal Context</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        FY {entry.fiscal_year ?? "-"} · Period {entry.accounting_period || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Cost Center</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.cost_center_id ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Flags</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {[
                          entry.is_recurring != null
                            ? `Recurring: ${entry.is_recurring ? "Yes" : "No"}`
                            : null,
                          entry.is_adjusting_entry != null
                            ? `Adjusting: ${entry.is_adjusting_entry ? "Yes" : "No"}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" | ") || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default function TransactionDetailPage() {
  return (
    <AuthenticatedLayout>
      <TransactionDetailPageInner />
    </AuthenticatedLayout>
  );
}
