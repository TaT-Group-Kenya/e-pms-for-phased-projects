"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../common/Toast";
import Can from "../../auth/Can";

interface OrderSummary {
  id: number;
  order_number: string;
  job_reference_id?: string;
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

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const OrdersTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const { toasts, addToast, removeToast } = useToast();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const perPage = 15;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("per_page", String(perPage));

        const resp = await fetch(`/api/orders/list?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        const data: PaginatedResponse<OrderSummary> | any = await resp.json();

        if (!resp.ok) {
          addToast(data?.message || "Failed to load orders", "error");
          setOrders([]);
          setTotalPages(1);
          setTotalCount(0);
          return;
        }

        if (Array.isArray(data?.data)) {
          setOrders(data.data as OrderSummary[]);
          setTotalPages(data.last_page || 1);
          setTotalCount(data.total || (data.data as OrderSummary[]).length || 0);
        } else if (Array.isArray(data)) {
          setOrders(data as OrderSummary[]);
          setTotalPages(1);
          setTotalCount((data as OrderSummary[]).length || 0);
        } else {
          setOrders([]);
          setTotalPages(1);
          setTotalCount(0);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.error("fetch orders error", err);
        addToast("Error loading orders. Please try again.", "error");
        setOrders([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, [accessToken, page, perPage, addToast]);

  const handlePageClick = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      setPage(targetPage);
    }
  };

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

  const filteredOrders = orders.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      order.order_number.toLowerCase().includes(lowerSearch) ||
      (order.job_reference_id || "").toLowerCase().includes(lowerSearch) ||
      (order.customer?.name || "").toLowerCase().includes(lowerSearch) ||
      (order.project_owner?.name || "").toLowerCase().includes(lowerSearch) ||
      order.title.toLowerCase().includes(lowerSearch) ||
      order.status.toLowerCase().includes(lowerSearch);

    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const indexOfFirstOrder = (page - 1) * perPage + 1;
  const indexOfLastOrder = Math.min(page * perPage, totalCount);

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0">All Orders</h5>
        </div>

        <div className="flex items-center gap-[15px] w-full md:w-auto flex-wrap md:flex-nowrap">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="revised">Revised</option>
          </select>

          <div className="relative flex-1 md:flex-none md:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
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
                      Job Ref
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Customer
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[12px] py-[8px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Project Owner
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
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
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
                          {order.job_reference_id || "-"}
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
                        {searchTerm || statusFilter !== "all"
                          ? "No orders match your criteria"
                          : "No orders found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-[20px] py-[12px] md:py-[14px] border-t border-gray-100 dark:border-[#172036] flex items-center justify-between flex-wrap gap-[10px]">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstOrder} to {indexOfLastOrder} of {totalCount} results
                </p>
                <div className="flex gap-[5px]">
                  <button
                    type="button"
                    onClick={() => handlePageClick(page - 1)}
                    disabled={page === 1}
                    className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="material-symbols-outlined">chevron_left</i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      type="button"
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      onClick={() => handlePageClick(i + 1)}
                      className={`w-[31px] h-[31px] flex items-center justify-center rounded-md border transition-all ${
                        page === i + 1
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handlePageClick(page + 1)}
                    disabled={page === totalPages}
                    className="w-[31px] h-[31px] flex items-center justify-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="material-symbols-outlined">chevron_right</i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OrdersTable;
