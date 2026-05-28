import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import Can from "../../../components/auth/Can";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useRouter } from "next/router";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";

export default function PdcIssuedDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editChequeDate, setEditChequeDate] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState("cancelled");
  const [savingStatus, setSavingStatus] = useState(false);

  const formatCurrency = (
    value: string | number | null | undefined,
    currency?: string,
  ) => {
    if (value === null || value === undefined || value === "") return "-";
    const amount = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(amount)) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || item?.currency || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getUserName = (user: any) => {
    if (!user) return "-";
    const parts = [user.first_name, user.middle_name, user.last_name].filter(
      Boolean,
    );
    return parts.length ? parts.join(" ") : user.email || "-";
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id || !accessToken) return;
      setLoading(true);
      try {
        const resp = await fetch(`/api/pdc-issued/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await resp.json().catch(() => null);
        if (!resp.ok) throw new Error(data?.message || "Failed to load");
        const payload = data?.data || data;
        setItem(payload);
      } catch (err: any) {
        addToast(err?.message || "Failed to load PDC", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, accessToken, addToast]);

  useEffect(() => {
    if (item) {
      setEditAmount(item.amount.toString() || "");
      setEditChequeDate(item.cheque_date || "");
    }
  }, [item]);

  const handlePostToAccounts = async () => {
    if (!item || !accessToken) return;
    setPosting(true);
    try {
      const resp = await fetch("/api/pdc-issued/post-to-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error(data?.message || "Failed to post");
      addToast("Posted to accounts", "success");
      // refresh
      setItem((prev: any) => ({ ...prev, status: "cleared" }));
    } catch (err: any) {
      addToast(err?.message || "Failed to post to accounts", "error");
    } finally {
      setPosting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!item || item.status === "cleared") return;

    setSavingStatus(true);
    try {
      const resp = await fetch(`/api/pdc-issued/update-pdc-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: item.id,
          status: statusToUpdate,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error(data?.message || "Failed to update status");
      addToast("PDC status updated successfully", "success");
      // Refresh the item to update UI
      setItem(data?.data || data);
      setShowStatusUpdateModal(false);
    } catch (err: any) {
      addToast(err?.message || "Failed to update PDC status", "error");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusToUpdate(e.target.value);
  };

  const matured = (() => {
    if (!item || !item.cheque_date) return false;
    const cheque = new Date(item.cheque_date);
    const today = new Date();
    cheque.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return cheque <= today;
  })();

  return (
    <AuthenticatedLayout>
      <Can
        any={["ROLE_VIEW_PDC_ISSUED_COMPANY"]}
        fallback={<div>You do not have permission to view this PDC.</div>}
      >
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">PDC Issued</h5>
            <p className="text-sm text-gray-500">
              PDC #{item?.transaction_number || ""}
            </p>
          </div>

          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block text-sm">
              <a href="/dashboard">Dashboard {">"}</a>
            </li>
            <li className="breadcrumb-item inline-block text-sm ml-3">
              PDC Issued
            </li>
          </ol>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[20px]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                { item?.status === 'cancelled' ? (
                  <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Cancelled
                  </span>
                ): (
                  <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    {item?.status || "Unknown"}
                  </span>
                )}

                {matured && ['cleared', 'issued'].includes(item?.status) ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Matured
                  </span>
                ) : null}
              </div>
              <div>
                <h4 className="text-black dark:text-white text-2xl font-semibold">
                  {item?.transaction_number || "PDC Issued"}
                </h4>
                <p className="text-sm text-gray-500 max-w-2xl">
                  {item?.narration ||
                    "Post-dated check details, expected to become payable once the cheque date arrives."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
              <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Cheque value
                </div>
                <div className="mt-3 text-2xl font-semibold text-gray-900">
                  {formatCurrency(item?.amount, item?.currency)}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Currency: {item?.currency || "USD"}
                </div>
              </div>
              <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  Maturity
                </div>
                <div className="mt-3 text-2xl font-semibold text-gray-900">
                  {formatDate(item?.cheque_date)}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Received {formatDate(item?.received_date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-md font-medium px-[13px] py-[6px] text-gray-500 border border-gray-200 hover:bg-gray-50"
              >
                <i className="material-symbols-outlined !text-lg mr-1">
                  arrow_back
                </i>
                Back
              </button>
              { !['cleared', 'cancelled', 'bounced'].includes(item?.status) ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center justify-center rounded-md font-medium px-[13px] py-[6px] text-primary-600 border border-primary-200 bg-primary-50/80 hover:bg-primary-100 transition"
                >
                  <i className="material-symbols-outlined !text-lg mr-1">
                    edit
                  </i>{" "}
                  Edit
                </button>
              ) : null}
              {matured && item?.status === "issued" && (
                <button
                  type="button"
                  disabled={posting}
                  onClick={handlePostToAccounts}
                  className="inline-flex items-center justify-center rounded-md px-[13px] py-[6px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post to Accounts"}
                </button>
              )}
              {item?.status !== "cleared" ? (
                <button
                  type="button"
                  onClick={() => setShowStatusUpdateModal(true)}
                  className="inline-flex items-center justify-center rounded-md px-[13px] py-[6px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                >
                  <i className="material-symbols-outlined !text-lg mr-1">
                    update
                  </i>{" "}
                  Update Status
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="trezo-card bg-white p-[20px] rounded-md">
          {loading ? (
            <div>Loading...</div>
          ) : !item ? (
            <div>Not found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 border rounded-md bg-slate-50 dark:bg-[#111827]">
                  <div className="text-sm text-gray-500 font-semibold">
                    Invoice
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {item.invoice ? (
                      <a
                        href={`/company/invoices/${item.invoice.id}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        {item.invoice.invoice_number}
                      </a>
                    ) : (
                      <span>{item.invoice_number || "-"}</span>
                    )}
                  </div>
                  {item.invoice?.job_reference_id && (
                    <div className="text-sm text-gray-500 mt-2">
                      Job Ref: {item.invoice.job_reference_id}
                    </div>
                  )}
                  {item.invoice?.title && (
                    <div className="text-sm text-gray-500 mt-1">
                      {item.invoice.title}
                    </div>
                  )}
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    Total amount:{" "}
                    {formatCurrency(
                      item.invoice?.total_amount ??
                        item.invoice?.subtotal_amount ??
                        null,
                      item.invoice?.currency || item.currency,
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-slate-50 dark:bg-[#111827]">
                  <div className="text-sm text-gray-500 font-semibold">
                    Company
                  </div>
                  <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {item.company
                      ? item.company.name
                      : item.company_name || "-"}
                  </div>
                  {item.company?.contact_person_name && (
                    <div className="text-sm text-gray-500 mt-2">
                      Contact: {item.company.contact_person_name}
                    </div>
                  )}
                  {item.company?.email && (
                    <div className="text-sm text-gray-500 mt-1">
                      Email: {item.company.email}
                    </div>
                  )}
                  {item.company?.phone && (
                    <div className="text-sm text-gray-500">
                      Phone: {item.company.phone}
                    </div>
                  )}
                  {(item.company?.address ||
                    item.company?.city ||
                    item.company?.country) && (
                    <div className="text-sm text-gray-500 mt-1">
                      {[
                        item.company?.address,
                        item.company?.city,
                        item.company?.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-md bg-slate-50 dark:bg-[#111827]">
                  <div className="text-sm text-gray-500 font-semibold">
                    Bank Account
                  </div>
                  <div className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {item.bank_account
                      ? `${item.bank_account.code} — ${item.bank_account.name}`
                      : item.bank || "-"}
                  </div>
                  {item.bank_branch && (
                    <div className="text-sm text-gray-500 mt-2">
                      Branch: {item.bank_branch}
                    </div>
                  )}
                  {item.bank_account?.balance && (
                    <div className="text-sm text-gray-500 mt-1">
                      Balance:{" "}
                      {formatCurrency(
                        item.bank_account.balance,
                        item.bank_account.currency || item.currency,
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-slate-50 dark:bg-[#111827]">
                  <div className="text-sm text-gray-500 font-semibold">
                    PDC Details
                  </div>
                  <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    Cheque No:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.cheque_number || "-"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Cheque Date:{" "}
                    <span className="font-semibold text-primary-600">
                      {formatDate(item.cheque_date)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Amount:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.amount, item.currency)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Status:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.status || "-"}
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-slate-50 dark:bg-[#111827]">
                  <div className="text-sm text-gray-500 font-semibold">
                    Metadata
                  </div>
                  <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    Created At:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Created By:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getUserName(item.created_by_user)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Updated At:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(item.updated_at)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Updated By:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getUserName(item.updated_by_user)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Related Transaction:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.related_transaction_id || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-3">Edit PDC</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cheque Maturity Date
                  </label>
                  <input
                    type="date"
                    value={editChequeDate}
                    onChange={(e) => setEditChequeDate(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!item) return;
                      const amt = Number(editAmount);
                      if (Number.isNaN(amt) || amt <= 0) {
                        addToast("Enter a valid amount", "error");
                        return;
                      }
                      if (editChequeDate) {
                        const today = new Date().toISOString().slice(0, 10);
                        if (editChequeDate < today) {
                          addToast(
                            "Cheque date cannot be in the past.",
                            "error",
                          );
                          return;
                        }
                      }
                      setSavingEdit(true);
                      try {
                        const resp = await fetch(`/api/pdc-issued/${item.id}`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                          },
                          body: JSON.stringify({
                            amount: amt,
                            cheque_date: editChequeDate || null,
                          }),
                        });
                        const data = await resp.json().catch(() => null);
                        if (!resp.ok)
                          throw new Error(data?.message || "Failed to save");
                        addToast("PDC updated", "success");
                        // refresh item
                        setItem(data?.data || data);
                        setEditing(false);
                      } catch (err: any) {
                        addToast(
                          err?.message || "Failed to update PDC",
                          "error",
                        );
                      } finally {
                        setSavingEdit(false);
                      }
                    }}
                    disabled={savingEdit}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded bg-primary-500 text-white border border-primary-200 hover:bg-primary-300 disabled:opacity-60"
                  >
                    <i className="material-symbols-outlined !text-base">save</i>
                    {savingEdit ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    disabled={savingEdit}
                    className="px-3 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showStatusUpdateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Update PDC Status</h3>
                <button
                  type="button"
                  onClick={() => setShowStatusUpdateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="material-symbols-outlined !text-lg">close</i>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    value={statusToUpdate}
                    onChange={handleStatusChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="bounced">Bounced</option>
                    <option value="issued">Issued</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={savingStatus}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded bg-primary-500 text-white border border-primary-200 hover:bg-primary-300 disabled:opacity-60"
                  >
                    <i className="material-symbols-outlined !text-base">save</i>
                    {savingStatus ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStatusUpdateModal(false)}
                    disabled={savingStatus}
                    className="px-3 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </Can>
    </AuthenticatedLayout>
  );
}
