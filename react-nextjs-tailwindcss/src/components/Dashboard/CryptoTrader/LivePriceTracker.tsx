"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

// Define the Crypto interface
interface Crypto {
  name: string;
  symbol: string;
  price: number;
  icon: string;
}

// Mock data (replace with actual API call)
const mockCryptoData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 68848.92,
    icon: "/images/cryptocurrencies/bitcoin.svg",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 2565.77,
    icon: "/images/cryptocurrencies/ethereum.svg",
  },
  {
    name: "Binance",
    symbol: "BNB",
    price: 565.32,
    icon: "/images/cryptocurrencies/binance.svg",
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: 1.0,
    icon: "/images/cryptocurrencies/tether.svg",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 0.529105,
    icon: "/images/cryptocurrencies/xrp.svg",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 179.44,
    icon: "/images/cryptocurrencies/solana.svg",
  },
  {
    name: "USDC",
    symbol: "USDC",
    price: 1.0,
    icon: "/images/cryptocurrencies/usdc.png",
  },
  {
    name: "Tron",
    symbol: "TRX",
    price: 0.192391,
    icon: "/images/cryptocurrencies/tron.png",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 68848.92,
    icon: "/images/cryptocurrencies/bitcoin.svg",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 179.44,
    icon: "/images/cryptocurrencies/solana.svg",
  },
  {
    name: "USDC",
    symbol: "USDC",
    price: 1.0,
    icon: "/images/cryptocurrencies/usdc.png",
  },
  {
    name: "Tron",
    symbol: "TRX",
    price: 0.192391,
    icon: "/images/cryptocurrencies/tron.png",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 2565.77,
    icon: "/images/cryptocurrencies/ethereum.svg",
  },
  {
    name: "Binance",
    symbol: "BNB",
    price: 565.32,
    icon: "/images/cryptocurrencies/binance.svg",
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: 1.0,
    icon: "/images/cryptocurrencies/tether.svg",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 0.529105,
    icon: "/images/cryptocurrencies/xrp.svg",
  },
];

const LivePriceTracker: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // State variables
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items per page
  const [totalItems, setTotalItems] = useState(0);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCryptoData(mockCryptoData);
        setTotalItems(mockCryptoData.length);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  // Calculate the data to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCryptoData = cryptoData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format price to USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Live Price Tracker</h5>
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
              {currentCryptoData.length > 0 ? (
                currentCryptoData.map((crypto, index) => (
                  <tr key={index}>
                    <td className="text-[13px] ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[22px]">
                          <Image
                            alt={crypto.name}
                            src={crypto.icon}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/cryptocurrencies/placeholder.png";
                            }}
                            width={22}
                            height={22}
                          />
                        </div>
                        <span className="block font-medium ltr:ml-[8px] rtl:mr-[8px]">
                          {crypto.name}
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                            ({crypto.symbol})
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="text-[13px] ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {formatPrice(crypto.price)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-[12px]">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-[20px] md:px-[25px] pt-[15px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 text-sm">
            Showing {currentCryptoData.length} of {totalItems} results
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

export default LivePriceTracker;
