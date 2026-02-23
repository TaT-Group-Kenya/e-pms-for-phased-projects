"use client";

import React from "react";

const FileInput: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">File Input</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="mb-[20px] md:mb-[25px] last:mb-0">
            <label className="mb-[12px] font-medium block">
              Default file input example
            </label>
            <input
              type="file"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] py-[15px] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer"
            />
          </div>

          <div className="mb-[20px] md:mb-[25px] last:mb-0">
            <label className="mb-[12px] font-medium block">
              Multiple files input example
            </label>
            <input
              type="file"
              multiple
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] py-[15px] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 cursor-pointer"
            />
          </div>

          <div className="mb-[20px] md:mb-[25px] last:mb-0">
            <label className="mb-[12px] font-medium block">
              Disabled file input example
            </label>
            <input
              type="file"
              className="rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] py-[15px] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:bg-gray-50 dark:disabled:bg-dark"
              disabled
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileInput;
