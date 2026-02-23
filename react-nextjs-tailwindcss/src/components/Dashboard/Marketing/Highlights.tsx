"use client";

import React from "react";
import Image from "next/image";

interface HighlightData {
  icon: string;
  title: string;
  value: string;
  trend: "up" | "down";
  trendIcon: string;
  trendColor: string;
}

const highlightData: HighlightData[] = [
  {
    icon: "/images/icons/star.svg",
    title: "Average Client Rating",
    value: "4.9/5.0",
    trend: "up",
    trendIcon: "arrow_upward",
    trendColor: "text-success-600",
  },
  {
    icon: "/images/icons/instagram.svg",
    title: "Instagram Followers",
    value: "630K",
    trend: "down",
    trendIcon: "arrow_downward",
    trendColor: "text-orange-600",
  },
  {
    icon: "/images/icons/google2.svg",
    title: "Google Ads CPC",
    value: "$3.58",
    trend: "up",
    trendIcon: "arrow_upward",
    trendColor: "text-success-600",
  },
];

const Highlights: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Highlights</h5>
          </div>
          <div className="trezo-card-subtitle">
            <span className="block">Last 7 days</span>
          </div>
        </div>

        <div className="trezo-card-content">
          <ul>
            {highlightData.map((highlight, index) => (
              <li
                key={index}
                className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[14px] mb-[14px] last:border-none last:mb-0 last:pb-0"
              >
                <div className="relative ltr:pl-[23px] rtl:pr-[23px]">
                  <Image
                    src={highlight.icon}
                    className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2"
                    alt={highlight.title}
                    width={17}
                    height={17}
                  />
                  {highlight.title}
                </div>
                <span className="block relative font-medium text-black dark:text-white ltr:pl-[20px] rtl:pr-[20px]">
                  <i
                    className={`material-symbols-outlined ${highlight.trendColor} !text-[18px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2`}
                  >
                    {highlight.trendIcon}
                  </i>
                  {highlight.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Highlights;
