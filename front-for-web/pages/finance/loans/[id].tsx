"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import Can from "../../../components/auth/Can";
import { formatCurrency } from "../../../utils/format";
import { formatApiError } from "../../../utils/errorHandler";

interface ScheduleRow {
  id: number;
  installment_number: number;
  due_date: string;
  expected_principal: number;
  expected_interest: number;
  status: string;
}

interface RepaymentRow {
  id: number;
  payment_date: string;
  amount_paid: number;
  principal_component: number;
  interest_component: number;
  balance_after: number;
  paid_from_account?: { id: number; code: string; name: string } | null;
  payment_reference?: string | null;
  notes?: string | null;
}

interface LoanDetail {
  id: number;
  account_id: number;
  account: { id: number; code: string; name: string; currency: string; balance: number } | null;
  lender_name: string;
  principal: number;
  currency: string;
  interest_type: string;
  interest_rate: number;
  tenure_months: number;
  repayment_frequency: string;
  disbursement_date?: string;
  first_payment_date?: string;
  installment_amount?: number;
  status: string;
  description?: string;
  schedule: ScheduleRow[];
  repayments: RepaymentRow[];
  summary?: {
    loan_balance: number;
    total_repaid: number;
    principal_repaid: number;
    interest_repaid: number;
    accrued_interest: number;
    total_interest?: number;
    total_repayable?: number;
    next_due_date?: string | null;
    next_due_amount?: number | null;
  } | null;
}

interface SourceAccount {
  id: number;
  code: string;
  name: string;
  currency: string;
  balance: number;
}

const statusStyles: Record<string, string> = {
  pending_disbursement: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300",
  active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  closed: "bg-gray-100 text-gray-600 dark:bg-[#111827] dark:text-gray-300",
  restructured: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  pending: "bg-gray-100 text-gray-600 dark:bg-[#111827] dark:text-gray-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  waived: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
};

const LoanDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sourceAccounts, setSourceAccounts] = useState<SourceAccount[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);

  const [repaying, setRepaying] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayAmount, setRepayAmount] = useState("");
  const [repayDate, setRepayDate] = useState("");
  const [repaySourceId, setRepaySourceId] = useState("");
  const [repayReference, setRepayReference] = useState("");
  const [repayNotes, setRepayNotes] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const fetchLoan = useCallback(
    async (signal?: AbortSignal) => {
      if (!id || !accessToken) return;

      setLoading(true);
      try {
        const resp = await fetch(`/api/loans/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load loan", "error");
          setLoan(null);
          return;
        }
        setLoan(data?.data ?? null);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch loan error", err);
        addToast("Error loading loan. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [id, accessToken, addToast],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchLoan(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken]);

  // Source accounts for repayment: internal, with balance, excluding the loan account.
  useEffect(() => {
    if (!showRepayModal || !accessToken || !loan) return;

    const controller = new AbortController();
    const fetchSources = async () => {
      setLoadingSources(true);
      try {
        const resp = await fetch("/api/accounts/list?page=1&per_page=100", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load source accounts", "error");
          setSourceAccounts([]);
          return;
        }

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const mapped: SourceAccount[] = (items || []).map((acc: any) => ({
          id: Number(acc.id),
          code: String(acc.code ?? ""),
          name: String(acc.name ?? ""),
          currency: String(acc.currency ?? ""),
          balance: Number(acc.balance ?? 0),
        }));

        setSourceAccounts(
          mapped.filter((a) => a.id !== loan.account_id && a.currency === (loan.currency || a.currency) && a.balance > 0),
        );
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch source accounts error", err);
        setSourceAccounts([]);
      } finally {
        setLoadingSources(false);
      }
    };

    fetchSources();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRepayModal, accessToken]);

  const handleRepay = async () => {
    if (!id || !accessToken || !loan) return;

    if (!repaySourceId) {
      addToast("Please select the account the repayment is paid from.", "error");
      return;
    }

    const amount = Number(repayAmount || 0);
    if (!repayAmount || Number.isNaN(amount) || amount <= 0) {
      addToast("Please enter a valid repayment amount.", "error");
      return;
    }

    const outstanding = Number(loan.summary?.loan_balance ?? 0);
    if (amount > outstanding + 0.001) {
      addToast(`Repayment cannot exceed the outstanding balance of ${outstanding.toLocaleString()}.`, "error");
      return;
    }

    setRepaying(true);
    try {
      const resp = await fetch(`/api/loans/${id}/repay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount,
          paid_from_account_id: Number(repaySourceId),
          payment_date: repayDate || new Date().toISOString().slice(0, 10),
          payment_reference: repayReference.trim() || undefined,
          notes: repayNotes.trim() || undefined,
        }),
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        addToast(formatApiError(data), "error");
        return;
      }

      addToast("Repayment recorded.", "success");
      setShowRepayModal(false);
      setRepayAmount("");
      setRepaySourceId("");
      setRepayReference("");
      setRepayNotes("");
      fetchLoan();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("repay loan error", err);
      addToast("Failed to record repayment.", "error");
    } finally {
      setRepaying(false);
    }
  };

  const currency = loan?.currency || loan?.account?.currency || "KES";

  const handleExportCsv = () => {
    if (!loan) return;

    const scheduleRows = (loan.schedule || []).map((row) => [
      "SCHEDULE",
      String(row.installment_number),
      row.due_date,
      String(row.expected_principal ?? 0),
      String(row.expected_interest ?? 0),
      "",
      String(Number(row.expected_principal ?? 0) + Number(row.expected_interest ?? 0)),
      row.status,
    ]);

    const repaymentRows = (loan.repayments || []).map((row) => [
      "REPAYMENT",
      row.payment_date,
      row.paid_from_account ? `${row.paid_from_account.name} (${row.paid_from_account.code})` : "",
      String(row.amount_paid ?? 0),
      String(row.principal_component ?? 0),
      String(row.interest_component ?? 0),
      String(row.balance_after ?? 0),
      row.payment_reference || "",
    ]);

    const summaryRows = [
      ["LOAN STATEMENT", loan.lender_name, "", "", "", "", "", ""],
      ["Loan account", loan.account ? `${loan.account.name} (${loan.account.code})` : "", "", "", "", "", "", ""],
      ["Currency", currency, "", "", "", "", "", ""],
      ["Status", loan.status, "", "", "", "", "", ""],
      ["Principal", String(loan.principal ?? 0), "", "", "", "", "", ""],
      ["Outstanding", String(loan.summary?.loan_balance ?? 0), "", "", "", "", "", ""],
      ["Total repaid", String(loan.summary?.total_repaid ?? 0), "", "", "", "", "", ""],
      ["Interest paid", String(loan.summary?.interest_repaid ?? 0), "", "", "", "", "", ""],
      [
        "Next due",
        loan.summary?.next_due_date
          ? `${loan.summary.next_due_date} (${loan.summary.next_due_amount ?? 0})`
          : "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "", "", "", "", "", ""],
      ["Type", "No/Number", "Date/Party", "Amount", "Principal", "Interest", "Total/Balance", "Status/Ref"],
    ];

    const csv = [...summaryRows, ...scheduleRows, ...repaymentRows]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `loan-${loan.id}-${loan.lender_name.replace(/[^a-z0-9]+/gi, "-")}-statement.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!id || !accessToken) {
      addToast("You must be logged in to download.", "error");
      return;
    }

    setDownloadingPdf(true);
    try {
      const resp = await fetch(`/api/loans/${id}/statement-pdf`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!resp.ok) {
        let message = "Failed to download loan statement PDF";
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
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `loan-${loan?.id ?? id}-statement.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("loan statement pdf download error", err);
      addToast("Error downloading loan statement PDF.", "error");
    } finally {
      setDownloadingPdf(false);
    }
  };
  const canRepay = loan?.status === "active";

  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_ACCOUNT"]} fallback={<div>You do not have permission to view loans.</div>}>
        <div className="space-y-[12px] md:space-y-[16px]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.push("/finance/loans")}
              className="inline-flex items-center px-[10px] py-[6px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
            >
              <i className="material-symbols-outlined text-[16px] mr-[4px]">arrow_back</i>
              Back to loans
            </button>
          </div>

          {loading && <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] text-sm text-gray-500">Loading loan...</div>}

          {!loading && !loan && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] text-sm text-gray-500">
              Loan not found.
            </div>
          )}

          {!loading && loan && (
            <>
              <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] space-y-[15px]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[15px]">
                  <div className="space-y-[6px]">
                    <h1 className="text-base md:text-lg font-semibold text-black dark:text-white">
                      {loan.lender_name}
                      {loan.account && (
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {" "}
                          — {loan.account.name} ({loan.account.code})
                        </span>
                      )}
                    </h1>
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                      <span
                        className={`inline-flex items-center px-2 py-[3px] rounded-full font-medium ${
                          statusStyles[loan.status] || statusStyles.closed
                        }`}
                      >
                        {loan.status.replace("_", " ")}
                      </span>
                      <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-gray-100 dark:bg-[#111827]">
                        {loan.interest_type === "none"
                          ? "No interest"
                          : `${loan.interest_type === "flat" ? "Flat" : "Reducing"} @ ${Number(loan.interest_rate ?? 0)}% p.a.`}
                      </span>
                      <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-gray-100 dark:bg-[#111827]">
                        {loan.tenure_months} installments · {loan.repayment_frequency}
                      </span>
                      <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                        Currency: {currency}
                      </span>
                    </div>
                    {loan.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl">{loan.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-[10px]">
                    {canRepay && (
                      <Can any={["ROLE_EDIT_ACCOUNT"]}>
                        <button
                          type="button"
                          onClick={() => {
                            setRepayDate(new Date().toISOString().slice(0, 10));
                            setShowRepayModal(true);
                          }}
                          disabled={repaying}
                          className="inline-flex items-center px-[12px] py-[7px] rounded-md bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="material-symbols-outlined text-[16px] mr-[4px]">savings</i>
                          Receive Repayment
                        </button>
                      </Can>
                    )}
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="px-[12px] py-[7px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                    >
                      Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      className="px-[12px] py-[7px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingPdf ? "Preparing..." : "Download PDF"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-[12px]">
                  {[
                    { label: "Principal", value: formatCurrency(Number(loan.principal ?? 0), currency), tone: "" },
                    {
                      label: "Outstanding",
                      value: formatCurrency(Number(loan.summary?.loan_balance ?? 0), currency),
                      tone: "text-primary-500",
                    },
                    { label: "Repaid", value: formatCurrency(Number(loan.summary?.total_repaid ?? 0), currency), tone: "" },
                    {
                      label: "Interest Paid",
                      value: formatCurrency(Number(loan.summary?.interest_repaid ?? 0), currency),
                      tone: "",
                    },
                    {
                      label: "Interest Due (fallen due)",
                      value: formatCurrency(Number(loan.summary?.accrued_interest ?? 0), currency),
                      tone: "text-orange-500",
                    },
                    {
                      label: "Next Due",
                      value: loan.summary?.next_due_date
                        ? `${new Date(loan.summary.next_due_date).toLocaleDateString()} · ${formatCurrency(
                            Number(loan.summary.next_due_amount ?? 0),
                            currency,
                          )}`
                        : "-",
                      tone: "",
                    },
                    {
                      label: "Total Interest (whole loan)",
                      value: formatCurrency(Number(loan.summary?.total_interest ?? 0), currency),
                      tone: "",
                    },
                    {
                      label: "Total Repayable",
                      value: formatCurrency(Number(loan.summary?.total_repayable ?? 0), currency),
                      tone: "font-bold",
                    },
                    {
                      label: "Per Installment",
                      value: formatCurrency(Number(loan.installment_amount ?? 0), currency),
                      tone: "",
                    },
                  ].map((card) => (
                    <div key={card.label} className="inline-flex flex-col px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328]">
                      <div className="text-xs text-gray-500">{card.label}</div>
                      <div className={`text-sm font-semibold text-black dark:text-white ${card.tone}`}>{card.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[16px] md:p-[20px]">
                <h3 className="text-sm font-semibold text-black dark:text-white mb-[10px]">Repayment Schedule</h3>
                <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                  <table className="min-w-[560px] w-full">
                    <thead className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#15203c]">
                      <tr>
                        <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">#</th>
                        <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Due Date</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Principal</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Interest</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Total</th>
                        <th className="px-[10px] py-[8px] ltr:text-center rtl:text-center whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-900 dark:text-gray-100">
                      {loan.schedule?.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-[10px] py-[12px] text-center text-sm text-gray-500">
                            Schedule is generated when the loan is created.
                          </td>
                        </tr>
                      )}
                      {loan.schedule?.map((row) => (
                        <tr key={row.id} className="border-t border-gray-100 dark:border-[#172036]">
                          <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">{row.installment_number}</td>
                          <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">
                            {new Date(row.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                            {formatCurrency(Number(row.expected_principal ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                            {formatCurrency(Number(row.expected_interest ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                            {formatCurrency(Number(row.expected_principal ?? 0) + Number(row.expected_interest ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium ${
                                statusStyles[row.status] || statusStyles.pending
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[16px] md:p-[20px]">
                <h3 className="text-sm font-semibold text-black dark:text-white mb-[10px]">Repayments</h3>
                <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                  <table className="min-w-[640px] w-full">
                    <thead className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#15203c]">
                      <tr>
                        <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Date</th>
                        <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Paid From</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Amount</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Principal</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Interest</th>
                        <th className="px-[10px] py-[8px] ltr:text-right rtl:text-left whitespace-nowrap">Balance After</th>
                        <th className="px-[10px] py-[8px] ltr:text-left rtl:text-right whitespace-nowrap">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-900 dark:text-gray-100">
                      {loan.repayments?.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-[10px] py-[12px] text-center text-sm text-gray-500">
                            No repayments recorded yet.
                          </td>
                        </tr>
                      )}
                      {loan.repayments?.map((row) => (
                        <tr key={row.id} className="border-t border-gray-100 dark:border-[#172036]">
                          <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">
                            {new Date(row.payment_date).toLocaleDateString()}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">
                            {row.paid_from_account ? `${row.paid_from_account.name} (${row.paid_from_account.code})` : "-"}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                            {formatCurrency(Number(row.amount_paid ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                            {formatCurrency(Number(row.principal_component ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap">
                            {formatCurrency(Number(row.interest_component ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs text-right whitespace-nowrap font-medium">
                            {formatCurrency(Number(row.balance_after ?? 0), currency)}
                          </td>
                          <td className="px-[10px] py-[6px] text-xs whitespace-nowrap">{row.payment_reference || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {showRepayModal && loan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-[20px] md:p-[24px]">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">Receive Loan Repayment</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-[16px]">
                Interest that has fallen due is collected first; the remainder reduces the principal. Both legs are
                recorded in the transactions ledger.
              </p>

              <div className="space-y-[12px] mb-[18px]">
                <div className="inline-flex flex-col px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328] w-full">
                  <div className="text-xs text-gray-500">Outstanding loan balance</div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {formatCurrency(Number(loan.summary?.loan_balance ?? 0), currency)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Repayment amount ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Paid from account</label>
                  <select
                    value={repaySourceId}
                    onChange={(e) => setRepaySourceId(e.target.value)}
                    disabled={loadingSources}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select source account</option>
                    {sourceAccounts.map((src) => (
                      <option key={src.id} value={src.id}>
                        {src.name} ({src.code}) — {src.currency}{" "}
                        {Number(src.balance).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                  <div>
                    <label className="block text-xs font-medium mb-[5px]">Payment date</label>
                    <input
                      type="date"
                      value={repayDate}
                      onChange={(e) => setRepayDate(e.target.value)}
                      className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-[5px]">Reference (optional)</label>
                    <input
                      type="text"
                      value={repayReference}
                      onChange={(e) => setRepayReference(e.target.value)}
                      className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Notes (optional)</label>
                  <textarea
                    rows={2}
                    value={repayNotes}
                    onChange={(e) => setRepayNotes(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-[10px]">
                <button
                  type="button"
                  onClick={() => setShowRepayModal(false)}
                  disabled={repaying}
                  className="px-[12px] py-[7px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRepay}
                  disabled={repaying}
                  className="px-[12px] py-[7px] rounded-md bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {repaying ? "Recording..." : "Record Repayment"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </Can>
    </AuthenticatedLayout>
  );
};

export default LoanDetailPage;