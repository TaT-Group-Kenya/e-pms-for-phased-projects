"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface CompanyLedgerRow {
  id: number;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  amount: number;
  tax_amount?: number | null;
  net_amount?: number | null;
  transaction_currency?: string | null;
  base_currency?: string | null;
  converted_amount?: number | null;
  converted_tax_amount?: number | null;
  converted_net_amount?: number | null;
  company_id?: number | null;
  customer_id?: number | null;
  category?: string | null;
  transaction_status?: string | null;
}

const CompanyLedgerTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [rows, setRows] = useState<CompanyLedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchRows = async () => {
      if (!accessToken) {
        setRows([]);
        return;
      }
      setLoading(true);
      try {
        const resp = await fetch("/api/finance/company-ledger/list?page=1&per_page=50", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load company ledger", "error");
          setRows([]);
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
          company_id: r.company_id != null ? Number(r.company_id) : null,
          customer_id: r.customer_id != null ? Number(r.customer_id) : null,
          category: r.category ?? null,
          transaction_status: r.transaction_status ?? null,
        }));

        setRows(mapped);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch company ledger error", err);
        addToast("Error loading company ledger.", "error");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRows();

    return () => controller.abort();
  }, [accessToken, addToast]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rows.filter((r) => {
      return (
        (r.transaction_number || "").toLowerCase().includes(term) ||
        (r.transaction_type || "").toLowerCase().includes(term) ||
        (r.category || "").toLowerCase().includes(term) ||
        (r.transaction_status || "").toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm]);

  const handleExportCsv = () => {
    if (!rows.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "ID",
      "TransactionNumber",
      "Type",
      "Date",
      "Amount",
      "TransactionCurrency",
      "BaseAmount",
      "BaseCurrency",
      "ConvertedTaxAmount",
      "ConvertedNetAmount",
      "Category",
      "Status",
    ];

    const dataRows = rows.map((r) => [
      r.id,
      r.transaction_number ?? "",
      r.transaction_type ?? "",
      r.transaction_date ?? "",
      r.amount,
      r.transaction_currency ?? "",
      r.converted_amount ?? "",
      r.base_currency ?? "",
      r.converted_tax_amount ?? "",
      r.converted_net_amount ?? "",
      r.category ?? "",
      r.transaction_status ?? "",
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

  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by number, type, category, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Date</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Number</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Type</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Category</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Status</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Amount</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Base Amount</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Tax (Trans)</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Tax (Base)</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Net (Trans)</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Net (Base)</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={12} className="text-center text-sm px-[15px] py-[12px]">
                    Loading company ledger...
                  </td>
                </tr>
              )}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-sm px-[15px] py-[12px] text-gray-500">
                    No ledger entries found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredRows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-gray-100 dark:border-[#172036] align-middle"
                  >
                    <td className="text-sm px-[15px] py-[10px]">
                      {r.transaction_date
                        ? new Date(r.transaction_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px]">{r.transaction_number || "-"}</td>
                    <td className="text-sm px-[15px] py-[10px] capitalize">{r.transaction_type || "-"}</td>
                    <td className="text-sm px-[15px] py-[10px]">{r.category || "-"}</td>
                    <td className="text-sm px-[15px] py-[10px] capitalize">
                      {r.transaction_status || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {r.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {r.transaction_currency || ""}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {r.converted_amount != null
                        ? `${r.converted_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.base_currency || ""}`
                        : r.base_currency || ""}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {r.tax_amount != null
                        ? `${r.tax_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.transaction_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {r.converted_tax_amount != null
                        ? `${r.converted_tax_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.base_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {r.net_amount != null
                        ? `${r.net_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.transaction_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {r.converted_net_amount != null
                        ? `${r.converted_net_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${r.base_currency || ""}`
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
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

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default CompanyLedgerTable;
