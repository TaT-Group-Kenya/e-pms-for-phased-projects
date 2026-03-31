"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

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
  jobReferenceId?: string | null;
  transactedBy?: string | null;
}

const AccountPayablesReportTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [rows, setRows] = useState<CompanyPaymentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [companyFilterId, setCompanyFilterId] = useState("");
  const [projectFilterId, setProjectFilterId] = useState("");
  const [invoiceFilterId, setInvoiceFilterId] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCompanyPayments = async () => {
      if (!accessToken) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const resp = await fetch(
          `/api/finance/company-payments/list?page=${page}&per_page=${perPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }
        );

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load company payments", "error");
          setRows([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CompanyPaymentSummary[] = (items || []).map((p: any) => {
          const invoice = p.invoice || null;

          let companyName: string | null = null;
          let companyId: number | null = null;
          let projectName: string | null = null;
          let projectId: number | null = null;
          let invoiceNumber: string | null = null;
          let invoiceId: number | null = null;
          let jobReferenceId: string | null = null;

          if (invoice) {
            if (invoice.invoice_number) {
              invoiceNumber = String(invoice.invoice_number);
            }
            if (invoice.id != null) {
              invoiceId = Number(invoice.id);
            }

            if (invoice.company) {
              if (invoice.company.name) {
                companyName = String(invoice.company.name);
              }
              if (invoice.company.id != null) {
                companyId = Number(invoice.company.id);
              }
            }

            if (invoice.project) {
              const label = invoice.project.name || invoice.project.title || invoice.project.code;
              if (label) {
                projectName = String(label);
              }
              if (invoice.project.id != null) {
                projectId = Number(invoice.project.id);
              }
              if (invoice.project.job_reference_id) {
                jobReferenceId = String(invoice.project.job_reference_id);
              }
            }
          }

          return {
            id: Number(p.id),
            transaction_number: p.transaction_number ?? null,
            amount_paid: Number(p.amount_paid ?? 0),
            payment_date: p.payment_date ?? null,
            payment_method: p.payment_method ?? null,
            payment_status: p.payment_status ?? null,
            currency: p.currency ?? null,
            transactedBy: p.created_by_user ? `${p.created_by_user.first_name} ${p.created_by_user.last_name}` : null,
            companyName,
            companyId,
            projectName,
            projectId,
            invoiceNumber,
            invoiceId,
            jobReferenceId,
          };
        });

        setRows(mapped);

        const totalValue =
          typeof data?.meta?.total === "number"
            ? data.meta.total
            : Array.isArray(data?.data)
            ? data.data.length
            : Array.isArray(data)
            ? data.length
            : mapped.length;
        setTotal(totalValue);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch company payments error", err);
        addToast("Error loading company payments.", "error");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyPayments();

    return () => controller.abort();
  }, [accessToken, addToast, page, perPage]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const fromTime = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const toTime = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return rows.filter((p) => {
      if (fromTime || toTime) {
        const paidTime = p.payment_date ? new Date(p.payment_date).getTime() : null;

        if (fromTime && (paidTime === null || paidTime < fromTime)) {
          return false;
        }

        if (toTime && (paidTime === null || paidTime > toTime)) {
          return false;
        }
      }

      if (companyFilterId && p.companyId != null) {
        if (String(p.companyId) !== companyFilterId) {
          return false;
        }
      }

      if (projectFilterId && p.projectId != null) {
        if (String(p.projectId) !== projectFilterId) {
          return false;
        }
      }

      if (invoiceFilterId && p.invoiceId != null) {
        if (String(p.invoiceId) !== invoiceFilterId) {
          return false;
        }
      }

      if (currencyFilter) {
        if ((p.currency || "") !== currencyFilter) {
          return false;
        }
      }

      return (
        (p.transaction_number || "").toLowerCase().includes(term) ||
        (p.payment_method || "").toLowerCase().includes(term) ||
        (p.payment_status || "").toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, fromDate, toDate, companyFilterId, projectFilterId, invoiceFilterId]);

  const companyOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((p) => {
      if (p.companyId != null) {
        const key = String(p.companyId);
        if (!map.has(key)) {
          map.set(key, p.companyName || key);
        }
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const projectOptions = useMemo(() => {
    const map = new Map<string, string>();

    rows.forEach((p) => {
      if (p.projectId != null) {
        const key = String(p.projectId);
        if (!map.has(key)) {
          map.set(key, p.projectName || key);
        }
      }
    });

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const invoiceOptions = useMemo(() => {
    const map = new Map<string, string>();

    rows.forEach((p) => {
      if (p.invoiceId != null) {
        const key = String(p.invoiceId);
        if (!map.has(key)) {
          map.set(key, p.invoiceNumber || key);
        }
      }
    });

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const currencyOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((p) => {
      if (p.currency) {
        set.add(p.currency);
      }
    });
    return Array.from(set.values()).sort();
  }, [rows]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCompanyFilterId("");
    setProjectFilterId("");
    setInvoiceFilterId("");
    setCurrencyFilter("");
  };

  const totalPages = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;

  const handleChangePerPage = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

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
    const rowsSource = filteredRows;

    if (!rowsSource.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Company",
      "Job Reference ID",
      "Invoice Number",
      "Amount Paid",
      "Transacted By",
    ];

    const csvRows = rowsSource.map((p) => [
      p.id,
      p.payment_date ?? "",
      p.companyName ?? "",
      p.jobReferenceId ?? "",
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
    link.setAttribute("download", "company-payments.csv");
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
              <input
                type="text"
                placeholder="Search ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />

              <div className="flex items-center gap-2">
                <select
                  value={companyFilterId}
                  onChange={(e) => setCompanyFilterId(e.target.value)}
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
                <select
                  value={projectFilterId}
                  onChange={(e) => setProjectFilterId(e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[140px]"
                >
                  <option value="">All projects</option>
                  {projectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={invoiceFilterId}
                  onChange={(e) => setInvoiceFilterId(e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[140px]"
                >
                  <option value="">All invoices</option>
                  {invoiceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value)}
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
                <span className="text-xs text-gray-500 dark:text-gray-400">Date from:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Date to:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Rows per page:</span>
                <select
                  value={perPage}
                  onChange={(e) => handleChangePerPage(Number(e.target.value) || 25)}
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
                onClick={handleClearFilters}
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
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Company</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Job Reference ID</th>
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
                    Loading company payments...
                  </td>
                </tr>
              )}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-sm px-[15px] py-[12px] text-gray-500">
                    No company payments found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredRows.map((p) => (
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
                      {p.jobReferenceId || "-"}
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 dark:border-[#172036]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {total > 0
              ? `Showing ${(page - 1) * perPage + 1} to ${Math.min(page * perPage, total)} of ${total}`
              : "No records"}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={page <= 1}
              className={`px-[10px] py-[6px] rounded-md border text-xs font-medium flex items-center gap-1 transition-colors ${
                page <= 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-primary-200 text-primary-600 hover:bg-primary-50"
              }`}
            >
              <span className="material-symbols-outlined !text-[16px]">chevron_left</span>
              Previous
            </button>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className={`px-[10px] py-[6px] rounded-md border text-xs font-medium flex items-center gap-1 transition-colors ${
                page >= totalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-primary-200 text-primary-600 hover:bg-primary-50"
              }`}
            >
              Next
              <span className="material-symbols-outlined !text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default AccountPayablesReportTable;
