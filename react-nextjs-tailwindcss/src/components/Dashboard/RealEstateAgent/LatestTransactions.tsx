"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type Transaction = {
  id: number;
  client: string;
  avatar: string;
  email: string;
  amount: string;
  paymentMethod: {
    name: string;
    icon: string;
  };
  status: "completed" | "pending" | "failed";
};

const LatestTransactions: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Sample transaction data
  const transactionsData: Transaction[] = [
    {
      id: 1,
      client: "Johhna Loren",
      avatar: "/images/users/user58.jpg",
      email: "loren123@gmail.com",
      amount: "$6240",
      paymentMethod: {
        name: "Paypal",
        icon: "/images/payment-method/paypal.svg",
      },
      status: "completed",
    },
    {
      id: 2,
      client: "Skyler Queen",
      avatar: "/images/users/user53.jpg",
      email: "skyqueen@gmail.com",
      amount: "$5135",
      paymentMethod: {
        name: "Wise",
        icon: "/images/payment-method/wise.svg",
      },
      status: "pending",
    },
    {
      id: 3,
      client: "Jonathon Watson",
      avatar: "/images/users/user55.jpg",
      email: "jona2134@gmail.com",
      amount: "$4321",
      paymentMethod: {
        name: "Bank",
        icon: "/images/payment-method/bank.svg",
      },
      status: "failed",
    },
    {
      id: 4,
      client: "Walter White",
      avatar: "/images/users/user54.jpg",
      email: "puzzleworld@gmail.com",
      amount: "$3124",
      paymentMethod: {
        name: "Paypal",
        icon: "/images/payment-method/paypal.svg",
      },
      status: "completed",
    },
    {
      id: 5,
      client: "Saul Goodman",
      avatar: "/images/users/user57.jpg",
      email: "bettercallsaul@gmail.com",
      amount: "$1987",
      paymentMethod: {
        name: "Bank",
        icon: "/images/payment-method/bank.svg",
      },
      status: "completed",
    },
    {
      id: 6,
      client: "Jonathon Watson",
      avatar: "/images/users/user55.jpg",
      email: "jona2134@gmail.com",
      amount: "$4321",
      paymentMethod: {
        name: "Bank",
        icon: "/images/payment-method/bank.svg",
      },
      status: "failed",
    },
    {
      id: 7,
      client: "Johhna Loren",
      avatar: "/images/users/user58.jpg",
      email: "loren123@gmail.com",
      amount: "$6240",
      paymentMethod: {
        name: "Paypal",
        icon: "/images/payment-method/paypal.svg",
      },
      status: "completed",
    },
    {
      id: 8,
      client: "Saul Goodman",
      avatar: "/images/users/user57.jpg",
      email: "bettercallsaul@gmail.com",
      amount: "$1987",
      paymentMethod: {
        name: "Bank",
        icon: "/images/payment-method/bank.svg",
      },
      status: "completed",
    },
    {
      id: 9,
      client: "Skyler Queen",
      avatar: "/images/users/user53.jpg",
      email: "skyqueen@gmail.com",
      amount: "$5135",
      paymentMethod: {
        name: "Wise",
        icon: "/images/payment-method/wise.svg",
      },
      status: "pending",
    },
    {
      id: 10,
      client: "Walter White",
      avatar: "/images/users/user54.jpg",
      email: "puzzleworld@gmail.com",
      amount: "$3124",
      paymentMethod: {
        name: "Paypal",
        icon: "/images/payment-method/paypal.svg",
      },
      status: "completed",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = transactionsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current transactions
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactionsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Status badge styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success-600 border border-success-500 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c]";
      case "pending":
        return "text-info-600 border border-info-500 bg-info-50 dark:bg-[#15203c] dark:border-[#15203c]";
      case "failed":
        return "text-danger-600 border border-danger-500 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c]";
      default:
        return "text-gray-600 border border-gray-500 bg-gray-100 dark:bg-[#15203c] dark:border-[#15203c]";
    }
  };

  // Capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Latest Transactions</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-[#F5F7F8] bg-[#F5F7F8] dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
              <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                {selectedOption}
                <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
              </span>
            </MenuButton>

            <MenuItems
              transition
              className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {["Weekly", "Monthly", "Yearly"].map((option) => (
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

      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Client
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Email
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Amount
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Payment Method
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[32px]">
                        <Image
                          src={transaction.avatar}
                          className="inline-block rounded-full"
                          alt="user-image"
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="font-semibold inline-block">
                        {transaction.client}
                      </span>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {transaction.email}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <span className="block text-xs font-semibold">
                      {transaction.amount}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <div className="flex items-center gap-[8px] text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <Image
                        src={transaction.paymentMethod.icon}
                        alt={transaction.paymentMethod.name}
                        width={24}
                        height={24}
                      />
                      {transaction.paymentMethod.name}
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <span
                      className={`inline-block text-xs font-medium py-px px-[10px] ${getStatusStyles(
                        transaction.status
                      )} rounded-[100px]`}
                    >
                      {capitalizeFirstLetter(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-[13px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 text-xs">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
          </p>

          <ol className="mt-[10px] sm:mt-0 flex items-center">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === 1
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <li
                  key={number}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    type="button"
                    onClick={() => paginate(number)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                      currentPage === number
                        ? "border border-primary-500 bg-primary-500 text-white"
                        : "border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {number}
                  </button>
                </li>
              )
            )}

            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === totalPages
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
  );
};

export default LatestTransactions;
