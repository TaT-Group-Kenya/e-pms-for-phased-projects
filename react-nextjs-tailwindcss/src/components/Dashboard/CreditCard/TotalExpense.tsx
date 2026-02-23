"use client";

import React from "react"; 

const TotalExpense: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md relative z-[1]">
        <div className="trezo-card-content flex items-center justify-between">
          <div>
            <span className="block">Total Expense</span>
            <h3 className="!mb-[21px] mt-[4px] !text-[20px]">$18,950</h3>
            <div className="flex items-center gap-[10px]">
              <span className="inline-block text-xs font-medium px-[8px] text-danger-600 border border-danger-600 bg-danger-100 rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c]">
                -18.1%
              </span>
              <span className="block text-xs">Last Month</span>
            </div>
          </div>
          <div className="w-[75px] h-[75px] rounded-full text-purple-500 flex items-center justify-center bg-purple-100 dark:bg-[#15203c]">
            <i className="material-symbols-outlined !text-[35px]">payments</i>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full rounded-md -z-[1] dark:hidden"
          style={{
            background: "linear-gradient(90deg, #f3e8ff, #ffffff)",
          }}
        ></div>
      </div>
    </>
  );
};

export default TotalExpense;
