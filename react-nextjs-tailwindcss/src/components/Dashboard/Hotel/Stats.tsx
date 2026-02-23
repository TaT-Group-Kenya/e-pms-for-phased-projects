"use client";

import React from "react";
import Image from "next/image";

type Stat = {
  label: string;
  value: number;
  change: string;
  changeType: "increase" | "decrease";
  bgColor: string;
  icon: string;
};

const statsData: Stat[] = [
  {
    label: "New Bookings",
    value: 1540,
    change: "-4.15%",
    changeType: "decrease",
    bgColor: "bg-primary-100",
    icon: "/images/icons/add-event2.svg",
  },
  {
    label: "Check In",
    value: 245,
    change: "+3.4%",
    changeType: "increase",
    bgColor: "bg-orange-100",
    icon: "/images/icons/check-in-desk.svg",
  },
  {
    label: "Check Out",
    value: 315,
    change: "-1.4%",
    changeType: "decrease",
    bgColor: "bg-purple-100",
    icon: "/images/icons/point.svg",
  },
];

const Stats: React.FC = () => {
  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[10px] rounded-md mb-[25px]">
      <div className="trezo-card-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} dark:bg-[#0a0e19] p-[20px] rounded-md`}
            >
              <span className="block">{stat.label}</span>
              <h1 className="!leading-none !text-2xl !font-black mt-[5px] !mb-[11px]">
                {stat.value}
              </h1>
              <span
                className={`inline-block text-xs px-[9px] border rounded-[100px] ${
                  stat.changeType === "increase"
                    ? "text-success-700 border-success-500 bg-success-100"
                    : "text-danger-700 border-danger-400 bg-danger-100"
                } dark:bg-[#15203c] dark:border-[#15203c]`}
              >
                {stat.change}
              </span>
              <div className="bg-white dark:bg-[#0c1427] rounded-full w-[79px] h-[79px] flex items-center justify-end -mt-[14px] ltr:ml-auto rtl:mr-auto">
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={56}
                  height={56}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
