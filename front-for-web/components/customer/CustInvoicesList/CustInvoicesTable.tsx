"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import Can from "../../auth/Can";

interface CustInvoiceSummary {
  id: number;
  job_reference_id?: string;
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

interface ApprovedOrderSummary {
  id: number;
  order_number: string;
  title?: string | null;
  status: string;
  total_amount: number;
  currency: string;
}

const CustInvoicesTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [invoices, setInvoices] = useState<CustInvoiceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [orders, setOrders] = useState<ApprovedOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
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
        const url = qs ? `/api/cust-invoices/list?${qs}` : "/api/cust-invoices/list";

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);

        if (!resp.ok) {
          addToast(data?.message || "Failed to load customer invoices", "error");
          setInvoices([]);
          return;
        }

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

        const mapped: CustInvoiceSummary[] = (items || []).map((inv: any) => ({
          id: inv.id,
          invoice_number: inv.invoice_number,
          title: inv.title ?? null,
          status: inv.status,
          job_reference_id: inv.job_reference_id ?? null,
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
        console.error("fetch customer invoices error", err);
        addToast("Error loading customer invoices. Please try again.", "error");
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
      case "partial-paid":
        return "bg-warning-50 text-warning-500";
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
      inv.status.toLowerCase().includes(lowerSearch) ||
      (inv.job_reference_id || "").toLowerCase().includes(lowerSearch);

    const matchesStatus =
      statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const fetchApprovedOrders = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "approved");
      params.append("per_page", "50");

      const resp = await fetch(`/api/orders/list?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        addToast(data?.message || "Failed to load approved orders", "error");
        setOrders([]);
        return;
      }

      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

      const mapped: ApprovedOrderSummary[] = (items || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        title: order.title ?? null,
        status: order.status,
        total_amount: Number(order.total_amount ?? 0),
        currency: order.currency || "USD",
      }));

      setOrders(mapped);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("fetch approved orders error", err);
      addToast("Error loading approved orders. Please try again.", "error");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSendEmail = async (id: number) => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setSendingEmailId(id);
    try {
      const resp = await fetch("/api/cust-invoices/send-email", {
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

  const handleDownloadPdf = async (id: number) => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setDownloadingId(id);
    try {
      const resp = await fetch(`/api/cust-invoices/download-pdf?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!resp.ok) {
        const data: any = await resp.json().catch(() => null);
        throw new Error(data?.message || "Failed to download invoice PDF");
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
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

  const handleOpenCreateModal = async () => {
    setSelectedOrderId(null);
    setInvoiceTitle("");
    setInvoiceDescription("");
    setInvoicePaymentTerms("");
    setInvoiceNotes("");
    setShowCreateModal(true);
    await fetchApprovedOrders();
  };

  const handleCreateInvoice = async () => {
    if (!selectedOrderId) return;
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setCreatingInvoice(true);
    try {
      const resp = await fetch("/api/cust-invoices/create-from-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          order_id: selectedOrderId,
          title: invoiceTitle || undefined,
          description: invoiceDescription || undefined,
          payment_terms: invoicePaymentTerms || undefined,
          notes_to_customer: invoiceNotes || undefined,
        }),
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        throw new Error(data?.message || "Failed to create invoice from order");
      }

      addToast(data?.message || "Invoice created from order successfully", "success");
      setShowCreateModal(false);
      setReloadKey((prev) => prev + 1);
    } catch (e: any) {
      addToast(e?.message || "Failed to create invoice from order", "error");
    } finally {
      setCreatingInvoice(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Customer Invoices</h5>
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
            <option value="partial-paid">Partial Paid</option>
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

          <Can any={["ROLE_ADD_CUST_INVOICE"]}>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Invoice
              </span>
            </button>
          </Can>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        {loading ? (
          <div className="p-[20px] md:p-[25px]">
            <div className="space-y-[10px]">
              {[...Array(5)].map((_, idx) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
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
                      Job Ref ID
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
                            href={`/cust-invoices/${inv.id}`}
                            className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {inv.invoice_number}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {inv.job_reference_id || ""}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px]">
                          {inv.title ? (
                            <Link
                              href={`/cust-invoices/${inv.id}`}
                              className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                            >
                              {inv.title}
                            </Link>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">(No title)</span>
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
                          {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : "-"}
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
                              href={`/cust-invoices/${inv.id}`}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                              title="View Details"
                            >
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(inv.id)}
                              disabled={downloadingId === inv.id}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download PDF"
                            >
                              <i className="material-symbols-outlined !text-[18px]">picture_as_pdf</i>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendEmail(inv.id)}
                              disabled={sendingEmailId === inv.id}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Send Email"
                            >
                              <i className="material-symbols-outlined !text-[18px]">mail</i>
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
                          ? "No customer invoices match your criteria"
                          : "No customer invoices found"}
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
              <h5 className="!mb-0">Create Invoice from Order</h5>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-[10px]">
              Select an order in approved status to generate a draft customer invoice. You can override the invoice header details below; financial and tax amounts will always come from the selected order.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[15px]">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Invoice Title
                </label>
                <input
                  type="text"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                  placeholder="e.g. Phase 1 Completion Invoice"
                />
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[15px]">
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
                  Notes to Customer
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

            <div className="border border-gray-100 dark:border-[#172036] rounded-md max-h-[320px] overflow-auto mb-[15px]">
              {ordersLoading ? (
                <div className="p-[16px] text-sm text-gray-500 dark:text-gray-400">Loading approved orders...</div>
              ) : orders.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-[#15203c] text-black dark:text-white">
                    <tr>
                      <th className="px-[16px] py-[10px] text-left">Select</th>
                      <th className="px-[16px] py-[10px] text-left">Order #</th>
                      <th className="px-[16px] py-[10px] text-left">Title</th>
                      <th className="px-[16px] py-[10px] text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-black dark:text-white">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] cursor-pointer"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <td className="px-[16px] py-[8px]">
                          <input
                            type="radio"
                            checked={selectedOrderId === order.id}
                            onChange={() => setSelectedOrderId(order.id)}
                          />
                        </td>
                        <td className="px-[16px] py-[8px] whitespace-nowrap">{order.order_number}</td>
                        <td className="px-[16px] py-[8px]">
                          {order.title || <span className="text-gray-500 dark:text-gray-400">(No title)</span>}
                        </td>
                        <td className="px-[16px] py-[8px] text-right whitespace-nowrap">
                          {formatCurrency(order.total_amount, order.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-[16px] text-sm text-gray-500 dark:text-gray-400">
                  No approved orders available for invoicing.
                </div>
              )}
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
                disabled={!selectedOrderId || creatingInvoice}
                onClick={handleCreateInvoice}
                className="px-[13px] py-[6px] text-sm rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingInvoice ? 'Creating…' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustInvoicesTable;
