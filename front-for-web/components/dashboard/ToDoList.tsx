"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

type RecentOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  project_name: string | null;
  total_amount: number;
  currency: string;
  status: string;
  statusClass: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 5;

const mapStatusToClass = (status: string): string => {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel") || normalized.includes("reject")) {
    return "bg-danger-50 text-danger-500";
  }
  if (normalized.includes("pending")) {
    return "bg-warning-50 text-warning-500";
  }
  if (normalized.includes("progress") || normalized.includes("active")) {
    return "bg-success-50 text-success-500";
  }
  return "bg-primary-50 text-primary-500";
};

const ToDoList: React.FC = () => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();
  const { range } = useDashboardFilters();

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "/api/dashboard/recent-orders",
          window.location.origin
        );
        url.searchParams.set("range", range);
        url.searchParams.set("limit", "10");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!response.ok) {
          addToast("Failed to load recent orders", "error");
          setOrders([]);
          return;
        }

        const body = await response.json();
        const payload = ((body?.data ?? body) || []) as Array<{
          id: number;
          order_number: string;
          customer_name: string;
          project_name: string | null;
          total_amount: number;
          currency: string;
          status: string;
          created_at: string;
        }>;

        const mapped: RecentOrder[] = Array.isArray(payload)
          ? payload.map((order) => ({
              ...order,
              statusClass: mapStatusToClass(order.status ?? ""),
            }))
          : [];

        setOrders(mapped);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading recent orders", error);
        addToast("Error loading recent orders", "error");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      (order.project_name || "").toLowerCase().includes(query)
    );
  });

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Orders</h5>
          </div>

          <div className="sm:flex items-center gap-3">
            <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
              <form className="relative sm:w-[265px]">
                <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                  <i className="material-symbols-outlined !text-[20px]">
                    search
                  </i>
                </label>
                <input
                  type="text"
                  placeholder="Search here....."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                />
              </form>
            </div>
            <div className="mt-[15px] sm:mt-0">
              <Menu as="div" className="trezo-card-dropdown relative">
                <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                  <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                    Global Filter
                    <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                  </span>
                </MenuButton>

                <MenuItems
                  transition
                  className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem
                    as="div"
                    className="block w-full transition-all text-gray-500 cursor-default ltr:text-left rtl:text-right relative py-[8px] px-[20px]"
                  >
                    Uses global dashboard filter
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px] flex-1 overflow-y-auto">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Order #
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Customer
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Project
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Amount
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Created At
                  </th>
                </tr>
              </thead>
              
              <tbody className="text-black dark:text-white">
                {displayedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {order.order_number}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="block font-medium text-gray-500 dark:text-gray-400">
                        {order.customer_name}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {order.project_name || "-"}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {order.currency} {order.total_amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${order.statusClass}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {order.created_at}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center px-[20px] py-[15px] text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#172036]"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {displayedOrders.length} of {orders.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 space-x-1">
              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li className="inline-block" key={index}>
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
        {loading && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Loading recent orders...
          </p>
        )}
      </div>
    </>
  );
};

export default ToDoList;
