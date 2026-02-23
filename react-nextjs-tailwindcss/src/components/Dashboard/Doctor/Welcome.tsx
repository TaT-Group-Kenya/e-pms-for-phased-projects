"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card pt-[25px] md:pt-[8px] px-[20px] md:px-[35px] lg:px-[50px] ltr:2xl:pl-[105px] rtl:2xl:pr-[105px] ltr:2xl:pr-[80px] rtl:2xl:pl-[80px] rounded-md relative z-[1]"
        style={{
          background: "linear-gradient(272deg, #1F64F1 31.27%, #123A8B 98.4%)",
        }}
      >
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:pt-[40px] text-center ltr:md:text-left rtl:md:text-right">
              <span className="block text-white text-base md:text-lg mb-[6px] lg:mb-[4px]">
                Good Morning
              </span>

              <h1 className="!mb-[10px] !text-xl md:!text-2xl !font-black !text-white">
                Dr. Olivia John
              </h1>

              <span className="inline-block relative text-white text-xs uppercase ltr:pl-[20px] rtl:pr-[20px] mb-[9px]">
                <Image
                  src="/images/icons/heart.png"
                  className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2"
                  alt="heart"
                  width={18}
                  height={18}
                />
                CARDIO SPECIALIST
              </span>

              <p className="text-gray-300">
                Today you have <span className="text-white">15</span>{" "}
                Consultations and <span className="text-white">12</span>{" "}
                Operations.
              </p>
            </div>

            <div className="text-center mt-[15px] md:mt-0 ltr:md:text-right rtl:md:text-left">
              <Image
                src="/images/main-doctor.png"
                className="inline-block"
                alt="doctor-image"
                width={210}
                height={240}
              />
            </div>
          </div>
        </div>

        <div className="absolute ltr:right-0 rtl:left-0 bottom-0 -z-[1] rtl:-scale-x-[1]">
          <Image src="/images/line.png" alt="line" width={845} height={220} />
        </div>

        <div className="hidden md:block absolute top-[60px] ltr:right-[40px] rtl:left-[40px] ltr:lg:right-[85px] rtl:lg:left-[85px] -z-[1] rtl:-scale-x-[1]">
          <Image src="/images/star.png" alt="star" width={300} height={80} />
        </div>
      </div>
    </>
  );
};

export default Welcome;
