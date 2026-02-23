"use client";

import React, { useState, useEffect } from "react"; 
import Image from "next/image";
import { ApexOptions } from "apexcharts"; 
import type { Props as ApexChartProps } from "react-apexcharts";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  allocation: number;
  roi: number;
  currentValue: number;
  netGain: number;
  oneDayChange: number;
  sevenDayChange: number;
  sparklineData: number[];
}

const IndividualAssetPerformance: React.FC = () => {
  const [Chart, setChart] = useState<React.ComponentType<ApexChartProps> | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
          icon: "/images/cardano.png",
          allocation: 35,
          roi: 120,
          currentValue: 35000,
          netGain: 15000,
          oneDayChange: 0.5,
          sevenDayChange: 3.0,
          sparklineData: [60, 40, 80, 70, 50, 90, 60, 85, 55, 75, 65, 95],
        },
        {
          id: 2,
          name: "Ethereum",
          symbol: "ETH",
          icon: "/images/ethereum-2.png",
          allocation: 25,
          roi: 80,
          currentValue: 25000,
          netGain: 8000,
          oneDayChange: -1.0,
          sevenDayChange: 1.5,
          sparklineData: [50, 60, 45, 70, 55, 65, 50, 75, 60, 70, 65, 80],
        },
        {
          id: 3,
          name: "Binance",
          symbol: "BNB",
          icon: "/images/binance-2.png",
          allocation: 15,
          roi: 30,
          currentValue: 7500,
          netGain: 1500,
          oneDayChange: -2.5,
          sevenDayChange: -5.0,
          sparklineData: [70, 60, 65, 50, 55, 45, 40, 50, 45, 55, 50, 60],
        },
        {
          id: 4,
          name: "Tether",
          symbol: "USDT",
          icon: "/images/tether.png",
          allocation: 10,
          roi: 45,
          currentValue: 4500,
          netGain: 1000,
          oneDayChange: 0.2,
          sevenDayChange: 2.0,
          sparklineData: [30, 35, 40, 38, 42, 45, 43, 47, 45, 48, 46, 50],
        },
        {
          id: 5,
          name: "XRP",
          symbol: "XRP",
          icon: "/images/xrp.png",
          allocation: 5,
          roi: 60,
          currentValue: 3000,
          netGain: 1200,
          oneDayChange: 1.5,
          sevenDayChange: 4.5,
          sparklineData: [40, 45, 50, 48, 52, 55, 53, 57, 55, 58, 56, 60],
        },
        {
          id: 6,
          name: "Cardano",
          symbol: "ADA",
          icon: "/images/cardano.png",
          allocation: 8,
          roi: 25,
          currentValue: 2000,
          netGain: 500,
          oneDayChange: 0.8,
          sevenDayChange: 2.5,
          sparklineData: [30, 35, 32, 38, 35, 40, 42, 45, 43, 47, 45, 50],
        },
        {
          id: 7,
          name: "Solana",
          symbol: "SOL",
          icon: "/images/solana.png",
          allocation: 12,
          roi: 75,
          currentValue: 6000,
          netGain: 2500,
          oneDayChange: -0.5,
          sevenDayChange: 5.0,
          sparklineData: [40, 45, 50, 55, 60, 65, 70, 65, 60, 55, 50, 45],
        },
        {
          id: 8,
          name: "Polkadot",
          symbol: "DOT",
          icon: "/images/polkadot.png",
          allocation: 7,
          roi: 15,
          currentValue: 1500,
          netGain: 200,
          oneDayChange: -1.2,
          sevenDayChange: -2.0,
          sparklineData: [50, 48, 45, 42, 40, 38, 35, 40, 45, 50, 55, 60],
        },
        {
          id: 9,
          name: "Dogecoin",
          symbol: "DOGE",
          icon: "/images/dogecoin.png",
          allocation: 3,
          roi: 10,
          currentValue: 750,
          netGain: 75,
          oneDayChange: 2.0,
          sevenDayChange: 8.0,
          sparklineData: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
        },
        {
          id: 10,
          name: "Litecoin",
          symbol: "LTC",
          icon: "/images/litecoin.png",
          allocation: 5,
          roi: 20,
          currentValue: 1200,
          netGain: 200,
          oneDayChange: -0.3,
          sevenDayChange: 1.5,
          sparklineData: [40, 42, 45, 43, 47, 45, 50, 55, 60, 65, 70, 75],
        },
      ];
      setAssets(mockData);
    };

    fetchData();
  }, []);

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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getChangeColorClass = (value: number): string => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Pagination logic
  const totalItems = assets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedAssets = assets.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Individual Asset Performance</h5>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto overflow-y-hidden">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Asset
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Allocation %
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ROI
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Current Value
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Net Gain/Los
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    1D Change
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    7D Change
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Sparkline
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {displayedAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
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

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {asset.allocation}%
                    </td>

                    <td
                      className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${
                        asset.roi >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {asset.roi >= 0 ? "+" : ""}
                      {asset.roi}%
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {formatCurrency(asset.currentValue)}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {formatCurrency(asset.netGain)}
                    </td>

                    <td
                      className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${getChangeColorClass(
                        asset.sevenDayChange
                      )}`}
                    >
                      {formatPercentage(asset.oneDayChange)}
                    </td>

                    <td
                      className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ${getChangeColorClass(
                        asset.sevenDayChange
                      )}`}
                    >
                      {formatPercentage(asset.sevenDayChange)}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="relative">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[15px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              {" "}
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  aria-label="Previous"
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
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                        currentPage === number
                          ? "border-primary-500 bg-primary-500 text-white"
                          : " "
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
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  aria-label="Next"
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

export default IndividualAssetPerformance;
