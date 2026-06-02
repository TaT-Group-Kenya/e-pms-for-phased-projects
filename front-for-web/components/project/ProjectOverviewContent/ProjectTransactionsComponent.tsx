"use client";

import React from "react";

interface Payment {
  id?: number;
  amount_paid?: number | string;
  payment_date?: string;
  payment_status?: string;
  payment_method?: string;
  receipt_number?: string;
  currency?: string;
  [key: string]: any;
}

interface ProjectTransactionsComponentProps {
  incomingPayments?: Payment[] | null;
  outgoingPayments?: Payment[] | null;
}

const ProjectTransactionsComponent: React.FC<ProjectTransactionsComponentProps> = ({
  incomingPayments = [],
  outgoingPayments = [],
}) => {
  const hasPayments = (incomingPayments && incomingPayments.length > 0) || 
                      (outgoingPayments && outgoingPayments.length > 0);

  if (!hasPayments) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="pt-[20px]">
          <div className="text-center py-[40px]">
            <div className="mb-[15px]">
              <i className="material-symbols-outlined text-[48px] text-gray-400">payments</i>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No payments recorded</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-[8px]">Payment records will appear here once transactions are made on project invoices</p>
          </div>
        </div>
      </div>
    );
  }

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-[25px]">
      {/* Incoming Payments */}
      {incomingPayments && incomingPayments.length > 0 && (
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md border-l-4 border-l-green-500">
          <div className="pt-[20px]">
            <h6 className="font-semibold text-black dark:text-white mb-[20px] flex items-center gap-[8px]">
              <i className="material-symbols-outlined text-[20px] text-green-600">trending_up</i>
              Incoming Payments ({incomingPayments.length})
            </h6>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#172036]">
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Receipt #
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Date
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Method
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incomingPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 dark:border-[#0f1829] hover:bg-gray-50 dark:hover:bg-[#172036] transition-colors"
                    >
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        #{payment.receipt_number || payment.id}
                      </td>
                      <td className="py-[12px] px-[16px] text-green-700 dark:text-green-400 font-bold">
                        +{payment.currency || 'KES'} {typeof payment.amount_paid === 'number' ? payment.amount_paid.toFixed(2) : payment.amount_paid}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 text-sm">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 capitalize text-sm">
                        {payment.payment_method || 'N/A'}
                      </td>
                      <td className="py-[12px] px-[16px]">
                        <span className={`inline-block px-[8px] py-[4px] rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(payment.payment_status)}`}>
                          {payment.payment_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Outgoing Payments */}
      {outgoingPayments && outgoingPayments.length > 0 && (
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md border-l-4 border-l-red-500">
          <div className="pt-[20px]">
            <h6 className="font-semibold text-black dark:text-white mb-[20px] flex items-center gap-[8px]">
              <i className="material-symbols-outlined text-[20px] text-red-600">trending_down</i>
              Outgoing Payments ({outgoingPayments.length})
            </h6>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#172036]">
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Receipt #
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Company
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Date
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Method
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {outgoingPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 dark:border-[#0f1829] hover:bg-gray-50 dark:hover:bg-[#172036] transition-colors"
                    >
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        #{payment.receipt_number || payment.id}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        {payment.invoice.company.name || '-'}
                      </td>
                      <td className="py-[12px] px-[16px] text-red-700 dark:text-red-400 font-bold">
                        -{payment.currency || 'KES'} {typeof payment.amount_paid === 'number' ? payment.amount_paid.toFixed(2) : payment.amount_paid}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 text-sm">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 capitalize text-sm">
                        {payment.payment_method || 'N/A'}
                      </td>
                      <td className="py-[12px] px-[16px]">
                        <span className={`inline-block px-[8px] py-[4px] rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(payment.payment_status)}`}>
                          {payment.payment_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTransactionsComponent;
