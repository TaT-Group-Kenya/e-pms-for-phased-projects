"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";

interface CompanyLedgerDetail {
  id: number;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  posted_date?: string | null;
  amount: number;
  base_currency?: string | null;
  exchange_rate: number;
  converted_amount: number;
  tax_amount: number;
  net_amount: number;
  company_id?: number | null;
  customer_id?: number | null;
  source_type?: string | null;
  source_id?: number | null;
  account_debit?: number | null;
  account_credit?: number | null;
  category?: string | null;
  payment_method?: string | null;
  bank_account?: string | null;
  check_number?: string | null;
  transaction_status?: string | null;
  narration?: string | null;
  fiscal_year?: number | null;
  accounting_period?: string | null;
}

const CompanyLedgerDetailPageInner: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [entry, setEntry] = useState<CompanyLedgerDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const idParam = router.query.id ? String(router.query.id) : undefined;

  useEffect(() => {
    if (!idParam) return;
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/finance/company-ledger/${idParam}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load ledger entry", "error");
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
          base_currency: src.base_currency ?? null,
          exchange_rate: Number(src.exchange_rate ?? 1),
          converted_amount: Number(src.converted_amount ?? 0),
          tax_amount: Number(src.tax_amount ?? 0),
          net_amount: Number(src.net_amount ?? 0),
          company_id: src.company_id != null ? Number(src.company_id) : null,
          customer_id: src.customer_id != null ? Number(src.customer_id) : null,
          source_type: src.source_type ?? null,
          source_id: src.source_id != null ? Number(src.source_id) : null,
          account_debit: src.account_debit != null ? Number(src.account_debit) : null,
          account_credit: src.account_credit != null ? Number(src.account_credit) : null,
          category: src.category ?? null,
          payment_method: src.payment_method ?? null,
          bank_account: src.bank_account ?? null,
          check_number: src.check_number ?? null,
          transaction_status: src.transaction_status ?? null,
          narration: src.narration ?? null,
          fiscal_year: src.fiscal_year != null ? Number(src.fiscal_year) : null,
          accounting_period: src.accounting_period ?? null,
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("company ledger detail error", err);
        addToast("Error loading ledger entry.", "error");
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
        `/api/finance/company-ledger/download-pdf?id=${encodeURIComponent(idParam)}`,
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
      link.download = `company-ledger-${idParam}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("company ledger pdf export error", err);
      addToast("Error downloading PDF.", "error");
    }
  };

  if (!idParam) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">Missing ledger ID.</div>
    );
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

      <div className="border border-gray-100 dark:border-[#172036] rounded-md p-[20px]">
        {loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading entry...</p>
        )}

        {!loading && !entry && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Entry not found.</p>
        )}

        {entry && (
          <div className="space-y-[10px] text-sm">
            <h3 className="text-base font-semibold mb-[5px]">
              Company Ledger Entry #{entry.id}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
              <div>
                <span className="font-medium">Transaction #:</span> {entry.transaction_number || "-"}
              </div>
              <div>
                <span className="font-medium">Type:</span> {entry.transaction_type || "-"}
              </div>
              <div>
                <span className="font-medium">Date:</span>{" "}
                {entry.transaction_date
                  ? new Date(entry.transaction_date).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-medium">Posted:</span>{" "}
                {entry.posted_date ? new Date(entry.posted_date).toLocaleString() : "-"}
              </div>
              <div>
                <span className="font-medium">Amount:</span>{" "}
                {entry.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {entry.base_currency || ""}
              </div>
              <div>
                <span className="font-medium">Converted Amount:</span>{" "}
                {entry.converted_amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div>
                <span className="font-medium">Tax Amount:</span>{" "}
                {entry.tax_amount.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Net Amount:</span>{" "}
                {entry.net_amount.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Company ID:</span> {entry.company_id ?? "-"}
              </div>
              <div>
                <span className="font-medium">Customer ID:</span> {entry.customer_id ?? "-"}
              </div>
              <div>
                <span className="font-medium">Source:</span> {entry.source_type || "-"} #{
                  entry.source_id ?? "-"
                }
              </div>
              <div>
                <span className="font-medium">Accounts:</span> Dr {entry.account_debit ?? "-"} / Cr {" "}
                {entry.account_credit ?? "-"}
              </div>
              <div>
                <span className="font-medium">Category:</span> {entry.category || "-"}
              </div>
              <div>
                <span className="font-medium">Status:</span> {entry.transaction_status || "-"}
              </div>
              <div>
                <span className="font-medium">Payment Method:</span> {entry.payment_method || "-"}
              </div>
              <div>
                <span className="font-medium">Bank Account:</span> {entry.bank_account || "-"}
              </div>
              <div>
                <span className="font-medium">Cheque #:</span> {entry.check_number || "-"}
              </div>
              <div>
                <span className="font-medium">Fiscal Year:</span> {entry.fiscal_year ?? "-"}
              </div>
              <div>
                <span className="font-medium">Accounting Period:</span> {entry.accounting_period || "-"}
              </div>
            </div>

            <div>
              <span className="font-medium">Narration:</span>
              <p className="mt-[3px] text-gray-700 dark:text-gray-300">
                {entry.narration || "-"}
              </p>
            </div>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default function CompanyLedgerDetailPage() {
  return (
    <AuthenticatedLayout>
      <CompanyLedgerDetailPageInner />
    </AuthenticatedLayout>
  );
}
