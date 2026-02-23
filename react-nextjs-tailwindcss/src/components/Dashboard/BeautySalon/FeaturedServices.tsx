"use client";

import React from "react";
import Image from "next/image";

interface Service {
  id: number;
  name: string;
  icon: string;
  servedCount: number;
  rank: number;
}

const FeaturedServices: React.FC = () => {
  // Sample service data
  const services: Service[] = [
    {
      id: 1,
      name: "Hair Cut",
      icon: "/images/icons/hair-cutting.svg",
      servedCount: 132,
      rank: 1,
    },
    {
      id: 2,
      name: "Manicure",
      icon: "/images/icons/manicure.svg",
      servedCount: 102,
      rank: 2,
    },
    {
      id: 3,
      name: "Pedicure",
      icon: "/images/icons/pedicure.svg",
      servedCount: 99,
      rank: 3,
    },
    {
      id: 4,
      name: "Nail Art",
      icon: "/images/icons/nail-polish.svg",
      servedCount: 89,
      rank: 4,
    },
    {
      id: 5,
      name: "Facial Treatment",
      icon: "/images/icons/woman.svg",
      servedCount: 72,
      rank: 5,
    },
    // Add more services as needed
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Featured Services</h5>
        </div>
      </div>

      <div className="trezo-card-content">
        <ul>
          {services.map((service) => (
            <li
              key={service.id}
              className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[12px] mb-[12px] last:border-none last:mb-0 last:pb-0"
            >
              <div className="flex items-center gap-[15px]">
                <Image
                  src={service.icon}
                  alt={service.name.toLowerCase()}
                  width={32}
                  height={32}
                />
                <div>
                  <span className="block font-medium text-black dark:text-white mb-[2px]">
                    {service.name}
                  </span>
                  <span className="block text-xs">
                    {service.servedCount} Served this week
                  </span>
                </div>
              </div>
              <span className="font-medium text-primary-500 rounded-full flex items-center justify-center bg-primary-100 dark:bg-[#172036] w-[25px] h-[25px] text-xs pt-px">
                {service.rank.toString().padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeaturedServices;
