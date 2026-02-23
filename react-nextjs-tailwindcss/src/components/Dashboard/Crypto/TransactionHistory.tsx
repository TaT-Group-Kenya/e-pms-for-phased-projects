"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

interface Transaction {
  id: number;
  coin: string;
  symbol: string;
  icon: string;
  date: string;
  amount: string;
  price: string;
  type: "Buy" | "Sell";
  totalValue: string;
}

const TransactionHistory: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>(
    "Oct 01 - Oct 31, 2024"
  );

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    // Simulate fetching data
    const fetchTransactions = () => {
      const data: Transaction[] = [
        {
          id: 1,
          coin: "Bitcoin",
          symbol: "BTC",
          icon: "/images/cryptocurrencies/bitcoin.svg",
          date: "2024-09-10",
          amount: "0.50 BTC",
          price: "$27,500",
          type: "Buy",
          totalValue: "$13,500",
        },
        {
          id: 2,
          coin: "Ethereum",
          symbol: "ETH",
          icon: "/images/cryptocurrencies/ethereum.svg",
          date: "2024-09-08",
          amount: "5.00 ETH",
          price: "$1,750",
          type: "Sell",
          totalValue: "$8,750",
        },
        {
          id: 3,
          coin: "Binance",
          symbol: "BNB",
          icon: "/images/cryptocurrencies/binance.svg",
          date: "2024-09-05",
          amount: "100 SOL",
          price: "$250",
          type: "Buy",
          totalValue: "$3,500",
        },
        {
          id: 4,
          coin: "Tether",
          symbol: "USDT",
          icon: "/images/cryptocurrencies/tether.svg",
          date: "2024-08-30",
          amount: "10 BNB",
          price: "$1.00",
          type: "Buy",
          totalValue: "$2,500",
        },
        {
          id: 5,
          coin: "XRP",
          symbol: "XRP",
          icon: "/images/cryptocurrencies/xrp.svg",
          date: "2024-08-25",
          amount: "1,000 ADA",
          price: "$0.50",
          type: "Sell",
          totalValue: "$250",
        },
        {
          id: 6,
          coin: "Solana",
          symbol: "SOL",
          icon: "/images/cryptocurrencies/solana.svg",
          date: "2024-08-20",
          amount: "0.40 BTC",
          price: "$35",
          type: "Sell",
          totalValue: "$11,800",
        },
        {
          id: 7,
          coin: "USDC",
          symbol: "USDC",
          icon: "/images/cryptocurrencies/usdc.png",
          date: "2024-08-15",
          amount: "3.00 USDC",
          price: "$0.9999",
          type: "Buy",
          totalValue: "$5,400",
        },
        {
          id: 8,
          coin: "Binance",
          symbol: "BNB",
          icon: "/images/cryptocurrencies/binance.svg",
          date: "2024-09-05",
          amount: "100 SOL",
          price: "$250",
          type: "Buy",
          totalValue: "$3,500",
        },
        {
          id: 9,
          coin: "Ethereum",
          symbol: "ETH",
          icon: "/images/cryptocurrencies/ethereum.svg",
          date: "2024-09-08",
          amount: "5.00 ETH",
          price: "$1,750",
          type: "Sell",
          totalValue: "$8,750",
        },
        {
          id: 10,
          coin: "Tether",
          symbol: "USDT",
          icon: "/images/cryptocurrencies/tether.svg",
          date: "2024-08-30",
          amount: "10 BNB",
          price: "$1.00",
          type: "Buy",
          totalValue: "$2,500",
        },
        {
          id: 11,
          coin: "XRP",
          symbol: "XRP",
          icon: "/images/cryptocurrencies/xrp.svg",
          date: "2024-08-25",
          amount: "1,000 ADA",
          price: "$0.50",
          type: "Sell",
          totalValue: "$250",
        },
        {
          id: 12,
          coin: "Solana",
          symbol: "SOL",
          icon: "/images/cryptocurrencies/solana.svg",
          date: "2024-08-20",
          amount: "0.40 BTC",
          price: "$35",
          type: "Sell",
          totalValue: "$11,800",
        },
        {
          id: 13,
          coin: "Bitcoin",
          symbol: "BTC",
          icon: "/images/cryptocurrencies/bitcoin.svg",
          date: "2024-09-10",
          amount: "0.50 BTC",
          price: "$27,500",
          type: "Buy",
          totalValue: "$13,500",
        },
        {
          id: 14,
          coin: "USDC",
          symbol: "USDC",
          icon: "/images/cryptocurrencies/usdc.png",
          date: "2024-08-15",
          amount: "3.00 USDC",
          price: "$0.9999",
          type: "Buy",
          totalValue: "$5,400",
        },
      ];
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
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
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {[
                  "Sep 01 - Sep 30, 2024",
                  "Aug 01 - Aug 31, 2024",
                  "Jul 01 - Jul 31, 2024",
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

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Coin
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Date
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Amount
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Price
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Type
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Total Value
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {getCurrentPageData().map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[22px]">
                          <Image
                            src={transaction.icon}
                            alt={`${transaction.coin}`}
                            width={22}
                            height={22}
                          />
                        </div>
                        <span className="block font-medium ltr:ml-[8px] rtl:mr-[8px]">
                          {transaction.coin}{" "}
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                            ({transaction.symbol})
                          </span>
                        </span>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.date}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.amount}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.price}
                    </td>

                    <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`py-[3px] px-[8px] rounded-sm text-xs font-medium dark:bg-[#15203c] ${
                          transaction.type === "Buy"
                            ? "bg-success-100 text-success-600"
                            : "bg-danger-100 text-danger-500"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      {transaction.totalValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[10px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {getCurrentPageData().length} of {transactions.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border hover:bg-primary-500 hover:text-white hover:border-primary-500 dark:border-[#172036] ${
                      currentPage === i + 1
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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
