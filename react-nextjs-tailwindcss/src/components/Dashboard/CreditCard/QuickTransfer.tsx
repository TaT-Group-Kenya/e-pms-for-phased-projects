"use client";

import React from "react"; 

const QuickTransfer: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Quick Transfer</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <form>
            <div className="mb-[22.5px] last:mb-0 relative">
              <label className="block text-xs mb-[8px]">Card Number</label>
              <input
                type="text"
                defaultValue="**** **** **** 1580"
                className="text-md h-[54px] block w-full border border-[#D5D9E2] dark:border-[#172036] px-[17px] bg-white dark:bg-[#0c1427] text-black dark:text-white rounded-md placeholder:text-black dark:placeholder:text-white font-semibold outline-0 transition-all focus:border-primary-500"
              />
            </div>

            <div className="mb-[22.5px] last:mb-0 relative">
              <label className="block text-xs mb-[8px]">Transfer Amount</label>
              <input
                type="text"
                defaultValue="$1,580"
                className="text-md h-[54px] block w-full border border-[#D5D9E2] dark:border-[#172036] px-[17px] bg-white dark:bg-[#0c1427] text-black dark:text-white rounded-md placeholder:text-black dark:placeholder:text-white font-semibold outline-0 transition-all focus:border-primary-500"
              />

              <button
                type="button"
                className="flex items-center justify-center w-[54px] h-[54px] bg-primary-500 rounded-md text-white transition-all hover:bg-primary-400 absolute ltr:right-0 rtl:left-0 bottom-0"
              >
                <i className="material-symbols-outlined !text-[20px]">
                  send_money
                </i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuickTransfer;
