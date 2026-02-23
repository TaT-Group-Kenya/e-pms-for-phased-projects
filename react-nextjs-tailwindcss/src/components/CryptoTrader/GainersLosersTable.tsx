"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import Image from "next/image";
import type { Props as ApexChartProps } from "react-apexcharts";

// Interface for asset data
interface Asset {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  oneHourChange: number;
  oneDayChange: number;
  sevenDayChange: number;
  marketCap: number;
  volume24h: number;
  sparklineData: number[];
}

const GainersLosersTable: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("24h");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Table state
  const [Chart, setChart] = useState<React.ComponentType<ApexChartProps> | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadChart = async () => {
      const ApexCharts = await import("react-apexcharts");
      setChart(() => ApexCharts.default);
    };

    loadChart();

    // Simulate fetching data from an API
    const fetchData = () => {
      const mockData: Asset[] = [
        {
          id: 1,
          name: "Bitcoin",
          symbol: "BTC",
          icon: "/images/cryptocurrencies/bitcoin.svg",
          price: 85818.27,
          oneHourChange: 0.47,
          oneDayChange: 2.65,
          sevenDayChange: 3.01,
          marketCap: 1702262413645,
          volume24h: 37182010584,
          sparklineData: [60, 40, 80, 70, 50, 90, 60, 85, 55, 75, 65, 95],
        },
        {
          id: 2,
          name: "Ethereum",
          symbol: "ETH",
          icon: "/images/cryptocurrencies/ethereum.svg",
          price: 1993.88,
          oneHourChange: -1.03,
          oneDayChange: 2.44,
          sevenDayChange: -5.59,
          marketCap: 240652882527,
          volume24h: 19913301026,
          sparklineData: [50, 60, 45, 70, 55, 65, 50, 75, 60, 70, 65, 80],
        },
        {
          id: 3,
          name: "Binance",
          symbol: "BNB",
          icon: "/images/cryptocurrencies/binance.svg",
          price: 2.49,
          oneHourChange: 0.16,
          oneDayChange: -7.75,
          sevenDayChange: 10.25,
          marketCap: 145187520169,
          volume24h: 10614863319,
          sparklineData: [70, 60, 65, 50, 55, 45, 40, 50, 45, 55, 50, 60],
        },
        {
          id: 4,
          name: "Solana",
          symbol: "SOL",
          icon: "/images/cryptocurrencies/solana.svg",
          price: 135.42,
          oneHourChange: -0.21,
          oneDayChange: 3.13,
          sevenDayChange: 6.89,
          marketCap: 57820345123,
          volume24h: 6789321020,
          sparklineData: [30, 40, 35, 50, 60, 45, 55, 60, 70, 75, 65, 80],
        },
        {
          id: 5,
          name: "Cardano",
          symbol: "ADA",
          icon: "/images/cryptocurrencies/cardano.png",
          price: 0.57,
          oneHourChange: -0.45,
          oneDayChange: 1.74,
          sevenDayChange: 4.03,
          marketCap: 19648300123,
          volume24h: 1308420011,
          sparklineData: [20, 30, 25, 35, 40, 38, 42, 45, 47, 50, 52, 55],
        },
        {
          id: 6,
          name: "Ripple",
          symbol: "XRP",
          icon: "/images/cryptocurrencies/xrp.svg",
          price: 0.63,
          oneHourChange: 0.67,
          oneDayChange: -1.24,
          sevenDayChange: 2.91,
          marketCap: 32018304987,
          volume24h: 2218493202,
          sparklineData: [15, 20, 25, 22, 18, 19, 23, 25, 27, 30, 28, 35],
        },
        {
          id: 7,
          name: "Polkadot",
          symbol: "DOT",
          icon: "/images/cryptocurrencies/polkadot.png",
          price: 7.25,
          oneHourChange: 0.31,
          oneDayChange: 0.98,
          sevenDayChange: 1.23,
          marketCap: 9168023845,
          volume24h: 954312589,
          sparklineData: [8, 7, 6, 5, 7, 9, 8, 10, 11, 9, 10, 12],
        },
        {
          id: 8,
          name: "Avalanche",
          symbol: "AVAX",
          icon: "/images/cryptocurrencies/avalanche.png",
          price: 35.22,
          oneHourChange: -0.29,
          oneDayChange: 1.11,
          sevenDayChange: 4.55,
          marketCap: 12390218374,
          volume24h: 1829381123,
          sparklineData: [12, 14, 13, 15, 18, 17, 16, 18, 20, 21, 19, 22],
        },
        {
          id: 9,
          name: "Litecoin",
          symbol: "LTC",
          icon: "/images/cryptocurrencies/litecoin.png",
          price: 85.13,
          oneHourChange: -0.12,
          oneDayChange: 0.94,
          sevenDayChange: 3.12,
          marketCap: 6812309842,
          volume24h: 721930112,
          sparklineData: [40, 42, 39, 43, 41, 44, 46, 45, 47, 49, 48, 50],
        },
        {
          id: 10,
          name: "Chainlink",
          symbol: "LINK",
          icon: "/images/cryptocurrencies/chainlink.png",
          price: 18.76,
          oneHourChange: 0.84,
          oneDayChange: 2.11,
          sevenDayChange: 6.34,
          marketCap: 10928342984,
          volume24h: 1309432839,
          sparklineData: [10, 12, 11, 14, 13, 15, 17, 16, 18, 19, 18, 20],
        },
        {
          id: 11,
          name: "Avalanche",
          symbol: "AVAX",
          icon: "/images/cryptocurrencies/avalanche.png",
          price: 35.22,
          oneHourChange: -0.29,
          oneDayChange: 1.11,
          sevenDayChange: 4.55,
          marketCap: 12390218374,
          volume24h: 1829381123,
          sparklineData: [12, 14, 13, 15, 18, 17, 16, 18, 20, 21, 19, 22],
        },
        {
          id: 12,
          name: "Litecoin",
          symbol: "LTC",
          icon: "/images/cryptocurrencies/litecoin.png",
          price: 85.13,
          oneHourChange: -0.12,
          oneDayChange: 0.94,
          sevenDayChange: 3.12,
          marketCap: 6812309842,
          volume24h: 721930112,
          sparklineData: [40, 42, 39, 43, 41, 44, 46, 45, 47, 49, 48, 50],
        },
        {
          id: 13,
          name: "Chainlink",
          symbol: "LINK",
          icon: "/images/cryptocurrencies/chainlink.png",
          price: 18.76,
          oneHourChange: 0.84,
          oneDayChange: 2.11,
          sevenDayChange: 6.34,
          marketCap: 10928342984,
          volume24h: 1309432839,
          sparklineData: [10, 12, 11, 14, 13, 15, 17, 16, 18, 19, 18, 20],
        },
        {
          id: 14,
          name: "Binance",
          symbol: "BNB",
          icon: "/images/cryptocurrencies/binance.svg",
          price: 2.49,
          oneHourChange: 0.16,
          oneDayChange: -7.75,
          sevenDayChange: 10.25,
          marketCap: 145187520169,
          volume24h: 10614863319,
          sparklineData: [70, 60, 65, 50, 55, 45, 40, 50, 45, 55, 50, 60],
        },
        {
          id: 15,
          name: "Solana",
          symbol: "SOL",
          icon: "/images/cryptocurrencies/solana.svg",
          price: 135.42,
          oneHourChange: -0.21,
          oneDayChange: 3.13,
          sevenDayChange: 6.89,
          marketCap: 57820345123,
          volume24h: 6789321020,
          sparklineData: [30, 40, 35, 50, 60, 45, 55, 60, 70, 75, 65, 80],
        },
        {
          id: 16,
          name: "Bitcoin",
          symbol: "BTC",
          icon: "/images/cryptocurrencies/bitcoin.svg",
          price: 85818.27,
          oneHourChange: 0.47,
          oneDayChange: 2.65,
          sevenDayChange: 3.01,
          marketCap: 1702262413645,
          volume24h: 37182010584,
          sparklineData: [60, 40, 80, 70, 50, 90, 60, 85, 55, 75, 65, 95],
        },
        {
          id: 17,
          name: "Ethereum",
          symbol: "ETH",
          icon: "/images/cryptocurrencies/ethereum.svg",
          price: 1993.88,
          oneHourChange: -1.03,
          oneDayChange: 2.44,
          sevenDayChange: 5.59,
          marketCap: 240652882527,
          volume24h: 19913301026,
          sparklineData: [50, 60, 45, 70, 55, 65, 50, 75, 60, 70, 65, 80],
        },
        {
          id: 18,
          name: "Cardano",
          symbol: "ADA",
          icon: "/images/cryptocurrencies/cardano.png",
          price: 0.57,
          oneHourChange: -0.45,
          oneDayChange: 1.74,
          sevenDayChange: 4.03,
          marketCap: 19648300123,
          volume24h: 1308420011,
          sparklineData: [20, 30, 25, 35, 40, 38, 42, 45, 47, 50, 52, 55],
        },
        {
          id: 19,
          name: "Ripple",
          symbol: "XRP",
          icon: "/images/cryptocurrencies/xrp.svg",
          price: 0.63,
          oneHourChange: 0.67,
          oneDayChange: -1.24,
          sevenDayChange: 2.91,
          marketCap: 32018304987,
          volume24h: 2218493202,
          sparklineData: [15, 20, 25, 22, 18, 19, 23, 25, 27, 30, 28, 35],
        },
        {
          id: 20,
          name: "Polkadot",
          symbol: "DOT",
          icon: "/images/cryptocurrencies/polkadot.png",
          price: 7.25,
          oneHourChange: 0.31,
          oneDayChange: 0.98,
          sevenDayChange: 1.23,
          marketCap: 9168023845,
          volume24h: 954312589,
          sparklineData: [8, 7, 6, 5, 7, 9, 8, 10, 11, 9, 10, 12],
        },
      ];
      setAssets(mockData);
    };

    fetchData();
  }, []);

  // Chart options for sparkline
  const getChartOptions = (color: string): ApexOptions => ({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "monotoneCubic",
      width: 1,
    },
    colors: [color],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
    },
  });

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage changes
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Get color class for percentage changes
  const getChangeColorClass = (value: number): string => {
    return value >= 0 ? "text-success-600" : "text-danger-600";
  };

  // Format large numbers (market cap, volume)
  const formatLargeNumber = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter assets based on search term
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredAssets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedAssets = filteredAssets.slice(
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
          <div className="trezo-card-subtitle flex items-center gap-[15px] mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              id="add-new-popup-toggle"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add Crypto
              </span>
            </button>

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
                {["24h", "48h", "72h"].map((option) => (
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
                    Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Price
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    1h %
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    24h %
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    7d %
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Market Cap
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Volume (24h)
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {displayedAssets.length > 0 ? (
                  displayedAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <div className="w-[22px]">
                            <Image
                              src={asset.icon}
                              alt={asset.symbol.toLowerCase()}
                              width={22}
                              height={22}
                            />
                          </div>
                          <span className="block font-medium ltr:ml-[8px] rtl:mr-[8px]">
                            {asset.name}{" "}
                            <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                              ({asset.symbol})
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {formatCurrency(asset.price)}
                      </td>
                      <td
                        className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${getChangeColorClass(
                          asset.oneHourChange
                        )}`}
                      >
                        {formatPercentage(asset.oneHourChange)}
                      </td>
                      <td
                        className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${getChangeColorClass(
                          asset.oneDayChange
                        )}`}
                      >
                        {formatPercentage(asset.oneDayChange)}
                      </td>
                      <td
                        className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${getChangeColorClass(
                          asset.sevenDayChange
                        )}`}
                      >
                        {formatPercentage(asset.sevenDayChange)}
                      </td>
                      <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {formatLargeNumber(asset.marketCap)}
                      </td>
                      <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {formatLargeNumber(asset.volume24h)}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[14px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                        {Chart && (
                          <Chart
                            options={getChartOptions(
                              asset.sevenDayChange >= 0 ? "#25b003" : "#ff0000"
                            )}
                            series={[{ data: asset.sparklineData }]}
                            type="line"
                            height={50}
                            width={100}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center whitespace-nowrap px-[20px] py-[14px] border-b border-gray-100 dark:border-[#172036]"
                    >
                      No assets found
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
    </>
  );
};

export default GainersLosersTable;
