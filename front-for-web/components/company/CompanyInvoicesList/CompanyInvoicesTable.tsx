"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";

interface CompanyInvoiceSummary {
  id: number;
  invoice_number: string;
  title?: string | null;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  created_at?: string | null;
}

interface CompanyOption {
  id: number;
  name: string;
}

interface CompanyPhaseAssignment {
  id: number;
  phase_id: number;
  project_id: number | null;
  is_complete: boolean;
  phase_name: string;
  phase_code?: string | null;
  project_name?: string | null;
}

const CompanyInvoicesTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [invoices, setInvoices] = useState<CompanyInvoiceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<CompanyPhaseAssignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState<boolean>(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [creatingInvoice, setCreatingInvoice] = useState<boolean>(false);
  const [invoiceTitle, setInvoiceTitle] = useState<string>("");
  const [invoiceDescription, setInvoiceDescription] = useState<string>("");
  const [invoicePaymentTerms, setInvoicePaymentTerms] = useState<string>("");
  const [invoiceNotes, setInvoiceNotes] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchInvoices = async () => {
      if (!accessToken) {
        setLoading(false);
        setInvoices([]);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (statusFilter && statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        const qs = params.toString();
        const url = qs ? `/api/company-invoices/list?${qs}` : "/api/company-invoices/list";

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);

        if (!resp.ok) {
          addToast(
            data?.message || "Failed to load company invoices",
            "error"
          );
          setInvoices([]);
          return;
        }

        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const mapped: CompanyInvoiceSummary[] = (items || []).map((inv: any) => ({
          id: inv.id,
          invoice_number: inv.invoice_number,
          title: inv.title ?? null,
          status: inv.status,
          subtotal_amount: Number(inv.subtotal_amount ?? 0),
          tax_amount: Number(inv.tax_amount ?? 0),
          discount_amount: Number(inv.discount_amount ?? 0),
          total_amount: Number(inv.total_amount ?? 0),
          currency: inv.currency || "USD",
          created_at: inv.created_at ?? null,
        }));

        setInvoices(mapped);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch company invoices error", err);
        addToast(
          "Error loading company invoices. Please try again.",
          "error"
        );
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();

    return () => controller.abort();
  }, [accessToken, addToast, reloadKey, statusFilter]);

  const formatCurrency = (value: number, currency: string) => {
    if (Number.isNaN(value)) return "-";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-success-50 text-success-500";
      case "sent":
        return "bg-info-50 text-info-500";
      case "draft":
        return "bg-warning-50 text-warning-500";
      case "overdue":
        return "bg-danger-50 text-danger-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(lowerSearch) ||
      (inv.title || "").toLowerCase().includes(lowerSearch) ||
      inv.status.toLowerCase().includes(lowerSearch);

    const matchesStatus =
      statusFilter === "all" ||
      inv.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const canDeleteInvoice = (inv: CompanyInvoiceSummary): boolean => {
    return inv.status.toLowerCase() === "draft";
  };

  const handleSendEmail = async (id: number) => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setSendingEmailId(id);
    try {
      const resp = await fetch("/api/company-invoices/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id }),
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        throw new Error(data?.message || "Failed to send invoice email");
      }

      addToast(data?.message || "Invoice emailed successfully", "success");
    } catch (e: any) {
      addToast(e?.message || "Failed to send invoice email", "error");
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleDownloadPdf = async (id: number, invoiceNumber?: string | null) => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setDownloadingId(id);
    try {
      const resp = await fetch(
        `/api/company-invoices/download-pdf?id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!resp.ok) {
        const data: any = await resp.json().catch(() => null);
        throw new Error(data?.message || "Failed to download invoice PDF");
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = invoiceNumber
        ? `${invoiceNumber}.pdf`
        : `company-invoice-${id}.pdf`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      addToast(e?.message || "Failed to download invoice PDF", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchCompanies = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setCompaniesLoading(true);
    try {
      const resp = await fetch("/api/companies/list?per_page=100", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        addToast(data?.message || "Failed to load companies", "error");
        setCompanies([]);
        return;
      }

      const list = data?.data || data;
      const items: CompanyOption[] = (Array.isArray(list) ? list : []).map((c: any) => ({
        id: c.id,
        name: c.name || c.code || `Company #${c.id}`,
      }));

      setCompanies(items);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("fetch companies error", err);
      addToast("Error loading companies. Please try again.", "error");
      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const fetchAssignmentsForCompany = async (companyId: number) => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setAssignmentsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("company_id", String(companyId));
      params.append("is_complete", "1");
      params.append("per_page", "50");

      const resp = await fetch(`/api/projects/company-projects?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        addToast(data?.error || data?.message || "Failed to load assigned phases", "error");
        setAssignments([]);
        return;
      }

      const payload = data?.data || data;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      const mapped: CompanyPhaseAssignment[] = (items || []).map((item: any) => ({
        id: item.id,
        phase_id: item.phase_id,
        project_id: item.project_id ?? null,
        is_complete: !!item.is_complete,
        phase_name: item.phase?.name || item.phase_name || `Phase #${item.phase_id}`,
        phase_code: item.phase?.code ?? null,
        project_name: item.project?.name ?? null,
      }));

      setAssignments(mapped);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("fetch company assignments error", err);
      addToast("Error loading assigned phases. Please try again.", "error");
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const handleOpenCreateModal = async () => {
    setSelectedCompanyId(null);
    setSelectedAssignmentId(null);
    setAssignments([]);
    setInvoiceTitle("");
    setInvoiceDescription("");
    setInvoicePaymentTerms("");
    setInvoiceNotes("");
    setShowCreateModal(true);
    await fetchCompanies();
  };

  const handleCompanyChange = async (value: string) => {
    const id = value ? Number(value) : NaN;
    if (Number.isNaN(id)) {
      setSelectedCompanyId(null);
      setAssignments([]);
      setSelectedAssignmentId(null);
      return;
    }
    setSelectedCompanyId(id);
    setSelectedAssignmentId(null);
    setAssignments([]);
    await fetchAssignmentsForCompany(id);
  };

  const handleCreateInvoice = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    if (!selectedCompanyId || !selectedAssignmentId) {
      addToast("Please select a company and a completed phase.", "error");
      return;
    }

    const selected = assignments.find((a) => a.id === selectedAssignmentId);
    if (!selected) {
      addToast("Selected phase is not available.", "error");
      return;
    }

    setCreatingInvoice(true);
    try {
      const resp = await fetch("/api/company-invoices/create-from-phase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          company_id: selectedCompanyId,
          project_phase_id: selected.phase_id,
          title: invoiceTitle || undefined,
          description: invoiceDescription || undefined,
          payment_terms: invoicePaymentTerms || undefined,
          notes_to_customer: invoiceNotes || undefined,
        }),
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        throw new Error(data?.message || "Failed to create company invoice from phase");
      }

      addToast(data?.message || "Company invoice created successfully", "success");
      setShowCreateModal(false);
      setReloadKey((prev) => prev + 1);
    } catch (e: any) {
      addToast(e?.message || "Failed to create company invoice from phase", "error");
    } finally {
      setCreatingInvoice(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Company Invoices</h5>
        </div>

        <div className="flex items-center gap-[15px] w-full md:w-auto flex-wrap md:flex-nowrap">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                add
              </i>
              Create Company Invoice
            </span>
          </button>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        {loading ? (
          <div className="p-[20px] md:p-[25px]">
            <div className="space-y-[10px]">
              {[...Array(5)].map((_, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  key={idx}
                  className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Invoice #
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Title
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Subtotal
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Tax
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Discount
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Total
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Created
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/company/invoices/${inv.id}`}
                            className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {inv.invoice_number}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px]">
                          {inv.title ? (
                            <Link
                              href={`/company/invoices/${inv.id}`}
                              className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                            >
                              {inv.title}
                            </Link>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              (No title)
                            </span>
                          )}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold">
                            {formatCurrency(inv.subtotal_amount, inv.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold">
                            {formatCurrency(inv.tax_amount, inv.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold">
                            {formatCurrency(inv.discount_amount, inv.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold text-primary-500">
                            {formatCurrency(inv.total_amount, inv.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {inv.created_at
                            ? new Date(inv.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span
                            className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusBadgeClass(
                              inv.status
                            )}`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link
                              href={`/company/invoices/${inv.id}`}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                              title="View Details"
                            >
                              <i className="material-symbols-outlined !text-[18px]">
                                visibility
                              </i>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(inv.id, inv.invoice_number)}
                              disabled={downloadingId === inv.id}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download PDF"
                            >
                              <i className="material-symbols-outlined !text-[18px]">
                                picture_as_pdf
                              </i>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendEmail(inv.id)}
                              disabled={sendingEmailId === inv.id}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Send Email"
                            >
                              <i className="material-symbols-outlined !text-[18px]">
                                mail
                              </i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm || statusFilter !== "all"
                          ? "No company invoices match your criteria"
                          : "No company invoices found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#0c1427] rounded-md shadow-lg w-full max-w-2xl p-[20px] md:p-[25px]">
            <div className="flex items-center justify-between mb-[15px]">
              <h5 className="!mb-0">Create Company Invoice from Project</h5>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-[10px]">
              Select a company and one of its completed, assigned project phases to generate a draft
              company invoice. You can override the invoice header details below; financial amounts
              and line items can be edited later on the invoice detail page.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[15px]">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Company
                </label>
                <select
                  value={selectedCompanyId ?? ""}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                >
                  <option value="">
                    {companiesLoading ? "Loading companies..." : "Select company"}
                  </option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Invoice Title
                </label>
                <input
                  type="text"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                  placeholder="e.g. Phase completion invoice"
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-1 gap-[15px] mb-[15px]">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Description
                </label>
                <textarea
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none resize-none"
                  placeholder="Short description for this invoice"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Completed Assigned Phases
                </label>
                <div className="border border-gray-200 dark:border-[#172036] rounded-md max-h-[220px] overflow-auto">
                  {assignmentsLoading ? (
                    <div className="p-[12px] text-sm text-gray-500 dark:text-gray-400">
                      Loading assigned phases...
                    </div>
                  ) : assignments.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-[#15203c] text-black dark:text-white">
                        <tr>
                          <th className="px-[12px] py-[8px] text-left">Select</th>
                          <th className="px-[12px] py-[8px] text-left">Project</th>
                          <th className="px-[12px] py-[8px] text-left">Phase</th>
                        </tr>
                      </thead>
                      <tbody className="text-black dark:text-white">
                        {assignments.map((a) => (
                          <tr
                            key={a.id}
                            className="border-t border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] cursor-pointer"
                            onClick={() => setSelectedAssignmentId(a.id)}
                          >
                            <td className="px-[12px] py-[8px]">
                              <input
                                type="radio"
                                checked={selectedAssignmentId === a.id}
                                onChange={() => setSelectedAssignmentId(a.id)}
                              />
                            </td>
                            <td className="px-[12px] py-[8px] whitespace-nowrap">
                              {a.project_name || "(No project)"}
                            </td>
                            <td className="px-[12px] py-[8px] whitespace-nowrap">
                              {a.phase_code ? `${a.phase_code} - ${a.phase_name}` : a.phase_name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-[12px] text-sm text-gray-500 dark:text-gray-400">
                      {selectedCompanyId
                        ? "No completed project phases assigned to this company."
                        : "Select a company to view its completed assigned phases."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-[15px] mb-[15px]">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={invoicePaymentTerms}
                  onChange={(e) => setInvoicePaymentTerms(e.target.value)}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                  placeholder="e.g. 30 days from invoice date"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Notes to Company
                </label>
                <textarea
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none resize-none"
                  placeholder="Any special notes to show on the invoice"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-[10px]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-[13px] py-[6px] text-sm rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedCompanyId || !selectedAssignmentId || creatingInvoice}
                onClick={handleCreateInvoice}
                className="px-[13px] py-[6px] text-sm rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingInvoice ? "Creating…" : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyInvoicesTable;
