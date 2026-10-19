"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import Can from "../../auth/Can";

interface CustDebitNoteSummary {
  id: number;
  debit_note_number: string;
  invoice_id: number;
  title: string | null;
  description: string | null;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  notes_to_customer: string | null;
  updated_at: string | null;
  updated_by: number | null;
  created_at: string | null;
  created_by: number | null;
  invoice?: any;
  items?: any[];
}

interface CustInvoiceSummary {
  id: number;
  invoice_number: string;
  title: string | null;
  status: string;
  currency: string;
}

// Debit notes document additional charges on invoices already issued to the customer
const ELIGIBLE_INVOICE_STATUSES = ["sent", "partial-paid", "paid"];

const ELIGIBLE_STATUSES_LABEL = "sent, partial-paid or paid";

const CustDebitNotesTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [debitNotes, setDebitNotes] = useState<CustDebitNoteSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<CustInvoiceSummary[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState<boolean>(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [debitNoteTitle, setDebitNoteTitle] = useState<string>("");
  const [debitNoteDescription, setDebitNoteDescription] = useState<string>("");
  const [debitNoteNotes, setDebitNoteNotes] = useState<string>("");
  const [creatingDebitNote, setCreatingDebitNote] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDebitNotes = async () => {
      if (!accessToken) {
        setLoading(false);
        setDebitNotes([]);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (statusFilter && statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        const qs = params.toString();
        const url = qs ? `/api/cust-debit-notes?${qs}` : "/api/cust-debit-notes";

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);

        if (!resp.ok) {
          addToast(data?.message || "Failed to load customer debit notes", "error");
          setDebitNotes([]);
          return;
        }

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

        const mapped: CustDebitNoteSummary[] = (items || []).map((dn: any) => ({
          id: dn.id,
          debit_note_number: dn.debit_note_number ?? String(dn.id ?? ""),
          invoice_id:
            typeof dn.invoice_id === "number"
              ? dn.invoice_id
              : dn.invoice_id
              ? Number(dn.invoice_id)
              : null,
          title: dn.title ?? null,
          description: dn.description ?? null,
          status: dn.status || "draft",
          subtotal_amount: Number(dn.subtotal_amount ?? 0),
          tax_amount: Number(dn.tax_amount ?? 0),
          total_amount: Number(dn.total_amount ?? 0),
          currency: dn.currency || "USD",
          created_at: dn.created_at ?? null,
        }));

        setDebitNotes(mapped);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch customer debit notes error", err);
        addToast("Error loading customer debit notes. Please try again.", "error");
        setDebitNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDebitNotes();

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
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const filteredDebitNotes = debitNotes.filter((dn) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      (dn.title || "").toLowerCase().includes(lowerSearch) ||
      (dn.status || "").toLowerCase().includes(lowerSearch) ||
      (dn.debit_note_number || "").toLowerCase().includes(lowerSearch) ||
      (dn.invoice_id ? String(dn.invoice_id).includes(lowerSearch) : false);

    const matchesStatus =
      statusFilter === "all" || dn.status.toLowerCase() === statusFilter.toLowerCase();

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
      params.append('per_page', '1000');

      const resp = await fetch(`/api/cust-invoices/list?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: any = await resp.json().catch(() => null);

      if (!resp.ok) {
        const message = data?.message || 'Failed to load customer invoices'
        addToast(message, 'error')
        setInvoices([])
        return
      }

      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []

      // Debit notes document additional charges on invoices already issued to the customer
      const mapped: CustInvoiceSummary[] = (items || [])
        .filter((inv: any) =>
          ELIGIBLE_INVOICE_STATUSES.includes(String(inv.status || '').toLowerCase()),
        )
        .map((inv: any) => ({
          id: inv.id,
          invoice_number: inv.invoice_number,
          title: inv.title ?? null,
          status: inv.status,
          currency: inv.currency || 'USD',
        }))

      setInvoices(mapped)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('fetch customer invoices for debit note error', err)
      addToast('Error loading customer invoices.', 'error')
      setInvoices([])
    } finally {
      setInvoicesLoading(false)
    }
  };

  const handleOpenCreateModal = async () => {
    setSelectedInvoiceId(null);
    setDebitNoteTitle("");
    setDebitNoteDescription("");
    setDebitNoteNotes("");
    setShowCreateModal(true);
    await fetchInvoices();
  };

  const handleCreateDebitNote = async () => {
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

    if (!ELIGIBLE_INVOICE_STATUSES.includes(selectedInvoice.status?.toLowerCase() || "")) {
      addToast("Debit notes can only be created for invoices issued to the customer.", "error");
      return;
    }

    if (!debitNoteTitle.trim()) {
      addToast("Debit note title is required.", "error");
      return;
    }

    if (!debitNoteDescription.trim()) {
      addToast("Description is required.", "error");
      return;
    }

    if (!debitNoteNotes.trim()) {
      addToast("Notes to customer are required.", "error");
      return;
    }

    setCreatingDebitNote(true);
    try {
      const resp = await fetch("/api/cust-debit-notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_id: selectedInvoiceId,
          title: debitNoteTitle,
          description: debitNoteDescription,
          currency: selectedInvoice.currency,
          notes_to_customer: debitNoteNotes,
        }),
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        throw new Error(data?.message || "Failed to create debit note");
      }

      addToast(data?.message || "Draft debit note created.", "success");
      setShowCreateModal(false);
      setReloadKey((prev) => prev + 1);
    } catch (e: any) {
      addToast(e.message || "Failed to create debit note", "error");
    } finally {
      setCreatingDebitNote(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Customer Debit Notes</h5>
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
          </select>

          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search debit notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>

          <Can any={["ROLE_ADD_CUST_DEBIT_NOTE"]}>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Customer Debit Note
              </span>
            </button>
          </Can>
        </div>
      </div>

      <p className="mt-[3px] mb-[20px] md:mb-[25px] text-[11px] text-danger-500">
        Only invoices in <span className="font-medium">{ELIGIBLE_STATUSES_LABEL}</span> status are
        eligible for customer debit notes.
      </p>

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
              <table className="min-w-[1200px] w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Debit Note #</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Title</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Description</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Invoice</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Subtotal</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Tax</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Total</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Currency</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Status</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Created</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {filteredDebitNotes.length > 0 ? (
                    filteredDebitNotes.map((dn) => (
                      <tr
                        key={dn.id}
                        className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap font-mono">
                          {dn.debit_note_number || dn.id}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/cust-invoices/debit-notes/${dn.id}`}
                            className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {dn.title || "(Untitled)"}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-xs max-w-[250px] truncate">
                          {dn.description || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {dn.invoice_id ? (
                            <Link
                              href={`/cust-invoices/${dn.invoice_id}`}
                              className="text-primary-500 hover:text-primary-600 hover:underline"
                            >
                              Invoice #{dn.invoice_id}
                            </Link>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </td>
                        <td className="ltr:text-right rtl:text-left px-[20px] py-[15px] whitespace-nowrap">
                          {formatCurrency(dn.subtotal_amount, dn.currency)}
                        </td>
                        <td className="ltr:text-right rtl:text-left px-[20px] py-[15px] whitespace-nowrap">
                          {formatCurrency(dn.tax_amount, dn.currency)}
                        </td>
                        <td className="ltr:text-right rtl:text-left px-[20px] py-[15px] whitespace-nowrap font-semibold text-primary-500">
                          {formatCurrency(dn.total_amount, dn.currency)}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {dn.currency}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <span
                            className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                              dn.status
                            )}`}
                          >
                            {dn.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-sm">
                          {dn.created_at ? new Date(dn.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link
                            href={`/cust-invoices/debit-notes/${dn.id}`}
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
                        colSpan={11}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm || statusFilter !== "all"
                          ? "No customer debit notes match your criteria"
                          : "No customer debit notes found"}
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
              <h5 className="!mb-0">Create Customer Debit Note</h5>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-[10px]">
              Select the customer invoice you want to charge additional amounts against. Only
              invoices issued to the customer are eligible.
            </p>

            <div className="mb-[15px]">
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
                  {invoicesLoading ? "Loading invoices..." : "Select issued invoice"}
                </option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoice_number}
                    {inv.title ? ` - ${inv.title}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-[15px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                Title
              </label>
              <input
                type="text"
                value={debitNoteTitle}
                onChange={(e) => setDebitNoteTitle(e.target.value)}
                className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                placeholder="Debit note title"
              />
            </div>

            <div className="mb-[15px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                Description
              </label>
              <textarea
                value={debitNoteDescription}
                onChange={(e) => setDebitNoteDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                placeholder="Short description for this debit note"
              />
            </div>

            <div className="mb-[15px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-[6px]">
                Notes to Customer
              </label>
              <textarea
                value={debitNoteNotes}
                onChange={(e) => setDebitNoteNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-[#172036] rounded-md px-[10px] py-[7px] text-sm bg-white dark:bg-[#0c1427] text-black dark:text-white outline-none"
                placeholder="Any additional notes for the customer"
              />
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={creatingDebitNote}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateDebitNote}
                disabled={creatingDebitNote}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingDebitNote ? "Creating..." : "Create Debit Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustDebitNotesTable;