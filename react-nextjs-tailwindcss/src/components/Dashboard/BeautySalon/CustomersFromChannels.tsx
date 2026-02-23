"use client";

import React from "react";
import Image from "next/image";

interface Channel {
  id: number;
  name: string;
  icon: string;
  description: string;
  percentage: number;
  color: "primary" | "secondary" | "orange" | "success";
}

const CustomersFromChannels: React.FC = () => {
  // Sample channel data
  const channels: Channel[] = [
    {
      id: 1,
      name: "Facebook",
      icon: "/images/icons/facebook3.svg",
      description: "Community",
      percentage: 50,
      color: "primary",
    },
    {
      id: 2,
      name: "Dribbble",
      icon: "/images/icons/dribbble2.svg",
      description: "Community",
      percentage: 75,
      color: "secondary",
    },
    {
      id: 3,
      name: "Instagram",
      icon: "/images/icons/instagram2.svg",
      description: "Reels",
      percentage: 30,
      color: "orange",
    },
    {
      id: 4,
      name: "Google",
      icon: "/images/icons/google3.svg",
      description: "SEO & PPC",
      percentage: 20,
      color: "success",
    },
    // Add more channels as needed
  ];

  // Get color classes based on channel color
  const getColorClasses = (color: string) => {
    return {
      bgLight: `bg-${color}-100 dark:bg-[#172036]`,
      bgDark: `bg-${color}-400`,
    };
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Customers From Channels</h5>
        </div>
      </div>

      <div className="trezo-card-content">
        {channels.map((channel) => {
          const colorClasses = getColorClasses(channel.color);
          return (
            <div
              key={channel.id}
              className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[14.5px] mb-[14.5px] last:border-none last:mb-0 last:pb-0"
            >
              <div className="flex items-center gap-[15px]">
                <Image
                  src={channel.icon}
                  alt={channel.name.toLowerCase()}
                  width={26}
                  height={26}
                />
                <div>
                  <span className="block font-semibold text-black dark:text-white">
                    {channel.name}
                  </span>
                  <span className="block text-xs mt-[2px]">
                    {channel.description}
                  </span>
                </div>
              </div>
              <div className="w-[150px]">
                <div className="leading-none flex items-center gap-[12px]">
                  <div
                    className={`flex w-full h-[8px] overflow-hidden rounded-md ${colorClasses.bgLight}`}
                  >
                    <div
                      className={`flex flex-col justify-center overflow-hidden ${colorClasses.bgDark} rounded-md`}
                      style={{ width: `${channel.percentage}%` }}
                    ></div>
                  </div>
                  <span className="block text-xs">{channel.percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomersFromChannels;
