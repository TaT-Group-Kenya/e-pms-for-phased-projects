"use client";

import React from "react";

interface Quotation {
  id?: number;
  quotation_number?: string;
  title?: string;
  description?: string;
  total_amount?: number | string;
  subtotal_amount?: number | string;
  tax_amount?: number | string;
  discount_amount?: number | string;
  status?: string;
  valid_until?: string;
  currency?: string;
  created_at?: string;
  [key: string]: any;
}

interface ProjectQuotationsComponentProps {
  quotation?: Quotation | null;
}

const ProjectQuotationsComponent: React.FC<ProjectQuotationsComponentProps> = ({ quotation }) => {
  if (!quotation || Object.keys(quotation).length === 0) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="pt-[20px]">
          <div className="text-center py-[40px]">
            <div className="mb-[15px]">
              <i className="material-symbols-outlined text-[48px] text-gray-400">description</i>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No quotation available</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-[8px]">A quotation will appear here once one is created for this project</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="pt-[20px]">
        <div className="space-y-[20px]">
          {/* Header Info */}
          <div className="border-b border-gray-200 dark:border-[#172036] pb-[20px]">
            <h6 className="font-semibold text-black dark:text-white mb-[15px]">
              {quotation?.title || quotation?.quotation_number || 'Quotation'}
            </h6>
            <div className="grid grid-cols-2 gap-[15px]">
              {quotation?.quotation_number && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-[4px]">Quotation Number</p>
                  <p className="text-sm font-medium text-black dark:text-white">{quotation.quotation_number}</p>
                </div>
              )}
              {quotation?.status && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-[4px]">Status</p>
                  <span className={`inline-block px-[8px] py-[4px] rounded text-xs font-medium capitalize ${
                    quotation.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    quotation.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {quotation.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Details */}
          {quotation?.subtotal_amount && (
            <div className="space-y-[12px]">
              <div className="flex justify-between items-center py-[8px] border-b border-gray-100 dark:border-[#0f1829]">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-black dark:text-white">
                  {quotation.currency || 'KES'} {typeof quotation.subtotal_amount === 'number' ? quotation.subtotal_amount.toFixed(2) : quotation.subtotal_amount}
                </span>
              </div>
              {quotation?.tax_amount ? (
                <div className="flex justify-between items-center py-[8px] border-b border-gray-100 dark:border-[#0f1829]">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-black dark:text-white">
                    {quotation.currency || 'KES'} {typeof quotation.tax_amount === 'number' ? quotation.tax_amount.toFixed(2) : quotation.tax_amount}
                  </span>
                </div>
              ) : null}
              {quotation?.discount_amount ? (
                <div className="flex justify-between items-center py-[8px] border-b border-gray-100 dark:border-[#0f1829]">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="font-medium text-black dark:text-white text-green-600">
                    -{quotation.currency || 'KES'} {typeof quotation.discount_amount === 'number' ? quotation.discount_amount.toFixed(2) : quotation.discount_amount}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center py-[12px] bg-primary-50 dark:bg-[#0f1829] px-[12px] rounded-md">
                <span className="font-semibold text-black dark:text-white">Total Amount</span>
                <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                  {quotation.currency || 'KES'} {typeof quotation.total_amount === 'number' ? quotation.total_amount.toFixed(2) : quotation.total_amount}
                </span>
              </div>
            </div>
          )}

          {/* Valid Until */}
          {quotation?.valid_until && (
            <div className="pt-[12px] border-t border-gray-200 dark:border-[#172036]">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-[4px]">Valid Until</p>
              <p className="text-sm font-medium text-black dark:text-white">
                {new Date(quotation.valid_until).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Description */}
          {quotation?.description && (
            <div className="pt-[12px] border-t border-gray-200 dark:border-[#172036]">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-[8px] font-medium">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-[1.6]">
                {quotation.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectQuotationsComponent;
