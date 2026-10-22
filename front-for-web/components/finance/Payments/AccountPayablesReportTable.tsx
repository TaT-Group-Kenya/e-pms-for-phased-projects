"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { ToastContainer } from "../../common/Toast";
import PaginationFooter from "../../common/PaginationFooter";

interface CompanyPaymentSummary {
  id: number;
  amount_paid: number;
  payment_date?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  currency?: string | null;
  transaction_number?: string | null;
  companyName?: string | null;
  companyId?: number | null;
  projectName?: string | null;
  projectId?: number | null;
  invoiceNumber?: string | null;
  invoiceId?: number | null;
  bolNumber?: string | null;
  transactedBy?: string | null;
}

const AccountPayablesReportTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

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
    rows: unfilteredRows,
    loading,
    error,
    meta,
  } = useListQuery<CompanyPaymentSummary>("/api/finance/company-payments/list", {
    accessToken,
    onError: (message) => addToast(message, "error"),
  });

  // Date/company/currency filters now go to the API via `filters`.
  const fromDate = filters.date_from || "";
  const toDate = filters.date_to || "";
  const companyFilterId = filters.company_id || "";
  const currencyFilter = filters.currency || "";
  const hasExtraFilters =
    !!searchInput || fromDate !== "" || toDate !== "" || companyFilterId !== "" || currencyFilter !== "";

  const rows = unfilteredRows;

  const formatCurrency = (value: number, currency?: string | null) => {
    if (Number.isNaN(value)) return "-";
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);
    } catch {
      return value.toFixed(2);
    }
  };

  const handleExportCsv = () => {
    const rowsSource = rows;

    if (!rowsSource.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Service Provider",
      "BOL Number",
      "Invoice Number",
      "Amount Paid",
      "Transacted By",
    ];

    const csvRows = rowsSource.map((p) => [
      p.id,
      p.payment_date ?? "",
      p.companyName ?? "",
      p.bolNumber ?? "",
      p.invoiceNumber ?? "",
      formatCurrency(p.amount_paid, p.currency) ?? "",
      p.transactedBy ?? "",
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "service-provider-payments.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden mb-[20px]">
        <div className="trezo-card-header flex flex-col md:flex-row items-start md:items-center justify-between p-5 gap-[15px]">
          <div className="flex flex-wrap items-center gap-2 justify-start w-full md:flex-1 mt-[10px] md:mt-0">
              {(hasExtraFilters) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-[4px] h-[36px] px-[10px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 whitespace-nowrap"
                  title="Clear all filters"
                >
                  <i className="material-symbols-outlined !text-[16px]">filter_alt_off</i>
                  Clear
                </button>
              )}
              <input
                type="text"
                placeholder="Search (number, provider)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-48 md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />

              <div className="flex items-center gap-2">
                <select
                  value={companyFilterId}
                  onChange={(e) => setFilter("company_id", e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[140px]"
                >
                  <option value="">All Service Providers</option>
                  {Array.from(
                    new Map(
                      rows
                        .filter((p) => p.companyId != null)
                        .map((p) => [String(p.companyId), p.companyName || String(p.companyId)])
                    ).entries()
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={currencyFilter}
                  onChange={(e) => setFilter("currency", e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[120px]"
                >
                  <option value="">All currencies</option>
                  {Array.from(new Set(rows.map((p) => p.currency).filter(Boolean) as string[])).sort().map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Date from:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFilter("date_from", e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Date to:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setFilter("date_to", e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Rows per page:</span>
                <select
                  value={perPage}
                  onChange={(e) => changePerPage(Number(e.target.value) || 25)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[8px] py-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="px-[10px] py-[6px] rounded-md border border-amber-500 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100"
              >
                Clear filters
              </button>

          </div>

          <div className="flex items-center justify-end w-full md:w-auto mt-[10px] md:mt-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-[12px] py-[8px] rounded-md bg-primary-500 border border-primary-200 dark:border-[#172036] text-sm font-medium text-white dark:text-gray-300 hover:bg-primary-500 dark:hover:bg-[#111827]"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">ID</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Date</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Service Provider</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">BOL Number</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Invoice Number</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Amount Paid</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Transacted By</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center text-sm px-[15px] py-[12px]">
                    Loading Service Provider payments...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={8} className="text-center px-[15px] py-[12px] text-danger-500">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-sm px-[15px] py-[12px] text-gray-500">
                    No Service Provider payments found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 dark:border-[#172036] align-middle"
                  >
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">{p.id}</td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.payment_date
                        ? new Date(p.payment_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.companyName || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.bolNumber || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.invoiceNumber || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {formatCurrency(p.amount_paid, p.currency)}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.transactedBy ? p.transactedBy : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {p.id != null ? (
                        <Link
                          href={`/finance/payments/payables/${p.id}`}
                          className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                        >
                          View
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default AccountPayablesReportTable;
