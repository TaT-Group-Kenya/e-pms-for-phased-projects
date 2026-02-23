"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Sample data for orders
const initialOrdersData = [
  {
    id: "OR045",
    customerName: "Mark Blake",
    orderDate: "30 Apr 2024",
    currentLocation: "Chicago, IL",
    trackingNumber: "TRK001",
    status: "Delivered",
  },
  {
    id: "OR046",
    customerName: "Cheryl Myers",
    orderDate: "29 Apr 2024",
    currentLocation: "London, UK",
    trackingNumber: "TRK002",
    status: "In Transit",
  },
  {
    id: "OR047",
    customerName: "Marc Bradley",
    orderDate: "28 Apr 2024",
    currentLocation: "Paris, France",
    trackingNumber: "TRK003",
    status: "On The Way",
  },
  {
    id: "OR048",
    customerName: "Ryan Vasquez",
    orderDate: "N/A",
    currentLocation: "N/A",
    trackingNumber: "N/A",
    status: "Canceled",
  },
  {
    id: "OR049",
    customerName: "Donald Ness",
    orderDate: "26 Apr 2024",
    currentLocation: "Tokyo, Japan",
    trackingNumber: "TRK004",
    status: "Pending",
  },
  {
    id: "OR050",
    customerName: "Marc Bradley",
    orderDate: "28 Apr 2024",
    currentLocation: "Paris, France",
    trackingNumber: "TRK003",
    status: "On The Way",
  },
  {
    id: "OR051",
    customerName: "Mark Blake",
    orderDate: "30 Apr 2024",
    currentLocation: "Chicago, IL",
    trackingNumber: "TRK001",
    status: "Delivered",
  },
  {
    id: "OR052",
    customerName: "Ryan Vasquez",
    orderDate: "N/A",
    currentLocation: "N/A",
    trackingNumber: "N/A",
    status: "Canceled",
  },
  {
    id: "OR053",
    customerName: "Cheryl Myers",
    orderDate: "29 Apr 2024",
    currentLocation: "London, UK",
    trackingNumber: "TRK002",
    status: "In Transit",
  },
  {
    id: "OR054",
    customerName: "Donald Ness",
    orderDate: "26 Apr 2024",
    currentLocation: "Tokyo, Japan",
    trackingNumber: "TRK004",
    status: "Pending",
  },
];

const ITEMS_PER_PAGE = 5; // Number of orders per page

const TrackingOrder: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Last 30 Days");
  const [orders, setOrders] = useState(initialOrdersData);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Handle row deletion
  const handleDelete = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Tracking Order</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Last 7 Days", "Last 15 Days", "Last 30 Days"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Order ID
                  </th>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Customer Name
                  </th>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Order Date
                  </th>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Current Location
                  </th>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Tracking Number
                  </th>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-normal ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[12px]">
                        <div className="form-check relative top-[1.5px]">
                          <input type="checkbox" className="cursor-pointer" />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">
                          #{order.id}
                        </span>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {order.customerName}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {order.orderDate}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {order.currentLocation}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {order.trackingNumber}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${
                          order.status === "Delivered"
                            ? "bg-success-50 dark:bg-[#15203c] text-success-600"
                            : order.status === "In Transit"
                            ? "bg-secondary-50 dark:bg-[#15203c] text-secondary-600"
                            : order.status === "On The Way"
                            ? "bg-orange-50 dark:bg-[#15203c] text-orange-600"
                            : order.status === "Canceled"
                            ? "bg-danger-50 dark:bg-[#15203c] text-danger-600"
                            : "bg-warning-50 dark:bg-[#15203c] text-warning-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <button
                          type="button"
                          className="text-danger-500 leading-none custom-tooltip"
                          onClick={() => handleDelete(order.id)}
                        >
                          <i className="material-symbols-outlined !text-md">
                            delete
                          </i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, orders.length)} of{" "}
              {orders.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
      </div>
    </>
  );
};

export default TrackingOrder;
