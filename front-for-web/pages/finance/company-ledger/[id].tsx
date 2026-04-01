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
  company_payment_id?: number | null;
  transaction_number?: string | null;
  transaction_type?: string | null;
  transaction_date?: string | null;
  posted_date?: string | null;
  amount: number;
  transaction_currency?: string | null;
  base_currency?: string | null;
  exchange_rate: number;
  converted_amount: number;
  converted_tax_amount: number;
  converted_net_amount: number;
  tax_amount: number;
  net_amount: number;
  company_id?: number | null;
  customer_id?: number | null;
  company_name?: string | null;
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
  narration?: string | null;
  fiscal_year?: number | null;
  accounting_period?: string | null;
  is_recurring?: boolean | null;
  is_adjusting_entry?: boolean | null;
  cost_center_id?: number | null;
  related_transaction_id?: number | null;
  is_deleted?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  created_by?: number | string | null;
  updated_by?: number | string | null;
  deleted_by?: number | string | null;
  account_debit_name?: string | null;
  account_credit_name?: string | null;

  // Flattened payment details
  payment_id?: number | null;
  payment_direction?: string | null;
  payment_status?: string | null;
  payment_amount_paid?: number | null;
  payment_currency?: string | null;
  payment_date?: string | null;
  payment_bank_name?: string | null;
  payment_check_number?: string | null;
  payment_transaction_reference?: string | null;
  payment_receipt_number?: string | null;
  payment_reconciled?: boolean | null;
  payment_reconciliation_date?: string | null;

  // Flattened company invoice details
  invoice_id?: number | null;
  invoice_number?: string | null;
  invoice_status?: string | null;
  invoice_subtotal_amount?: number | null;
  invoice_tax_amount?: number | null;
  invoice_total_amount?: number | null;
  invoice_currency?: string | null;
  invoice_title?: string | null;
  invoice_description?: string | null;
  invoice_payment_terms?: string | null;
  invoice_valid_until?: string | null;

  // Flattened project details for the invoice
  project_id?: number | null;
  project_code?: string | null;
  project_name?: string | null;
  project_job_reference_id?: string | null;
  project_status?: string | null;
  project_priority?: string | null;
  project_progress?: string | null;
  project_currency?: string | null;

  // Flattened company contact details
  company_email?: string | null;
  company_phone?: string | null;
  company_contact_person_name?: string | null;
  company_address?: string | null;
  company_city?: string | null;
  company_state?: string | null;
  company_country?: string | null;
  company_kra_pin?: string | null;

  // Flattened created/updated user details
  created_by_user_name?: string | null;
  created_by_user_email?: string | null;
  updated_by_user_name?: string | null;
  updated_by_user_email?: string | null;
}

const CompanyLedgerDetailPageInner: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [entry, setEntry] = useState<CompanyLedgerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
          company_payment_id:
            src.company_payment_id != null ? Number(src.company_payment_id) : null,
          transaction_number: src.transaction_number ?? null,
          transaction_type: src.transaction_type ?? null,
          transaction_date: src.transaction_date ?? null,
          posted_date: src.posted_date ?? null,
          amount: Number(src.amount ?? 0),
          transaction_currency: src.transaction_currency ?? null,
          base_currency: src.base_currency ?? null,
          exchange_rate: Number(src.exchange_rate ?? 1),
          converted_amount: Number(src.converted_amount ?? 0),
          converted_tax_amount: Number(src.converted_tax_amount ?? 0),
          converted_net_amount: Number(src.converted_net_amount ?? 0),
          tax_amount: Number(src.tax_amount ?? 0),
          net_amount: Number(src.net_amount ?? 0),
          company_id: src.company_id != null ? Number(src.company_id) : null,
          customer_id: src.customer_id != null ? Number(src.customer_id) : null,
          company_name:
            src.company && typeof src.company === "object" && src.company.name
              ? String(src.company.name)
              : null,
          customer_name:
            src.customer && typeof src.customer === "object" && src.customer.name
              ? String(src.customer.name)
              : null,
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
          is_recurring:
            src.is_recurring !== undefined && src.is_recurring !== null
              ? Boolean(src.is_recurring)
              : null,
          is_adjusting_entry:
            src.is_adjusting_entry !== undefined && src.is_adjusting_entry !== null
              ? Boolean(src.is_adjusting_entry)
              : null,
          cost_center_id: src.cost_center_id != null ? Number(src.cost_center_id) : null,
          related_transaction_id:
            src.related_transaction_id != null
              ? Number(src.related_transaction_id)
              : null,
          is_deleted:
            src.is_deleted !== undefined && src.is_deleted !== null
              ? Boolean(src.is_deleted)
              : null,
          created_at: src.created_at ?? null,
          updated_at: src.updated_at ?? null,
          deleted_at: src.deleted_at ?? null,
          created_by: src.created_by ?? null,
          updated_by: src.updated_by ?? null,
          deleted_by: src.deleted_by ?? null,

          // Payment
          payment_id:
            src.payment && typeof src.payment === "object" && src.payment.id != null
              ? Number(src.payment.id)
              : null,
          payment_direction:
            src.payment && typeof src.payment === "object"
              ? src.payment.direction ?? null
              : null,
          payment_status:
            src.payment && typeof src.payment === "object"
              ? src.payment.payment_status ?? null
              : null,
          payment_amount_paid:
            src.payment && typeof src.payment === "object"
              ? src.payment.amount_paid != null
                ? Number(src.payment.amount_paid)
                : null
              : null,
          payment_currency:
            src.payment && typeof src.payment === "object"
              ? src.payment.currency ?? null
              : null,
          payment_date:
            src.payment && typeof src.payment === "object"
              ? src.payment.payment_date ?? null
              : null,
          payment_bank_name:
            src.payment && typeof src.payment === "object"
              ? src.payment.bank_name ?? null
              : null,
          payment_check_number:
            src.payment && typeof src.payment === "object"
              ? src.payment.check_number ?? null
              : null,
          payment_transaction_reference:
            src.payment && typeof src.payment === "object"
              ? src.payment.transaction_reference ?? null
              : null,
          payment_receipt_number:
            src.payment && typeof src.payment === "object"
              ? src.payment.receipt_number ?? null
              : null,
          payment_reconciled:
            src.payment && typeof src.payment === "object"
              ? src.payment.reconciled != null
                ? Boolean(src.payment.reconciled)
                : null
              : null,
          payment_reconciliation_date:
            src.payment && typeof src.payment === "object"
              ? src.payment.reconciliation_date ?? null
              : null,

          // Company invoice
          invoice_id:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.id != null
                ? Number(src.companyInvoice.id)
                : null
              : null,
          invoice_number:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.invoice_number ?? null
              : null,
          invoice_status:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.status ?? null
              : null,
          invoice_subtotal_amount:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.subtotal_amount != null
                ? Number(src.companyInvoice.subtotal_amount)
                : null
              : null,
          invoice_tax_amount:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.tax_amount != null
                ? Number(src.companyInvoice.tax_amount)
                : null
              : null,
          invoice_total_amount:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.total_amount != null
                ? Number(src.companyInvoice.total_amount)
                : null
              : null,
          invoice_currency:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.currency ?? null
              : null,
          invoice_title:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.title ?? null
              : null,
          invoice_description:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.description ?? null
              : null,
          invoice_payment_terms:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.payment_terms ?? null
              : null,
          invoice_valid_until:
            src.companyInvoice && typeof src.companyInvoice === "object"
              ? src.companyInvoice.valid_until ?? null
              : null,

          // Project (via companyInvoice)
          project_id:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.id != null
                ? Number(src.companyInvoice.project.id)
                : null
              : null,
          project_code:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.code ?? null
              : null,
          project_name:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.name ?? null
              : null,
          project_job_reference_id:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.job_reference_id ?? null
              : null,
          project_status:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.status ?? null
              : null,
          project_priority:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.priority ?? null
              : null,
          project_progress:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.progress ?? null
              : null,
          project_currency:
            src.companyInvoice &&
            typeof src.companyInvoice === "object" &&
            src.companyInvoice.project &&
            typeof src.companyInvoice.project === "object"
              ? src.companyInvoice.project.currency ?? null
              : null,

          // Company contact details
          company_email:
            src.company && typeof src.company === "object"
              ? src.company.email ?? null
              : null,
          company_phone:
            src.company && typeof src.company === "object"
              ? src.company.phone ?? null
              : null,
          company_contact_person_name:
            src.company && typeof src.company === "object"
              ? src.company.contact_person_name ?? null
              : null,
          company_address:
            src.company && typeof src.company === "object"
              ? src.company.address ?? null
              : null,
          company_city:
            src.company && typeof src.company === "object"
              ? src.company.city ?? null
              : null,
          company_state:
            src.company && typeof src.company === "object"
              ? src.company.state ?? null
              : null,
          company_country:
            src.company && typeof src.company === "object"
              ? src.company.country ?? null
              : null,
          company_kra_pin:
            src.company && typeof src.company === "object"
              ? src.company.kra_pin ?? null
              : null,

          account_debit_name:
            src.debitAccount && typeof src.debitAccount === "object" && src.debitAccount.name
              ? String(src.debitAccount.name)
              : null,
          account_credit_name:
            src.creditAccount && typeof src.creditAccount === "object" && src.creditAccount.name
              ? String(src.creditAccount.name)
              : null,

          // Created/updated users
          created_by_user_name:
            src.createdByUser && typeof src.createdByUser === "object"
              ? ([
                  src.createdByUser.first_name,
                  src.createdByUser.middle_name,
                  src.createdByUser.last_name,
                ]
                  .filter((p: any) => !!p)
                  .join(" ")
                  .trim() || src.createdByUser.email || null)
              : null,
          created_by_user_email:
            src.createdByUser && typeof src.createdByUser === "object"
              ? src.createdByUser.email ?? null
              : null,
          updated_by_user_name:
            src.updatedByUser && typeof src.updatedByUser === "object"
              ? ([
                  src.updatedByUser.first_name,
                  src.updatedByUser.middle_name,
                  src.updatedByUser.last_name,
                ]
                  .filter((p: any) => !!p)
                  .join(" ")
                  .trim() || src.updatedByUser.email || null)
              : null,
          updated_by_user_email:
            src.updatedByUser && typeof src.updatedByUser === "object"
              ? src.updatedByUser.email ?? null
              : null,
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

  const handleTabClick = (index: number) => {
    setActiveTab(index);
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
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          {loading && (
            <div className="text-center py-[30px]">
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading entry...</p>
            </div>
          )}

          {!loading && !entry && (
            <div className="text-center py-[30px]">
              <p className="text-sm text-gray-500 dark:text-gray-400">Entry not found.</p>
            </div>
          )}

          {entry && (
            <>
              {/* Header summary */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[15px] mb-[20px]">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-black dark:text-white mb-[4px]">
                    Company Ledger Entry #{entry.id}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Detailed view of the posted transaction and its accounting impact.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-[8px]">
                  {entry.transaction_status && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-xs font-medium bg-primary-50 dark:bg-[#15203c] text-primary-600 dark:text-primary-400">
                      <span className="w-[6px] h-[6px] rounded-full bg-primary-500 mr-[6px]"></span>
                      {entry.transaction_status}
                    </span>
                  )}
                  {entry.transaction_type && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-xs font-medium bg-gray-100 dark:bg-[#111827] text-gray-700 dark:text-gray-300">
                      {entry.transaction_type}
                    </span>
                  )}
                  <span className="inline-flex items-center px-[12px] py-[6px] rounded-md text-xs md:text-sm font-semibold bg-gray-900 text-white dark:bg-primary-500">
                    {entry.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {entry.transaction_currency || entry.base_currency || ""}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="trezo-tabs mb-[20px] md:mb-[25px]">
                <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto whitespace-nowrap">
                  <li className="nav-item inline-block ltr:mr-[30px] rtl:ml-[30px]">
                    <button
                      type="button"
                      onClick={() => handleTabClick(0)}
                      className={`nav-link flex items-center gap-[6px] pb-[10px] transition-all relative text-xs md:text-sm font-medium ${
                        activeTab === 0
                          ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <i className="material-symbols-outlined !text-[18px]">info</i>
                      Overview
                    </button>
                  </li>

                  <li className="nav-item inline-block ltr:mr-[30px] rtl:ml-[30px]">
                    <button
                      type="button"
                      onClick={() => handleTabClick(1)}
                      className={`nav-link flex items-center gap-[6px] pb-[10px] transition-all relative text-xs md:text-sm font-medium ${
                        activeTab === 1
                          ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <i className="material-symbols-outlined !text-[18px]">account_balance</i>
                      Accounting
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tab content */}
              {activeTab === 0 && (
                <div className="space-y-[20px] text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Transaction #</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Company</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.company_name || entry.company_id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Customer</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.customer_name || entry.customer_id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Transaction Date</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.transaction_date
                          ? new Date(entry.transaction_date).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Posted Date</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.posted_date
                          ? new Date(entry.posted_date).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Source</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.source_type || "-"} {entry.source_id ? `#${entry.source_id}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Category</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.category || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Payment Method</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_method || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Bank / Cheque</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.bank_account || entry.check_number
                          ? `${entry.bank_account || "-"} / ${entry.check_number || "-"}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Linked invoice & project */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Invoice</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.invoice_number || "-"} {entry.invoice_status ? `(${entry.invoice_status})` : ""}
                      </p>
                      {(entry.invoice_total_amount != null || entry.invoice_currency) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                          Total: {entry.invoice_total_amount != null
                            ? entry.invoice_total_amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "-"} {entry.invoice_currency || ""}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Project</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.project_name || "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.project_code ? `Code: ${entry.project_code}` : ""}
                        {entry.project_job_reference_id
                          ? `${entry.project_code ? " · " : ""}Job Ref: ${entry.project_job_reference_id}`
                          : ""}
                      </p>
                      {(entry.project_status || entry.project_priority || entry.project_progress) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                          {entry.project_status ? `Status: ${entry.project_status}` : ""}
                          {entry.project_priority ? ` · Priority: ${entry.project_priority}` : ""}
                          {entry.project_progress ? ` · Progress: ${entry.project_progress}%` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Payment Status</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_status || "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.payment_direction ? `Direction: ${entry.payment_direction}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Payment Amount</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_amount_paid != null
                          ? `${entry.payment_amount_paid.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} ${entry.payment_currency || ""}`
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.payment_date
                          ? `Paid on ${new Date(entry.payment_date).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Receipt / Reference</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_receipt_number || entry.payment_transaction_reference || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Reconciliation</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.payment_reconciled != null
                          ? entry.payment_reconciled
                            ? "Reconciled"
                            : "Not reconciled"
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.payment_reconciliation_date
                          ? `On ${new Date(entry.payment_reconciliation_date).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Company details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Company Contact</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.company_contact_person_name || "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.company_email || ""}
                        {entry.company_phone ? ` · ${entry.company_phone}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Company Location</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {[entry.company_address, entry.company_city, entry.company_country]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </p>
                      {entry.company_kra_pin && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                          KRA PIN: {entry.company_kra_pin}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Audit trail */}
                  <div className="mt-[10px] grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Created</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.created_at
                          ? new Date(entry.created_at).toLocaleString()
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.created_by_user_name || entry.created_by_user_email ||
                          (entry.created_by != null ? String(entry.created_by) : "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Last Updated</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.updated_at
                          ? new Date(entry.updated_at).toLocaleString()
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-[2px]">
                        {entry.updated_by_user_name || entry.updated_by_user_email ||
                          (entry.updated_by != null ? String(entry.updated_by) : "")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[10px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Narration</p>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] px-[12px] py-[10px]">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {entry.narration || "No narration provided for this entry."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-[20px] text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Transaction Gross</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {entry.transaction_currency || entry.base_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Transaction Tax</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.tax_amount.toFixed(2)} {entry.transaction_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Transaction Net</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.net_amount.toFixed(2)} {entry.transaction_currency || ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px] mt-[10px]">
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Base Gross</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.converted_amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {entry.base_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Base Tax</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.converted_tax_amount.toFixed(2)} {entry.base_currency || ""}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-100 dark:border-[#172036] bg-gray-50 dark:bg-[#111827] p-[12px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[4px]">Base Net</p>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {entry.converted_net_amount.toFixed(2)} {entry.base_currency || ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Exchange Rate</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.exchange_rate.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Converted Amount</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {entry.converted_amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Accounts</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        Dr {entry.account_debit_name ?? "-"} / Cr {entry.account_credit_name ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">Fiscal Context</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        FY {entry.fiscal_year ?? "-"} · Period {entry.accounting_period || "-"}
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

export default function CompanyLedgerDetailPage() {
  return (
    <AuthenticatedLayout>
      <CompanyLedgerDetailPageInner />
    </AuthenticatedLayout>
  );
}
