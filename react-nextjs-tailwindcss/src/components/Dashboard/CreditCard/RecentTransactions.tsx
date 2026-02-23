"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: string;
  status: "completed" | "pending" | "cancelled" | "rejected";
}

const RecentTransactions: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 30 Days");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Sample transaction data
  const allTransactions: Transaction[] = [
    {
      id: 1,
      date: "30 Apr 2025",
      description: "Starbucks Coffee",
      category: "Dining",
      amount: "$500,000",
      status: "completed",
    },
    {
      id: 2,
      date: "29 Apr 2025",
      description: "Whole Foods",
      category: "Groceries",
      amount: "$90.50",
      status: "pending",
    },
    {
      id: 3,
      date: "28 Apr 2025",
      description: "Gas Station",
      category: "Transportation",
      amount: "$15.00",
      status: "cancelled",
    },
    {
      id: 4,
      date: "27 Apr 2025",
      description: "Electric Bill",
      category: "Utilities",
      amount: "$150.00",
      status: "completed",
    },
    {
      id: 5,
      date: "26 Apr 2025",
      description: "Spotify Subscription",
      category: "Entertainment",
      amount: "$10.00",
      status: "rejected",
    },
    {
      id: 6,
      date: "25 Apr 2025",
      description: "Football Ticket",
      category: "Sports",
      amount: "$99.99",
      status: "completed",
    },
    {
      id: 7,
      date: "24 Apr 2025",
      description: "Amazon Purchase",
      category: "Shopping",
      amount: "$75.25",
      status: "completed",
    },
    {
      id: 8,
      date: "23 Apr 2025",
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: "$14.99",
      status: "completed",
    },
    {
      id: 9,
      date: "22 Apr 2025",
      description: "Dinner with Friends",
      category: "Dining",
      amount: "$85.00",
      status: "completed",
    },
    {
      id: 10,
      date: "21 Apr 2025",
      description: "Car Insurance",
      category: "Insurance",
      amount: "$120.00",
      status: "pending",
    },
    {
      id: 11,
      date: "20 Apr 2025",
      description: "Gym Membership",
      category: "Health",
      amount: "$45.00",
      status: "completed",
    },
    {
      id: 12,
      date: "19 Apr 2025",
      description: "Phone Bill",
      category: "Utilities",
      amount: "$65.50",
      status: "completed",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination data
  const totalItems = allTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTransactions = allTransactions.slice(startIndex, endIndex);

  // Status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success-600 border-success-500 bg-success-100";
      case "pending":
        return "text-info-600 border-info-500 bg-info-50";
      case "cancelled":
        return "text-orange-600 border-orange-500 bg-orange-100";
      case "rejected":
        return "text-danger-600 border-danger-500 bg-danger-100";
      default:
        return "text-gray-600 border-gray-500 bg-gray-100";
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Transactions</h5>
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
                {["Last 7 Days", "Last 15 Days", "Last 30 Days"].map((option) => (
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Description
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Category
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Amount ($)
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18.7px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.date}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18.7px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.description}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18.7px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      Dining
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18.7px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.category}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18.7px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`inline-block text-xs font-medium py-px px-[10px] capitalize border dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] ${getStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[18.7px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <button
                          type="button"
                          className="text-primary-500 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>
                        <button
                          type="button"
                          className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            edit
                          </i>
                        </button>
                        <button
                          type="button"
                          className="text-danger-500 leading-none custom-tooltip"
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

          <div className="px-[20px] md:px-[25px] pt-[15px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              Showing {startIndex + 1} to {endIndex} of {totalItems} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-100 hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  >
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                        currentPage === page
                          ? "border border-primary-500 bg-primary-500 text-white"
                          : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-100 hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
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

export default RecentTransactions;
