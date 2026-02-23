"use client";

import React from "react";
import Image from "next/image";

const UpgradePlans: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] rounded-md"
        style={{
          background: "linear-gradient(164deg, #B95232 3.1%, #EB6D5C 99.22%)",
        }}
      >
        <div className="trezo-card-content md:py-[30px] mx-auto md:max-w-[209px]">
          <h3 className="!text-white !text-lg md:!text-xl !leading-[1.3] !mb-[16px]">
            Have A Team More Than 10 Members?
          </h3>

          <a
            href="#"
            target="_blank"
            className="inline-block rounded-md bg-gray-900 text-white transition-all text-[15px] md:text-md font-medium py-[6px] px-[16.5px] hover:bg-gray-800 mb-[15px] md:mb-[30px]"
          >
            Upgrade Plans
          </a>

          <Image
            src="/images/paper.png"
            className="mx-auto"
            alt="paper-image"
            width={207}
            height={188}
          />
        </div>
      </div>
    </>
  );
};

export default UpgradePlans;
