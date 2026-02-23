"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface CryptoData {
  rank: number;
  image: string;
  name: string;
  symbol: string;
  marketCap: string;
  price: string;
  change24h: string;
  change7d: string;
  value24h: string;
  supply: string;
}

const CryptoRankings: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>(
    "Oct 01 - Oct 31, 2024"
  );
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      const data: CryptoData[] = [
        {
          rank: 1,
          image: "/images/cryptocurrencies/bitcoin.svg",
          name: "Bitcoin",
          symbol: "BTC",
          marketCap: "$520B",
          price: "$27,500",
          change24h: "+2.3%",
          change7d: "+10.2%",
          value24h: "$35B",
          supply: "19M BTC",
        },
        {
          rank: 2,
          image: "/images/cryptocurrencies/ethereum.svg",
          name: "Ethereum",
          symbol: "ETH",
          marketCap: "$210B",
          price: "$1,750",
          change24h: "-1.2%",
          change7d: "+6.3%",
          value24h: "$20B",
          supply: "120M ETH",
        },
        {
          rank: 3,
          image: "/images/cryptocurrencies/binance.svg",
          name: "Binance",
          symbol: "BNB",
          marketCap: "$40B",
          price: "$250",
          change24h: "+1.5%",
          change7d: "+7.8%",
          value24h: "$1.8B",
          supply: "160M BNB",
        },
        {
          rank: 4,
          image: "/images/cryptocurrencies/tether.svg",
          name: "Tether",
          symbol: "USDT",
          marketCap: "$83B",
          price: "$1.00",
          change24h: "+0.01%",
          change7d: "+0.02%",
          value24h: "$45B",
          supply: "83B USDT",
        },
        {
          rank: 5,
          image: "/images/cryptocurrencies/xrp.svg",
          name: "XRP",
          symbol: "XRP",
          marketCap: "$25B",
          price: "$0.50",
          change24h: "+0.9%",
          change7d: "-8.6%",
          value24h: "$2.2B",
          supply: "50B XRP",
        },
        {
          rank: 6,
          name: "Solana",
          image: "/images/cryptocurrencies/solana.svg",
          symbol: "SOL",
          marketCap: "$12B",
          price: "$35",
          change24h: "+5.8%",
          change7d: "+15.5%",
          value24h: "$3.5B",
          supply: "400M SOL",
        },

        {
          rank: 7,
          image: "/images/cryptocurrencies/binance.svg",
          name: "Binance",
          symbol: "BNB",
          marketCap: "$40B",
          price: "$250",
          change24h: "+1.5%",
          change7d: "+7.8%",
          value24h: "$1.8B",
          supply: "160M BNB",
        },
        {
          rank: 8,
          image: "/images/cryptocurrencies/bitcoin.svg",
          name: "Bitcoin",
          symbol: "BTC",
          marketCap: "$520B",
          price: "$27,500",
          change24h: "+2.3%",
          change7d: "+10.2%",
          value24h: "$35B",
          supply: "19M BTC",
        },
        {
          rank: 9,
          image: "/images/cryptocurrencies/tether.svg",
          name: "Tether",
          symbol: "USDT",
          marketCap: "$83B",
          price: "$1.00",
          change24h: "+0.01%",
          change7d: "+0.02%",
          value24h: "$45B",
          supply: "83B USDT",
        },
        {
          rank: 10,
          image: "/images/cryptocurrencies/ethereum.svg",
          name: "Ethereum",
          symbol: "ETH",
          marketCap: "$210B",
          price: "$1,750",
          change24h: "-1.2%",
          change7d: "+6.3%",
          value24h: "$20B",
          supply: "120M ETH",
        },
        {
          rank: 11,
          name: "Solana",
          image: "/images/cryptocurrencies/solana.svg",
          symbol: "SOL",
          marketCap: "$12B",
          price: "$35",
          change24h: "+5.8%",
          change7d: "+15.5%",
          value24h: "$3.5B",
          supply: "400M SOL",
        },
        {
          rank: 12,
          image: "/images/cryptocurrencies/xrp.svg",
          name: "XRP",
          symbol: "XRP",
          marketCap: "$25B",
          price: "$0.50",
          change24h: "+0.9%",
          change7d: "-8.6%",
          value24h: "$2.2B",
          supply: "50B XRP",
        },
      ];
      setCryptoData(data);
    };

    fetchData();
  }, []);

  // Calculate pagination data
  const totalPages = Math.ceil(cryptoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = cryptoData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Crypto Rankings</h5>
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
                    Rank
                  </th>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Cryptocurrency
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Market Cap
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Price
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    24h Change %
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    7d Change %
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Value 24h
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Circulating Supply
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentPageData.map((crypto) => (
                  <tr key={crypto.rank}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {crypto.rank}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[22px]">
                          <Image
                            src={crypto.image}
                            alt={crypto.name}
                            width={22}
                            height={22}
                          />
                        </div>
                        <span className="block font-medium ltr:ml-[8px] rtl:mr-[8px]">
                          {crypto.name}{" "}
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                            ({crypto.symbol})
                          </span>
                        </span>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {crypto.marketCap}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {crypto.price}
                    </td>

                    <td
                      className={`font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036] ${
                        crypto.change24h.startsWith("+")
                          ? "text-success-700"
                          : "text-danger-500"
                      }`}
                    >
                      {crypto.change24h}
                    </td>

                    <td
                      className={`font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036] ${
                        crypto.change7d.startsWith("+")
                          ? "text-success-700"
                          : "text-danger-500"
                      }`}
                    >
                      {crypto.change7d}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {crypto.value24h}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {crypto.supply}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[9px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to {startIndex + currentPageData.length}{" "}
              of {cryptoData.length} results
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

export default CryptoRankings;
