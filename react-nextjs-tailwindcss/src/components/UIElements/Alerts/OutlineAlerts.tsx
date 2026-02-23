"use client";

import React from "react"; 

const OutlineAlerts: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Outline Alerts</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="mt-[15px] md:mt-[20px]"></div>
          <div className="py-[1rem] px-[1rem] text-primary-500 border border-primary-500 rounded-md">
            A simple primary alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-secondary-500 border border-secondary-500 rounded-md">
            A simple secondary alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-success-500 border border-success-500 rounded-md">
            A simple success alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-danger-500 border border-danger-500 rounded-md">
            A simple danger alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-warning-500 border border-warning-500 rounded-md">
            A simple warning alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-info-500 border border-info-500 rounded-md">
            A simple info alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-gray-500 border border-gray-100 rounded-md">
            A simple light alert—check it out!
          </div>
          <div className="mt-[15px]"></div>
          <div className="py-[1rem] px-[1rem] text-dark border border-dark rounded-md">
            A simple dark alert—check it out!
          </div>
        </div>
      </div>
    </>
  );
};

export default OutlineAlerts;
