"use client";

import React from "react"; 

const BGColorAlertsWithIcon: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">BG Color Alerts with Icon</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="py-[1rem] px-[1rem] text-white bg-primary-500 border border-primary-500 rounded-md flex items-center gap-[5px]">
            <i className="ri-home-2-line text-[20px]"></i>A simple primary
            alert—check it out!
          </div>
        </div>
      </div>
    </>
  );
};

export default BGColorAlertsWithIcon;
