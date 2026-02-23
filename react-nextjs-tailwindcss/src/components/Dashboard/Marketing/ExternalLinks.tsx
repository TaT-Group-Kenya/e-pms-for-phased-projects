"use client";

import React from "react";
import Image from "next/image";

const externalLinksData = [
  {
    id: 1,
    icon: "/images/icons/google3.svg",
    name: "Google Ad Analytics",
    link: "#",
  },
  {
    id: 2,
    icon: "/images/icons/instagram2.svg",
    name: "Instagram Ads",
    link: "#",
  },
  {
    id: 3,
    icon: "/images/icons/facebook3.svg",
    name: "Facebook Ads",
    link: "#",
  },
];

const ExternalLinks: React.FC = () => {
  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">External Links</h5>
        </div>
      </div>
      <div className="trezo-card-content">
        {externalLinksData.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[13px] mb-[13px] last:border-none last:mb-0 last:pb-0"
          >
            <div className="relative ltr:pl-[28px] rtl:pr-[28px] font-medium text-primary-500">
              <Image
                src={link.icon}
                className="w-[18px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2"
                alt={link.name}
                width={18}
                height={18}
              />
              {link.name}
            </div>
            <a
              href={link.link}
              target="_blank"
              className="inline-block transition-all leading-none hover:text-primary-500"
            >
              <i className="material-symbols-outlined !text-[18px]">
                open_in_new
              </i>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalLinks;
