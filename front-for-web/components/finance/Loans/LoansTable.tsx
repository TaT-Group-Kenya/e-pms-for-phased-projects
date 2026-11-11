import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { useFilterOptions } from "../../../hooks/useFilterOptions";
import { ToastContainer } from "../../common/Toast";
import PaginationFooter from "../../common/PaginationFooter";
import FilterSelect from "../../common/FilterSelect";
import Can from "../../auth/Can";
import { formatCurrency } from "../../../utils/format";
import { formatApiError } from "../../../utils/errorHandler";

interface CurrencyOption {
  id: number;
  code: string;
  name: string;
  current_forex_rate?: number;
}

interface LoanRow {
  id: number;
  destination_account_id: number;
  destination_account: { id: number; code: string; name: string; currency: string; balance: number } | null;
  lender_name: string;
  lender_id?: number | null;
  lender?: { id: number; name: string; email?: string | null; phone?: string | null; kra_pin?: string | null; address?: string | null } | null;
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
  group: string;
  chartCode: string;
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

  // Server-side listing: pagination, debounced search and status filter live
  // in useListQuery; the create-loan modal keeps its own state below.
  const {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    clearFilters,
    page,
    setPage,
    perPage,
    changePerPage,
    rows: loans,
    loading,
    error,
    meta,
    refresh,
  } = useListQuery<LoanRow>("/api/loans", {
    accessToken,
    initialFilters: { status: "all" },
    onError: (message) => addToast(message, "error"),
  });

  const statusFilter = filters.status || "all";
  const hasExtraFilters = searchInput || statusFilter !== "all";
  const [destinationAccounts, setDestinationAccounts] = useState<AccountOption[]>([]);
  const [lenders, setLenders] = useState<{ id: number; name: string }[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formCurrency, setFormCurrency] = useState("");
  const [formForexRate, setFormForexRate] = useState("129.75");
  const [formDestinationAccountId, setFormDestinationAccountId] = useState("");
  const [formLender, setFormLender] = useState("");
  const [formLenderId, setFormLenderId] = useState("");
  const [formPrincipal, setFormPrincipal] = useState("");
  const [formInterestType, setFormInterestType] = useState<"none" | "flat" | "reducing">("none");
  const [formInterestRate, setFormInterestRate] = useState("");
  const [formTenure, setFormTenure] = useState("12");
  const [formFrequency, setFormFrequency] = useState<"monthly" | "quarterly" | "weekly">("monthly");
  const [formDisbursementDate, setFormDisbursementDate] = useState("");
  const [formFirstPaymentDate, setFormFirstPaymentDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Options for the loan-account select in the create modal
  const [loanAccounts, setLoanAccounts] = useState<AccountOption[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDestinationAccounts = async () => {
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
        const options: AccountOption[] = (items || []).map((acc: any) => ({
          id: Number(acc.id),
          code: String(acc.code ?? ""),
          name: String(acc.name ?? ""),
          currency: String(acc.currency ?? ""),
          group: String(acc.group ?? ""),
          chartCode: String(acc.chart_of_account?.code ?? ""),
        }));

        setDestinationAccounts(
          options.filter((acc) => acc.chartCode === "1000" && acc.currency),
        );
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch accounts error", err);
      }
    };

    fetchDestinationAccounts();

    // Lender options for the loan form dropdown.
    const lendersUrl = "/api/lenders?per_page=100";
    fetch(lendersUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    })
      .then((r) => r.json().catch(() => null))
      .then((data: any) => {
        if (!data) return;
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setLenders(
          (items || []).map((l: any) => ({ id: Number(l.id), name: String(l.name ?? "") })),
        );
      })
      .catch(() => {});

    return () => controller.abort();
  }, [accessToken, showCreateModal]);

  // Currency options for the loan form.
  useEffect(() => {
    const controller = new AbortController();

    const fetchCurrencies = async () => {
      if (!accessToken) {
        setCurrencies([]);
        return;
      }

      try {
        const resp = await fetch("/api/currencies/list", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });

        const data: any = await resp.json().catch(() => null);
        if (!resp.ok) return;

        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setCurrencies(
          (items || []).map((c: any) => ({
            id: Number(c.id),
            code: String(c.code ?? ""),
            name: String(c.name ?? ""),
            current_forex_rate: Number(c.current_forex_rate ?? 0),
          })),
        );
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch currencies error", err);
      }
    };

    fetchCurrencies();

    return () => controller.abort();
  }, [accessToken]);

  // Summaries are grouped per currency — mixing currencies in one total
  // would be meaningless.
  const totalsByCurrency = useMemo(() => {
    const grouped: Record<string, { principal: number; outstanding: number; repaid: number; active: number }> = {};

    for (const loan of loans) {
      const currency = loan.currency || "";
      if (!grouped[currency]) {
        grouped[currency] = { principal: 0, outstanding: 0, repaid: 0, active: 0 };
      }
      grouped[currency].principal += Number(loan.principal ?? 0);
      grouped[currency].outstanding += Number(loan.summary?.loan_balance ?? 0);
      grouped[currency].repaid += Number(loan.summary?.total_repaid ?? 0);
      if (loan.status === "active") grouped[currency].active += 1;
    }

    // Deterministic order; loans without a currency group last.
    const entries = Object.entries(grouped);
    entries.sort(([a], [b]) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b)));

    return entries;
  }, [loans]);

  // The loaned money is disbursed onto the destination account. Its currency
  // is chosen first; only matching asset accounts can be picked.
  const eligibleDestinationAccounts = destinationAccounts.filter(
    (d) => !formCurrency || d.currency === formCurrency,
  );

  const resetForm = () => {
    setFormCurrency("");
    setFormForexRate("129.75");
    setFormDestinationAccountId("");
    setFormLender("");
    setFormLenderId("");
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
    if (!formCurrency) {
      addToast("Please select a currency.", "error");
      return;
    }
    if (formCurrency !== "KES") {
      const rate = Number(formForexRate);
      if (!rate || rate <= 0) {
        addToast("Please enter a valid USD to KES forex rate.", "error");
        return;
      }
    }
    if (!formDestinationAccountId) {
      addToast("Please select a destination account.", "error");
      return;
    }
    if (!formLenderId) {
      addToast("Please select a lender.", "error");
      return;
    }
    if (!formPrincipal || Number(formPrincipal) <= 0) {
      addToast("Please enter a valid principal amount.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        destination_account_id: Number(formDestinationAccountId),
        lender_id: Number(formLenderId),
        principal: Number(formPrincipal),
        currency: formCurrency,
        ...(formCurrency !== "KES" ? { forex_rate: Number(formForexRate) } : {}),
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
      refresh();
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
        {totalsByCurrency.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px]">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Principal</div>
              <div className="text-lg font-semibold text-black dark:text-white">
                {formatCurrency(0, "KES")}
              </div>
            </div>
          </div>
        )}

        {totalsByCurrency.map(([currency, totals]) => (
          <div
            key={currency || "unknown"}
            className={
              totalsByCurrency.length > 1
                ? "mb-[20px] pb-[15px] border-b border-gray-100 dark:border-[#172036] last:mb-0 last:pb-0 last:border-0"
                : ""
            }
          >
            <div className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-[8px]">
              {currency || "Unspecified"} currency
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px]">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Principal{currency ? ` (${currency})` : ""}
                </div>
                <div className="text-lg font-semibold text-black dark:text-white">
                  {formatCurrency(totals.principal, currency)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Outstanding{currency ? ` (${currency})` : ""}
                </div>
                <div className="text-lg font-semibold text-primary-500">
                  {formatCurrency(totals.outstanding, currency)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Repaid{currency ? ` (${currency})` : ""}
                </div>
                <div className="text-lg font-semibold text-black dark:text-white">
                  {formatCurrency(totals.repaid, currency)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Active Loans{currency ? ` (${currency})` : ""}
                </div>
                <div className="text-lg font-semibold text-black dark:text-white">{totals.active}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The borrowed money is disbursed straight onto a destination account (chart 1000) and the
          loan schedule is booked.
        </p>
        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end flex-wrap">
          {(hasExtraFilters) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-[4px] h-[36px] px-[10px] text-xs rounded-md border border-gray-50 dark:border-[#15203c] text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 whitespace-nowrap"
              title="Clear all filters"
            >
              <i className="material-symbols-outlined !text-[16px]">filter_alt_off</i>
              Clear
            </button>
          )}
          <select
            value={statusFilter}
            onChange={(e) => setFilter("status", e.target.value)}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0"
          >
            <option value="all">All Status</option>
            <option value="pending_disbursement">Pending Disbursement</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="restructured">Restructured</option>
          </select>
          <div className="relative md:flex-none md:w-[220px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search loans (lender)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>
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
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Destination Account</th>
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
                    No loans found. Add a loan disbursed onto an asset account to get started.
                  </td>
                </tr>
              )}

              {!loading &&
                loans.map((loan) => {
                  const currency = loan.currency || loan.destination_account?.currency || "";
                  return (
                    <tr
                      key={loan.id}
                      className="border-b border-gray-100 dark:border-[#172036] align-middle hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                    >
                      <td className="text-sm px-[10px] py-[6px] font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {loan.lender?.name ?? loan.lender_name ?? "-"}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] whitespace-nowrap">
                        {loan.destination_account
                          ? `${loan.destination_account.name} (${loan.destination_account.code})`
                          : "-"}
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

        {!loading && !error && (
          <PaginationFooter
            meta={meta}
            page={page}
            perPage={perPage}
            loading={loading}
            onPageChange={setPage}
            onPerPageChange={changePerPage}
          />
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">Add Loan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[16px]">
              The loaned money is disbursed immediately: a ledger entry credits the destination
              account, its cash balance is updated and the repayment schedule is booked at once.
            </p>

            <div className="space-y-[12px] mb-[18px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Currency</label>
                <select
                  value={formCurrency}
                  onChange={(e) => {
                    const nextCurrency = e.target.value;
                    const currentDestination = destinationAccounts.find(
                      (d) => String(d.id) === formDestinationAccountId,
                    );
                    if (currentDestination && nextCurrency && currentDestination.currency !== nextCurrency) {
                      setFormDestinationAccountId("");
                    }
                    if (nextCurrency === "KES") {
                      setFormForexRate("1");
                    } else {
                      const seeded = currencies.find((c) => c.code === nextCurrency);
                      const seededRate = Number(seeded?.current_forex_rate ?? 0);
                      setFormForexRate(seededRate > 0 ? String(seededRate) : formForexRate || "129.75");
                    }
                    setFormCurrency(nextCurrency);
                  }}
                  disabled={saving}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select currency</option>
                  {currencies.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {formCurrency && formCurrency !== "KES" && (
                <div>
                  <label className="block text-xs font-medium mb-[5px]">
                    Forex rate (USD to KES) <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.000001"
                    step="0.0001"
                    value={formForexRate}
                    onChange={(e) => setFormForexRate(e.target.value)}
                    className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="e.g. 129.75"
                  />
                  <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                    Used to book this loan in KES for the trial balance. The loan
                    schedule and repayments stay in USD.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-[5px]">
                  Destination Account {formCurrency ? `(${formCurrency})` : ""}
                </label>
                <select
                  value={formDestinationAccountId}
                  onChange={(e) => setFormDestinationAccountId(e.target.value)}
                  disabled={!formCurrency || saving}
                  className={`w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                    !formCurrency || saving ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">
                    {!formCurrency ? "Select a currency first" : "Select destination account"}
                  </option>
                  {eligibleDestinationAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code}) — {a.currency}
                    </option>
                  ))}
                </select>
                {formCurrency && eligibleDestinationAccounts.length === 0 && (
                  <p className="mt-[4px] text-[11px] text-yellow-600 dark:text-yellow-400">
                    No asset accounts (1000) available in {formCurrency}. Create one on the Accounts
                    page first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Lender</label>
                <select
                  value={formLenderId}
                  onChange={(e) => setFormLenderId(e.target.value)}
                  disabled={saving}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select lender</option>
                  {lenders.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                {lenders.length === 0 && (
                  <p className="mt-[4px] text-[11px] text-yellow-600 dark:text-yellow-400">
                    No lenders yet. Create one on the Lenders page first.
                  </p>
                )}
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