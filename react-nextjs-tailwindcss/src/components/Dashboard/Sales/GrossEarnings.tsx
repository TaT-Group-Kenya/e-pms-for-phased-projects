"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const GrossEarnings: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Earnings",
      data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 4,
      curve: "smooth",
    },
    xaxis: {
      categories: ["1W", "2W", "3W", "4W", "5W", "6W", "7W", "8W", "9W", "10W"],
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
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    colors: ["#9135E8"],
    yaxis: {
      show: false,
      labels: {
        formatter: (val) => {
          return "$" + val + "K";
        },
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
    legend: {
      show: false,
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
      <div className="trezo-card bg-purple-100 dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center">
            <Image
              src="/images/icons/gross-earnings.svg"
              alt="gross-earnings"
              width={41}
              height={41}
            />

            <div className="ltr:ml-[10px] rtl:mr-[10px]">
              <span className="block uppercase">Gross Earnings</span>
              <h4 className="!mb-0 !text-[20px] !mt-[6px] !font-semibold">
                $78,350.00
                <span className="text-success-600 text-base font-medium -top-px relative ltr:ml-[2px] rtl:mr-[2px] ltr:pl-[25px] rtl:pr-[25px]">
                  <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                    trending_up
                  </i>
                  +2.3%
                </span>
              </h4>
            </div>
          </div>

          <div className="-mt-[15px] -mb-[8px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="line"
                height={245}
                width={"100%"}
              />
            )}
          </div>

          <div className="flex justify-between pt-[17px] border-t border-purple-200 dark:border-[#172036]">
            <div>
              <span className="block text-xs">Total Balance</span>
              <h6 className="!mb-0 !font-medium !text-lg !mt-[5px]">$3,42,890</h6>
            </div>
            <div>
              <span className="block text-xs">Withdrawals</span>
              <h6 className="!mb-0 !font-medium !text-lg !mt-[5px]">$2,35,425</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrossEarnings;
