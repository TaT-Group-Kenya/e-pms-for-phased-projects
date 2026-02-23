"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type Order = {
  id: string;
  customerName: string;
  customerImage: string;
  created: string;
  total: string;
  status: string;
  statusClass: string; // For styling the status (e.g., "bg-success-100 text-success-600")
};

const orders: Order[] = [
  {
    id: "#JAN-2345",
    customerName: "Sarah Johnson",
    customerImage: "/images/users/user1.jpg",
    created: "12 Jun 2024",
    total: "$10,490",
    status: "Shipped",
    statusClass: "bg-success-100 text-success-600",
  },
  {
    id: "#JAN-2346",
    customerName: "Michael Smith",
    customerImage: "/images/users/user2.jpg",
    created: "11 Jun 2024",
    total: "$6,575",
    status: "Confirmed",
    statusClass: "bg-primary-50 text-primary-500",
  },
  {
    id: "#DEC-2347",
    customerName: "Emily Brown",
    customerImage: "/images/users/user3.jpg",
    created: "10 Jun 2024",
    total: "$12,870",
    status: "Pending",
    statusClass: "bg-warning-50 text-warning-500",
  },
  {
    id: "#DEC-2348",
    customerName: "Jason Lee",
    customerImage: "/images/users/user4.jpg",
    created: "09 Jun 2024",
    total: "$7,895",
    status: "Shipped",
    statusClass: "bg-success-100 text-success-600",
  },
  {
    id: "#DEC-2349",
    customerName: "Ashley Davis",
    customerImage: "/images/users/user5.jpg",
    created: "08 Jun 2024",
    total: "$4,680",
    status: "Rejected",
    statusClass: "bg-danger-100 text-danger-500",
  },
  {
    id: "#DEC-2354",
    customerName: "Ashley Davis",
    customerImage: "/images/users/user66.jpg",
    created: "08 Jun 2024",
    total: "$4,680",
    status: "Rejected",
    statusClass: "bg-danger-100 text-danger-500",
  },
  {
    id: "#DEC-2352",
    customerName: "Emily Brown",
    customerImage: "/images/users/user64.jpg",
    created: "10 Jun 2024",
    total: "$12,870",
    status: "Pending",
    statusClass: "bg-warning-50 text-warning-500",
  },
  {
    id: "#JAN-2350",
    customerName: "Sarah Johnson",
    customerImage: "/images/users/user62.jpg",
    created: "12 Jun 2024",
    total: "$10,490",
    status: "Shipped",
    statusClass: "bg-success-100 text-success-600",
  },
  {
    id: "#JAN-2351",
    customerName: "Michael Smith",
    customerImage: "/images/users/user63.jpg",
    created: "11 Jun 2024",
    total: "$6,575",
    status: "Confirmed",
    statusClass: "bg-primary-50 text-primary-500",
  },
  {
    id: "#DEC-2353",
    customerName: "Jason Lee",
    customerImage: "/images/users/user65.jpg",
    created: "09 Jun 2024",
    total: "$7,895",
    status: "Shipped",
    statusClass: "bg-success-100 text-success-600",
  },
];

const ITEMS_PER_PAGE = 5;

const RecentOrders: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Show All");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex sm:items-center sm:justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Orders</h5>
          </div>

          <div className="trezo-card-subtitle sm:flex sm:items-center">
            <form className="relative sm:w-[240px] ltr:sm:mr-[20px] rtl:sm:ml-[20px] my-[13px] sm:my-0">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search here....."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>

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
                  className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {[
                    "Show All",
                    "This Day",
                    "This Week",
                    "This Month",
                    "This Year",
                  ].map((option) => (
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
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Order ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Customer
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Created
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Total
                  </th>
                  <th className="font-medium text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tr-md">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {displayedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.id}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="rounded-md w-[40px]">
                          <Image
                            src={order.customerImage}
                            className="inline-block rounded-md"
                            alt={`${order.customerName} image`}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {order.customerName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      {order.created}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      {order.total}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${order.statusClass}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
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
      </div>
    </>
  );
};

export default RecentOrders;
