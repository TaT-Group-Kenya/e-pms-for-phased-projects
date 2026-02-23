"use client";

import React from "react";
import Image from "next/image";

const ActiveTotalProperty: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card relative pt-[20px] md:pt-[25px] ltr:pl-[20px] ltr:md:pl-[25px] rtl:pr-[20px] rtl:md:pr-[25px] rounded-md"
        style={{
          background: "linear-gradient(101deg, #FE7A36 0%, #FD5812 100%)",
        }}
      >
        <div className="trezo-card-content">
          <span className="block text-white mb-[4px]">
            Active Total Property
          </span>

          <h3 className="!mb-0 !text-[20px] !text-white">507,020</h3>

          <div className="-mt-[5px] ltr:text-right rtl:text-left">
            <Image
              src="/images/man-searching-house.png"
              className="inline-block"
              alt="man-searching-house.png"
              width={188}
              height={125}
            />
          </div>
        </div>

        <Image
          src="/images/icons/4dot2.svg"
          className="absolute bottom-0 ltr:left-0 rtl:right-0 rtl:-scale-x-100"
          alt="4dot"
          width={60}
          height={60}
        />
      </div>
    </>
  );
};

export default ActiveTotalProperty;
