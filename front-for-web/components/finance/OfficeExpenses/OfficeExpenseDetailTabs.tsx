import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAccessToken } from "../../../store/auth/selectors";

const TABS = [
  { label: "Overview", key: "overview", icon: "dashboard" },
  { label: "Documents", key: "documents", icon: "description" },
];

interface OfficeExpenseDetailTabsProps {
  expenseId: string | number;
}

interface Document {
  id: number;
  document_path: string;
  document_url: string;
  file_name: string;
  created_by: number;
  created_by_user?: { id: number; first_name: string };
  created_at: string;
  updated_at: string;
}

type DebitAccount = {
  code: number;
  name: string;
}
type ExpTrxn = {
  id: number;
  debitAccount: DebitAccount;
}
type ExpPayment = {
  id: number;
  transaction: ExpTrxn;
}
interface OfficeExpense {
  id: number;
  category: { id: number; name: string } | null;
  costCenter: { id: number; name: string } | null;
  payments: ExpPayment[];
  documents: Document[];
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  created_by_user: { id: number; first_name: string } | null;
  updated_by_user: { id: number; first_name: string } | null;
  created_at: string;
  updated_at: string;
}

const OfficeExpenseDetailTabs = ({ expenseId }: OfficeExpenseDetailTabsProps) => {
  const [showSettle, setShowSettle] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [expense, setExpense] = useState<OfficeExpense | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();

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
        setDocuments(data.data?.documents || []);
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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Only images (JPG, PNG), PDF, DOC, and DOCX files are allowed.");
        setSelectedFile(null);
        return;
      }
      setUploadError(null);
      setSelectedFile(file);
    }
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!selectedFile || !expenseId) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("expense_id", expenseId.toString());
    formData.append("document_file", selectedFile);

    try {
      const resp = await fetch("/api/finance/office-expense-documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const data = await resp.json();
      if (!resp.ok) {
        // Extract validation errors if available (422 response)
        if (resp.status !== 500 && data) {
          const fieldErrors = Object.values(data).flat().join(' ');
          throw new Error(fieldErrors);
        }
        throw new Error(data.message || "Failed to upload document");
      }

      // Refresh documents list
      setDocuments((prev) => [data.data, ...prev]);
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle document download
  const handleDownload = async (doc: Document) => {
    try {
      const resp = await fetch(`/api/finance/office-expense-documents/${doc.id}/download`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!resp.ok) throw new Error("Failed to download document");
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download document");
    }
  };

  // Handle document delete
  const handleDelete = (docId: number) => {
    setDocToDelete(docId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      const resp = await fetch(`/api/finance/office-expense-documents/${docToDelete}`, {
        method: "DELETE",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      // Handle 204 No Content response
      if (resp.status === 204) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docToDelete));
        setShowDeleteConfirm(false);
        setDocToDelete(null);
        return;
      }
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Failed to delete document");
      setDocuments((prev) => prev.filter((doc) => doc.id !== docToDelete));
      setShowDeleteConfirm(false);
      setDocToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };



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
        {/* Back Button */}
        <div className="mb-[20px]">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-[#15203c] text-gray-700 dark:text-white font-medium border border-gray-200 dark:border-[#172036] hover:bg-gray-200 dark:hover:bg-[#1a2948] transition"
            onClick={() => {
              router.push('/finance/office-expenses');
            }}
          >
            <i className="material-symbols-outlined !text-[18px]">arrow_back</i>
            Back to expenses
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="trezo-tabs mb-[20px] md:mb-[25px]">
          <div className="flex items-center justify-between mb-[15px]">
            <h6 className="text-black dark:text-white font-semibold"> </h6>
            <button
              type="button"
              disabled={expense?.status === 'paid'}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowSettle(true)}
            >
              <i className="material-symbols-outlined !text-[18px]">add</i>
              Settle Expense
            </button>
          </div>
          <div className="flex space-x-2 border-b border-gray-200 dark:border-[#172036]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.key
                    ? "border-primary-500 text-primary-600 dark:text-primary-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          {activeTab === "overview" && (
            <>
              <div>
                {expense && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Source Account</span>
                      <span className="text-black dark:text-white font-semibold">{expense.payments?.[0]?.transaction?.debitAccount?.name || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${expense.status === 'paid'
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
                          {expense.category?.name || '-'}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Cost Center</span>
                      {expense.costCenter?.name || expense.costCenter ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-white">
                          {expense.costCenter?.name || '-'}
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
                      <span className="text-black dark:text-white font-semibold">{expense.created_by_user?.first_name || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#101a33] rounded px-3 py-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Updated By</span>
                      <span className="text-black dark:text-white font-semibold">{expense.updated_by_user?.first_name || '-'}</span>
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
              <div className="mt-10">
                {expense && Array.isArray(expense.payments) && expense.payments.length > 0 ? (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md mb-[10px]">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-left px-[15px] py-[12px]">Date</th>
                          <th className="text-xs font-semibold text-left px-[15px] py-[12px]">Amount</th>
                          <th className="text-xs font-semibold text-left px-[15px] py-[12px]">Currency</th>
                          <th className="text-xs font-semibold text-left px-[15px] py-[12px]">Method</th>
                          <th className="text-xs font-semibold text-left px-[15px] py-[12px]">Narration</th>
                          <th className="text-xs font-semibold text-left px-[15px] py-[12px]">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expense.payments.map((p: any) => (
                          <tr key={p.id} className="border-b border-gray-100 dark:border-[#172036] align-middle">
                            <td className="text-sm ltr:text-left rtl:text-left px-[15px] py-[12px]">{p.payment_date || p.paid_at}</td>
                            <td className="text-sm text-left px-[15px] py-[12px]">{p.amount_paid || p.amount}</td>
                            <td className="text-sm text-left px-[15px] py-[12px]">{p.currency}</td>
                            <td className="text-sm text-left px-[15px] py-[12px]">{p.payment_method || p.method}</td>
                            <td className="text-sm text-left px-[15px] py-[12px]">{p.transaction ? p.transaction.narration : '-'}</td>
                            <td className="text-sm text-left px-[15px] py-[12px]">{p.transaction_number || p.reference || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No payment found for this expense.</p>
                )}
              </div>
            </>

          )}

          {activeTab === "documents" && (
            <div className="mb-[25px]">
              <div className="flex items-center justify-between mb-[15px]">
                <h6 className="text-black dark:text-white font-semibold">Expense attachments</h6>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
                  onClick={() => setShowUploadModal(true)}
                >
                  <i className="material-symbols-outlined !text-[18px]">add</i>
                  Add Document
                </button>
              </div>
              {documents.length > 0 ? (
                <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#15203c]">
                      <tr>
                        <th className="text-xs font-semibold text-left px-[15px] py-[12px]">File Name</th>
                        <th className="text-xs font-semibold text-left px-[15px] py-[12px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-gray-100 dark:border-[#172036] align-middle">
                          <td className="text-sm text-left px-[15px] py-[12px]">
                            <div className="flex items-center gap-2">
                              <i className="material-symbols-outlined text-gray-400">
                                {doc.document_path.includes("pdf")
                                  ? "description"
                                  : doc.document_path.includes("doc") || doc.document_path.includes("docx")
                                    ? "description"
                                    : "image"}
                              </i>
                              <span className="text-black dark:text-white">{doc.file_name}</span>
                            </div>
                          </td>
                          <td className="text-sm text-left px-[15px] py-[12px]">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownload(doc)}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 mr-5"
                                title="Download"
                              >
                                <i className="material-symbols-outlined !text-[38px]">download</i>
                              </button>
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                                title="Delete"
                              >
                                <i className="material-symbols-outlined !text-[38px]">delete</i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <i className="material-symbols-outlined !text-[48px] mb-2">description</i>
                  <p>No documents attached to this expense.</p>
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Upload Document Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          expenseId={expenseId}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          uploading={uploading}
          uploadError={uploadError}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          onClose={() => {
            setShowDeleteConfirm(false);
            setDocToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DeleteConfirmationModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[400px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="font-semibold text-black dark:text-white">Confirm Deletion</h6>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="material-symbols-outlined !text-[24px]">close</i>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-[20px]">Are you sure you want to delete this document? This action cannot be undone.</p>
        <div className="flex items-center justify-end gap-[10px] mt-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadDocumentModal({
  expenseId,
  onClose,
  onUpload,
  uploading,
  uploadError,
  selectedFile,
  onFileChange,
}: {
  expenseId: string | number;
  onClose: () => void;
  onUpload: () => void;
  uploading: boolean;
  uploadError: string | null;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-[20px]">
          <h6 className="font-semibold text-black dark:text-white">Upload Document</h6>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="material-symbols-outlined !text-[24px]">close</i>
          </button>
        </div>
        <div className="space-y-[16px]">
          <div>
            <label className="mb-[8px] text-black dark:text-white font-medium block">
              Upload Document
            </label>
            <input
              type="file"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              onChange={onFileChange}
              accept="image/jpeg,image/jpg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              disabled={uploading}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-500">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Allowed: JPG, PNG, PDF, DOC, DOCX
            </p>
          </div>
          {uploadError && <div className="text-red-500 text-sm">{uploadError}</div>}
          <div className="flex items-center justify-end gap-[10px] mt-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onUpload}
              disabled={uploading || !selectedFile}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettleExpenseModal({ expense, accounts, loading, error, onClose, refetchExpense }: { expense: any; accounts: any[]; loading: boolean; error: string | null; onClose: () => void; refetchExpense: () => void }) {
  const [fundingAccount, setFundingAccount] = useState("");
  const [narration, setNarration] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [transactionCost, setTransactionCost] = useState("");
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
          transaction_cost: transactionCost || 0,
        })
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
            <label className="mb-[8px] text-black dark:text-white font-medium block">Transaction Cost</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] py-[8px] block w-full outline-0 focus:border-primary-500"
              value={transactionCost}
              onChange={e => setTransactionCost(e.target.value)}
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
