"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const NewEmployees: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [30];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#9135E8"],
    plotOptions: {
      radialBar: {
        track: {
          background: "#EDEEF0",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            offsetY: 5,
            fontWeight: 500,
            color: "#9135E8",
            fontSize: "14px",
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[30px] rounded-md">
        <div className="trezo-card-content relative">
          <div className="flex items-center gap-[12px]">
            <div className="bg-purple-600 rounded-[4px] text-white w-[44px] h-[44px] flex items-center justify-center">
              <i className="material-symbols-outlined">person_add</i>
            </div>
            <div>
              <span className="block">New Employees</span>
              <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">824</h5>
            </div>
          </div>
          
          <div className="mt-[32px] flex items-center gap-[7px]">
            <div className="bg-success-100 dark:bg-[#15203c] text-success-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-lg">
              <i className="ri-arrow-right-up-line"></i>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-400">
                +10%
              </span>{" "}
              last year
            </div>
          </div>

          <div className="absolute -bottom-[10px] ltr:right-0 rtl:left-0 max-w-[125px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={165}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewEmployees;
