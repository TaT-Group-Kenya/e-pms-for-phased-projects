"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

type TopCustomer = {
  customer_id: number;
  name: string;
  email: string | null;
  total_revenue: number;
};

const TeamMembers: React.FC = () => {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(false);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();
  const { range } = useDashboardFilters();

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchTopCustomers = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "/api/dashboard/top-customers-by-revenue",
          window.location.origin
        );
        url.searchParams.set("range", range);
        url.searchParams.set("limit", "5");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!response.ok) {
          addToast("Failed to load top customers", "error");
          setCustomers([]);
          return;
        }

        const body = await response.json();
        const payload: TopCustomer[] = (body?.data ?? body) || [];
        setCustomers(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading top customers", error);
        addToast("Error loading top customers", "error");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchTopCustomers();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Customers by Revenue</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px] flex-1 overflow-y-auto">
          <div className="table-responsive overflow-x-auto without-border">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Email
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Total Revenue (KES)
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {customers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="font-medium inline-block">
                        {customer.name}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.email || "-"}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        KES {customer.total_revenue.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center px-[20px] py-[15px] text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#172036]"
                    >
                      No customers found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Loading top customers...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamMembers;
