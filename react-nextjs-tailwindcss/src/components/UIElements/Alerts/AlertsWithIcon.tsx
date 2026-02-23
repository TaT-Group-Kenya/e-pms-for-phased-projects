"use client";

import React from "react"; 

const AlertsWithIcon: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Alerts with Icon</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="py-[1rem] px-[1rem] text-primary-500 bg-primary-50 border border-primary-200 rounded-md flex items-center gap-[5px]">
            <i className="ri-home-2-line text-[20px]"></i>A simple primary
            alert—check it out!
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertsWithIcon;
