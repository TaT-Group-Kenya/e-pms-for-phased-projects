"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
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
  company_invoice_project_job_reference_id?: string | null;
  created_by_user_name?: string | null;
}

const CompanyLedgerTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [rows, setRows] = useState<CompanyLedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [companyFilterId, setCompanyFilterId] = useState<string>("");
  const [postedFrom, setPostedFrom] = useState("");
  const [postedTo, setPostedTo] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchRows = async () => {
      if (!accessToken) {
        setRows([]);
        setTotal(0);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("per_page", String(perPage));
        if (companyFilterId) {
          params.set("company_id", companyFilterId);
        }

        const resp = await fetch(
          `/api/finance/company-ledger/list?${params.toString()}`,
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
          addToast(data?.message || "Failed to load company ledger", "error");
          setRows([]);
          setTotal(0);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CompanyLedgerRow[] = (items || []).map((r: any) => ({
          id: Number(r.id),
          transaction_number: r.transaction_number ?? null,
          transaction_type: r.transaction_type ?? null,
          transaction_date: r.transaction_date ?? null,
          posted_date: r.posted_date ?? null,
          amount: Number(r.amount ?? 0),
          tax_amount:
            r.tax_amount !== undefined && r.tax_amount !== null
              ? Number(r.tax_amount)
              : null,
          net_amount:
            r.net_amount !== undefined && r.net_amount !== null
              ? Number(r.net_amount)
              : null,
          transaction_currency: r.transaction_currency ?? null,
          company_id: r.company_id != null ? Number(r.company_id) : null,
          company_name:
            r.company && typeof r.company === "object" && r.company.name
              ? String(r.company.name)
              : null,
          category: r.category ?? null,
          transaction_status: r.transaction_status ?? null,
          company_invoice_invoice_number:
            r.companyInvoice && typeof r.companyInvoice === "object"
              ? r.companyInvoice.invoice_number ?? null
              : null,
          company_invoice_project_job_reference_id:
            r.companyInvoice &&
            typeof r.companyInvoice === "object" &&
            r.companyInvoice.project &&
            typeof r.companyInvoice.project === "object"
              ? r.companyInvoice.project.job_reference_id ?? null
              : null,
          created_by_user_name: (() => {
            if (r.createdByUser && typeof r.createdByUser === "object") {
              const fullName = [
                r.createdByUser.first_name,
                r.createdByUser.middle_name,
                r.createdByUser.last_name,
              ]
                .filter((p: any) => !!p)
                .join(" ")
                .trim();

              if (fullName) return fullName;
              if (r.createdByUser.email) return r.createdByUser.email;
            }

            if (r.created_by != null) {
              return String(r.created_by);
            }

            return null;
          })(),
        }));

        setRows(mapped);

        const meta =
          data && typeof data === "object" && "meta" in data ? (data as any).meta : null;

        if (meta) {
          const totalFromMeta = Number(meta.total ?? 0);
          if (!Number.isNaN(totalFromMeta)) {
            setTotal(totalFromMeta);
          }

          const currentPageFromMeta = Number(meta.current_page ?? 0);
          if (currentPageFromMeta && currentPageFromMeta !== page) {
            setPage(currentPageFromMeta);
          }

          const perPageFromMeta = Number(meta.per_page ?? 0);
          if (perPageFromMeta && perPageFromMeta !== perPage) {
            setPerPage(perPageFromMeta);
          }
        } else {
          setTotal(Array.isArray(items) ? items.length : 0);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch company ledger error", err);
        addToast("Error loading company ledger.", "error");
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRows();

    return () => controller.abort();
  }, [accessToken, addToast, page, perPage, companyFilterId]);

  const totalPages = useMemo(
    () => (perPage > 0 ? Math.max(1, Math.ceil((total || 0) / perPage)) : 1),
    [total, perPage]
  );

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const fromTime = postedFrom ? new Date(`${postedFrom}T00:00:00`).getTime() : null;
    const toTime = postedTo ? new Date(`${postedTo}T23:59:59`).getTime() : null;

    return rows.filter((r) => {
      if (companyFilterId && r.company_id != null) {
        if (String(r.company_id) !== companyFilterId) {
          return false;
        }
      }

      if (currencyFilter) {
        if ((r.transaction_currency || "") !== currencyFilter) {
          return false;
        }
      }

      if (fromTime || toTime) {
        const postedTime = r.posted_date ? new Date(r.posted_date).getTime() : null;

        if (fromTime && (postedTime === null || postedTime < fromTime)) {
          return false;
        }

        if (toTime && (postedTime === null || postedTime > toTime)) {
          return false;
        }
      }

      return (
        (r.transaction_number || "").toLowerCase().includes(term) ||
        (r.transaction_type || "").toLowerCase().includes(term) ||
        (r.category || "").toLowerCase().includes(term) ||
        (r.transaction_status || "").toLowerCase().includes(term) ||
        (r.company_name || "").toLowerCase().includes(term) ||
        (r.company_invoice_invoice_number || "").toLowerCase().includes(term) ||
        (r.company_invoice_project_job_reference_id || "")
          .toLowerCase()
          .includes(term) ||
        (r.created_by_user_name || "").toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, companyFilterId, postedFrom, postedTo, currencyFilter]);

  const companyOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => {
      if (r.company_id != null) {
        const key = String(r.company_id);
        if (!map.has(key)) {
          map.set(key, r.company_name || key);
        }
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const currencyOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.transaction_currency) {
        set.add(r.transaction_currency);
      }
    });
    return Array.from(set.values()).sort();
  }, [rows]);

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value) || 10;
    setPerPage(value);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCompanyFilterId("");
    setPostedFrom("");
    setPostedTo("");
    setCurrencyFilter("");
    setPerPage(20);
    setPage(1);
  };

  const handleExportCsv = () => {
    if (!rows.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "Date",
      "Invoice Number",
      "Company",
      "Type",
      "Job Reference ID",
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
      r.company_invoice_project_job_reference_id ?? "",
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Company:</span>
            <select
              value={companyFilterId}
              onChange={(e) => {
                setCompanyFilterId(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setCurrencyFilter(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setPostedFrom(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={postedTo}
              onChange={(e) => {
                setPostedTo(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
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
              onChange={handlePerPageChange}
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
                  Company
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Type
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                  Job Ref ID
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

              {!loading && filteredRows.length === 0 && (
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
                filteredRows.map((r) => (
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
                      {r.company_invoice_project_job_reference_id || "-"}
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
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-[10px] px-[16px] py-[8px] border-t border-gray-100 dark:border-[#172036] text-xs md:text-sm mt-[-1px]">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400">
            {from}-{to} of {total || rows.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={loading || page <= 1}
              className="px-[8px] py-[4px] rounded-md border border-primary-500 text-xs md:text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-primary-200 disabled:text-primary-300 disabled:bg-transparent"
            >
              Previous
            </button>
            <span className="text-gray-500 dark:text-gray-400">
              Page {total ? page : rows.length ? 1 : 0} of {total ? totalPages : 1}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={loading || page >= totalPages}
              className="px-[8px] py-[4px] rounded-md border border-primary-500 text-xs md:text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:border-primary-200 disabled:text-primary-300 disabled:bg-transparent"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default CompanyLedgerTable;
