"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface CustReceiptSummary {
  id: number;
  transaction_number?: string | null;
  amount_paid: number;
  tax_amount?: number | null;
  net_amount?: number | null;
  payment_date?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  currency?: string | null;
  bank_name?: string | null;
  check_number?: string | null;
  transaction_reference?: string | null;
  receipt_number?: string | null;
  invoice_total_amount?: number | null;
  exchange_rate?: number | null;
  fee_or_charge?: number | null;
  reconciled?: boolean | null;
  reconciliation_date?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  transaction_id?: number | null;
  customerNames?: string[];
  customerIds?: number[];
  projectNames?: string[];
  projectIds?: number[];
  invoiceNumbers?: string[];
  invoiceIds?: number[];
}

const AccountReceivablesReportTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [rows, setRows] = useState<CustReceiptSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerFilterId, setCustomerFilterId] = useState("");
  const [projectFilterId, setProjectFilterId] = useState("");
  const [invoiceFilterId, setInvoiceFilterId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCustomerReceipts = async () => {
      if (!accessToken) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const resp = await fetch(
          `/api/finance/customer-receipts/list?page=${page}&per_page=${perPage}`,
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
          addToast(data?.message || "Failed to load customer receipts", "error");
          setRows([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CustReceiptSummary[] = (items || []).map((p: any) => {
          const invoices = Array.isArray(p.invoices) ? p.invoices : [];

          const customerNames: string[] = [];
          const customerIds: number[] = [];
          const projectNames: string[] = [];
          const projectIds: number[] = [];
          const invoiceNumbers: string[] = [];
          const invoiceIds: number[] = [];

          invoices.forEach((inv: any) => {
            if (inv.customer) {
              if (inv.customer.name) {
                customerNames.push(String(inv.customer.name));
              }
              if (inv.customer.id != null) {
                customerIds.push(Number(inv.customer.id));
              }
            }

            if (inv.project) {
              const label = inv.project.name || inv.project.title || inv.project.code;
              if (label) {
                projectNames.push(String(label));
              }
              if (inv.project.id != null) {
                projectIds.push(Number(inv.project.id));
              }
            }

            if (inv.invoice_number) {
              invoiceNumbers.push(String(inv.invoice_number));
            }
            if (inv.id != null) {
              invoiceIds.push(Number(inv.id));
            }
          });

          return {
            id: Number(p.id),
            transaction_number: p.transaction_number ?? null,
            amount_paid: Number(p.amount_paid ?? 0),
            tax_amount: p.tax_amount != null ? Number(p.tax_amount) : null,
            net_amount: p.net_amount != null ? Number(p.net_amount) : null,
            payment_date: p.payment_date ?? null,
            payment_method: p.payment_method ?? null,
            payment_status: p.payment_status ?? null,
            currency: p.currency ?? null,
            bank_name: p.bank_name ?? null,
            check_number: p.check_number ?? null,
            transaction_reference: p.transaction_reference ?? null,
            receipt_number: p.receipt_number ?? null,
            invoice_total_amount:
              p.invoice_total_amount != null ? Number(p.invoice_total_amount) : null,
            exchange_rate: p.exchange_rate != null ? Number(p.exchange_rate) : null,
            fee_or_charge: p.fee_or_charge != null ? Number(p.fee_or_charge) : null,
            reconciled:
              typeof p.reconciled === "boolean"
                ? p.reconciled
                : p.reconciled != null
                ? Boolean(p.reconciled)
                : null,
            reconciliation_date: p.reconciliation_date ?? null,
            updated_at: p.updated_at ?? null,
            updated_by: p.updated_by ?? null,
            created_at: p.created_at ?? null,
            created_by: p.created_by ?? null,
            transaction_id: p.transaction_id != null ? Number(p.transaction_id) : null,
            customerNames,
            customerIds,
            projectNames,
            projectIds,
            invoiceNumbers,
            invoiceIds,
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
        console.error("fetch customer receipts error", err);
        addToast("Error loading customer receipts.", "error");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerReceipts();

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

      if (customerFilterId && p.customerIds && p.customerIds.length) {
        const match = p.customerIds.some((id) => String(id) === customerFilterId);
        if (!match) return false;
      }

      if (projectFilterId && p.projectIds && p.projectIds.length) {
        const match = p.projectIds.some((id) => String(id) === projectFilterId);
        if (!match) return false;
      }

      if (invoiceFilterId && p.invoiceIds && p.invoiceIds.length) {
        const match = p.invoiceIds.some((id) => String(id) === invoiceFilterId);
        if (!match) return false;
      }

      return (
        (p.transaction_number || "").toLowerCase().includes(term) ||
        (p.payment_method || "").toLowerCase().includes(term) ||
        (p.payment_status || "").toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, fromDate, toDate, customerFilterId, projectFilterId, invoiceFilterId]);

  const customerOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((p) => {
      (p.customerIds || []).forEach((id, idx) => {
        const key = String(id);
        if (!map.has(key)) {
          const name = (p.customerNames || [])[idx];
          map.set(key, name || key);
        }
      });
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const projectOptions = useMemo(() => {
    const map = new Map<string, string>();

    rows.forEach((p) => {
      (p.projectIds || []).forEach((id, idx) => {
        const key = String(id);
        if (!map.has(key)) {
          const name = (p.projectNames || [])[idx];
          map.set(key, name || key);
        }
      });
    });

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const invoiceOptions = useMemo(() => {
    const map = new Map<string, string>();

    rows.forEach((p) => {
      (p.invoiceIds || []).forEach((id, idx) => {
        const key = String(id);
        if (!map.has(key)) {
          const num = (p.invoiceNumbers || [])[idx];
          map.set(key, num || key);
        }
      });
    });

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCustomerFilterId("");
    setProjectFilterId("");
    setInvoiceFilterId("");
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
      "TransactionNumber",
      "ReceiptNumber",
      "PaymentDate",
      "PaymentMethod",
      "PaymentStatus",
      "Currency",
      "AmountPaid",
      "TaxAmount",
      "NetAmount",
      "InvoiceTotalAmount",
      "ExchangeRate",
      "FeeOrCharge",
      "BankName",
      "CheckNumber",
      "TransactionReference",
      "Reconciled",
      "ReconciliationDate",
      "TransactionId",
      "CreatedAt",
      "CreatedBy",
      "UpdatedAt",
      "UpdatedBy",
    ];

    const csvRows = rowsSource.map((p) => [
      p.id,
      p.transaction_number ?? "",
      p.receipt_number ?? "",
      p.payment_date ?? "",
      p.payment_method ?? "",
      p.payment_status ?? "",
      p.currency ?? "",
      p.amount_paid,
      p.tax_amount ?? "",
      p.net_amount ?? "",
      p.invoice_total_amount ?? "",
      p.exchange_rate ?? "",
      p.fee_or_charge ?? "",
      p.bank_name ?? "",
      p.check_number ?? "",
      p.transaction_reference ?? "",
      p.reconciled != null ? (p.reconciled ? "Yes" : "No") : "",
      p.reconciliation_date ?? "",
      p.transaction_id ?? "",
      p.created_at ?? "",
      p.created_by ?? "",
      p.updated_at ?? "",
      p.updated_by ?? "",
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customer-receipts.csv");
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
                value={customerFilterId}
                onChange={(e) => setCustomerFilterId(e.target.value)}
                className="border border-gray-200 dark:border-[#172036] rounded-md bg-transparent px-[10px] py-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 min-w-[140px]"
              >
                <option value="">All customers</option>
                {customerOptions.map((opt) => (
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
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">ID</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Date</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Transaction #</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Receipt #</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Customer</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Project</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Invoice #</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Method</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Status</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Amount Paid</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Tax Amount</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Net Amount</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Invoice Total</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Exchange Rate</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[8px] whitespace-nowrap">Fee / Charge</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Currency</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Bank</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Cheque #</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Txn Ref</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Reconciled</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Reconciliation Date</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Transaction ID</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Created At</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Created By</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Updated At</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[8px] whitespace-nowrap">Updated By</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[15px] py-[12px]">
                    Loading customer receipts...
                  </td>
                </tr>
              )}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[15px] py-[12px] text-gray-500">
                    No customer receipts found.
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
                      {p.transaction_number || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.receipt_number || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {(p.customerNames && p.customerNames[0]) || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {(p.projectNames && p.projectNames[0]) || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {(p.invoiceNumbers && p.invoiceNumbers[0]) || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.payment_method || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap capitalize">
                      {p.payment_status || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {formatCurrency(p.amount_paid, p.currency)}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {p.tax_amount != null ? formatCurrency(p.tax_amount, p.currency) : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {p.net_amount != null ? formatCurrency(p.net_amount, p.currency) : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {p.invoice_total_amount != null
                        ? formatCurrency(p.invoice_total_amount, p.currency)
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {p.exchange_rate != null ? p.exchange_rate.toFixed(4) : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap text-right">
                      {p.fee_or_charge != null
                        ? formatCurrency(p.fee_or_charge, p.currency)
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.currency || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.bank_name || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.check_number || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.transaction_reference || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.reconciled != null ? (p.reconciled ? "Yes" : "No") : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.reconciliation_date
                        ? new Date(p.reconciliation_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.transaction_id != null ? p.transaction_id : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.created_by || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.updated_at
                        ? new Date(p.updated_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[8px] whitespace-nowrap">
                      {p.updated_by || "-"}
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

export default AccountReceivablesReportTable;
