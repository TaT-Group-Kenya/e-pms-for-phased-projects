"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ActivePage = {
  url: string;
  visitors: number;
};

const RealtimeActiveUsers: React.FC = () => {
  const [activePages, setActivePages] = useState<ActivePage[]>([]);

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Users",
      data: [
        100, 90, 85, 95, 100, 100, 90, 85, 95, 100, 100, 90, 85, 95, 100, 100,
        90, 85, 95, 100, 100, 90, 85, 95, 100, 100, 90, 85, 95, 100,
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#757DFF"],
    plotOptions: {
      bar: {
        columnWidth: "100%",
      },
    },
    grid: {
      show: false,
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
      max: 100,
      min: 0,
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

  // Simulate fetching data from an API or other source
  useEffect(() => {
    const fetchData = async () => {
      // Replace with actual API call
      const data: ActivePage[] = [
        { url: "/reports/trends-analysis", visitors: 1520 },
        { url: "/monitoring/user-activity", visitors: 980 },
        { url: "/specific/industry-comparisons", visitors: 856 },
        { url: "/global-reach-2023/statistics", visitors: 735 },
        { url: "/security-alerts/2024-update", visitors: 520 },
      ];
      setActivePages(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="trezo-card bg-primary-600 mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative z-[1]">
          <h6 className="!text-md !mb-[6px] !font-light !text-white">
            Realtime Active Users
          </h6>

          <h2 className="!text-4xl !mb-[20px] md:!mb-[25px] lg:!mb-[45px] !text-white !leading-none !font-medium !-tracking-[1px]">
            4,890
          </h2>

          <span className="block text-white pb-[6px] border-b border-primary-500">
            Page views per second
          </span>

          <div className="-mb-[10px] md:-mb-[2px] ltr:-ml-[29px] rtl:-mr-[29px] ltr:-mr-[17px] rtl:-ml-[17px]">
            <div id="analyticsRealtimeActiveUsersChart"></div>
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={170}
                width={"100%"}
              />
            )}
          </div>

          <span className="block text-white pb-[6px] border-b border-primary-500 font-semibold">
            Top Active Pages
          </span>

          <ul className="mt-[10px] mb-[20px] md:mb-[25px]">
            {activePages.map((page, index) => (
              <li
                className="text-white flex items-center justify-between pb-[4.8px] mb-[4.8px] border-b border-primary-500 last:mb-0"
                key={index}
              >
                <span className="block">
                  {page.url}
                  <a
                    href={page.url}
                    className="ml-[5px] transition-all hover:text-gray-200"
                  >
                    <i className="ri-external-link-line"></i>
                  </a>
                </span>
                <span className="block">{page.visitors}</span>
              </li>
            ))}
          </ul>

          <div className="ltr:text-right rtl:text-left">
            <a
              href="#"
              className="inline-block px-[12px] py-[4px] rounded-md text-white font-medium border border-primary-400 transition-all hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pr-[17px] rtl:pl-[17px]">
                All Real-Time Report
                <i className="ri-arrow-right-s-line absolute ltr:-right-[6px] rtl:-left-[6px] text-[20px] top-1/2 -translate-y-1/2"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeActiveUsers;
