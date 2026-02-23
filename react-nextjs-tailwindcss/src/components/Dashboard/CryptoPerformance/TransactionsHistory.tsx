"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

interface Transaction {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  type: "Sold" | "Withdraw" | "Deposit" | "Buy";
  amount: string;
}

const TransactionsHistory: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Sample transaction data
  const allTransactions: Transaction[] = [
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "/images/cryptocurrencies/bitcoin.svg",
      type: "Sold",
      amount: "$68848.92",
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      icon: "/images/cryptocurrencies/ethereum.svg",
      type: "Withdraw",
      amount: "$2565.77",
    },
    {
      id: "3",
      name: "Binance",
      symbol: "BNB",
      icon: "/images/cryptocurrencies/binance.svg",
      type: "Sold",
      amount: "$2565.77",
    },
    {
      id: "4",
      name: "Tether",
      symbol: "USDT",
      icon: "/images/cryptocurrencies/tether.svg",
      type: "Sold",
      amount: "$1.00",
    },
    {
      id: "5",
      name: "XRP",
      symbol: "XRP",
      icon: "/images/cryptocurrencies/xrp.svg",
      type: "Withdraw",
      amount: "$0.529105",
    },
    {
      id: "6",
      name: "Tether",
      symbol: "USDT",
      icon: "/images/cryptocurrencies/tether.svg",
      type: "Sold",
      amount: "$1.00",
    },
    {
      id: "7",
      name: "XRP",
      symbol: "XRP",
      icon: "/images/cryptocurrencies/xrp.svg",
      type: "Withdraw",
      amount: "$0.529105",
    },
    {
      id: "8",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "/images/cryptocurrencies/bitcoin.svg",
      type: "Sold",
      amount: "$68848.92",
    },
    {
      id: "9",
      name: "Ethereum",
      symbol: "ETH",
      icon: "/images/cryptocurrencies/ethereum.svg",
      type: "Withdraw",
      amount: "$2565.77",
    },
    {
      id: "10",
      name: "Binance",
      symbol: "BNB",
      icon: "/images/cryptocurrencies/binance.svg",
      type: "Sold",
      amount: "$2565.77",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = allTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Get badge style based on transaction type
  const getBadgeStyle = (type: Transaction["type"]) => {
    switch (type) {
      case "Sold":
      case "Buy":
        return "bg-success-100 dark:bg-[#15203c] text-success-600";
      case "Withdraw":
        return "bg-danger-100 dark:bg-[#15203c] text-danger-600";
      case "Deposit":
        return "bg-info-100 dark:bg-[#15203c] text-info-600";
      default:
        return "bg-gray-100 dark:bg-[#15203c] text-gray-600";
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Transactions History</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
              <i className="ri-more-fill"></i>
            </MenuButton>

            <MenuItems className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
              {["This Day", "This Week", "This Month", "This Year"].map(
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
            <tbody className="text-black dark:text-white">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="text-[13px] ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11.8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center">
                      <div className="w-[22px]">
                        <Image
                          width={22}
                          height={22}
                          alt={`${transaction.name} icon`}
                          src={transaction.icon}
                        />
                      </div>
                      <span className="block font-medium ltr:ml-[8px] rtl:mr-[8px]">
                        {transaction.name}{" "}
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                          ({transaction.symbol})
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="text-center whitespace-nowrap px-[20px] py-[11.8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                    <span
                      className={`inline-block py-[2px] px-[8px] rounded-[4px] text-xs font-medium ${getBadgeStyle(
                        transaction.type
                      )}`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="text-[13px] ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[11.8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-[20px] md:px-[25px] pt-[12px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 text-sm">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, allTransactions.length)} of{" "}
            {allTransactions.length} results
          </p>

          <ol className="mt-[10px] sm:mt-0">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current disabled:hover:border-gray-100"
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
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === number
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036]"
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
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current disabled:hover:border-gray-100"
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

export default TransactionsHistory;
