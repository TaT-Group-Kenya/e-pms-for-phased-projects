"use client";

import React from "react";
import Image from "next/image";

const DownloadMobileApp: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] text-center rounded-md"
        style={{
          background: "linear-gradient(150deg, #827CD8 0.57%, #2D2761 95.93%)",
        }}
      >
        <div className="trezo-card-content md:py-[13px] mx-auto md:max-w-[245px]">
          <h3
            className="
          !text-white !text-lg md:!text-xl !leading-[1.3] !mb-[15px] md:!mb-[30px]
          "
          >
            <span className="font-normal">Have You Tried Our</span> New Mobile
            App?
          </h3>
          <Image
            src="/images/app.png"
            className="mx-auto"
            alt="app-image"
            width={240}
            height={214}
          />
          <a
            href="#"
            target="_blank"
            className="mt-[15px] md:mt-[30px] mb-[5px] inline-block rounded-md bg-primary-500 text-white transition-all text-[15px] md:text-md font-medium py-[6px] px-[16.5px] hover:bg-primary-400"
          >
            Download Mobile App
          </a>
        </div>
      </div>
    </>
  );
};

export default DownloadMobileApp;
