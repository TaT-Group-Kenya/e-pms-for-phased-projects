"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalOrders: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Orders",
      data: [60, 50, 40, 50, 45, 30, 50, 35, 60, 45, 30, 60],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#AD63F6"],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: "9px",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      show: true,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Sep",
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
      labels: {
        show: false,
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
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    legend: {
      show: false,
      position: "top",
      fontSize: "12px",
      horizontalAlign: "left",
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
      <div className="relative rounded-md p-[20px] md:p-[25px] !pb-[65px] mb-[25px] border border-gray-100 dark:border-[#172036]">
        <div className="flex items-center">
          <div className="bg-purple-100 dark:bg-[#15203c] text-white text-center relative z-[1] ltr:mr-[15px] rtl:ml-[15px] rounded-[5px] text-[25px] w-[55px] h-[55px]">
            <span className="inset-0 -z-[1] m-[8px] absolute rounded-[5px] bg-purple-500"></span>
            <i className="ri-shopping-bag-3-line absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
          </div>
          <div>
            <h6 className="!text-lg !md:text-xl !mb-[2px] !font-medium">1,250</h6>
            <span className="block">Total Orders</span>
          </div>
        </div>
        <div className="mt-[25px] md:mt-[45px] flex items-center">
          <span className="font-medium inline-block relative text-xs rounded-full border border-success-300 text-success-700 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] py-[2px] ltr:pl-[20px] rtl:pr-[20px] ltr:pr-[10px] rtl:pl-[10px]">
            <i className="ri-arrow-up-fill absolute top-1/2 -translate-y-1/2 text-base -mt-px ltr:left-[6px] rtl:right-[6px]"></i>
            8%
          </span>
          <span className="block ltr:ml-[10px] rtl:mr-[10px] text-xs">
            from last week
          </span>
        </div>
        <div className="absolute -bottom-[31px] ltr:left-0 rtl:right-0 ltr:right-[10px] rtl:left-[10px]">
          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="bar"
              height={140}
              width={"100%"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TotalOrders;
