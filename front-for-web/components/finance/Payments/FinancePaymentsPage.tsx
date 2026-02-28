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
  payment_date?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  currency?: string | null;
}

interface CompanyPaymentSummary {
  id: number;
  transaction_number?: string | null;
  amount_paid: number;
  payment_date?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  currency?: string | null;
}

const FinancePaymentsPage: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [activeTab, setActiveTab] = useState<"customer" | "company">("customer");

  const [custReceipts, setCustReceipts] = useState<CustReceiptSummary[]>([]);
  const [custLoading, setCustLoading] = useState(false);

  const [companyPayments, setCompanyPayments] = useState<CompanyPaymentSummary[]>([]);
  const [companyLoading, setCompanyLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCustomerReceipts = async () => {
      if (!accessToken) {
        setCustReceipts([]);
        return;
      }
      setCustLoading(true);
      try {
        const resp = await fetch("/api/finance/customer-receipts/list?page=1&per_page=50", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load customer receipts", "error");
          setCustReceipts([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CustReceiptSummary[] = (items || []).map((p: any) => ({
          id: Number(p.id),
          transaction_number: p.transaction_number ?? null,
          amount_paid: Number(p.amount_paid ?? 0),
          payment_date: p.payment_date ?? null,
          payment_method: p.payment_method ?? null,
          payment_status: p.payment_status ?? null,
          currency: p.currency ?? null,
        }));

        setCustReceipts(mapped);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch customer receipts error", err);
        addToast("Error loading customer receipts.", "error");
        setCustReceipts([]);
      } finally {
        setCustLoading(false);
      }
    };

    const fetchCompanyPayments = async () => {
      if (!accessToken) {
        setCompanyPayments([]);
        return;
      }
      setCompanyLoading(true);
      try {
        const resp = await fetch("/api/finance/company-payments/list?page=1&per_page=50", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load company payments", "error");
          setCompanyPayments([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CompanyPaymentSummary[] = (items || []).map((p: any) => ({
          id: Number(p.id),
          transaction_number: p.transaction_number ?? null,
          amount_paid: Number(p.amount_paid ?? 0),
          payment_date: p.payment_date ?? null,
          payment_method: p.payment_method ?? null,
          payment_status: p.payment_status ?? null,
          currency: p.currency ?? null,
        }));

        setCompanyPayments(mapped);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch company payments error", err);
        addToast("Error loading company payments.", "error");
        setCompanyPayments([]);
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCustomerReceipts();
    fetchCompanyPayments();

    return () => controller.abort();
  }, [accessToken, addToast]);

  const filteredCustReceipts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return custReceipts.filter((p) => {
      return (
        (p.transaction_number || "").toLowerCase().includes(term) ||
        (p.payment_method || "").toLowerCase().includes(term) ||
        (p.payment_status || "").toLowerCase().includes(term)
      );
    });
  }, [custReceipts, searchTerm]);

  const filteredCompanyPayments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return companyPayments.filter((p) => {
      return (
        (p.transaction_number || "").toLowerCase().includes(term) ||
        (p.payment_method || "").toLowerCase().includes(term) ||
        (p.payment_status || "").toLowerCase().includes(term)
      );
    });
  }, [companyPayments, searchTerm]);

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
    const rowsSource =
      activeTab === "customer" ? filteredCustReceipts : filteredCompanyPayments;

    if (!rowsSource.length) {
      addToast("No data to export.", "error");
      return;
    }

    const headers = [
      "ID",
      "TransactionNumber",
      "Date",
      "Method",
      "Status",
      "Amount",
      "Currency",
    ];

    const rows = rowsSource.map((p) => [
      p.id,
      p.transaction_number ?? "",
      p.payment_date ?? "",
      p.payment_method ?? "",
      p.payment_status ?? "",
      p.amount_paid,
      p.currency ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      activeTab === "customer" ? "customer-receipts.csv" : "company-payments.csv"
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 min-w-0">
          <div className="trezo-tabs mb-[10px] md:mb-[12px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036]">
              <li className="nav-item inline-block ltr:mr-[40px] rtl:ml-[40px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("customer")}
                  className={`nav-link flex items-center gap-[8px] pb-[10px] transition-all relative font-medium ${
                    activeTab === "customer"
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">assured_workload</i>
                  Account Receivables
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[40px] rtl:ml-[40px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("company")}
                  className={`nav-link flex items-center gap-[8px] pb-[10px] transition-all relative font-medium ${
                    activeTab === "company"
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">paid</i>
                  Account Payables
                </button>
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Switch between customer receipts and company outgoing payments.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end mt-[10px] md:mt-0">
          <input
            type="text"
            placeholder="Search by transaction #, method, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-xs px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />

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
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">
                  Transaction #
                </th>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Method</th>
                <th className="text-xs font-semibold text-left px-[15px] py-[10px]">Status</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[10px]">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "customer" && custLoading && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[15px] py-[12px]">
                    Loading customer receipts...
                  </td>
                </tr>
              )}
              {activeTab === "company" && companyLoading && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[15px] py-[12px]">
                    Loading company payments...
                  </td>
                </tr>
              )}

              {activeTab === "customer" && !custLoading && filteredCustReceipts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[15px] py-[12px] text-gray-500">
                    No customer receipts found.
                  </td>
                </tr>
              )}

              {activeTab === "company" && !companyLoading && filteredCompanyPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[15px] py-[12px] text-gray-500">
                    No company payments found.
                  </td>
                </tr>
              )}

              {activeTab === "customer" && !custLoading &&
                filteredCustReceipts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 dark:border-[#172036] align-middle"
                  >
                    <td className="text-sm px-[15px] py-[10px]">
                      {p.payment_date
                        ? new Date(p.payment_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px]">
                      {p.transaction_number || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px]">
                      {p.payment_method || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] capitalize">
                      {p.payment_status || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {formatCurrency(p.amount_paid, p.currency)}
                    </td>
                  </tr>
                ))}

              {activeTab === "company" && !companyLoading &&
                filteredCompanyPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 dark:border-[#172036] align-middle"
                  >
                    <td className="text-sm px-[15px] py-[10px]">
                      {p.payment_date
                        ? new Date(p.payment_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px]">
                      {p.transaction_number || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px]">
                      {p.payment_method || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] capitalize">
                      {p.payment_status || "-"}
                    </td>
                    <td className="text-sm px-[15px] py-[10px] text-right">
                      {formatCurrency(p.amount_paid, p.currency)}
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

export default FinancePaymentsPage;
