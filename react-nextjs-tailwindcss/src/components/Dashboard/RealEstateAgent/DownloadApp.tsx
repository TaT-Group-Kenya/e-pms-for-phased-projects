"use client";

import React from "react";
import Image from "next/image";

const DownloadApp: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-success-200 dark:bg-[#15203c] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content mx-auto py-[10px] md:py-[20px] lg:py-[26px] max-w-[210px]">
          <h3 className="!text-[20px] md:!text-xl !mb-[15px] md:!mb-[20px]">
            Manage Your Dashboard From Your Mobile
          </h3>

          <a
            href="#"
            className="py-[7px] px-[17.5px] mb-[20px] md:mb-[31px] inline-block rounded-[4px] text-white text-base md:text-[15px] lg:text-md font-medium bg-success-900 transition-all hover:bg-success-700"
            target="_blank"
          >
            Download App
          </a>

          <Image
            src="/images/paper.png"
            alt="paper-image"
            className="mx-auto"
            width={207}
            height={188}
          />
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
