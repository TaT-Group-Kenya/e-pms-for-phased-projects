import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { ToastContainer } from "../../common/Toast";
// Fix implicit any types
type Category = { id: number; name: string };
type Department = { id: number; name: string };
type FormState = {
  description: string;
  category_id: string | number;
  cost_center_id: string | number;
  amount: number | string;
  currency: string;
  date: string;
};
interface OfficeExpense {
  id: number;
  category: { id: number; name: string } | null;
  costCenter: { id: number; name: string } | null;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

const OfficeExpensesTable: React.FC = () => {
  const [expenses, setExpenses] = useState<OfficeExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editExpense, setEditExpense] = useState<OfficeExpense | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteExpense, setDeleteExpense] = useState<OfficeExpense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const accessToken = useSelector(selectAccessToken);
  const accessTokenStr = typeof accessToken === "string" ? accessToken : "";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/finance/office-expenses/list?search=${encodeURIComponent(search)}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.data) ? data.data : [];
        setExpenses(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, accessToken, showEditModal, showDeleteModal]);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 p-[20px] pb-0">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by description or category..."
            className="input input-bordered w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive overflow-x-auto">
        <table className="w-full">
          <thead className="text-black dark:text-white">
            <tr>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Date</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Category</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Cost Center</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Description</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Amount</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Currency</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Status</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">Loading...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">No expenses found.</td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                >
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{expense.date}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{expense.category ? expense.category.name : "-"}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{expense.costCenter ? expense.costCenter.name : "-"}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{expense.description}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                    <span className="font-semibold">{expense.amount.toLocaleString()}</span>
                  </td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{expense.currency}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{expense.status ? expense.status : '-'}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap flex gap-2">
                    <Link
                      href={`/finance/office-expenses/${expense.id}`}
                      className="inline-flex items-center justify-center w-[64px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                      title="View Details"
                    >
                      <i className="material-symbols-outlined !text-[18px]">visibility</i>
                      View
                    </Link>
                    <button
                      type="button"
                      className={`inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all ${expense.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Edit Expense"
                      disabled={expense.status !== 'pending'}
                      onClick={() => {
                        setEditExpense(expense);
                        setShowEditModal(true);
                      }}
                    >
                      <i className="material-symbols-outlined !text-[18px]">edit</i>
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all ${expense.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Delete Expense"
                      disabled={expense.status !== 'pending'}
                      onClick={() => {
                        setDeleteExpense(expense);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="material-symbols-outlined !text-[18px]">delete</i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      {showEditModal && editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={() => {
            setShowEditModal(false);
            setEditExpense(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditExpense(null);
            addToast("Expense updated!", "success");
          }}
            accessToken={accessTokenStr}
        />
      )}
      {/* Delete Modal */}
      {showDeleteModal && deleteExpense && (
        <DeleteExpenseModal
          expense={deleteExpense}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteExpense(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setDeleteExpense(null);
            addToast("Expense deleted!", "success");
          }}
            accessToken={accessTokenStr}
        />
      )}
    </div>
  );

                    // Edit Modal
                    function EditExpenseModal({ expense, onClose, onSuccess, accessToken }: { expense: OfficeExpense; onClose: () => void; onSuccess: () => void; accessToken: string }) {
                      const [form, setForm] = useState<FormState>({
                        description: expense.description,
                        category_id: expense.category?.id || "",
                        cost_center_id: expense.costCenter?.id || "",
                        amount: expense.amount,
                        currency: expense.currency,
                        date: expense.date,
                      });
                      const [categories, setCategories] = useState<Category[]>([]);
                      const [departments, setDepartments] = useState<Department[]>([]);
                      const [loadingOptions, setLoadingOptions] = useState(true);
                      const [isSubmitting, setIsSubmitting] = useState(false);
                      const [error, setError] = useState("");

                      useEffect(() => {
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
                          setCategories(Array.isArray(catData.data) ? catData.data : []);
                          setDepartments(Array.isArray(deptData.data) ? deptData.data : []);
                          setLoadingOptions(false);
                        }).catch(() => setLoadingOptions(false));
                        return () => { isMounted = false; };
                      }, [accessToken]);

                      return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-[20px]">
                              <h6 className="font-semibold text-black dark:text-white">Edit Office Expense</h6>
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
                                    category_id: typeof form.category_id === "string" ? parseInt(form.category_id, 10) : form.category_id,
                                    cost_center_id: typeof form.cost_center_id === "string" ? parseInt(form.cost_center_id, 10) : form.cost_center_id,
                                    amount: form.amount,
                                    currency: form.currency,
                                    date: form.date,
                                  };
                                  const res = await fetch(`/api/finance/office-expenses/${expense.id}`, {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                                    },
                                    body: JSON.stringify(payload),
                                  });
                                  const data = await res.json();
                                  if (!res.ok) {
                                    setError(data?.message || "Failed to update expense.");
                                    setIsSubmitting(false);
                                    return;
                                  }
                                  setIsSubmitting(false);
                                  onSuccess();
                                } catch (err) {
                                  setError("Failed to update expense. Please try again.");
                                  setIsSubmitting(false);
                                }
                              }}
                              className="space-y-[16px]"
                            >
                              <div>
                                <label className="mb-[8px] text-black dark:text-white font-medium block">Description</label>
                                <textarea
                                  value={form.description}
                                    onChange={e => setForm((f: FormState) => ({ ...f, description: e.target.value }))}
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
                                    onChange={e => setForm((f: FormState) => ({ ...f, category_id: e.target.value }))}
                                    className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                                    required
                                    disabled={loadingOptions}
                                  >
                                    <option value="" disabled>Select category</option>
                                    {categories.length === 0 && !loadingOptions && (
                                      <option value="" disabled>No categories found</option>
                                    )}
                                    {categories.map((cat: Category) => (
                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="mb-[8px] text-black dark:text-white font-medium block">Cost Center</label>
                                  <select
                                    value={form.cost_center_id}
                                    onChange={e => setForm((f: FormState) => ({ ...f, cost_center_id: e.target.value }))}
                                    className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                                    required
                                    disabled={loadingOptions}
                                  >
                                    <option value="" disabled>Select cost center</option>
                                    {departments.length === 0 && !loadingOptions && (
                                      <option value="" disabled>No cost centers found</option>
                                    )}
                                    {departments.map((dept: Department) => (
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
                                    onChange={e => setForm((f: FormState) => ({ ...f, amount: e.target.value }))}
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
                                    onChange={e => setForm((f: FormState) => ({ ...f, currency: e.target.value }))}
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
                                  onChange={e => setForm((f: FormState) => ({ ...f, date: e.target.value }))}
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
                                  Update Expense
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      );
                    }

                    // Delete Modal
                    function DeleteExpenseModal({ expense, onClose, onSuccess, accessToken }: { expense: OfficeExpense; onClose: () => void; onSuccess: () => void; accessToken: string }) {
                      const [isSubmitting, setIsSubmitting] = useState(false);
                      const [error, setError] = useState("");
                      return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-[20px]">
                              <h6 className="font-semibold text-black dark:text-white">Delete Expense</h6>
                            </div>
                            <div className="mb-[20px] text-sm text-black dark:text-white">Are you sure you want to delete this expense? This action cannot be undone.</div>
                            {error && (
                              <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
                            )}
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
                                type="button"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-danger-500 text-white hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={async () => {
                                  setIsSubmitting(true);
                                  setError("");
                                  try {
                                    const accessTokenStr = typeof accessToken === "string" ? accessToken : "";
                                    const res = await fetch(`/api/finance/office-expenses/${expense.id}`, {
                                      method: "DELETE",
                                      headers: {
                                        ...(accessTokenStr ? { Authorization: `Bearer ${accessTokenStr}` } : {}),
                                      },
                                    });
                                    const data = await res.json().catch(() => null);
                                    if (!res.ok) {
                                      setError(data?.message || "Failed to delete expense.");
                                      setIsSubmitting(false);
                                      return;
                                    }
                                    setIsSubmitting(false);
                                    onSuccess();
                                  } catch (err) {
                                    setError("Failed to delete expense. Please try again.");
                                    setIsSubmitting(false);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

}
export default OfficeExpensesTable;
