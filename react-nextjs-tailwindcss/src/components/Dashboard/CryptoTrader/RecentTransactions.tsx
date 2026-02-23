"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Define the Transaction interface
interface Transaction {
  date: string;
  asset: string;
  type: string;
  amount: string;
  price: string;
  totalValue: string;
  status: string;
}

// Mock data (replace with actual API call)
const mockTransactions = [
  {
    date: "2025-10-31",
    asset: "Bitcoin",
    type: "Buy",
    amount: "0.5 BTC",
    price: "$34,000",
    totalValue: "$17,000",
    status: "Done",
  },
  {
    date: "2025-10-30",
    asset: "Ethereum",
    type: "Sell",
    amount: "2 ETH",
    price: "$1,800",
    totalValue: "$3,600",
    status: "Done",
  },
  {
    date: "2025-10-29",
    asset: "Tether",
    type: "Buy",
    amount: "$1.00",
    price: "$175",
    totalValue: "$1,750",
    status: "Failed",
  },
  {
    date: "2025-10-28",
    asset: "USD Coin",
    type: "Sell",
    amount: "$0.9999",
    price: "$230",
    totalValue: "$1,150",
    status: "Done",
  },
  {
    date: "2025-10-27",
    asset: "Cardano",
    type: "Buy",
    amount: "5000 ADA",
    price: "$0.07",
    totalValue: "$350",
    status: "Pending",
  },
  {
    date: "2025-10-26",
    asset: "Tron",
    type: "Buy",
    amount: "142 TRX",
    price: "$0.192391",
    totalValue: "$350",
    status: "Failed",
  },
  {
    date: "2025-10-25",
    asset: "Solana",
    type: "Sell",
    amount: "10 SOL",
    price: "$35",
    totalValue: "$350",
    status: "Done",
  },
  {
    date: "2025-10-24",
    asset: "Polkadot",
    type: "Buy",
    amount: "100 DOT",
    price: "$5.5",
    totalValue: "$550",
    status: "Pending",
  },
  {
    date: "2025-10-23",
    asset: "Litecoin",
    type: "Sell",
    amount: "4 LTC",
    price: "$70",
    totalValue: "$280",
    status: "Done",
  },
  {
    date: "2025-10-22",
    asset: "Ripple",
    type: "Buy",
    amount: "1000 XRP",
    price: "$0.6",
    totalValue: "$600",
    status: "Done",
  },
  {
    date: "2025-10-21",
    asset: "Avalanche",
    type: "Buy",
    amount: "25 AVAX",
    price: "$10",
    totalValue: "$250",
    status: "Failed",
  },
  {
    date: "2025-10-20",
    asset: "Shiba Inu",
    type: "Sell",
    amount: "1,000,000 SHIB",
    price: "$0.00001",
    totalValue: "$10",
    status: "Pending",
  },
];

const RecentTransactions: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 30 Days");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Transactions state with updated type
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTransactions(mockTransactions);
        setTotalItems(mockTransactions.length);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate the transactions to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const statusStyles: { [key: string]: string } = {
      Done: "bg-success-100 dark:bg-[#15203c] text-success-600",
      Failed: "bg-danger-100 dark:bg-[#15203c] text-danger-600",
      Pending: "bg-warning-50 dark:bg-[#15203c] text-warning-700",
    };

    return (
      <span
        className={`inline-block py-[4px] px-[8px] rounded-[4px] text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  // Render type badge
  const renderTypeBadge = (type: string) => {
    const typeStyles: { [key: string]: string } = {
      Buy: "bg-success-100 dark:bg-[#15203c] text-success-600",
      Sell: "bg-danger-100 dark:bg-[#15203c] text-danger-600",
    };

    return (
      <span
        className={`inline-block py-[4px] px-[8px] rounded-[4px] text-xs font-medium ${
          typeStyles[type] || "bg-gray-100 text-gray-600"
        }`}
      >
        {type}
      </span>
    );
  };

  return (
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
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Date
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Asset
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Type
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Amount
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Price
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Total Value
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.date}
                    </td>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.asset}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {renderTypeBadge(transaction.type)}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.amount}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.price}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.totalValue}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {renderStatusBadge(transaction.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-[15px]">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-[20px] md:px-[25px] pt-[14px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 text-sm">
            Showing {currentTransactions.length} of {totalItems} results
          </p>

          <ol className="mt-[10px] sm:mt-0">
            <li className="inline-block mx-[2px]">
              <button
                type="button"
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className="inline-block mx-[2px]">
                <button
                  type="button"
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                    currentPage === page
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  } transition-all`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className="inline-block mx-[2px]">
              <button
                type="button"
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default RecentTransactions;
