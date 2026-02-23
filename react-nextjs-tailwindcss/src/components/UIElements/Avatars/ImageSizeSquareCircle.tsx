"use client";

import React from "react";
import Image from "next/image";

const ImageSizeSquareCircle: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Image Size Square-Circle</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="flex items-center gap-[15px]">
            <Image
              src="/images/blue-man.jpg"
              alt="admin-image"
              className="rounded-md w-[130px] h-[130px]"
              width={130}
              height={130}
            />
            <Image
              src="/images/blue-man.jpg"
              alt="admin-image"
              className="rounded-md w-[110px] h-[110px]"
              width={110}
              height={110}
            />
            <Image
              src="/images/blue-man.jpg"
              alt="admin-image"
              className="rounded-md w-[90px] h-[90px]"
              width={90}
              height={90}
            />
            <Image
              src="/images/blue-man.jpg"
              alt="admin-image"
              className="rounded-md w-[70px] h-[70px]"
              width={70}
              height={70}
            />
            <Image
              src="/images/blue-man.jpg"
              alt="admin-image"
              className="rounded-md w-[50px] h-[50px]"
              width={50}
              height={50}
            />
          </div>
          <div className="mt-[20px]"></div>
        </div>
      </div>
    </>
  );
};

export default ImageSizeSquareCircle;
