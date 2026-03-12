
import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import Can from "../../../components/auth/Can";
import OfficeExpensesTable from "../../../components/finance/OfficeExpenses/OfficeExpensesTable";
import OfficeExpenseCategoriesTab from "../../../components/finance/OfficeExpenses/OfficeExpenseCategoriesTab";
import OfficeExpensePaymentsTab from "../../../components/finance/OfficeExpenses/OfficeExpensePaymentsTab";
import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";
import React from "react";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useSelector } from "react-redux";


const tabs = [
  { id: "expenses", label: "Office Expenses", icon: "receipt_long" },
  { id: "categories", label: "Expense Categories", icon: "category" },
  { id: "payments", label: "Expense Payments", icon: "payments" },
];

type TabId = typeof tabs[number]["id"];

export default function OfficeExpensesListPage() {
  const [activeTab, setActiveTab] = useState<TabId>("expenses");
  const { toasts, addToast, removeToast } = useToast();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expensesTableKey, setExpensesTableKey] = useState(0); // For forcing table reload
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Modal scaffolds matching quotation line item modal style
  const AddExpenseModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
    const [form, setForm] = useState({
      description: "",
      category_id: "",
      cost_center_id: "",
      amount: "",
      currency: "KES",
      date: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const accessToken = useSelector(selectAccessToken);
    

    // Fetch categories and departments on mount
    React.useEffect(() => {
      let isMounted = true;
      setLoadingOptions(true);
      Promise.all([
        fetch("/api/finance/office-expense-categories/list", {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        }).then(r => r.json()),
        fetch("/api/departments/list", {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        }).then(r => r.json()),
      ]).then(([catData, deptData]) => {
        if (!isMounted) return;
        // Debug log
        console.log('Fetched categories:', catData);
        console.log('Fetched departments:', deptData);
        setCategories(Array.isArray(catData.data) ? catData.data : []);
        setDepartments(Array.isArray(deptData.data) ? deptData.data : []);
        setLoadingOptions(false);
      }).catch(() => setLoadingOptions(false));
      return () => { isMounted = false; };
    }, []);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-[20px]">
            <h6 className="font-semibold text-black dark:text-white">Add Office Expense</h6>
            {isSubmitting && (
              <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          {error && (
            <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError("");
              try {
                const payload = {
                  description: form.description,
                  category_id: form.category_id ? parseInt(form.category_id, 10) : undefined,
                  cost_center_id: form.cost_center_id ? parseInt(form.cost_center_id, 10) : undefined,
                  amount: form.amount,
                  currency: form.currency,
                  date: form.date,
                };
                const res = await fetch("/api/finance/office-expenses/create", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                  },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data?.message || "Failed to add expense.");
                  setIsSubmitting(false);
                  return;
                }
                addToast("Expense added!", "success");
                setIsSubmitting(false);
                onSuccess();
              } catch (err) {
                setError("Failed to add expense. Please try again.");
                setIsSubmitting(false);
              }
            }}
            className="space-y-[16px]"
          >
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 focus:border-primary-500"
                placeholder="Describe the expense"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Category</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  required
                  disabled={loadingOptions}
                >
                  <option value="" disabled>Select category</option>
                  {categories.length === 0 && !loadingOptions && (
                    <option value="" disabled>No categories found</option>
                  )}
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Cost Center</label>
                <select
                  value={form.cost_center_id}
                  onChange={e => setForm(f => ({ ...f, cost_center_id: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  required
                  disabled={loadingOptions}
                >
                  <option value="" disabled>Select cost center</option>
                  {departments.length === 0 && !loadingOptions && (
                    <option value="" disabled>No cost centers found</option>
                  )}
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Currency</label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="E.g. KES"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-[10px] mt-[10px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddPaymentModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
    const [form, setForm] = useState({
      expense_id: "",
      amount: "",
      currency: "KES",
      paid_at: "",
      method: "",
      reference: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-[20px]">
            <h6 className="font-semibold text-black dark:text-white">Add Expense Payment</h6>
            {isSubmitting && (
              <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          {error && (
            <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError("");
              // TODO: Implement API call
              setTimeout(() => {
                addToast("Payment added!", "success");
                setIsSubmitting(false);
                onSuccess();
              }, 800);
            }}
            className="space-y-[16px]"
          >
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Expense ID</label>
              <input
                type="text"
                value={form.expense_id}
                onChange={e => setForm(f => ({ ...f, expense_id: e.target.value }))}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                placeholder="Expense ID"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Currency</label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="E.g. KES"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-[8px] text-black dark:text-white font-medium block">Paid At</label>
              <input
                type="date"
                value={form.paid_at}
                onChange={e => setForm(f => ({ ...f, paid_at: e.target.value }))}
                className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Method</label>
                <input
                  type="text"
                  value={form.method}
                  onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="E.g. Bank, Cash, Mpesa"
                  required
                />
              </div>
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Reference</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="Reference/Transaction ID"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-[10px] mt-[10px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Can any={["ROLE_VIEW_OFFICE_EXPENSE"]} fallback={<div>You do not have permission to view office expenses.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Office Expenses</h5>
          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              <Link
                href="/dashboard"
                className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">home</i>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">Finance</li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">Office Expenses</li>
          </ol>
        </div>

        {/* Tabs Navigation */}
        <div className="trezo-tabs mb-[20px] md:mb-[25px]">
          <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
            {tabs.map((tab) => (
              <li key={tab.id} className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
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
        {activeTab === "expenses" && (
          <div className="mb-[25px]">
            <div className="flex justify-end mb-4">
              <Can any={["ROLE_ADD_OFFICE_EXPENSE"]}>
                <button
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowAddExpenseModal(true)}
                >
                  <i className="material-symbols-outlined align-middle mr-1">add</i> Add Expense
                </button>
              </Can>
            </div>
            <OfficeExpensesTable key={expensesTableKey} />
            {showAddExpenseModal && (
              <AddExpenseModal
                onClose={() => setShowAddExpenseModal(false)}
                onSuccess={() => {
                  setShowAddExpenseModal(false);
                  setExpensesTableKey((k) => k + 1); // Force OfficeExpensesTable to reload
                }}
              />
            )}
          </div>
        )}
        {activeTab === "categories" && (
          <div>
            <OfficeExpenseCategoriesTab />
          </div>
        )}
        {activeTab === "payments" && (
          <div>
            <OfficeExpensePaymentsTab />
            {showAddPaymentModal && (
              <AddPaymentModal onClose={() => setShowAddPaymentModal(false)} onSuccess={() => { setShowAddPaymentModal(false); }} />
            )}
          </div>
        )}
      </Can>
    </AuthenticatedLayout>
  );
}
