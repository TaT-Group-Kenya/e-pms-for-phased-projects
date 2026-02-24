"use client";

import React from "react";

interface Order {
  id?: number;
  order_number?: string;
  title?: string;
  description?: string;
  total_amount?: number | string;
  subtotal_amount?: number | string;
  tax_amount?: number | string;
  discount_amount?: number | string;
  status?: string;
  currency?: string;
  created_at?: string;
  [key: string]: any;
}

interface ProjectOrdersComponentProps {
  order?: Order | null;
}

const ProjectOrdersComponent: React.FC<ProjectOrdersComponentProps> = ({ order }) => {
  if (!order || Object.keys(order).length === 0) {
    return (
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="pt-[20px]">
          <div className="text-center py-[40px]">
            <div className="mb-[15px]">
              <i className="material-symbols-outlined text-[48px] text-gray-400">shopping_cart</i>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No order available</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-[8px]">An order will appear here once one is created for this project</p>
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
              {order?.title || order?.order_number || 'Order'}
            </h6>
            <div className="grid grid-cols-2 gap-[15px]">
              {order?.order_number && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-[4px]">Order Number</p>
                  <p className="text-sm font-medium text-black dark:text-white">{order.order_number}</p>
                </div>
              )}
              {order?.status && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-[4px]">Status</p>
                  <span className={`inline-block px-[8px] py-[4px] rounded text-xs font-medium capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Details */}
          {order?.subtotal_amount && (
            <div className="space-y-[12px]">
              <div className="flex justify-between items-center py-[8px] border-b border-gray-100 dark:border-[#0f1829]">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-black dark:text-white">
                  {order.currency || 'KES'} {typeof order.subtotal_amount === 'number' ? order.subtotal_amount.toFixed(2) : order.subtotal_amount}
                </span>
              </div>
              {order?.tax_amount ? (
                <div className="flex justify-between items-center py-[8px] border-b border-gray-100 dark:border-[#0f1829]">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-black dark:text-white">
                    {order.currency || 'KES'} {typeof order.tax_amount === 'number' ? order.tax_amount.toFixed(2) : order.tax_amount}
                  </span>
                </div>
              ) : null}
              {order?.discount_amount ? (
                <div className="flex justify-between items-center py-[8px] border-b border-gray-100 dark:border-[#0f1829]">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="font-medium text-black dark:text-white text-green-600">
                    -{order.currency || 'KES'} {typeof order.discount_amount === 'number' ? order.discount_amount.toFixed(2) : order.discount_amount}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center py-[12px] bg-primary-50 dark:bg-[#0f1829] px-[12px] rounded-md">
                <span className="font-semibold text-black dark:text-white">Total Amount</span>
                <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                  {order.currency || 'KES'} {typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : order.total_amount}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          {order?.description && (
            <div className="pt-[12px] border-t border-gray-200 dark:border-[#172036]">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-[8px] font-medium">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-[1.6]">
                {order.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectOrdersComponent;
