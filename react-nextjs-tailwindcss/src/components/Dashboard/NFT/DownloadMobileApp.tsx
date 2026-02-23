"use client";

import React from "react";
import Image from "next/image";

const DownloadMobileApp: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] text-center rounded-md"
        style={{
          background: "linear-gradient(153deg, #FAD2D2 0%, #6FA3EC 100%)",
        }}
      >
        <div className="trezo-card-content py-px relative z-[1] mx-auto md:max-w-[245px]">
          <h3 className="!text-lg dark:!text-black md:!text-[20px] !leading-[1.2] !mb-[15px] md:!mb-[20px]">
            <span className="font-normal">Have You Tried Our</span> New Mobile
            App?
          </h3>

          <Image
            src="/images/nfts/nft-app.png"
            className="mx-auto"
            alt="nft-app-image"
            width={170}
            height={188}
          />

          <a
            href="#"
            target="_blank"
            className="mt-[15px] md:mt-[22px] inline-block rounded-md bg-primary-500 text-white transition-all text-[15px] md:text-md font-medium py-[6px] px-[16.5px] hover:bg-primary-400"
          >
            Download App
          </a>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-[201px] h-[201px] rounded-full bg-white opacity-[.15] -z-[1] mx-auto"></div>
        </div>
      </div>
    </>
  );
};

export default DownloadMobileApp;
