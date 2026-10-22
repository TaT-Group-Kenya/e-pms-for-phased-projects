"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { useListQuery } from "../../../hooks/useListQuery";
import { useFilterOptions } from "../../../hooks/useFilterOptions";
import { ToastContainer } from "../../common/Toast";
import PaginationFooter from "../../common/PaginationFooter";
import FilterSelect from "../../common/FilterSelect";
import Can from "../../auth/Can";

interface OrderSummary {
  id: number;
  order_number: string;
  bol_number?: string;
  project_id: number | null;
  customer_id: number | null;
  title: string;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  created_at: string;
  customer?: { name: string };
  project_owner?: {
    id: number;
    name: string;
  };
  created_by_user?: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
  };
}

const OrdersTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  // Server-side listing: pagination, debounced search and status filter all
  // live in useListQuery; this component keeps only its own columns/cells.
  const {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    clearFilters,
    page,
    setPage,
    perPage,
    changePerPage,
    rows: orders,
    loading,
    error,
    meta,
  } = useListQuery<OrderSummary>("/api/orders/list", {
    accessToken,
    initialFilters: { status: "all" },
    onError: (message) => addToast(message, "error"),
  });

  const statusFilter = filters.status || "all";

  // Option lists for the extra filter dropdowns (small reference data).
  const accessTokenRef = accessToken as string;
  const { options: customerOptions } = useFilterOptions(
    accessTokenRef ? "/api/customers/list?page=1&per_page=500" : null,
    (row) => (row?.id != null && row?.name ? { value: String(row.id), label: row.name } : null),
    { accessToken: accessTokenRef }
  );
  const customerIdFilter = filters.customer_id || "all";
  const hasExtraFilters = searchInput || statusFilter !== "all" || customerIdFilter !== "all";

  const formatCurrency = (value: number, currency: string) => {
    if (Number.isNaN(value)) return "-";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-success-50 text-success-500";
      case "sent":
        return "bg-info-50 text-info-500";
      case "draft":
        return "bg-warning-50 text-warning-500";
      case "rejected":
        return "bg-danger-50 text-danger-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Orders</h5>
        </div>

        <div className="flex items-center gap-[15px] w-full md:w-auto flex-wrap md:flex-nowrap">
          {(hasExtraFilters) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-[4px] h-[36px] px-[10px] text-xs rounded-md border border-gray-50 dark:border-[#15203c] text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 whitespace-nowrap"
              title="Clear all filters"
            >
              <i className="material-symbols-outlined !text-[16px]">filter_alt_off</i>
              Clear
            </button>
          )}
          <select
            value={statusFilter}
            onChange={(e) => setFilter("status", e.target.value)}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="revised">Revised</option>
          </select>

          {/* Customer Filter */}
          <FilterSelect
            value={customerIdFilter}
            options={customerOptions}
            placeholder="All Customers"
            onChange={(value) => setFilter("customer_id", value)}
          />

          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
            />
          </div>
          <Can any={["ROLE_ADD_ORDER"]}>
            <Link
              href="/orders/create-order"
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white whitespace-nowrap"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Order
              </span>
            </Link>
          </Can>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        {loading ? (
          <div className="p-[20px] md:p-[25px]">
            <div className="space-y-[10px]">
              {[...Array(5)].map((_, idx) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Date
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Order #
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      BOL Number
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Customer
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Consignee
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      <span style={{ minWidth: 200, display: 'inline-block' }}>Title</span>
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Sub Total
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Tax
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Total
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Created By
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {!loading && error && (
                    <tr>
                      <td
                        colSpan={12}
                        className="text-center px-[20px] py-[40px] text-danger-500"
                      >
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && orders.length > 0 ? (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <Link
                            href={`/orders/${order.id}`}
                            className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {order.bol_number || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {order.customer?.name || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap text-sm">
                          {order.project_owner?.name || "-"}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                            style={{
                              whiteSpace: 'nowrap',
                              minWidth: 200,
                              display: 'inline-block',
                              maxWidth: '100%',
                              overflow: 'visible',
                            }}
                          >
                            {order.title}
                          </Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <span className="font-semibold">
                            {formatCurrency(order.subtotal_amount, order.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <span className="font-semibold">
                            {formatCurrency(order.tax_amount, order.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <span className="font-semibold text-primary-500">
                            {formatCurrency(order.total_amount, order.currency)}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <span
                            className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          {[
                            order.created_by_user?.first_name,
                            order.created_by_user?.middle_name,
                            order.created_by_user?.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[12px] py-[8px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link
                              href={`/orders/${order.id}`}
                              className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                              title="View Details"
                            >
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={12}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        {hasExtraFilters
                          ? "No orders match your criteria"
                          : "No orders found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!loading && !error && (
              <PaginationFooter
                meta={meta}
                page={page}
                perPage={perPage}
                loading={loading}
                onPageChange={setPage}
                onPerPageChange={changePerPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OrdersTable;
