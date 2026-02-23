"use client";

import React from "react";
import Image from "next/image";

interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change: {
    value: string;
    type: "increase" | "decrease";
  };
  imageUrl: string;
}

const Stats: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const statsData: StatItem[] = [
    {
      id: "1",
      title: "Total Listings",
      value: 3251,
      change: {
        value: "+3.4%",
        type: "increase",
      },
      imageUrl: "/images/buildings/building1.png",
    },
    {
      id: "2",
      title: "Sales Volume",
      value: "$1.2M",
      change: {
        value: "-3.2%",
        type: "decrease",
      },
      imageUrl: "/images/buildings/building2.png",
    },
    {
      id: "3",
      title: "Active Deals",
      value: 1124,
      change: {
        value: "+1.4%",
        type: "increase",
      },
      imageUrl: "/images/buildings/building3.png",
    },
    {
      id: "4",
      title: "Closed Deals",
      value: 2312,
      change: {
        value: "-1.2%",
        type: "decrease",
      },
      imageUrl: "/images/buildings/building4.png",
    },
  ];

  const getChangeStyle = (type: "increase" | "decrease") => {
    const baseStyle =
      "inline-block text-xs font-medium px-[8px] rounded-[100px]";

    return type === "increase"
      ? `${baseStyle} text-success-700 border border-success-500 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c]`
      : `${baseStyle} text-danger-700 border border-danger-400 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c]`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-[25px]">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
        >
          <div className="trezo-card-content flex items-center justify-between">
            <div>
              <span className="block">{stat.title}</span>
              <h3 className="!leading-none !text-xl mt-[6px] !mb-[11px]">
                {stat.value}
              </h3>
              <span className={getChangeStyle(stat.change.type)}>
                {stat.change.value}
              </span>
            </div>
            <div>
              <Image
                src={stat.imageUrl}
                alt={`${stat.title} illustration`}
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
