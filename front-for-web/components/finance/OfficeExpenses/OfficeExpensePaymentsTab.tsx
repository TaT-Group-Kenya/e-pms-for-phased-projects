import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import Can from "../../auth/Can";

interface Payment {
  id: number;
  expense_id: number;
  transaction_id: number;
  transaction_number: string;
  transaction: {
    id: number;
    narration: string;
  } | null;
  direction: string;
  transaction_type: string;
  amount_paid: number;
  tax_amount: number;
  net_amount: number;
  payment_date: string;
  payment_method: string;
  payment_status: string;
  currency: string;
  exchange_rate: number;
  bank_name: string;
  check_number: string;
  transaction_reference: string;
  receipt_number: string;
  reconciled: boolean;
  reconciliation_date: string;
  updated_by: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const OfficeExpensePaymentsTab: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useSelector(selectAccessToken);

  const fetchPayments = () => {
    setLoading(true);
    fetch("/api/finance/office-expense-payments/list", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle paginated response: data.data is the array
        if (data && Array.isArray(data.data)) {
          setPayments(data.data);
        } else if (Array.isArray(data)) {
          setPayments(data);
        } else {
          setPayments([]);
        }
      })
      .catch(() => setError("Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 p-[20px] pb-0">
        <div className="font-semibold text-lg">Expense Payments</div>
      </div>
      <div className="table-responsive overflow-x-auto">
        <table className="w-full">
          <thead className="text-black dark:text-white">
            <tr>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">ID</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Expense ID</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Transaction #</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Narration</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Type</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Direction</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Amount Paid</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Tax Amount</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Net Amount</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Payment Date</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Method</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Status</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Currency</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Exchange Rate</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Reference</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Receipt #</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Reconciled</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Reconciliation Date</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Updated By</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Created By</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Created At</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Updated At</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {loading ? (
              <tr>
                <td colSpan={25} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">Loading...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={25} className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400">No payments found.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                >
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.id}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.expense_id}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.transaction_number}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.transaction ? payment.transaction.narration : '-' }</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.transaction_type}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.direction}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.amount_paid}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.tax_amount}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.net_amount}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.payment_date}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.payment_method}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.payment_status}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.currency}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.exchange_rate}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.transaction_reference}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.receipt_number}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.reconciled ? 'Yes' : 'No'}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.reconciliation_date}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.updated_by}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.created_by}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.created_at}</td>
                  <td className="px-[20px] py-[15px] whitespace-nowrap">{payment.updated_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficeExpensePaymentsTab;
