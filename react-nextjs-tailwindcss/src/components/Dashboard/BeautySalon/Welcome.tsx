"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] rounded-md !pb-0"
        style={{
          background: "linear-gradient(90deg, #EAB9D2 0%, #EBA2C7 100%)",
        }}
      >
        <div className="trezo-card-content md:pt-[11px]">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[20px] md:gap-[25px]">
            <div className="relative z-[1] md:-top-[11px] md:max-w-[255px] text-center ltr:md:text-left rtl:md:text-right ltr:md:-mr-[15px] rtl:md:-ml-[15px]">
              <span className="block text-md md:text-lg mb-[10px] text-dark">
                Hello Olivia!
              </span>
              <h1 className="!font-black !text-xl md:!text-2xl !mb-[12px] !text-dark">
                Welcome To Your Beauty Lounge
              </h1>
              <p className="text-black mb-0">
                You have 15.7% more bookings today.
              </p>
              <div
                className="absolute -z-[1] -top-[15px] -left-[15px] w-[60px] h-[60px] rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.04) 100%)",
                }}
              ></div>
            </div>
            <div className="mx-auto max-w-[237px] relative z-[1] text-center">
              <Image
                src="/images/girl-with-smile.png"
                className="inline-block"
                alt="girl-with-smile"
                width={237}
                height={266}
              />
              <div
                className="absolute -z-[1] top-[30px] left-1/2 -translate-x-1/2 w-[220px] h-[220px] rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.04) 100%)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
