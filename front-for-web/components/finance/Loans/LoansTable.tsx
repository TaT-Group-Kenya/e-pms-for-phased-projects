import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import Can from "../../auth/Can";
import { formatCurrency } from "../../../utils/format";
import { formatApiError } from "../../../utils/errorHandler";

interface LoanRow {
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
  status: string;
  installment_amount?: number;
  summary?: {
    loan_balance: number;
    total_repaid: number;
    interest_repaid: number;
    accrued_interest: number;
    next_due_date?: string | null;
    next_due_amount?: number | null;
  } | null;
}

interface AccountOption {
  id: number;
  code: string;
  name: string;
  currency: string;
}

const statusStyles: Record<string, string> = {
  pending_disbursement: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300",
  active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  closed: "bg-gray-100 text-gray-600 dark:bg-[#111827] dark:text-gray-300",
  restructured: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
};

const LoansTable: React.FC = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [loans, setLoans] = useState<LoanRow[]>([]);
  const [loanAccounts, setLoanAccounts] = useState<AccountOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formAccountId, setFormAccountId] = useState("");
  const [formLender, setFormLender] = useState("");
  const [formPrincipal, setFormPrincipal] = useState("");
  const [formInterestType, setFormInterestType] = useState<"none" | "flat" | "reducing">("none");
  const [formInterestRate, setFormInterestRate] = useState("");
  const [formTenure, setFormTenure] = useState("12");
  const [formFrequency, setFormFrequency] = useState<"monthly" | "quarterly" | "weekly">("monthly");
  const [formDisbursementDate, setFormDisbursementDate] = useState("");
  const [formFirstPaymentDate, setFormFirstPaymentDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchLoans = async () => {
      if (!accessToken) {
        setLoans([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const resp = await fetch("/api/loans?page=1&per_page=100", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) {
          addToast(data?.message || "Failed to load loans", "error");
          setLoans([]);
          return;
        }

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setLoans(items as LoanRow[]);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch loans error", err);
        addToast("Error loading loans. Please try again.", "error");
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();

    return () => controller.abort();
  }, [accessToken, addToast, reloadKey]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLoanAccounts = async () => {
      if (!accessToken) return;

      try {
        const resp = await fetch("/api/accounts/list?page=1&per_page=100", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) return;

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const options: AccountOption[] = (items || [])
          .filter((acc: any) => String(acc.group) === "Loans")
          .map((acc: any) => ({
            id: Number(acc.id),
            code: String(acc.code ?? ""),
            name: String(acc.name ?? ""),
            currency: String(acc.currency ?? ""),
          }));

        setLoanAccounts(options);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch loan accounts error", err);
      }
    };

    fetchLoanAccounts();

    return () => controller.abort();
  }, [accessToken, showCreateModal]);

  const totals = useMemo(
    () =>
      loans.reduce(
        (acc, loan) => {
          acc.principal += Number(loan.principal ?? 0);
          acc.outstanding += Number(loan.summary?.loan_balance ?? 0);
          acc.repaid += Number(loan.summary?.total_repaid ?? 0);
          if (loan.status === "active") acc.active += 1;
          return acc;
        },
        { principal: 0, outstanding: 0, repaid: 0, active: 0 },
      ),
    [loans],
  );

  const resetForm = () => {
    setFormAccountId("");
    setFormLender("");
    setFormPrincipal("");
    setFormInterestType("none");
    setFormInterestRate("");
    setFormTenure("12");
    setFormFrequency("monthly");
    setFormDisbursementDate(new Date().toISOString().slice(0, 10));
    setFormFirstPaymentDate("");
    setFormDescription("");
  };

  const handleCreate = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error");
      return;
    }
    if (!formAccountId) {
      addToast("Please select a loan account.", "error");
      return;
    }
    if (!formLender.trim()) {
      addToast("Lender name is required.", "error");
      return;
    }
    if (!formPrincipal || Number(formPrincipal) <= 0) {
      addToast("Please enter a valid principal amount.", "error");
      return;
    }

    setSaving(true);
    try {
      const selected = loanAccounts.find((a) => String(a.id) === formAccountId);
      const payload = {
        account_id: Number(formAccountId),
        lender_name: formLender.trim(),
        principal: Number(formPrincipal),
        currency: selected?.currency || "KES",
        interest_type: formInterestType,
        interest_rate: formInterestType === "none" ? 0 : Number(formInterestRate || 0),
        tenure_months: Number(formTenure),
        repayment_frequency: formFrequency,
        disbursement_date: formDisbursementDate || new Date().toISOString().slice(0, 10),
        first_payment_date: formFirstPaymentDate || undefined,
        description: formDescription.trim() || undefined,
      };

      const resp = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data: any = await resp.json().catch(() => null);
      if (!resp.ok) {
        addToast(formatApiError(data), "error");
        return;
      }

      addToast("Loan created and the account funded. The repayment schedule is ready.", "success");
      setShowCreateModal(false);
      resetForm();
      setReloadKey((k) => k + 1);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("create loan error", err);
      addToast("Failed to create loan.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] p-5 rounded-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px]">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Principal</div>
            <div className="text-lg font-semibold text-black dark:text-white">
              {formatCurrency(totals.principal, loans[0]?.currency || "KES")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Outstanding</div>
            <div className="text-lg font-semibold text-primary-500">
              {formatCurrency(totals.outstanding, loans[0]?.currency || "KES")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Repaid</div>
            <div className="text-lg font-semibold text-black dark:text-white">
              {formatCurrency(totals.repaid, loans[0]?.currency || "KES")}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active Loans</div>
            <div className="text-lg font-semibold text-black dark:text-white">{totals.active}</div>
          </div>
        </div>
      </div>

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Loans live on accounts in the Loans group. Creating a loan funds the account and books the schedule.
        </p>
        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <Can any={["ROLE_ADD_ACCOUNT"]}>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
            >
              Add Loan
            </button>
          </Can>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Lender</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Loan Account</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Principal</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Outstanding</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Repaid</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Terms</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Next Due</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Status</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td colSpan={9} className="text-center text-sm px-[10px] py-[8px] text-gray-500 dark:text-gray-400">
                    Loading loans...
                  </td>
                </tr>
              )}

              {!loading && loans.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-sm px-[10px] py-[16px] text-gray-500 dark:text-gray-400">
                    No loans found. Add a loan on a Loans-group account to get started.
                  </td>
                </tr>
              )}

              {!loading &&
                loans.map((loan) => {
                  const currency = loan.currency || loan.account?.currency || "";
                  return (
                    <tr
                      key={loan.id}
                      className="border-b border-gray-100 dark:border-[#172036] align-middle hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                    >
                      <td className="text-sm px-[10px] py-[6px] font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {loan.lender_name}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                        {loan.account ? `${loan.account.name} (${loan.account.code})` : "-"}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                        {formatCurrency(Number(loan.principal ?? 0), currency)}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap font-medium">
                        {formatCurrency(Number(loan.summary?.loan_balance ?? 0), currency)}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                        {formatCurrency(Number(loan.summary?.total_repaid ?? 0), currency)}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                        {loan.interest_type === "none"
                          ? "No interest"
                          : `${loan.interest_type === "flat" ? "Flat" : "Reducing"} ${Number(loan.interest_rate ?? 0)}%`}
                        {" · "}
                        {loan.tenure_months} × {loan.repayment_frequency.replace("ly", "")}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                        {loan.summary?.next_due_date
                          ? `${new Date(loan.summary.next_due_date).toLocaleDateString()} · ${formatCurrency(
                              Number(loan.summary.next_due_amount ?? 0),
                              currency,
                            )}`
                          : "-"}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium ${
                            statusStyles[loan.status] || statusStyles.closed
                          }`}
                        >
                          {loan.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="text-sm px-[10px] py-[6px] text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => router.push(`/finance/loans/${loan.id}`)}
                          className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827]"
                        >
                          View Loan
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">Add Loan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[16px]">
              The loan account is funded immediately: a ledger top-up entry is recorded and both the
              account cash balance and loan balance are updated at once.
            </p>

            <div className="space-y-[12px] mb-[18px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Loan Account (Loans group)</label>
                <select
                  value={formAccountId}
                  onChange={(e) => setFormAccountId(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select loan account</option>
                  {loanAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code}) — {a.currency}
                    </option>
                  ))}
                </select>
                {loanAccounts.length === 0 && (
                  <p className="mt-[4px] text-[11px] text-yellow-600 dark:text-yellow-400">
                    No accounts in the Loans group yet. Create one on the Accounts page first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Lender</label>
                <input
                  type="text"
                  value={formLender}
                  onChange={(e) => setFormLender(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-xs font-medium mb-[5px]">Principal</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPrincipal}
                    onChange={(e) => setFormPrincipal(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Interest Type</label>
                  <select
                    value={formInterestType}
                    onChange={(e) => setFormInterestType(e.target.value as any)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="none">No interest</option>
                    <option value="flat">Flat</option>
                    <option value="reducing">Reducing balance</option>
                  </select>
                </div>

                {formInterestType !== "none" && (
                  <div>
                    <label className="block text-xs font-medium mb-[5px]">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formInterestRate}
                      onChange={(e) => setFormInterestRate(e.target.value)}
                      className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Tenure (installments)</label>
                  <input
                    type="number"
                    min="1"
                    value={formTenure}
                    onChange={(e) => setFormTenure(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as any)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">Disbursement Date</label>
                  <input
                    type="date"
                    value={formDisbursementDate}
                    onChange={(e) => setFormDisbursementDate(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-[5px]">First Payment Date (optional)</label>
                  <input
                    type="date"
                    value={formFirstPaymentDate}
                    onChange={(e) => setFormFirstPaymentDate(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={saving}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Create Loan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default LoansTable;