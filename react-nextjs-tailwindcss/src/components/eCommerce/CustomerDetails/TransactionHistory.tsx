"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const customersData = [
  {
    orderId: "#JAN-121",
    status: "Pending",
    amount: "$6,855.00",
    rewards: "$12.00",
    date: "14 Jan 2024",
  },
  {
    orderId: "#JAN-120",
    status: "Successful",
    amount: "$258.00",
    rewards: "$9.00",
    date: "13 Jan 2024",
  },
  {
    orderId: "#JAN-119",
    status: "Rejected",
    amount: "$3,890.00",
    rewards: "$11.00",
    date: "12 Jan 2024",
  },
  {
    orderId: "#JAN-118",
    status: "Successful",
    amount: "$2,500.00",
    rewards: "$23.42",
    date: "11 Jan 2024",
  },
  {
    orderId: "#JAN-117",
    status: "Successful",
    amount: "$8,200.00",
    rewards: "$10.84",
    date: "10 Jan 2024",
  },
  {
    orderId: "#JAN-116",
    status: "Rejected",
    amount: "$640.00",
    rewards: "$3.21",
    date: "09 Jan 2024",
  },
  {
    orderId: "#JAN-115",
    status: "Successful",
    amount: "$9,100.00",
    rewards: "$43.21",
    date: "08 Jan 2024",
  },
  {
    orderId: "#JAN-114",
    status: "Pending",
    amount: "$500.00",
    rewards: "$2.00",
    date: "07 Jan 2024",
  },
  {
    orderId: "#JAN-117",
    status: "Successful",
    amount: "$8,200.00",
    rewards: "$10.84",
    date: "10 Jan 2024",
  },
  {
    orderId: "#JAN-116",
    status: "Rejected",
    amount: "$640.00",
    rewards: "$3.21",
    date: "09 Jan 2024",
  },
  {
    orderId: "#JAN-115",
    status: "Successful",
    amount: "$9,100.00",
    rewards: "$43.21",
    date: "08 Jan 2024",
  },
  {
    orderId: "#JAN-114",
    status: "Pending",
    amount: "$500.00",
    rewards: "$2.00",
    date: "07 Jan 2024",
  },
  {
    orderId: "#JAN-121",
    status: "Pending",
    amount: "$6,855.00",
    rewards: "$12.00",
    date: "14 Jan 2024",
  },
  {
    orderId: "#JAN-120",
    status: "Successful",
    amount: "$258.00",
    rewards: "$9.00",
    date: "13 Jan 2024",
  },
  {
    orderId: "#JAN-119",
    status: "Rejected",
    amount: "$3,890.00",
    rewards: "$11.00",
    date: "12 Jan 2024",
  },
  {
    orderId: "#JAN-118",
    status: "Successful",
    amount: "$2,500.00",
    rewards: "$23.42",
    date: "11 Jan 2024",
  },
];

const TransactionHistory: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(customersData.length / perPage);

  const indexOfLastTransaction = currentPage * perPage;
  const indexOfFirstTransaction = indexOfLastTransaction - perPage;
  const currentTransactions = customersData.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePaginationClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Transaction History</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Last Day", "Last Week", "Last Month", "Last Year"].map(
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

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Order ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Amount
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Rewards
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {transaction.orderId}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          transaction.status === "Pending"
                            ? "bg-warning-50 dark:bg-[#15203c] text-warning-500"
                            : transaction.status === "Successful"
                            ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                            : "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {transaction.amount}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {transaction.rewards}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {transaction.date}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {indexOfFirstTransaction + 1} to {indexOfLastTransaction}{" "}
              of {customersData.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handlePrevClick}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePaginationClick(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handleNextClick}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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

export default TransactionHistory;
