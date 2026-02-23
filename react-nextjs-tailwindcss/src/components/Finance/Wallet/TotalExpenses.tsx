"use client";

import React from "react"; 

const TotalExpenses: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex justify-between">
            <div>
              <span className="block">Total Expenses</span>
              <h5 className="!mb-0 !mt-[3px] !text-[20px]">$251,952</h5>
            </div>
            <div className="w-[55px] lg:w-[60px] h-[55px] lg:h-[60px] flex items-center justify-center rounded-full text-purple-600 bg-purple-50 dark:bg-[#0a0e19]">
              <i className="material-symbols-outlined">
                account_balance_wallet
              </i>
            </div>
          </div>
          <div className="mt-[15px] flex items-center gap-[10px]">
            <span className="inline-block px-[8.5px] text-danger-700 border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] text-xs">
              -28.5%
            </span>
            <span className="block text-xs">Last 30 days</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalExpenses;
