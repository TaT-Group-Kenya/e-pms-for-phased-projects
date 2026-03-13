import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import PaymentReceivingMethodForm from "./PaymentReceivingMethodForm";

interface PaymentReceivingMethod {
  id: number;
  type: string;
  name: string;
  currency: string;
  instruction?: string;
  paybill?: string;
  account_holder_name?: string;
  account_number?: string;
  bank?: string;
  branch?: string;
  swift_code?: string;
  iban?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const PaymentReceivingMethodsTable: React.FC = () => {
  const [methods, setMethods] = useState<PaymentReceivingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMethod, setEditMethod] = useState<PaymentReceivingMethod | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMethod, setDeleteMethod] = useState<PaymentReceivingMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/finance/payment-receiving-methods/list?search=${encodeURIComponent(search)}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.data) ? data.data : [];
        setMethods(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, accessToken, showEditModal, showDeleteModal]);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Payment Receiving Methods</h2>
        <button
          className="trezo-btn bg-primary-500 text-white flex items-center gap-1 px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
          onClick={() => { setEditMethod(null); setShowEditModal(true); }}
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Method
        </button>
      </div>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 bg-white dark:bg-[#0c1427] text-black dark:text-white transition-colors"
          style={{ boxSizing: 'border-box' }}
        />
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Name</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Type</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Currency</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Paybill</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Account Holder</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Account Number</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Bank</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Branch</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Swift Code</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">IBAN</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Instruction</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Status</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Created</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Updated</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading ? (
                <tr>
                  <td colSpan={15} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">Loading...</td>
                </tr>
              ) : methods.length === 0 ? (
                <tr>
                  <td colSpan={15} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">No payment receiving methods found.</td>
                </tr>
              ) : (
                methods.map((method) => (
                  <tr
                    key={method.id}
                    className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                  >
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.name}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.type}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.currency}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.paybill || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.account_holder_name || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.account_number || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.bank || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.branch || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.swift_code || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.iban || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{method.instruction || ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                      <span className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${method.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {method.status}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-xs">{method.created_at ? new Date(method.created_at).toLocaleDateString() : ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap text-xs">{method.updated_at ? new Date(method.updated_at).toLocaleDateString() : ''}</td>
                    <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                      <div className="flex items-center gap-[10px]">
                        <button
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                          title="Edit"
                          onClick={() => { setEditMethod(method); setShowEditModal(true); }}
                        >
                          <i className="material-symbols-outlined !text-[18px]">edit</i>
                        </button>
                        <button
                          className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-danger-500 hover:text-white hover:border-danger-500 transition-all"
                          title="Delete"
                          onClick={() => { setDeleteMethod(method); setShowDeleteModal(true); }}
                        >
                          <i className="material-symbols-outlined !text-[18px]">delete</i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[20px]">
              <h6 className="font-semibold text-black dark:text-white">{editMethod ? 'Edit' : 'Add'} Payment Receiving Method</h6>
              {isSubmitting && (
                <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            {/* Error message area (optional, can add error state if needed) */}
            {/* {error && (
              <div className="mb-[20px] p-[12px] rounded-md bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
            )} */}
            <PaymentReceivingMethodForm
              initial={editMethod ? {
                ...editMethod,
                instruction: editMethod.instruction ?? "",
                paybill: editMethod.paybill ?? "",
                account_holder_name: editMethod.account_holder_name ?? "",
                account_number: editMethod.account_number ?? "",
                bank: editMethod.bank ?? "",
                branch: editMethod.branch ?? "",
                swift_code: editMethod.swift_code ?? "",
                iban: editMethod.iban ?? "",
              } : undefined}
              isSubmitting={isSubmitting}
              onCancel={() => setShowEditModal(false)}
              onSubmit={async (fields) => {
                setIsSubmitting(true);
                try {
                  let url = "/api/finance/payment-receiving-methods";
                  let method = "POST";
                  if (editMethod) {
                    url = `/api/finance/payment-receiving-methods/${editMethod.id}`;
                    method = "PUT";
                  }
                  const res = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                    body: JSON.stringify(fields),
                  });
                  if (!res.ok) throw new Error("Failed to save");
                  addToast(editMethod ? "Payment method updated!" : "Payment method added!", "success");
                  setShowEditModal(false);
                } catch (e) {
                  addToast("Failed to save payment method", "error");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReceivingMethodsTable;
