"use client";

import React from "react";
import Image from "next/image";

const channelData = [
  {
    id: 1,
    icon: "/images/icons/facebook3.svg",
    name: "Facebook",
    description: "Community",
    progress: 50,
    progressColor: "primary",
  },
  {
    id: 2,
    icon: "/images/icons/dribbble2.svg",
    name: "Dribbble",
    description: "Community",
    progress: 75,
    progressColor: "secondary",
  },
  {
    id: 3,
    icon: "/images/icons/instagram2.svg",
    name: "Instagram",
    description: "Reels",
    progress: 30,
    progressColor: "orange",
  },
  {
    id: 4,
    icon: "/images/icons/behance.svg",
    name: "Behance",
    description: "Community",
    progress: 80,
    progressColor: "purple",
  },
  {
    id: 5,
    icon: "/images/icons/figma2.svg",
    name: "Figma",
    description: "Community",
    progress: 50,
    progressColor: "info",
  },
  {
    id: 6,
    icon: "/images/icons/google3.svg",
    name: "Google",
    description: "SEO & PPC",
    progress: 20,
    progressColor: "success",
  },
];

const Channels: React.FC = () => {
  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Channels</h5>
        </div>
      </div>
      <div className="trezo-card-content">
        {channelData.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[14px] mb-[14px] last:border-none last:mb-0 last:pb-0"
          >
            <div className="flex items-center gap-[15px]">
              <Image
                src={channel.icon}
                alt={channel.name}
                width={26}
                height={26}
              />
              <div>
                <span className="block font-semibold text-black dark:text-white">
                  {channel.name}
                </span>
                <span className="block text-xs mt-px">
                  {channel.description}
                </span>
              </div>
            </div>
            <div className="w-[150px]">
              <div className="leading-none flex items-center gap-[12px]">
                <div className="flex w-full h-[8px] overflow-hidden rounded-md bg-primary-100 dark:bg-[#172036]">
                  <div
                    className={`flex flex-col justify-center overflow-hidden bg-${channel.progressColor}-400 rounded-md`}
                    style={{ width: `${channel.progress}%` }}
                  ></div>
                </div>
                <span className="block text-xs">{channel.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channels;
