"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../../store/auth/selectors";
import AuthenticatedLayout from "../../../../components/authenticated/AuthenticatedLayout";
import { useToast } from "../../../../hooks/useToast";
import { ToastContainer } from "../../../../components/common/Toast";

interface CompanyPaymentSummary {
  id: number;
  transaction_number?: string | null;
  amount_paid: number;
  tax_amount?: number | null;
  net_amount?: number | null;
  payment_date?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  currency?: string | null;
  invoice_id?: number | null;
  exchange_rate?: number | null;
  bank_name?: string | null;
  check_number?: string | null;
  transaction_reference?: string | null;
  receipt_number?: string | null;
  reconciled?: boolean | null;
  reconciliation_date?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  transaction_id?: number | null;
  companyName?: string | null;
  companyId?: number | null;
  projectName?: string | null;
  projectId?: number | null;
  invoiceNumber?: string | null;
  invoiceId?: number | null;
}

const CompanyPaymentDetailPageInner: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [entry, setEntry] = useState<CompanyPaymentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  useEffect(() => {
    if (!accessToken || !id) {
      return;
    }

    const idParam = Array.isArray(id) ? id[0] : id;
    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/finance/company-payments/${idParam}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load company payment", "error");
          setEntry(null);
          return;
        }

        const src = data?.data || data;
        if (!src) {
          setEntry(null);
          return;
        }

        const invoice = src.invoice || null;

        let companyName: string | null = null;
        let companyId: number | null = null;
        let projectName: string | null = null;
        let projectId: number | null = null;
        let invoiceNumber: string | null = null;
        let invoiceId: number | null = null;

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
            const label =
              invoice.project.name ||
              invoice.project.title ||
              invoice.project.code;
            if (label) {
              projectName = String(label);
            }
            if (invoice.project.id != null) {
              projectId = Number(invoice.project.id);
            }
          }
        }

        setEntry({
          id: Number(src.id),
          transaction_number: src.transaction_number ?? null,
          amount_paid: Number(src.amount_paid ?? src.amount ?? 0),
          tax_amount:
            src.tax_amount != null ? Number(src.tax_amount) : null,
          net_amount:
            src.net_amount != null ? Number(src.net_amount) : null,
          payment_date: src.payment_date ?? null,
          payment_method: src.payment_method ?? null,
          payment_status: src.payment_status ?? null,
          currency: src.currency ?? null,
          invoice_id:
            src.invoice_id != null ? Number(src.invoice_id) : invoiceId,
          exchange_rate:
            src.exchange_rate != null ? Number(src.exchange_rate) : null,
          bank_name: src.bank_name ?? null,
          check_number: src.check_number ?? null,
          transaction_reference: src.transaction_reference ?? null,
          receipt_number: src.receipt_number ?? null,
          reconciled:
            typeof src.reconciled === "boolean"
              ? src.reconciled
              : src.reconciled != null
              ? Boolean(src.reconciled)
              : null,
          reconciliation_date: src.reconciliation_date ?? null,
          updated_at: src.updated_at ?? null,
          updated_by: src.updated_by ?? null,
          created_at: src.created_at ?? null,
          created_by: src.created_by ?? null,
          transaction_id:
            src.transaction_id != null ? Number(src.transaction_id) : null,
          companyName,
          companyId,
          projectName,
          projectId,
          invoiceNumber,
          invoiceId,
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("company payment detail error", err);
        addToast("Error loading company payment.", "error");
        setEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    return () => controller.abort();
  }, [accessToken, id, addToast]);

  const handleExportPdf = async () => {
    if (!entry || !accessToken) return;
    try {
      const resp = await fetch(
        `/api/finance/company-payments/download-pdf?id=${entry.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!resp.ok) {
        addToast("Failed to download payment PDF", "error");
        return;
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `company-payment-${
        entry.transaction_number || entry.id
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("company payment pdf error", err);
      addToast("Error downloading payment PDF.", "error");
    }
  };

  const titleNumber = entry
    ? entry.transaction_number || String(entry.id)
    : "";

  return (
    <>
      <div className="flex items-center justify-between gap-[10px] mb-[15px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-[10px] py-[6px] text-xs border border-gray-200 dark:border-[#1f2937] rounded-md hover:bg-gray-50 dark:hover:bg-[#020817]"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleExportPdf}
          disabled={!entry || loading}
          className="inline-flex items-center px-[12px] py-[6px] text-xs bg-primary-500 text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Export PDF
        </button>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header flex flex-wrap items-center justify-between gap-[10px]">
          <div>
            <h1 className="text-base font-semibold text-black dark:text-white">
              Company Payment #{titleNumber}
            </h1>
            {entry && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-[4px]">
                {entry.companyName || "-"}
                {entry.projectName ? ` · ${entry.projectName}` : ""}
              </p>
            )}
          </div>

          {entry && (
            <div className="flex flex-wrap items-center gap-[10px]">
              {entry.payment_status && (
                <span className="inline-flex items-center px-[8px] py-[3px] rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-[#020617] dark:text-gray-300">
                  {entry.payment_status}
                </span>
              )}

              {entry.payment_method && (
                <span className="inline-flex items-center px-[8px] py-[3px] rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-[#020617] dark:text-gray-300">
                  {entry.payment_method}
                </span>
              )}

              <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#020617] px-[12px] py-[6px] text-right">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-[2px]">
                  Amount Paid
                </p>
                {entry && (
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {entry.amount_paid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {entry.currency || ""}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="trezo-card-body">
          {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading company payment...
            </p>
          )}

          {!loading && !entry && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Company payment not found.
            </p>
          )}

          {!loading && entry && (
            <>
              <div className="flex border-b border-gray-100 dark:border-[#172036] mb-[15px] text-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab(0)}
                  className={`mr-[20px] pb-[6px] border-b-2 text-xs font-medium transition-colors ${
                    activeTab === 0
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`mr-[20px] pb-[6px] border-b-2 text-xs font-medium transition-colors ${
                    activeTab === 1
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  Accounting
                </button>
              </div>

              {activeTab === 0 && (
                <div className="space-y-[20px] text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Company
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.companyName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Project
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.projectName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Payment Date
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_date
                          ? new Date(entry.payment_date).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Payment Status
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_status || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Payment Method
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_method || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Invoice
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.invoiceNumber ||
                          (entry.invoiceId != null
                            ? `#${entry.invoiceId}`
                            : "-")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Bank
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.bank_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Cheque Number
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.check_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Transaction Reference
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_reference || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Receipt Number
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.receipt_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Reconciled
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.reconciled == null
                          ? "-"
                          : entry.reconciled
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Reconciliation Date
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.reconciliation_date
                          ? new Date(
                              entry.reconciliation_date
                            ).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Linked Transaction ID
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_id != null
                          ? entry.transaction_id
                          : "-"}
                      </p>
                    </div>
                    <div />
                  </div>

                  <div className="mt-[10px] grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Created
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.created_at
                          ? `${new Date(
                              entry.created_at
                            ).toLocaleString()}${
                              entry.created_by
                                ? ` · By ${entry.created_by}`
                                : ""
                            }`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Last Updated
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.updated_at
                          ? `${new Date(
                              entry.updated_at
                            ).toLocaleString()}${
                              entry.updated_by
                                ? ` · By ${entry.updated_by}`
                                : ""
                            }`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-[20px] text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">
                        Amount Paid
                      </p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.amount_paid.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {entry.currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">
                        Tax Amount
                      </p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.tax_amount != null
                          ? `${entry.tax_amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} ${entry.currency || ""}`
                          : "-"}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">
                        Net Amount
                      </p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.net_amount != null
                          ? `${entry.net_amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} ${entry.currency || ""}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Exchange Rate
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.exchange_rate != null
                          ? entry.exchange_rate.toFixed(4)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Currency
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.currency || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Invoice ID
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.invoice_id != null ? entry.invoice_id : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                        Linked Transaction ID
                      </p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_id != null
                          ? entry.transaction_id
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default function CompanyPaymentDetailPage() {
  return (
    <AuthenticatedLayout>
      <CompanyPaymentDetailPageInner />
    </AuthenticatedLayout>
  );
}
