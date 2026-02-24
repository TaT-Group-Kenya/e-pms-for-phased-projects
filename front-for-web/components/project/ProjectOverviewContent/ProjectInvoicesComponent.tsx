"use client";

import React from "react";

interface Invoice {
  id?: number;
  invoice_number?: string;
  title?: string;
  total_amount?: number | string;
  status?: string;
  payment_terms?: string;
  created_at?: string;
  [key: string]: any;
}

interface ProjectInvoicesComponentProps {
  customerInvoices?: Invoice[] | null;
  companyInvoices?: Invoice[] | null;
  projectId?: string;
}

const ProjectInvoicesComponent: React.FC<ProjectInvoicesComponentProps> = ({
  customerInvoices = [],
  companyInvoices = [],
  projectId,
}) => {
  const hasInvoices = (customerInvoices && customerInvoices.length > 0) || 
                      (companyInvoices && companyInvoices.length > 0);

  if (!hasInvoices) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="pt-[20px]">
          <div className="text-center py-[40px]">
            <div className="mb-[15px]">
              <i className="material-symbols-outlined text-[48px] text-gray-400">receipt</i>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No invoices available</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-[8px]">Invoices will appear here once they are created for this project</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-[25px]">
      {/* Customer Invoices */}
      {customerInvoices && customerInvoices.length > 0 && (
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="pt-[20px]">
            <h6 className="font-semibold text-black dark:text-white mb-[20px] flex items-center gap-[8px]">
              <i className="material-symbols-outlined text-[20px]">person</i>
              Customer Invoices ({customerInvoices.length})
            </h6>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#172036]">
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Invoice #
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customerInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 dark:border-[#0f1829] hover:bg-gray-50 dark:hover:bg-[#172036] transition-colors"
                    >
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        {invoice.invoice_number || `INV-${invoice.id}`}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        {invoice.total_amount || '0.00'}
                      </td>
                      <td className="py-[12px] px-[16px]">
                        <span className={`inline-block px-[8px] py-[4px] rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                          {invoice.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 text-sm">
                        {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Company Invoices */}
      {companyInvoices && companyInvoices.length > 0 && (
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="pt-[20px]">
            <h6 className="font-semibold text-black dark:text-white mb-[20px] flex items-center gap-[8px]">
              <i className="material-symbols-outlined text-[20px]">business</i>
              Company Invoices ({companyInvoices.length})
            </h6>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#172036]">
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Invoice #
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-[12px] px-[16px] text-black dark:text-white font-semibold text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companyInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 dark:border-[#0f1829] hover:bg-gray-50 dark:hover:bg-[#172036] transition-colors"
                    >
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        {invoice.invoice_number || `INV-${invoice.id}`}
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-700 dark:text-gray-300 font-medium">
                        {invoice.total_amount || '0.00'}
                      </td>
                      <td className="py-[12px] px-[16px]">
                        <span className={`inline-block px-[8px] py-[4px] rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                          {invoice.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-[12px] px-[16px] text-gray-600 dark:text-gray-400 text-sm">
                        {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
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

export default ProjectInvoicesComponent;
