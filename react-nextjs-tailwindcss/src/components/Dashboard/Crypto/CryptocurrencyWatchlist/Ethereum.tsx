"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Ethereum: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Price",
      data: [90, 130, 140, 110, 120, 95, 85, 170],
    },
  ];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    colors: ["#AD63F6"],
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.9,
      },
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
        "07 Jan",
        "08 Jan",
      ],
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: false,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      show: false,
      max: 170,
      min: 0,
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
        formatter: (val) => {
          return "$" + val + "K";
        },
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "12px",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "circle",
      },
    },
  };

  return (
    <>
      <div className="bg-purple-50 dark:bg-[#172036] p-[15px] md:p-[23px] rounded-md">
        <div className="flex items-center">
          <Image
            src="/images/watchlist/ethereum.svg"
            className="w-[48px]"
            alt="ethereum"
            width={48}
            height={48}
          />
          <div className="ltr:ml-[10px] rtl:mr-[10px]">
            <span className="text-black dark:text-white uppercase font-medium">
              Ethereum
              <span className="font-normal text-gray-500 dark:text-gray-400">
                (ETH)
              </span>
            </span>
            <h4 className="!mb-0 !mt-[6px] !text-[18px] md:!text-[20px] !font-semibold">
              $1,750
              <span className="relative font-medium text-base text-danger-700 -top-px ltr:ml-[2px] rtl:mr-[2px] ltr:pl-[24px] rtl:pr-[24px]">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] top-1/2 -translate-y-1/2">
                  trending_down
                </i>
                -1.2%
              </span>
            </h4>
          </div>
        </div>

        <div className="-mt-[15px] -mb-[18px] ltr:-ml-[11px] rtl:-mr-[11px]">
          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="area"
              height={120}
              width={"100%"}
            />
          )}
        </div>

        <ul className="ltr:mr-[8px] rtl:ml-[8px] flex items-center justify-between">
          <li className="text-xs font-semibold text-black dark:text-white">
            <span className="block font-medium text-gray-500 dark:text-gray-400 mb-[5px]">
              Market Cap:
            </span>
            $210B
          </li>
          <li className="text-xs font-semibold text-black dark:text-white">
            <span className="block font-medium text-gray-500 dark:text-gray-400 mb-[5px]">
              Volume (24h):
            </span>
            $20B
          </li>
        </ul>
      </div>
    </>
  );
};

export default Ethereum;
