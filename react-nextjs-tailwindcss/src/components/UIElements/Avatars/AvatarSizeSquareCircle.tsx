"use client";

import React from "react"; 

const AvatarSizeSquareCircle: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Avatar Size Square-Circle</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="flex items-center gap-[15px]">
            <div className="bg-[#f5f7f8] dark:bg-[#15203c] text-[25px] h-[130px] w-[130px] flex items-center justify-center text-primary-500 rounded-md text-center font-bold">
              Ab
            </div>
            <div className="bg-[#f5f7f8] dark:bg-[#15203c] text-[20px] h-[110px] w-[110px] flex items-center justify-center text-primary-500 rounded-md text-center font-bold">
              Ab
            </div>
            <div className="bg-[#f5f7f8] dark:bg-[#15203c] text-[18px] h-[90px] w-[90px] flex items-center justify-center text-primary-500 rounded-md text-center font-bold">
              Ab
            </div>
            <div className="bg-[#f5f7f8] dark:bg-[#15203c] text-[16px] h-[70px] w-[70px] flex items-center justify-center text-primary-500 rounded-md text-center font-bold">
              Ab
            </div>
            <div className="bg-[#f5f7f8] dark:bg-[#15203c] h-[45px] w-[45px] flex items-center justify-center text-primary-500 rounded-md text-center font-bold">
              Ab
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvatarSizeSquareCircle;
