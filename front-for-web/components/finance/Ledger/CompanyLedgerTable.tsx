"use client";

import React from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { useFilterOptions } from "../../../hooks/useFilterOptions";
import { ToastContainer } from "../../common/Toast";
import PaginationFooter from "../../common/PaginationFooter";
import FilterSelect from "../../common/FilterSelect";
import Link from "next/link";

interface CompanyLedgerRow {
  id: number;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  posted_date?: string | null;
  amount: number;
  tax_amount?: number | null;
  net_amount?: number | null;
  transaction_currency?: string | null;
  company_id?: number | null;
  company_name?: string | null;
  category?: string | null;
  transaction_status?: string | null;
  company_invoice_invoice_number?: string | null;
  company_invoice_project_bol_number?: string | null;
  created_by_user_name?: string | null;
}

const CompanyLedgerTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  // Server-side listing: pagination, debounced search, company/currency/
  // posted-date filters all reach the API via useListQuery.
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
  } = useListQuery<CompanyLedgerRow>("/api/finance/company-ledger/list", {
    accessToken,
    onError: (message) => addToast(message, "error"),
  });

  const companyFilterId = filters.company_id || "";
  const currencyFilter = filters.transaction_currency || "";
  const postedFrom = filters.date_from || "";
  const postedTo = filters.date_to || "";
  const hasExtraFilters =
    !!searchInput || companyFilterId !== "" || currencyFilter !== "" || postedFrom !== "" || postedTo !== "";

  // Option lists built from the current page's rows (small distinct sets).
  const companyOptions = Array.from(
    new Map(
      rows
        .filter((r) => r.company_id != null)
        .map((r) => [String(r.company_id), r.company_name || String(r.company_id)])
    ).entries()
  ).map(([value, label]) => ({ value, label }));
  const currencyOptions = Array.from(
    new Set(rows.map((r) => r.transaction_currency).filter(Boolean))
  ).sort() as string[];


  const handleExportCsv = () => {
    if (!rows.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "Date",
      "Invoice Number",
      "Service Provider",
      "Type",
      "BOL Number",
      "Amount (Net)",
      "Tax Amount",
      "Total Amount",
      "Created By",
    ];

    const dataRows = rows.map((r) => [
      r.transaction_date ?? "",
      r.company_invoice_invoice_number ?? "",
      r.company_name ?? (r.company_id != null ? String(r.company_id) : ""),
      r.transaction_type ?? "",
      r.company_invoice_project_bol_number ?? "",
      r.net_amount != null ? r.net_amount : "",
      r.tax_amount != null ? r.tax_amount : "",
      r.amount != null ? r.amount : "",
      r.created_by_user_name ?? "",
    ]);

    const csv = [headers, ...dataRows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "company-ledger.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const from = rows.length ? (page - 1) * perPage + 1 : 0;
  const to = rows.length ? (page - 1) * perPage + rows.length : 0;

  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 flex flex-wrap gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by number, type, category, status..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Company:</span>
            <select
              value={companyFilterId}
              onChange={(e) => setFilter("company_id", e.target.value)}
              disabled={loading}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[140px]"
            >
              <option value="">All companies</option>
              {companyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Txn Currency:</span>
            <select
              value={currencyFilter}
              onChange={(e) => setFilter("transaction_currency", e.target.value)}
              disabled={loading}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[120px]"
            >
              <option value="">All currencies</option>
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Posted:</span>
            <input
              type="date"
              value={postedFrom}
              onChange={(e) => setFilter("date_from", e.target.value)}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={postedTo}
              onChange={(e) => setFilter("date_to", e.target.value)}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
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
          <table className="w-full min-w-[900px]">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Date
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Invoice #
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Service Provider
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Type
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  BOL Number
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Amount (Net)
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Tax
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Total
                </th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Created By
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
                    colSpan={9}
                    className="text-center text-sm px-[10px] py-[8px] text-gray-500 dark:text-gray-400"
                  >
                    Loading company ledger...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center text-sm px-[10px] py-[16px] text-danger-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center text-sm px-[10px] py-[16px] text-gray-500 dark:text-gray-400"
                  >
                    No ledger entries found.
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
                      {r.company_invoice_invoice_number || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] capitalize whitespace-nowrap">
                      {r.company_name || r.company_id || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.transaction_type || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] capitalize whitespace-nowrap">
                      {r.company_invoice_project_bol_number || "-"}
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
                      {r.tax_amount != null
                        ? `${r.tax_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.transaction_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      {r.amount != null
                        ? `${r.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.transaction_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.created_by_user_name || "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      <Link
                        href={`/finance/company-ledger/${r.id}`}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

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
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default CompanyLedgerTable;
