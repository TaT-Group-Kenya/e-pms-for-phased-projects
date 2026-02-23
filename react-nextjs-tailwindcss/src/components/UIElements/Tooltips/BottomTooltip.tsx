"use client";

import React from "react";

const BottomTooltip: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Bottom Tooltip</h5>
          </div>
        </div>
        <div className="trezo-card-content flex items-center">
          <div className="relative group">
            <button
              type="button"
              className="inline-block py-[10px] px-[55px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 custom-tooltip"
            >
              Hover Tooltip
            </button>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Hey, Hello World!
              {/* Arrow */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-b-gray-800 dark:border-b-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomTooltip;
