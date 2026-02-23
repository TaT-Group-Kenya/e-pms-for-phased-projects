"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface Transaction {
  id: string;
  date: string;
  asset: string;
  type: "Buy" | "Sell";
  amount: string;
  price: string;
  totalValue: string;
  status: "Done" | "Pending" | "Failed";
}

const TransactionsTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 30 Days");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Sample transaction data
  const initialTransactions: Transaction[] = [
    {
      id: "1",
      date: "2025-10-31",
      asset: "Bitcoin",
      type: "Buy",
      amount: "0.5 BTC",
      price: "$34,000",
      totalValue: "$17,000",
      status: "Done",
    },
    {
      id: "2",
      date: "2025-10-30",
      asset: "Ethereum",
      type: "Sell",
      amount: "2 ETH",
      price: "$1,800",
      totalValue: "$3,600",
      status: "Done",
    },
    {
      id: "3",
      date: "2025-10-29",
      asset: "Tether",
      type: "Buy",
      amount: "$1.00",
      price: "$175",
      totalValue: "$1,750",
      status: "Failed",
    },
    {
      id: "4",
      date: "2025-10-28",
      asset: "USD Coin",
      type: "Sell",
      amount: "$0.9999",
      price: "$230",
      totalValue: "$1,150",
      status: "Done",
    },
    {
      id: "5",
      date: "2025-10-27",
      asset: "Cardano",
      type: "Buy",
      amount: "5000 DOGE",
      price: "$0.07",
      totalValue: "$350",
      status: "Pending",
    },
    {
      id: "6",
      date: "2025-10-26",
      asset: "Solana",
      type: "Buy",
      amount: "10 SOL",
      price: "$32",
      totalValue: "$320",
      status: "Done",
    },
    {
      id: "7",
      date: "2025-10-25",
      asset: "Ripple",
      type: "Sell",
      amount: "1000 XRP",
      price: "$0.52",
      totalValue: "$520",
      status: "Done",
    },
    {
      id: "8",
      date: "2025-10-24",
      asset: "Polkadot",
      type: "Buy",
      amount: "50 DOT",
      price: "$6.80",
      totalValue: "$340",
      status: "Pending",
    },
    {
      id: "9",
      date: "2025-10-23",
      asset: "Litecoin",
      type: "Buy",
      amount: "5 LTC",
      price: "$70",
      totalValue: "$350",
      status: "Done",
    },
    {
      id: "10",
      date: "2025-10-22",
      asset: "Binance Coin",
      type: "Sell",
      amount: "2 BNB",
      price: "$300",
      totalValue: "$600",
      status: "Done",
    },
    {
      id: "11",
      date: "2025-10-21",
      asset: "Chainlink",
      type: "Buy",
      amount: "40 LINK",
      price: "$10",
      totalValue: "$400",
      status: "Failed",
    },
    {
      id: "12",
      date: "2025-10-20",
      asset: "Uniswap",
      type: "Sell",
      amount: "100 UNI",
      price: "$5",
      totalValue: "$500",
      status: "Done",
    },
    {
      id: "13",
      date: "2025-10-19",
      asset: "Avalanche",
      type: "Buy",
      amount: "20 AVAX",
      price: "$12",
      totalValue: "$240",
      status: "Pending",
    },
    {
      id: "14",
      date: "2025-10-18",
      asset: "Stellar",
      type: "Buy",
      amount: "2000 XLM",
      price: "$0.09",
      totalValue: "$180",
      status: "Done",
    },
    {
      id: "15",
      date: "2025-10-17",
      asset: "VeChain",
      type: "Sell",
      amount: "3000 VET",
      price: "$0.03",
      totalValue: "$90",
      status: "Done",
    },
    {
      id: "16",
      date: "2025-10-16",
      asset: "Monero",
      type: "Buy",
      amount: "2 XMR",
      price: "$140",
      totalValue: "$280",
      status: "Failed",
    },
    {
      id: "17",
      date: "2025-10-15",
      asset: "Aave",
      type: "Sell",
      amount: "5 AAVE",
      price: "$60",
      totalValue: "$300",
      status: "Pending",
    },
    {
      id: "18",
      date: "2025-10-14",
      asset: "Tezos",
      type: "Buy",
      amount: "100 XTZ",
      price: "$1.10",
      totalValue: "$110",
      status: "Done",
    },
    {
      id: "19",
      date: "2025-10-13",
      asset: "Cosmos",
      type: "Sell",
      amount: "30 ATOM",
      price: "$8",
      totalValue: "$240",
      status: "Done",
    },
    {
      id: "20",
      date: "2025-10-12",
      asset: "Filecoin",
      type: "Buy",
      amount: "25 FIL",
      price: "$4",
      totalValue: "$100",
      status: "Pending",
    },
  ];

  const [transactions] =
    useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get type styling
  const getTypeStyle = (type: string) => {
    return type === "Buy"
      ? "bg-success-100 dark:bg-[#15203c] text-success-600"
      : "bg-danger-100 dark:bg-[#15203c] text-danger-600";
  };

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-success-100 dark:bg-[#15203c] text-success-600";
      case "Pending":
        return "bg-warning-50 dark:bg-[#15203c] text-warning-700";
      case "Failed":
        return "bg-danger-100 dark:bg-[#15203c] text-danger-600";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here....."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </form>
          </div>
          <div className="trezo-card-subtitle flex items-center gap-[15px] mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add Transaction
              </span>
            </button>

            <div className="trezo-card-dropdown relative">
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
                  currentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {transaction.date}
                      </td>
                      <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {transaction.asset}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        <span
                          className={`inline-block py-[3px] px-[8px] rounded-[4px] text-xs font-medium ${getTypeStyle(
                            transaction.type
                          )}`}
                        >
                          {transaction.type}
                        </span>
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
                        <span
                          className={`inline-block py-[3px] px-[8px] rounded-[4px] text-xs font-medium ${getStatusStyle(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[15px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              Showing {indexOfFirstTransaction + 1} to{" "}
              {Math.min(indexOfLastTransaction, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
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
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                        currentPage === number
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  </li>
                )
              )}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => paginate(currentPage + 1)}
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

      {/* Add New Transaction Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[550px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0">Add New Transaction</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content">
                  <form>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-[20px] md:gap-[25px]">
                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Asset
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Asset"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Type
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Buy</option>
                          <option value="2">Sell</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Amount
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Amount"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Price
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Price"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Total Value
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Total Value"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Done</option>
                          <option value="2">Pending</option>
                          <option value="3">Failed</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-[20px] md:mt-[25px] ltr:text-right rtl:text-left">
                      <button
                        type="button"
                        className="rounded-md inline-block transition-all font-medium ltr:mr-[15px] rtl:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400"
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            add
                          </i>
                          Create
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TransactionsTable;
