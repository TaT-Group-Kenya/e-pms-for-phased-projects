"use client";

import React from "react"; 

const TotalBalance: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md relative z-[1]">
        <div className="trezo-card-content flex items-center justify-between">
          <div>
            <span className="block">Total Balance</span>
            <h3 className="!mb-[21px] mt-[4px] !text-[20px]">$20,507</h3>
            <div className="flex items-center gap-[10px]">
              <span className="inline-block text-xs font-medium px-[8px] text-success-600 border border-success-600 bg-success-100 rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c]">
                +28.5%
              </span>
              <span className="block text-xs">Last Month</span>
            </div>
          </div>
          <div className="w-[75px] h-[75px] rounded-full text-secondary-500 flex items-center justify-center bg-secondary-100 dark:bg-[#15203c]">
            <i className="material-symbols-outlined !text-[35px]">
              account_balance_wallet
            </i>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full rounded-md -z-[1] dark:hidden"
          style={{
            background: "linear-gradient(90deg, #daebff, #ffffff)",
          }}
        ></div>
      </div>
    </>
  );
};

export default TotalBalance;
