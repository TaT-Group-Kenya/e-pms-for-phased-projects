import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAccessToken } from "../../../store/auth/selectors";

const TABS = [
  { label: "Overview", key: "overview", icon: "dashboard" },
  { label: "Payment", key: "payment", icon: "payment" },
];

interface OfficeExpenseDetailTabsProps {
  expenseId: string | number;
}

const OfficeExpenseDetailTabs = ({ expenseId }: OfficeExpenseDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showSettle, setShowSettle] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useSelector(selectAccessToken);

  // Fetch expense by id
  useEffect(() => {
    if (!expenseId) {
      setError("No expense ID provided");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/finance/office-expenses/${expenseId}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Failed to fetch expense");
        setExpense(data.data || data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, expenseId]);

  // Fetch accounts for funding account dropdown
  useEffect(() => {
    if (!showSettle) return;
    setAccountsLoading(true);
    setAccountsError(null);
    fetch("/api/accounts/list?per_page=1000", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        setAccounts(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
      })
      .catch(() => setAccountsError("Failed to load accounts"))
      .finally(() => setAccountsLoading(false));
  }, [showSettle, accessToken]);

  // Overview Tab
  const OverviewTab = () => (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <h6 className="text-black dark:text-white font-semibold mb-[15px]">Basic Information</h6>
      {expense && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">ID</span>
            <span className="text-black dark:text-white font-semibold">{expense.id}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                expense.status === 'paid'
                  ? 'bg-green-600'
                  : expense.status === 'pending'
                  ? 'bg-red-600'
                  : 'bg-gray-700'
              }`}
            >
              {expense.status}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Category</span>
            {expense.category?.name || expense.category ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-600 text-white">
                {expense.category?.name || expense.category}
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Cost Center</span>
            {expense.costCenter?.name || expense.costCenter ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-white">
                {expense.costCenter?.name || expense.costCenter}
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Currency</span>
            <span className="text-black dark:text-white font-semibold">{expense.currency}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Amount</span>
            <span className="text-black dark:text-white font-semibold">{expense.amount}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Date</span>
            <span className="text-black dark:text-white font-semibold">{expense.date ? new Date(expense.date).toLocaleDateString() : '-'}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Description</span>
            <span className="text-black dark:text-white text-sm truncate max-w-[220px] md:max-w-[260px]">{expense.description || 'No description provided.'}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Created By</span>
            <span className="text-black dark:text-white font-semibold">{expense.created_by || '-'}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Updated By</span>
            <span className="text-black dark:text-white font-semibold">{expense.updated_by || '-'}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Created At</span>
            <span className="text-black dark:text-white font-semibold">{expense.created_at ? new Date(expense.created_at).toLocaleString() : '-'}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Updated At</span>
            <span className="text-black dark:text-white font-semibold">{expense.updated_at ? new Date(expense.updated_at).toLocaleString() : '-'}</span>
          </div>
        </div>
      )}
    </div>
  );

  // Payment Tab
  const PaymentTab = () => (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="flex items-center justify-between mb-[15px]">
        <h6 className="text-black dark:text-white font-semibold">Payment</h6>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
          onClick={() => setShowSettle(true)}
        >
          <i className="material-symbols-outlined !text-[18px]">add</i>
          Settle Expense
        </button>
      </div>
      {expense && Array.isArray(expense.payments) && expense.payments.length > 0 ? (
        <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md mb-[10px]">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">Date</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[12px]">Amount</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[12px]">Currency</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[12px]">Method</th>
                <th className="text-xs font-semibold text-right px-[15px] py-[12px]">Reference</th>
              </tr>
            </thead>
            <tbody>
              {expense.payments.map((p: any) => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-[#172036] align-middle">
                  <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">{p.payment_date || p.paid_at}</td>
                  <td className="text-sm text-right px-[15px] py-[12px]">{p.amount_paid || p.amount}</td>
                  <td className="text-sm text-right px-[15px] py-[12px]">{p.currency}</td>
                  <td className="text-sm text-right px-[15px] py-[12px]">{p.payment_method || p.method}</td>
                  <td className="text-sm text-right px-[15px] py-[12px]">{p.transaction_number || p.reference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xs text-gray-500">No payment found for this expense.</p>
      )}
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading expense details...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!expense) {
    return <div className="p-8 text-center text-gray-500">No expense found.</div>;
  }

  // Refetch expense after settle
  const refetchExpense = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/finance/office-expenses/${expenseId}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Failed to fetch expense");
        setExpense(data.data || data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Tabs Navigation */}
        <div className="trezo-tabs mb-[20px] md:mb-[25px]">
          <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto flex">
            {TABS.map((tab) => (
              <li key={tab.key} className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">{tab.icon}</i>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Tab Content */}
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "payment" && <PaymentTab />}
      </div>

      {/* Settle Modal */}
      {showSettle && (
        <SettleExpenseModal
          expense={expense}
          accounts={accounts}
          loading={accountsLoading}
          error={accountsError}
          onClose={() => setShowSettle(false)}
          refetchExpense={refetchExpense}
        />
      )}
    </div>
  );
};

function SettleExpenseModal({ expense, accounts, loading, error, onClose, refetchExpense }: { expense: any; accounts: any[]; loading: boolean; error: string | null; onClose: () => void; refetchExpense: () => void }) {
  const [fundingAccount, setFundingAccount] = useState("");
  const [narration, setNarration] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const accessToken = useSelector(selectAccessToken);

  // Filter accounts to only those with same currency as expense
  const filteredAccounts = Array.isArray(accounts)
    ? accounts.filter((acc) => acc.currency === expense.currency)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const resp = await fetch(`/api/finance/office-expenses/${expense.id}/settle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          amount: expense.amount,
          currency: expense.currency,
          date,
          funding_account: fundingAccount,
          narration,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Failed to settle expense");
      onClose();
      refetchExpense(); // Refresh current page data
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-[20px]">
                  <div className="mb-[15px] flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-[#15203c] text-gray-700 dark:text-white font-medium border border-gray-200 dark:border-[#172036] hover:bg-gray-200 dark:hover:bg-[#1a2948] transition"
                      onClick={() => {
                        // Use Next.js router to go back to expenses list
                        const router = useRouter();
                        router.push('/finance/office-expenses');
                      }}
                    >
                      <i className="material-symbols-outlined !text-[18px]">arrow_back</i>
                      Back to expenses
                    </button>
                  </div>
          <h6 className="font-semibold text-black dark:text-white">Settle Expense</h6>
        </div>
        <form onSubmit={handleSubmit} className="space-y-[16px]">
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Amount</label>
            <input
              type="text"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              value={expense.amount}
              readOnly
            />
          </div>
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Currency</label>
            <input
              type="text"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              value={expense.currency}
              readOnly
            />
          </div>
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Funding Account</label>
            <select
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              value={fundingAccount}
              onChange={e => setFundingAccount(e.target.value)}
              required
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? "Loading accounts..." : `Select account (${expense.currency})`}
              </option>
              {filteredAccounts.length === 0 && !loading && (
                <option value="" disabled>No accounts found for this currency</option>
              )}
              {filteredAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.code} {acc.name} - ({acc.currency} {acc.balance})
                </option>
              ))}
            </select>
            {error && <div className="text-red-500 mt-1 text-xs">{error}</div>}
          </div>
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Date</label>
            <input
              type="date"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">Narration (optional)</label>
            <input
              type="text"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              value={narration}
              onChange={e => setNarration(e.target.value)}
            />
          </div>
          {formError && <div className="text-red-500 mb-2">{formError}</div>}
          <div className="flex items-center justify-end gap-[10px] mt-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Settle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OfficeExpenseDetailTabs;
