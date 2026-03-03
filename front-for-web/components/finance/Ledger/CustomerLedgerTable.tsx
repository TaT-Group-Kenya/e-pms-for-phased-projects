"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface CustomerLedgerRow {
  id: number;
  cust_payment_id?: number | null;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  posted_date?: string | null;
  amount: number;
  tax_amount?: number | null;
  net_amount?: number | null;
  transaction_currency?: string | null;
  base_currency?: string | null;
  exchange_rate?: number | null;
  converted_amount?: number | null;
  converted_tax_amount?: number | null;
  converted_net_amount?: number | null;
  customer_id?: number | null;
  customer_name?: string | null;
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
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | number | null;
  updated_by?: string | number | null;
  is_deleted?: boolean | null;
  deleted_at?: string | null;
  deleted_by?: string | number | null;
}

const CustomerLedgerTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [rows, setRows] = useState<CustomerLedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [customerFilterId, setCustomerFilterId] = useState<string>("");
  const [postedFrom, setPostedFrom] = useState("");
  const [postedTo, setPostedTo] = useState("");

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
        if (customerFilterId) {
          params.set("customer_id", customerFilterId);
        }

        const resp = await fetch(
          `/api/finance/customer-ledger/list?${params.toString()}`,
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
          addToast(data?.message || "Failed to load customer ledger", "error");
          setRows([]);
          setTotal(0);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CustomerLedgerRow[] = (items || []).map((r: any) => ({
          id: Number(r.id),
          cust_payment_id: r.cust_payment_id != null ? Number(r.cust_payment_id) : null,
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
          base_currency: r.base_currency ?? null,
          exchange_rate:
            r.exchange_rate !== undefined && r.exchange_rate !== null
              ? Number(r.exchange_rate)
              : null,
          converted_amount:
            r.converted_amount !== undefined && r.converted_amount !== null
              ? Number(r.converted_amount)
              : null,
          converted_tax_amount:
            r.converted_tax_amount !== undefined && r.converted_tax_amount !== null
              ? Number(r.converted_tax_amount)
              : null,
          converted_net_amount:
            r.converted_net_amount !== undefined && r.converted_net_amount !== null
              ? Number(r.converted_net_amount)
              : null,
          customer_id: r.customer_id != null ? Number(r.customer_id) : null,
          customer_name:
            r.customer && typeof r.customer === "object" && r.customer.name
              ? String(r.customer.name)
              : null,
          source_type: r.source_type ?? null,
          source_id: r.source_id != null ? Number(r.source_id) : null,
          account_debit: r.account_debit != null ? Number(r.account_debit) : null,
          account_credit: r.account_credit != null ? Number(r.account_credit) : null,
          category: r.category ?? null,
          payment_method: r.payment_method ?? null,
          bank_account: r.bank_account ?? null,
          check_number: r.check_number ?? null,
          transaction_status: r.transaction_status ?? null,
          related_transaction_id:
            r.related_transaction_id != null ? Number(r.related_transaction_id) : null,
          narration: r.narration ?? null,
          is_recurring:
            r.is_recurring !== undefined && r.is_recurring !== null
              ? Boolean(r.is_recurring)
              : null,
          fiscal_year: r.fiscal_year != null ? Number(r.fiscal_year) : null,
          accounting_period: r.accounting_period ?? null,
          is_adjusting_entry:
            r.is_adjusting_entry !== undefined && r.is_adjusting_entry !== null
              ? Boolean(r.is_adjusting_entry)
              : null,
          cost_center_id: r.cost_center_id != null ? Number(r.cost_center_id) : null,
          created_at: r.created_at ?? null,
          updated_at: r.updated_at ?? null,
          created_by: r.created_by ?? null,
          updated_by: r.updated_by ?? null,
          is_deleted:
            r.is_deleted !== undefined && r.is_deleted !== null
              ? Boolean(r.is_deleted)
              : null,
          deleted_at: r.deleted_at ?? null,
          deleted_by: r.deleted_by ?? null,
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
        console.error("fetch customer ledger error", err);
        addToast("Error loading customer ledger.", "error");
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRows();

    return () => controller.abort();
  }, [accessToken, addToast, page, perPage, customerFilterId]);

  const totalPages = useMemo(
    () => (perPage > 0 ? Math.max(1, Math.ceil((total || 0) / perPage)) : 1),
    [total, perPage]
  );

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const fromTime = postedFrom ? new Date(`${postedFrom}T00:00:00`).getTime() : null;
    const toTime = postedTo ? new Date(`${postedTo}T23:59:59`).getTime() : null;

    return rows.filter((r) => {
      if (customerFilterId && r.customer_id != null) {
        if (String(r.customer_id) !== customerFilterId) {
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
        (r.transaction_status || "").toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, customerFilterId, postedFrom, postedTo]);

  const customerOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => {
      if (r.customer_id != null) {
        const key = String(r.customer_id);
        if (!map.has(key)) {
          map.set(key, r.customer_name || key);
        }
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
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
    setCustomerFilterId("");
    setPostedFrom("");
    setPostedTo("");
    setPerPage(20);
    setPage(1);
  };

  const handleExportCsv = () => {
    if (!rows.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "ID",
      "CustPaymentId",
      "TransactionNumber",
      "Type",
      "Date",
      "PostedDate",
      "Amount",
      "TaxAmount",
      "NetAmount",
      "TransactionCurrency",
      "BaseCurrency",
      "ExchangeRate",
      "ConvertedAmount",
      "ConvertedTaxAmount",
      "ConvertedNetAmount",
      "CustomerName",
      "SourceType",
      "SourceId",
      "AccountDebit",
      "AccountCredit",
      "Category",
      "PaymentMethod",
      "BankAccount",
      "CheckNumber",
      "Status",
      "RelatedTransactionId",
      "Narration",
      "IsRecurring",
      "FiscalYear",
      "AccountingPeriod",
      "IsAdjustingEntry",
      "CostCenterId",
      "CreatedAt",
      "UpdatedAt",
      "CreatedBy",
      "UpdatedBy",
      "IsDeleted",
      "DeletedAt",
      "DeletedBy",
    ];

    const dataRows = rows.map((r) => [
      r.id,
      r.cust_payment_id ?? "",
      r.transaction_number ?? "",
      r.transaction_type ?? "",
      r.transaction_date ?? "",
      r.posted_date ?? "",
      r.amount,
      r.tax_amount ?? "",
      r.net_amount ?? "",
      r.transaction_currency ?? "",
      r.base_currency ?? "",
      r.exchange_rate ?? "",
      r.converted_amount ?? "",
      r.converted_tax_amount ?? "",
      r.converted_net_amount ?? "",
      r.customer_name ?? r.customer_id ?? "",
      r.source_type ?? "",
      r.source_id ?? "",
      r.account_debit ?? "",
      r.account_credit ?? "",
      r.category ?? "",
      r.payment_method ?? "",
      r.bank_account ?? "",
      r.check_number ?? "",
      r.transaction_status ?? "",
      r.related_transaction_id ?? "",
      r.narration ?? "",
      r.is_recurring != null ? (r.is_recurring ? "Yes" : "No") : "",
      r.fiscal_year ?? "",
      r.accounting_period ?? "",
      r.is_adjusting_entry != null ? (r.is_adjusting_entry ? "Yes" : "No") : "",
      r.cost_center_id ?? "",
      r.created_at ?? "",
      r.updated_at ?? "",
      r.created_by ?? "",
      r.updated_by ?? "",
      r.is_deleted != null ? (r.is_deleted ? "Yes" : "No") : "",
      r.deleted_at ?? "",
      r.deleted_by ?? "",
    ]);

    const csv = [headers, ...dataRows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customer-ledger.csv");
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
            <span className="text-xs text-gray-500 dark:text-gray-400">Customer:</span>
            <select
              value={customerFilterId}
              onChange={(e) => {
                setCustomerFilterId(e.target.value);
                setPage(1);
              }}
              disabled={loading}
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
                    colSpan={24}
                    className="text-center text-sm px-[10px] py-[8px] text-gray-500 dark:text-gray-400"
                  >
                    Loading customer ledger...
                  </td>
                </tr>
              )}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={24}
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
                      {r.posted_date ? new Date(r.posted_date).toLocaleDateString() : "-"}
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
                    <td className="text-sm px-[20px] py-[15px] text-right whitespace-nowrap">
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
                    <td className="text-sm px-[20px] py-[15px] text-right whitespace-nowrap">
                      {r.exchange_rate != null
                        ? r.exchange_rate.toLocaleString(undefined, {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                          })
                        : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                      {r.customer_name || r.customer_id || "-"}
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
                    <td className="text-sm px-[20px] py-[15px] whitespace-nowrap">
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
                    <td className="text-sm px-[20px] py-[15px] whitespace-nowrap">
                      {r.fiscal_year || r.accounting_period
                        ? `${r.fiscal_year ?? "-"} / ${r.accounting_period ?? "-"}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[20px] py-[15px] whitespace-nowrap">
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
                        <span>
                          D: {r.is_deleted ? r.deleted_at || "Yes" : "-"}{" "}
                          {r.deleted_by ? `(${r.deleted_by})` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                      <Link
                        href={`/finance/customer-ledger/${r.id}`}
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

export default CustomerLedgerTable;
