"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MarketPriceStatistics: React.FC = () => {
  // selectedOption state
  const cryptocurrencies = [
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: "/images/cryptocurrencies/ethereum.svg",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      icon: "/images/cryptocurrencies/bitcoin.svg",
    },
    {
      name: "Solana",
      symbol: "SOL",
      icon: "/images/cryptocurrencies/solana.svg",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      icon: "/images/cryptocurrencies/cardano.png",
    },
    {
      name: "Binance",
      symbol: "BNB",
      icon: "/images/cryptocurrencies/binance.svg",
    },
  ];

  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[1]);
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Price",
      data: [
        {
          x: new Date(1538778600000),
          y: [6629.81, 6650.5, 6623.04, 6633.33],
        },
        {
          x: new Date(1538780400000),
          y: [6632.01, 6643.59, 6620, 6630.11],
        },
        {
          x: new Date(1538782200000),
          y: [6630.71, 6648.95, 6623.34, 6635.65],
        },
        {
          x: new Date(1538784000000),
          y: [6635.65, 6651, 6629.67, 6638.24],
        },
        {
          x: new Date(1538785800000),
          y: [6638.24, 6640, 6620, 6624.47],
        },
        {
          x: new Date(1538787600000),
          y: [6624.53, 6636.03, 6621.68, 6624.31],
        },
        {
          x: new Date(1538789400000),
          y: [6624.61, 6632.2, 6617, 6626.02],
        },
        {
          x: new Date(1538791200000),
          y: [6627, 6627.62, 6584.22, 6603.02],
        },
        {
          x: new Date(1538793000000),
          y: [6605, 6608.03, 6598.95, 6604.01],
        },
        {
          x: new Date(1538794800000),
          y: [6604.5, 6614.4, 6602.26, 6608.02],
        },
        {
          x: new Date(1538796600000),
          y: [6608.02, 6610.68, 6601.99, 6608.91],
        },
        {
          x: new Date(1538798400000),
          y: [6608.91, 6618.99, 6608.01, 6612],
        },
        {
          x: new Date(1538800200000),
          y: [6612, 6615.13, 6605.09, 6612],
        },
        {
          x: new Date(1538802000000),
          y: [6612, 6624.12, 6608.43, 6622.95],
        },
        {
          x: new Date(1538803800000),
          y: [6623.91, 6623.91, 6615, 6615.67],
        },
        {
          x: new Date(1538805600000),
          y: [6618.69, 6618.74, 6610, 6610.4],
        },
        {
          x: new Date(1538807400000),
          y: [6611, 6622.78, 6610.4, 6614.9],
        },
        {
          x: new Date(1538809200000),
          y: [6614.9, 6626.2, 6613.33, 6623.45],
        },
        {
          x: new Date(1538811000000),
          y: [6623.48, 6627, 6618.38, 6620.35],
        },
        {
          x: new Date(1538812800000),
          y: [6619.43, 6620.35, 6610.05, 6615.53],
        },
        {
          x: new Date(1538814600000),
          y: [6615.53, 6617.93, 6610, 6615.19],
        },
        {
          x: new Date(1538816400000),
          y: [6615.19, 6621.6, 6608.2, 6620],
        },
        {
          x: new Date(1538818200000),
          y: [6619.54, 6625.17, 6614.15, 6620],
        },
        {
          x: new Date(1538820000000),
          y: [6620.33, 6634.15, 6617.24, 6624.61],
        },
        {
          x: new Date(1538821800000),
          y: [6625.95, 6626, 6611.66, 6617.58],
        },
        {
          x: new Date(1538823600000),
          y: [6619, 6625.97, 6595.27, 6598.86],
        },
        {
          x: new Date(1538825400000),
          y: [6598.86, 6598.88, 6570, 6587.16],
        },
        {
          x: new Date(1538827200000),
          y: [6588.86, 6600, 6580, 6593.4],
        },
        {
          x: new Date(1538829000000),
          y: [6593.99, 6598.89, 6585, 6587.81],
        },
        {
          x: new Date(1538830800000),
          y: [6587.81, 6592.73, 6567.14, 6578],
        },
        {
          x: new Date(1538832600000),
          y: [6578.35, 6581.72, 6567.39, 6579],
        },
        {
          x: new Date(1538834400000),
          y: [6579.38, 6580.92, 6566.77, 6575.96],
        },
        {
          x: new Date(1538836200000),
          y: [6575.96, 6589, 6571.77, 6588.92],
        },
        {
          x: new Date(1538838000000),
          y: [6588.92, 6594, 6577.55, 6589.22],
        },
        {
          x: new Date(1538839800000),
          y: [6589.3, 6598.89, 6589.1, 6596.08],
        },
        {
          x: new Date(1538841600000),
          y: [6597.5, 6600, 6588.39, 6596.25],
        },
        {
          x: new Date(1538843400000),
          y: [6598.03, 6600, 6588.73, 6595.97],
        },
        {
          x: new Date(1538845200000),
          y: [6595.97, 6602.01, 6588.17, 6602],
        },
        {
          x: new Date(1538847000000),
          y: [6602, 6607, 6596.51, 6599.95],
        },
        {
          x: new Date(1538848800000),
          y: [6600.63, 6601.21, 6590.39, 6591.02],
        },
        {
          x: new Date(1538850600000),
          y: [6591.02, 6603.08, 6591, 6591],
        },
        {
          x: new Date(1538852400000),
          y: [6591, 6601.32, 6585, 6592],
        },
        {
          x: new Date(1538854200000),
          y: [6593.13, 6596.01, 6590, 6593.34],
        },
        {
          x: new Date(1538856000000),
          y: [6593.34, 6604.76, 6582.63, 6593.86],
        },
        {
          x: new Date(1538857800000),
          y: [6593.86, 6604.28, 6586.57, 6600.01],
        },
        {
          x: new Date(1538859600000),
          y: [6601.81, 6603.21, 6592.78, 6596.25],
        },
        {
          x: new Date(1538861400000),
          y: [6596.25, 6604.2, 6590, 6602.99],
        },
        {
          x: new Date(1538863200000),
          y: [6602.99, 6606, 6584.99, 6587.81],
        },
        {
          x: new Date(1538865000000),
          y: [6587.81, 6595, 6583.27, 6591.96],
        },
        {
          x: new Date(1538866800000),
          y: [6591.97, 6596.07, 6585, 6588.39],
        },
        {
          x: new Date(1538868600000),
          y: [6587.6, 6598.21, 6587.6, 6594.27],
        },
        {
          x: new Date(1538870400000),
          y: [6596.44, 6601, 6590, 6596.55],
        },
        {
          x: new Date(1538872200000),
          y: [6598.91, 6605, 6596.61, 6600.02],
        },
        {
          x: new Date(1538874000000),
          y: [6600.55, 6605, 6589.14, 6593.01],
        },
        {
          x: new Date(1538875800000),
          y: [6593.15, 6605, 6592, 6603.06],
        },
        {
          x: new Date(1538877600000),
          y: [6603.07, 6604.5, 6599.09, 6603.89],
        },
        {
          x: new Date(1538879400000),
          y: [6604.44, 6604.44, 6600, 6603.5],
        },
        {
          x: new Date(1538881200000),
          y: [6603.5, 6603.99, 6597.5, 6603.86],
        },
        {
          x: new Date(1538883000000),
          y: [6603.85, 6605, 6600, 6604.07],
        },
        {
          x: new Date(1538884800000),
          y: [6604.98, 6606, 6604.07, 6606],
        },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#EE3E08",
          downward: "#4936F5",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 6,
      tooltip: {
        enabled: true,
      },
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
  };

  return (
    <>
      <div className="trezo-card border border-gray-100 dark:border-[#172036] mb-[25px] pt-[15px] pb-[20px] md:pb-[25px] px-[20px] md:px-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between border-b border-gray-100 dark:border-[#172036] px-[20px] md:px-[25px] pb-[15px] -mx-[20px] md:-mx-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Market Price Statistics</h5>
          </div>
          <div className="trezo-card-subtitle sm:flex items-center gap-[25px]">
            <div className="my-[15px] sm:my-0">
              <button
                type="button"
                className="inline-block border border-gray-100 dark:border-[#172036] px-[10px] py-[1.5px] transition-all hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[1px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
              >
                1H
              </button>

              <button
                type="button"
                className="inline-block border border-gray-100 dark:border-[#172036] px-[10px] py-[1.5px] transition-all hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[1px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
              >
                24H
              </button>

              <button
                type="button"
                className="inline-block border border-gray-100 dark:border-[#172036] px-[10px] py-[1.5px] transition-all bg-primary-50 dark:bg-[#15203c] hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[1px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
              >
                1W
              </button>

              <button
                type="button"
                className="inline-block border border-gray-100 dark:border-[#172036] px-[10px] py-[1.5px] transition-all hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[1px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
              >
                1M
              </button>

              <button
                type="button"
                className="inline-block border border-gray-100 dark:border-[#172036] px-[10px] py-[1.5px] transition-all hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[1px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
              >
                1Y
              </button>
            </div>

            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn flex items-center font-semibold relative text-black dark:text-white ltr:pr-[20px] rtl:pl-[20px]">
                <Image
                  src={selectedCrypto.icon}
                  className="w-[24px] ltr:mr-[6px] rtl:ml-[6px]"
                  alt={selectedCrypto.name}
                  width={24}
                  height={24}
                />
                {selectedCrypto.name}
                <i className="ri-arrow-down-s-line text-[20px] absolute ltr:-right-[4px] rtl:-left-[4px] top-1/2 -translate-y-1/2"></i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {cryptocurrencies.map((crypto) => (
                  <MenuItem
                    key={crypto.name}
                    onClick={() => setSelectedCrypto(crypto)}
                    as="div"
                    className="flex items-center w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] cursor-pointer hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    <Image
                      src={crypto.icon}
                      className="w-[22px] ltr:mr-[8px] rtl:ml-[8px]"
                      alt={crypto.name}
                      width={22}
                      height={22}
                    />
                    {crypto.name}
                    <span className="font-normal ltr:ml-[3px] rtl:mr-[3px] text-gray-500 dark:text-gray-400">
                      ({crypto.symbol})
                    </span>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="market-price-statistics md:flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/images/cryptocurrencies/big-bitcoin.svg"
                alt="bitcoin"
                width={48}
                height={48}
              />
              <div className="ltr:ml-[10px] rtl:mr-[10px]">
                <span className="text-black dark:text-white uppercase font-medium">
                  Bitcoin
                  <span className="font-normal text-gray-500 dark:text-gray-400">
                    (BTC)
                  </span>
                </span>
                <h4 className="!mb-0 !mt-[6px] !text-[18px] md:!text-[20px] !font-semibold">
                  $27,500
                  <span className="relative font-medium text-base text-success-700 -top-px ltr:ml-[2px] rtl:mr-[2px] ltr:pl-[24px] rtl:pr-[24px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] top-1/2 -translate-y-1/2">
                      trending_up
                    </i>
                    +2.3%
                  </span>
                </h4>
              </div>
            </div>

            <ul className="my-[15px] md:my-0">
              <li className="inline-block text-black dark:text-white font-semibold mx-[18px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <span className="block text-gray-500 dark:text-gray-400 mb-[5px] font-normal">
                  Closing Price
                </span>
                $27,200
              </li>
              <li className="inline-block text-black dark:text-white font-semibold mx-[18px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <span className="block text-gray-500 dark:text-gray-400 mb-[5px] font-normal">
                  24h Volume
                </span>
                $35B
              </li>
            </ul>

            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[8px] rtl:-ml-[8px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>

          <div className="mt-[15px] ltr:-ml-[15px] rtl:-mr-[15px] -mb-[15px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="candlestick"
                height={326}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketPriceStatistics;
