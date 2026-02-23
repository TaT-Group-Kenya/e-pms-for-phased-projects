"use client";

import React from "react";
import Image from "next/image"; 

const Operations: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content flex justify-between">
          <div>
            <span className="block">Operations</span>
            <h2 className="!text-2xl !font-black !mt-[5px] !mb-[8px]">12</h2>
            <span className="inline-block text-xs rounded-[30px] px-[10px] border border-success-300 text-success-700 bg-success-100 dark:border-[#15203c] dark:bg-[#15203c]">
              +5.4%
            </span>
          </div>
          <div className="mt-[5px]">
            <Image
              src="/images/icons/scissors.svg"
              alt="scissors"
              width={46}
              height={46}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Operations;
