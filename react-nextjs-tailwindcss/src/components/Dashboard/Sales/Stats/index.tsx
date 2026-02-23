"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TotalSales from "./TotalSales";
import TotalOrders from "./TotalOrders";
import TotalProfit from "./TotalProfit";
import TotalRevenue from "./TotalRevenue";

const Stats: React.FC = () => {

  const [dateRange, setDateRange] = useState<string>("");

  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const formatDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${month} ${day}, ${date.getFullYear()}`;
    };

    setDateRange(`${formatDate(startOfMonth)} - ${formatDate(endOfMonth)}`);
  }, []);

  return (
    <>
      <div className="trezo-card rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 md:!text-xl !flex !items-center !font-normal">
              Welcome Back,{" "}
              <span className="text-primary-500 font-medium">Olivia!</span>
              <Image
                src="/images/icons/dog.svg"
                className="inline-block ltr:ml-[5px] rtl:mr-[5px]"
                alt="dog"
                width={32}
                height={32}
              />
            </h5>
          </div>

          <div className="trezo-card-subtitle sm:flex items-center mt-[10px] sm:mt-0">
            <button
              type="button"
              className="ltr:mr-[10px] rtl:ml-[10px] rounded-md inline-block transition-all py-[3.5px] px-[17px] border border-gray-100 dark:border-[#172036] hover:border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[26px] rtl:pr-[26px]">
                <i className="ri-calendar-line absolute text-[18px] top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                {dateRange}
              </span>
            </button>

            <button
              type="button"
              className="inline-block rounded-md transition-all bg-primary-500 text-white py-[4.5px] px-[17px] hover:bg-primary-400 mt-[10px] sm:mt-0"
            >
              <span className="inline-block relative ltr:pl-[26px] rtl:pr-[26px]">
                <i className="ri-download-2-line absolute text-[18px] top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                Export CSV
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-x-[25px]">
            <div>
              <TotalSales />
            </div>

            <div>
              <TotalOrders />
            </div>

            <div>
              <TotalProfit />
            </div>

            <div>
              <TotalRevenue />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
