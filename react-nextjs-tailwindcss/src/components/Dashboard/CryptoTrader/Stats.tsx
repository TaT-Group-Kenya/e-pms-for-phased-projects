"use client";

import React from "react";

const Stats: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card bg-cover bg-no-repeat bg-center p-[20px] md:p-[25px] rounded-md mb-[25px]"
        style={{
          backgroundImage: "url(/images/sparklines/sparkline-bg.jpg)",
        }}
      >
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px]">
            <div className="p-[20px] md:p-[25px] rounded-md bg-white dark:bg-[#0c1427]">
              <span className="block">Total Value of all Crypto</span>
              <h4 className="!mb-0 mt-[5px] !text-[20px]">$597.655B</h4>
            </div>

            <div className="p-[20px] md:p-[25px] rounded-md bg-white dark:bg-[#0c1427]">
              <span className="block">First Trade Volume</span>
              <h4 className="!mb-0 mt-[5px] !text-[20px]">
                $21.953M{" "}
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  (1 Jan, 2025)
                </span>
              </h4>
            </div>

            <div className="p-[20px] md:p-[25px] rounded-md bg-white dark:bg-[#0c1427]">
              <span className="block">Last Trade Volume</span>
              <h4 className="!mb-0 mt-[5px] !text-[20px]">
                $25.965B{" "}
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  (1 Nov, 2025)
                </span>
              </h4>
            </div>

            <div className="p-[20px] md:p-[25px] rounded-md bg-white dark:bg-[#0c1427]">
              <span className="block">Crypto Total Market Cap</span>
              <h4 className="!mb-0 mt-[5px] !text-[20px]">$1.36T</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
