"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Channel {
  id: string;
  name: string;
  icon: string;
  category: string;
  percentage: number;
  color: string;
}

const ProgressCircle: React.FC<{ percentage: number; color: string }> = ({
  percentage,
  color,
}) => {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-full relative w-[50px] h-[50px]">
      <svg
        width="60"
        height="60"
        viewBox="-25 -25 250 250"
        className="relative -top-[5px] ltr:-left-[5px] rtl:-right-[5px]"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          r="90"
          cx="100"
          cy="100"
          fill="transparent"
          stroke="transparent"
          strokeWidth="16px"
          strokeDasharray={circumference}
          strokeDashoffset="0"
        />
        <circle
          r="90"
          cx="100"
          cy="100"
          stroke={color}
          strokeWidth="16px"
          strokeLinecap="round"
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          strokeDasharray={circumference}
        />
      </svg>
      <span className="block text-gray-500 dark:text-gray-400 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[10px] absolute">
        {percentage}%
      </span>
    </div>
  );
};

const TopChannels: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const channels: Channel[] = [
    {
      id: "1",
      name: "Facebook",
      icon: "/images/icons/facebook3.svg",
      category: "Community",
      percentage: 80,
      color: "#605DFF",
    },
    {
      id: "2",
      name: "Dribbble",
      icon: "/images/icons/dribbble2.svg",
      category: "Community",
      percentage: 75,
      color: "#5DA8FF",
    },
    {
      id: "3",
      name: "Instagram",
      icon: "/images/icons/instagram2.svg",
      category: "Reels",
      percentage: 80,
      color: "#FE7A36",
    },
    {
      id: "4",
      name: "Google",
      icon: "/images/icons/google3.svg",
      category: "SEO & PPC",
      percentage: 100,
      color: "#58F229",
    },
    {
      id: "5",
      name: "Figma",
      icon: "/images/icons/figma2.svg",
      category: "Community",
      percentage: 60,
      color: "#BF85FB",
    },
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Top Channels</h5>
        </div>
        <div className="trezo-card-subtitle">
          <Link
            href="#"
            className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
          >
            Browse All{" "}
            <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
          </Link>
        </div>
      </div>

      <div className="trezo-card-content">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[10px] mb-[10px] last:border-none last:mb-0 last:pb-0"
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
                <span className="block text-xs mt-[2px]">
                  {channel.category}
                </span>
              </div>
            </div>
            <ProgressCircle
              percentage={channel.percentage}
              color={channel.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopChannels;
