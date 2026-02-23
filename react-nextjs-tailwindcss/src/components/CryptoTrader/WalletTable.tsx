"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// Interface for wallet data
interface Wallet {
  id: number;
  name: string;
  address: string;
  cryptoAsset: {
    name: string;
    symbol: string;
    icon: string;
  };
  balance: string;
  lastTransactionDate: string;
  status: "Active" | "Inactive";
}

const WalletTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Table State
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = () => {
      const mockData: Wallet[] = [
        {
          id: 1,
          name: "BTC Wallet",
          address: "3FZasd93cpjq2LkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Bitcoin",
            symbol: "BTC",
            icon: "/images/cryptocurrencies/bitcoin.svg",
          },
          balance: "0.25 BTC",
          lastTransactionDate: "2025-10-01",
          status: "Active",
        },
        {
          id: 2,
          name: "ETH Wallet",
          address: "0x32Be343pjq2LkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Ethereum",
            symbol: "ETH",
            icon: "/images/cryptocurrencies/ethereum.svg",
          },
          balance: "5.2 ETH",
          lastTransactionDate: "2025-10-02",
          status: "Active",
        },
        {
          id: 3,
          name: "TRX Wallet",
          address: "3FZbc3cpjq2LkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Tron",
            symbol: "TRX",
            icon: "/images/cryptocurrencies/tron.png",
          },
          balance: "1500 TRX",
          lastTransactionDate: "2025-10-08",
          status: "Inactive",
        },
        {
          id: 4,
          name: "SOL Wallet",
          address: "6Ksd8c23kfjqLkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Solana",
            symbol: "SOL",
            icon: "/images/cryptocurrencies/solana.svg",
          },
          balance: "20 SOL",
          lastTransactionDate: "2025-10-04",
          status: "Active",
        },
        {
          id: 5,
          name: "ADA Wallet",
          address: "DdzFFzCqrhsasdfLkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Cardano",
            symbol: "ADA",
            icon: "/images/cryptocurrencies/cardano.png",
          },
          balance: "1000 ADA",
          lastTransactionDate: "2025-10-05",
          status: "Active",
        },
        {
          id: 6,
          name: "XRP Wallet",
          address: "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",
          cryptoAsset: {
            name: "Ripple",
            symbol: "XRP",
            icon: "/images/cryptocurrencies/xrp.svg",
          },
          balance: "2500 XRP",
          lastTransactionDate: "2025-10-06",
          status: "Inactive",
        },
        {
          id: 7,
          name: "USDT Wallet",
          address: "1Ez69SnzzmePmZX3WpEzMKTrcBF2gpNQ55",
          cryptoAsset: {
            name: "Tether",
            symbol: "USDT",
            icon: "/images/cryptocurrencies/tether.svg",
          },
          balance: "3000 USDT",
          lastTransactionDate: "2025-10-07",
          status: "Active",
        },
        {
          id: 8,
          name: "DOT Wallet",
          address: "1PdqBWrfi9kdkLkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Polkadot",
            symbol: "DOT",
            icon: "/images/cryptocurrencies/polkadot.png",
          },
          balance: "75 DOT",
          lastTransactionDate: "2025-10-09",
          status: "Active",
        },
        {
          id: 9,
          name: "LTC Wallet",
          address: "LcHKJ4RHsZGPH5XRRc2eU7VULdSpE3eVTT",
          cryptoAsset: {
            name: "Litecoin",
            symbol: "LTC",
            icon: "/images/cryptocurrencies/litecoin.png",
          },
          balance: "12 LTC",
          lastTransactionDate: "2025-10-10",
          status: "Inactive",
        },
        {
          id: 10,
          name: "LINK Wallet",
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          cryptoAsset: {
            name: "Chainlink",
            symbol: "LINK",
            icon: "/images/cryptocurrencies/chainlink.png",
          },
          balance: "300 LINK",
          lastTransactionDate: "2025-10-11",
          status: "Active",
        },
        {
          id: 11,
          name: "ADA Wallet",
          address: "DdzFFzCqrhsasdfLkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Cardano",
            symbol: "ADA",
            icon: "/images/cryptocurrencies/cardano.png",
          },
          balance: "1000 ADA",
          lastTransactionDate: "2025-10-05",
          status: "Active",
        },
        {
          id: 12,
          name: "XRP Wallet",
          address: "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",
          cryptoAsset: {
            name: "Ripple",
            symbol: "XRP",
            icon: "/images/cryptocurrencies/xrp.svg",
          },
          balance: "2500 XRP",
          lastTransactionDate: "2025-10-06",
          status: "Inactive",
        },
        {
          id: 13,
          name: "USDT Wallet",
          address: "1Ez69SnzzmePmZX3WpEzMKTrcBF2gpNQ55",
          cryptoAsset: {
            name: "Tether",
            symbol: "USDT",
            icon: "/images/cryptocurrencies/tether.svg",
          },
          balance: "3000 USDT",
          lastTransactionDate: "2025-10-07",
          status: "Active",
        },
        {
          id: 14,
          name: "DOT Wallet",
          address: "1PdqBWrfi9kdkLkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Polkadot",
            symbol: "DOT",
            icon: "/images/cryptocurrencies/polkadot.png",
          },
          balance: "75 DOT",
          lastTransactionDate: "2025-10-09",
          status: "Active",
        },
        {
          id: 15,
          name: "LTC Wallet",
          address: "LcHKJ4RHsZGPH5XRRc2eU7VULdSpE3eVTT",
          cryptoAsset: {
            name: "Litecoin",
            symbol: "LTC",
            icon: "/images/cryptocurrencies/litecoin.png",
          },
          balance: "12 LTC",
          lastTransactionDate: "2025-10-10",
          status: "Inactive",
        },
        {
          id: 16,
          name: "LINK Wallet",
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          cryptoAsset: {
            name: "Chainlink",
            symbol: "LINK",
            icon: "/images/cryptocurrencies/chainlink.png",
          },
          balance: "300 LINK",
          lastTransactionDate: "2025-10-11",
          status: "Active",
        },
        {
          id: 17,
          name: "BTC Wallet",
          address: "3FZasd93cpjq2LkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Bitcoin",
            symbol: "BTC",
            icon: "/images/cryptocurrencies/bitcoin.svg",
          },
          balance: "0.25 BTC",
          lastTransactionDate: "2025-10-01",
          status: "Active",
        },
        {
          id: 18,
          name: "ETH Wallet",
          address: "0x32Be343pjq2LkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Ethereum",
            symbol: "ETH",
            icon: "/images/cryptocurrencies/ethereum.svg",
          },
          balance: "5.2 ETH",
          lastTransactionDate: "2025-10-02",
          status: "Active",
        },
        {
          id: 19,
          name: "TRX Wallet",
          address: "3FZbc3cpjq2LkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Tron",
            symbol: "TRX",
            icon: "/images/cryptocurrencies/tron.png",
          },
          balance: "1500 TRX",
          lastTransactionDate: "2025-10-08",
          status: "Inactive",
        },
        {
          id: 20,
          name: "SOL Wallet",
          address: "6Ksd8c23kfjqLkjuV5qJHunfnkLtktZc4",
          cryptoAsset: {
            name: "Solana",
            symbol: "SOL",
            icon: "/images/cryptocurrencies/solana.svg",
          },
          balance: "20 SOL",
          lastTransactionDate: "2025-10-04",
          status: "Active",
        },
      ];
      setWallets(mockData);
    };

    fetchData();
  }, []);

  // Filter wallets based on search term
  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.cryptoAsset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredWallets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedWallets = filteredWallets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
                placeholder="Search here..."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add Wallet
              </span>
            </button>
          </div>
        </div>
        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Address
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Crypto Asset
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Balance
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Last Transaction Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {displayedWallets.length > 0 ? (
                  displayedWallets.map((wallet) => (
                    <tr key={wallet.id}>
                      <td className="text-primary-500 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {wallet.name}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {wallet.address}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <div className="w-[22px]">
                            <Image
                              src={wallet.cryptoAsset.icon}
                              alt={wallet.cryptoAsset.symbol.toLowerCase()}
                              width={22}
                              height={22}
                            />
                          </div>
                          <span className="block font-medium ltr:ml-[8px] rtl:mr-[8px]">
                            {wallet.cryptoAsset.name}{" "}
                            <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                              ({wallet.cryptoAsset.symbol})
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {wallet.balance}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {wallet.lastTransactionDate}
                      </td>
                      <td
                        className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${
                          wallet.status === "Active"
                            ? "text-success-600"
                            : "text-danger-600"
                        }`}
                      >
                        {wallet.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]"
                    >
                      No wallets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[15px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
            </p>
            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={prevPage}
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
                  onClick={nextPage}
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

      {/* Add New Wallet Modal */}
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
                    <h5 className="!mb-0">Add New Wallet</h5>
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
                          Wallet Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Wallet Name"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Wallet Address
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Wallet Address"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Crypto Asset
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Crypto Asset"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Balance
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter Balance"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Last Transaction Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Active</option>
                          <option value="2">Inactive</option>
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

export default WalletTable;
