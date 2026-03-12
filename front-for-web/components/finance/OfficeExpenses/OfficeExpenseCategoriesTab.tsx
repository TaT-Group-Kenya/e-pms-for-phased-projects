import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import Can from "../../auth/Can";

interface Category {
  id: number;
  name: string;
  description?: string;
}

const OfficeExpenseCategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/finance/office-expense-categories/list", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      let url = "/api/finance/office-expense-categories";
      let method: "POST" | "PUT" = "POST";
      let body: any = { ...form };
      if (editing) {
        url = `/api/finance/office-expense-categories/${editing.id}`;
        method = "PUT";
        // Some backends require the id in the body for PUT, add if needed:
        body.id = editing.id;
      }
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(body),
      });
      let data;
      try {
        data = await resp.json();
      } catch {
        data = {};
      }
      if (!resp.ok) {
        setError((data && data.message) || "Failed to save category");
        addToast((data && data.message) || "Failed to save category", "error");
      } else {
        setForm({ name: "", description: "" });
        setEditing(null);
        setShowModal(false);
        fetchCategories();
        addToast(editing ? "Category updated!" : "Category added!", "success");
      }
    } catch {
      setError("Network error");
      addToast("Network error", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError(null);
    try {
      const resp = await fetch(`/api/finance/office-expense-categories/${deleteTarget.id}`, {
        method: "DELETE",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      let data: any;
      try {
        data = await resp.json() as any;
      } catch {}
      if (!resp.ok) {
        setError((data && data.message) || "Failed to delete category");
        addToast((data && data.message) || "Failed to delete category", "error");
        setIsDeleting(false);
        return;
      }
      setIsDeleting(false);
      setDeleteTarget(null);
      fetchCategories();
      addToast("Category deleted!", "success");
    } catch {
      setError("Network error");
      addToast("Network error", "error");
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-md bg-white dark:bg-[#0c1427] p-6 shadow-sm mt-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex items-center justify-between mb-4">
        <h6 className="font-semibold">Manage Expense Categories</h6>
        <Can any={["ROLE_ADD_OFFICE_EXPENSE_CATEGORY"]}>
          <button
            className="px-[20px] py-[10px] rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-all font-medium"
            onClick={() => { setEditing(null); setForm({ name: "", description: "" }); setShowModal(true); }}
          >
            <i className="material-symbols-outlined align-middle mr-1">add</i> Add Category
          </button>
        </Can>
      </div>
      <div className="table-responsive overflow-x-auto">
        <table className="w-full">
          <thead className="text-black dark:text-white">
            <tr>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Name</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Description</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">Loading...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">No categories found.</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                >
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{cat.name}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{cat.description}</td>
                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                    <button
                      className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all mr-2"
                      title="Edit"
                      onClick={() => handleEdit(cat)}
                    >
                      <span className="material-symbols-outlined !text-[18px]">edit</span>
                    </button>
                    <button
                      className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                      title="Delete"
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <span className="material-symbols-outlined !text-[18px]">delete</span>
                    </button>
                    {/* Modal for Delete Confirmation */}
                    {deleteTarget && deleteTarget.id === cat.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-[20px]">
                            <h6 className="font-semibold text-black dark:text-white">Delete Category</h6>
                          </div>
                          <div className="mb-[20px] text-black dark:text-white break-words whitespace-pre-line block">
                            {`Are you sure you want to delete the category `}
                            <span className="font-semibold break-words">{deleteTarget.name}</span>?
                          </div>
                          <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(null)}
                              disabled={isDeleting}
                              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-danger-500 text-white hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? (
                                <span className="w-[16px] h-[16px] border-2 border-danger-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h6 className="font-semibold text-black dark:text-white">{editing ? "Edit Category" : "Add Category"}</h6>
              {isSubmitting && (
                <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            {error && (
              <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-[16px]">
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
                  placeholder="Category Name"
                  required
                />
              </div>
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[10px] block w-full outline-0 focus:border-primary-500"
                  placeholder="Description (optional)"
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditing(null); setForm({ name: "", description: "" }); setError(null); }}
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
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeExpenseCategoriesTab;
