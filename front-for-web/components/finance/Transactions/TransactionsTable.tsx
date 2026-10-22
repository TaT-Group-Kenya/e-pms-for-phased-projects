"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { useFilterOptions } from "../../../hooks/useFilterOptions";
import { ToastContainer } from "../../common/Toast";
import PaginationFooter from "../../common/PaginationFooter";
import FilterSelect from "../../common/FilterSelect";

interface TxnRow {
  id: number;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  posted_date?: string | null;
  amount: number;
  transaction_currency?: string | null;
  base_currency?: string | null;
  exchange_rate?: number | null;
  converted_amount?: number | null;
  tax_amount?: number | null;
  net_amount?: number | null;
  converted_tax_amount?: number | null;
  converted_net_amount?: number | null;
  customer_id?: number | null;
  company_id?: number | null;
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
  customer?: any;
  company?: any;
  paymentMethod?: any;
  costCenter?: any;
  relatedTransaction?: any;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | number | null;
  updated_by?: string | number | null;
}

const TransactionsTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  // Server-side listing: pagination, debounced search and filters live in
  // useListQuery; this component keeps its own columns/cells/export.
  const {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    clearFilters,
    page,
    setPage,
    perPage,
    changePerPage,
    rows,
    loading,
    error,
    meta,
  } = useListQuery<TxnRow>("/api/finance/transactions/list", {
    accessToken,
    onError: (message) => addToast(message, "error"),
  });

  const typeFilter = filters.transaction_type || "";
  const statusFilter = filters.transaction_status || "";
  const currencyFilter = filters.base_currency || "";
  const hasExtraFilters =
    !!searchInput || typeFilter !== "" || statusFilter !== "" || currencyFilter !== "";

  // Option lists built from the current page's rows (small distinct sets).
  const typeOptions = Array.from(
    new Set(rows.map((r) => r.transaction_type).filter(Boolean))
  ) as string[];
  const statusOptions = Array.from(
    new Set(rows.map((r) => r.transaction_status).filter(Boolean))
  ) as string[];
  const currencyOptions = Array.from(
    new Set(rows.map((r) => r.base_currency).filter(Boolean))
  ).sort() as string[];

  const handleExportCsv = () => {
    if (!rows.length) {
      addToast("No data to export.", "error");
      return;
    }
  };

  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 flex flex-wrap gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by number, category, narration..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setFilter("transaction_type", e.target.value)}
              disabled={loading}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[130px]"
            >
              <option value="">All types</option>
              {typeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setFilter("transaction_status", e.target.value)}
              disabled={loading}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[130px]"
            >
              <option value="">All statuses</option>
              {statusOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Currency:</span>
            <select
              value={currencyFilter}
              onChange={(e) => setFilter("base_currency", e.target.value)}
              disabled={loading}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[120px]"
            >
              <option value="">All currencies</option>
              {currencyOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            disabled={loading}
            className="px-[10px] py-[6px] rounded-md border border-amber-500 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear filters
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Rows per page:</span>
            <select
              value={perPage}
              onChange={(e) => changePerPage(Number(e.target.value) || 20)}
              disabled={loading}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-[12px] py-[8px] rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 hover:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full min-w-[1800px]">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Date
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Posted
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Number
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Type
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Category
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Status
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Amount
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Tax (Trans)
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Net (Trans)
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Converted Amount
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Tax (Base)
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Net (Base)
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Txn Currency
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Base Currency
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Exchange Rate
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Customer
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Company
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Source
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Accounts (Dr/Cr)
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Payment
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Bank / Check
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Related Txn
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Recurring / Adj.
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  FY / Period
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Cost Center
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Narration
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Audit
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td
                    colSpan={28}
                    className="text-center text-sm px-[10px] py-[8px] text-gray-500 dark:text-gray-400"
                  >
                    Loading transactions...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    colSpan={28}
                    className="text-center text-sm px-[10px] py-[16px] text-danger-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={28}
                    className="text-center text-sm px-[10px] py-[16px] text-gray-500 dark:text-gray-400"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 dark:border-[#172036] align-middle hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                  >
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.transaction_date
                        ? new Date(r.transaction_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.posted_date
                        ? new Date(r.posted_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.transaction_number || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] capitalize whitespace-nowrap">
                      {r.transaction_type || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.category || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] capitalize whitespace-nowrap">
                      {r.transaction_status || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {r.transaction_currency || ""}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.tax_amount != null
                        ? `${r.tax_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.transaction_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.net_amount != null
                        ? `${r.net_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.transaction_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.converted_amount != null
                        ? `${r.converted_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.base_currency || ""}`
                        : r.base_currency || ""}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.converted_tax_amount != null
                        ? `${r.converted_tax_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.base_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.converted_net_amount != null
                        ? `${r.converted_net_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.base_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.transaction_currency || ""}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.base_currency || ""}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.exchange_rate != null
                        ? r.exchange_rate.toLocaleString(undefined, {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                          })
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.customer && typeof r.customer === "object" && (r.customer as any).name
                        ? String((r.customer as any).name)
                        : r.customer_id ?? "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.company && typeof r.company === "object" && (r.company as any).name
                        ? String((r.company as any).name)
                        : r.company_id ?? "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.source_type || "-"} {r.source_id ? `#${r.source_id}` : ""}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.account_debit != null || r.account_credit != null
                        ? `Dr ${r.account_debit ?? "-"} / Cr ${r.account_credit ?? "-"}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.payment_method || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.bank_account || r.check_number
                        ? `${r.bank_account || "-"} / ${r.check_number || "-"}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.related_transaction_id ?? "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.is_recurring != null || r.is_adjusting_entry != null
                        ? [
                            r.is_recurring != null
                              ? `Recurring: ${r.is_recurring ? "Yes" : "No"}`
                              : null,
                            r.is_adjusting_entry != null
                              ? `Adj: ${r.is_adjusting_entry ? "Yes" : "No"}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" | ")
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.fiscal_year || r.accounting_period
                        ? `${r.fiscal_year ?? "-"} / ${r.accounting_period ?? "-"}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.cost_center_id ?? "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.narration || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      <div className="flex flex-col gap-[2px] text-xs">
                        <span>
                          C: {r.created_at || "-"} {r.created_by ? `(${r.created_by})` : ""}
                        </span>
                        <span>
                          U: {r.updated_at || "-"} {r.updated_by ? `(${r.updated_by})` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      <Link
                        href={`/finance/expenses-and-others/${r.id}`}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !error && (
        <PaginationFooter
          meta={meta}
          page={page}
          perPage={perPage}
          loading={loading}
          onPageChange={setPage}
          onPerPageChange={changePerPage}
        />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default TransactionsTable;
