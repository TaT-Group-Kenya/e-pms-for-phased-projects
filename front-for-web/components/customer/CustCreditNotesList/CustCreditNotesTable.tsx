"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import Can from "../../auth/Can";

interface CustCreditNoteSummary {
  id: number;
  invoice_id: number | null;
  title: string | null;
  description: string | null;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  created_at: string | null;
}

interface CustInvoiceSummary {
  id: number;
  invoice_number: string;
  title: string | null;
  status: string;
  currency: string;
}

const CustCreditNotesTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [creditNotes, setCreditNotes] = useState<CustCreditNoteSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<CustInvoiceSummary[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState<boolean>(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [creditNoteTitle, setCreditNoteTitle] = useState<string>("");
  const [creditNoteDescription, setCreditNoteDescription] = useState<string>("");
  const [creditNoteNotes, setCreditNoteNotes] = useState<string>("");
  const [creatingCreditNote, setCreatingCreditNote] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCreditNotes = async () => {
      if (!accessToken) {
        setLoading(false);
        setCreditNotes([]);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (statusFilter && statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        const qs = params.toString();
        const url = qs ? `/api/cust-credit-notes?${qs}` : "/api/cust-credit-notes";

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);

        if (!resp.ok) {
          addToast(data?.message || "Failed to load customer credit notes", "error");
          setCreditNotes([]);
          return;
        }

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

        const mapped: CustCreditNoteSummary[] = (items || []).map((cn: any) => ({
          id: cn.id,
          invoice_id:
            typeof cn.invoice_id === "number"
              ? cn.invoice_id
              : cn.invoice_id
              ? Number(cn.invoice_id)
              : null,
          title: cn.title ?? null,
          description: cn.description ?? null,
          status: cn.status || "draft",
          subtotal_amount: Number(cn.subtotal_amount ?? 0),
          tax_amount: Number(cn.tax_amount ?? 0),
          total_amount: Number(cn.total_amount ?? 0),
          currency: cn.currency || "USD",
          created_at: cn.created_at ?? null,
        }));

        setCreditNotes(mapped);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch customer credit notes error", err);
        addToast("Error loading customer credit notes. Please try again.", "error");
        setCreditNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditNotes();

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
      case "draft":
        return "bg-warning-50 text-warning-500";
      case "raised":
        return "bg-info-50 text-info-500";
      case "refunded":
        return "bg-success-50 text-success-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const filteredCreditNotes = creditNotes.filter((cn) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      (cn.title || "").toLowerCase().includes(lowerSearch) ||
      (cn.status || "").toLowerCase().includes(lowerSearch) ||
      (cn.invoice_id ? String(cn.invoice_id).includes(lowerSearch) : false);

    const matchesStatus =
      statusFilter === "all" || cn.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const fetchInvoices = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    setInvoicesLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "paid");

      const resp = await fetch(`/api/cust-invoices/list?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
        currency: inv.currency || "USD",
      }));

      setInvoices(mapped);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("fetch customer invoices for credit note error", err);
      addToast("Error loading customer invoices.", "error");
      setInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const handleOpenCreateModal = async () => {
    setSelectedInvoiceId(null);
    setCreditNoteTitle("");
    setCreditNoteDescription("");
    setCreditNoteNotes("");
    setShowCreateModal(true);
    await fetchInvoices();
  };

  const handleCreateCreditNote = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }

    if (!selectedInvoiceId) {
      addToast("Please select an invoice.", "error");
      return;
    }

    const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId);
    if (!selectedInvoice) {
      addToast("Selected invoice is not available.", "error");
      return;
    }

    if (selectedInvoice.status?.toLowerCase() !== "paid") {
      addToast("Credit notes can only be created for fully paid invoices.", "error");
      return;
    }

    if (!creditNoteTitle.trim()) {
      addToast("Credit note title is required.", "error");
      return;
    }

    if (!creditNoteDescription.trim()) {
      addToast("Description is required.", "error");
      return;
    }

    if (!creditNoteNotes.trim()) {
      addToast("Notes to customer are required.", "error");
      return;
    }

    setCreatingCreditNote(true);
    try {
      const resp = await fetch("/api/cust-credit-notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_id: selectedInvoiceId,
          title: creditNoteTitle,
          description: creditNoteDescription,
          status: "draft",
          subtotal_amount: 0,
          tax_amount: 0,
          total_amount: 0,
          currency: selectedInvoice.currency,
          notes_to_customer: creditNoteNotes,
        }),
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        throw new Error(data?.message || "Failed to create credit note");
      }

      addToast("Draft credit note created.", "success");
      setShowCreateModal(false);
      setReloadKey((prev) => prev + 1);
    } catch (e: any) {
      addToast(e.message || "Failed to create credit note", "error");
    } finally {
      setCreatingCreditNote(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Customer Credit Notes</h5>
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
            <option value="raised">Raised</option>
            <option value="refunded">Refunded</option>
          </select>

          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search credit notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>

          <Can any={["ROLE_ADD_CUST_CREDIT_NOTE"]}>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Customer Credit Note
              </span>
            </button>
          </Can>
        </div>
      </div>

        <p className="mt-[3px] text-[11px] text-danger-500">
          Only invoices in <span className="font-medium">paid</span> status are eligible for
          customer credit notes.
        </p>

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
                      Credit Note
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Invoice
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Total
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Created
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredCreditNotes.length > 0 ? (
                    filteredCreditNotes.map((cn) => (
                      <tr
                        key={cn.id}
                        className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/cust/credit-notes/${cn.id}`}
                            className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {cn.title || `(Credit Note #${cn.id})`}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {cn.invoice_id ? (
                            <Link
                              href={`/cust-invoices/${cn.invoice_id}`}
                              className="text-primary-500 hover:text-primary-600 hover:underline"
                            >
                              Invoice #{cn.invoice_id}
                            </Link>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span className="font-semibold text-primary-500">
                            {formatCurrency(cn.total_amount, cn.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span
                            className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                              cn.status
                            )}`}
                          >
                            {cn.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {cn.created_at ? new Date(cn.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/cust/credit-notes/${cn.id}`}
                            className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                            title="View Details"
                          >
                            <i className="material-symbols-outlined !text-[18px]">visibility</i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm || statusFilter !== "all"
                          ? "No customer credit notes match your criteria"
                          : "No customer credit notes found"}
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
              <h5 className="!mb-0">Create Customer Credit Note</h5>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-[10px]">
              Select the customer invoice for which you want to create a credit note. Only fully
              paid invoices are eligible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[15px]">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Invoice
                </label>
                <select
                  value={selectedInvoiceId ?? ""}
                  onChange={(e) =>
                    setSelectedInvoiceId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                >
                  <option value="">
                    {invoicesLoading ? "Loading invoices..." : "Select paid invoice"}
                  </option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoice_number}
                      {inv.title ? ` - ${inv.title}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                  Title
                </label>
                <input
                  type="text"
                  value={creditNoteTitle}
                  onChange={(e) => setCreditNoteTitle(e.target.value)}
                  className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                  placeholder="Credit note title"
                />
              </div>
            </div>

            <div className="mb-[15px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                Description
              </label>
              <textarea
                value={creditNoteDescription}
                onChange={(e) => setCreditNoteDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                placeholder="Short description for this credit note"
              />
            </div>

            <div className="mb-[15px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                Notes to Customer
              </label>
              <textarea
                value={creditNoteNotes}
                onChange={(e) => setCreditNoteNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                placeholder="Any additional notes for the customer"
              />
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={creatingCreditNote}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCreditNote}
                disabled={creatingCreditNote}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingCreditNote ? "Creating..." : "Create Credit Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustCreditNotesTable;
