"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AnalyticsItem = {
  label: string;
  value: string | number;
  goal: number; // Goal completion percentage
  color: string; // Color for the progress bar
};

const AnalyticsOverview: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "New users",
      data: [28, 50, 90, 95, 20, 70, 35],
    },
    {
      name: "Page Views",
      data: [80, 60, 70, 30, 45, 20, 80],
    },
    {
      name: "Page Sessions",
      data: [32, 23, 78, 35, 65, 35, 15],
    },
    {
      name: "Bounce Rate",
      data: [60, 25, 80, 25, 15, 40, 15],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#605DFF", "#AD63F6", "#3584FC", "#FD5812"],
    plotOptions: {
      bar: {
        columnWidth: "65%",
        borderRadius: 4,
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      show: true,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      tickAmount: 5,
      max: 100,
      min: 0,
      labels: {
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

  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);

  // Simulate fetching data from an API or other source
  useEffect(() => {
    const fetchData = async () => {
      // Replace with actual API call
      const data: AnalyticsItem[] = [
        {
          label: "New Users",
          value: "19.5k",
          goal: 75,
          color: "bg-primary-500",
        },
        {
          label: "Page Views",
          value: "48k",
          goal: 45,
          color: "bg-purple-500",
        },
        {
          label: "Page Sessions",
          value: "33.3k",
          goal: 55,
          color: "bg-secondary-500",
        },
        {
          label: "Bounce Rate",
          value: "22.45%",
          goal: 35,
          color: "bg-danger-500",
        },
      ];
      setAnalyticsData(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Analytics Overview</h5>
          </div>

          <div className="trezo-card-subtitle mt-[13px] sm:mt-0">
            <button
              type="button"
              className="inline-block border border-gray-100 dark:border-[#172036] px-[15.5px] py-[1.5px] transition-all hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[3px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
            >
              Day
            </button>
            <button
              type="button"
              className="inline-block border border-gray-100 dark:border-[#172036] px-[15.5px] py-[1.5px] transition-all bg-primary-50 dark:bg-[#15203c] hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[3px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
            >
              Week
            </button>
            <button
              type="button"
              className="inline-block border border-gray-100 dark:border-[#172036] px-[15.5px] py-[1.5px] transition-all hover:bg-primary-50 dark:hover:bg-[#15203c] -mx-[3px] ltr:first:rounded-l-md rtl:first:rounded-r-lg ltr:last:rounded-r-md rtl:last:rounded-l-md"
            >
              Month
            </button>
          </div>
        </div>

        <div className="trezo-card-content -mt-[9px] sm:-mt-[17px] md:-mt-[22px]">
          <p className="text-xs">Track, Analyze, and Optimize Performance</p>

          <div className="lg:grid lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-2">
              <div className="-mb-[18px] ltr:-ml-[15px] rtl:-mr-[15px]">
                {isChartLoaded && (
                  <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                    width={"100%"}
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <ul className="mt-[15px] md:mt-[19px] lg:ltr:-ml-[22px] lg:rtl:-mr-[22px]">
                {analyticsData.map((item, index) => (
                  <li className="mb-[24px] last:mb-0" key={index}>
                    <div className="flex justify-between">
                      <div>
                        <span className="block text-xs mb-[2px] text-black dark:text-white">
                          {item.label}
                        </span>
                        <h5 className="!text-md !mb-0">{item.value}</h5>
                      </div>
                      <div>
                        <span className="block text-xs mb-[2px] text-black dark:text-white">
                          Goal Reached
                        </span>
                        <h5 className="!text-md !mb-0 !text-gray-500 dark:!text-gray-400 ltr:!text-right rtl:!text-left">
                          {item.goal}%
                        </h5>
                      </div>
                    </div>

                    <div className="mt-[11px] flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                      <div
                        className={`flex flex-col justify-center overflow-hidden ${item.color} rounded-md`}
                        style={{ width: `${item.goal}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsOverview;
