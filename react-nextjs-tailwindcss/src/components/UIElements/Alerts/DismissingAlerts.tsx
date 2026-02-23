"use client";

import React from "react"; 

const DismissingAlerts: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Dismissing Alerts</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div
            className="alert py-[1rem] px-[1rem] text-primary-500 bg-primary-50 border border-primary-200 rounded-md flex items-center justify-between"
          >
            A simple primary alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>

          <div
            className="alert py-[1rem] px-[1rem] text-secondary-500 bg-secondary-50 border border-secondary-200 rounded-md flex items-center justify-between"
          >
            A simple secondary alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>

          <div
            className="alert py-[1rem] px-[1rem] text-success-500 bg-success-50 border border-success-200 rounded-md flex items-center justify-between"
          >
            A simple success alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>

          <div
            className="alert py-[1rem] px-[1rem] text-danger-500 bg-danger-50 border border-danger-200 rounded-md flex items-center justify-between"
          >
            A simple danger alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>

          <div
            className="alert py-[1rem] px-[1rem] text-warning-500 bg-warning-50 border border-warning-200 rounded-md flex items-center justify-between"
          >
            A simple warning alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>

          <div
            className="alert py-[1rem] px-[1rem] text-info-500 bg-info-50 border border-info-200 rounded-md flex items-center justify-between"
          >
            A simple info alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>

          <div
            className="alert py-[1rem] px-[1rem] text-gray-500 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between"
          >
            A simple light alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="mt-[15px]"></div>
          
          <div
            className="alert py-[1rem] px-[1rem] text-dark bg-[#ced4da] border border-[#adb5bd] rounded-md flex items-center justify-between"
          >
            A simple dark alert—check it out!
            <button className="leading-none text-[20px] close-btn">
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DismissingAlerts;
