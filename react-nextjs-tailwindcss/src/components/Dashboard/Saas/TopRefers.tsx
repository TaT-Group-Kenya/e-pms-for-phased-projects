"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ReferData {
  id: number;
  name: string;
  category: string;
  icon: string;
  progress: number;
  colorClass: string; // Tailwind color classes for progress bar
}

const TopRefers: React.FC = () => {
  const [refers] = useState<ReferData[]>([
    {
      id: 1,
      name: "Facebook",
      category: "Community",
      icon: "/images/icons/facebook3.svg",
      progress: 50,
      colorClass: "primary",
    },
    {
      id: 2,
      name: "Dribbble",
      category: "Community",
      icon: "/images/icons/dribbble2.svg",
      progress: 75,
      colorClass: "secondary",
    },
    {
      id: 3,
      name: "Instagram",
      category: "Reels",
      icon: "/images/icons/instagram2.svg",
      progress: 30,
      colorClass: "orange",
    },
    {
      id: 4,
      name: "Behance",
      category: "Community",
      icon: "/images/icons/behance.svg",
      progress: 80,
      colorClass: "purple",
    },
    {
      id: 5,
      name: "Google",
      category: "SEO & PPC",
      icon: "/images/icons/google3.svg",
      progress: 20,
      colorClass: "success",
    },
  ]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Refers</h5>
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
          {refers.slice(0, 5).map((refer) => (
            <div
              key={refer.id}
              className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[14px] mb-[14px] last:border-none last:mb-0 last:pb-0"
            >
              <div className="flex items-center gap-[15px]">
                <Image
                  src={refer.icon}
                  alt={refer.name}
                  width={26}
                  height={26}
                />
                <div>
                  <span className="block font-semibold text-gray-900 dark:text-gray-400">
                    {refer.name}
                  </span>
                  <span className="block text-xs mt-px">{refer.category}</span>
                </div>
              </div>
              <div className="w-[150px]">
                <div className="leading-none flex items-center gap-[12px]">
                  <div
                    className={`flex w-full h-[8px] overflow-hidden rounded-md bg-${refer.colorClass}-100 dark:bg-[#172036]`}
                  >
                    <div
                      className={`flex flex-col justify-center overflow-hidden bg-${refer.colorClass}-400 rounded-md`}
                      style={{ width: `${refer.progress}%` }}
                    ></div>
                  </div>
                  <span className="block text-xs">{refer.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TopRefers;
