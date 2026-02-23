"use client";

import React from "react"; 

const CryptoMarketCap: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-purple-100 dark:bg-[#162243] py-[15px] px-[20px] md:px-[25px] rounded-md">
        <div className="trezo-card-content flex items-center justify-between">
          <div>
            <span className="block">Crypto Market Cap</span>
            <h5 className="!mb-0 mt-[4px] !text-[20px]">$2.64T</h5>
          </div>
          <div className="w-[53px] h-[53px] rounded-full bg-white dark:bg-[#0c1427] text-purple-500 flex items-center justify-center">
            <i className="material-symbols-outlined">payments</i>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoMarketCap;
