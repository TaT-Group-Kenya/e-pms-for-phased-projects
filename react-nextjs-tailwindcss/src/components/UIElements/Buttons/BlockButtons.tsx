"use client";

import React from "react"; 

const BlockButtons: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Block Buttons</h5>
          </div>
        </div>
        <div className="trezo-card-content -mb-[15px]">
          <button
            className="block w-full text-center py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 mb-[15px]"
            type="button"
          >
            Basic
          </button>
          <button
            className="block w-full text-center py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 mb-[15px] disabled:opacity-[.5] disabled:pointer-events-none"
            type="button"
            disabled
          >
            Disabled
          </button>
        </div>
      </div>
    </>
  );
};

export default BlockButtons;
