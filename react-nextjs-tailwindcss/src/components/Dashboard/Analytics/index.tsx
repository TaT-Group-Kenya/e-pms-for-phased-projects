"use client";

import React from "react";
import Image from "next/image";
import WebsiteVisits from "./AnalyticsStats/WebsiteVisits";
import NewRegisters from "./AnalyticsStats/NewRegisters";

const AnalyticsStats: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md relative">
        <div className="trezo-card-content">
          <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 gap-[25px]">
            <WebsiteVisits />

            <NewRegisters />
          </div>
        </div>

        <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 hidden md:block">
          <Image
            src="/images/spring-fat.png"
            alt="spring-fat"
            width={230}
            height={130}
          />
        </div>
      </div>
    </>
  );
};

export default AnalyticsStats;
