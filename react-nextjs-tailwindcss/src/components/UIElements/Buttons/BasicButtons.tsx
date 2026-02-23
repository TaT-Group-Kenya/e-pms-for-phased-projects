"use client";

import React from "react"; 

const BasicButtons: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Basic Buttons</h5>
          </div>
        </div>
        <div className="trezo-card-content -mb-[15px]">
          <button
            className="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Basic
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-secondary-500 text-white transition-all hover:bg-secondary-400 rounded-md border border-secondary-500 hover:border-secondary-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Secondary
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-success-500 text-white transition-all hover:bg-success-400 rounded-md border border-success-500 hover:border-success-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Success
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-danger-500 text-white transition-all hover:bg-danger-400 rounded-md border border-danger-500 hover:border-danger-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Danger
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-warning-500 text-black transition-all hover:bg-warning-400 rounded-md border border-warning-500 hover:border-warning-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Warning
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-info-500 text-white transition-all hover:bg-info-400 rounded-md border border-info-500 hover:border-info-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Info
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-gray-50 text-black transition-all hover:bg-gray-100 rounded-md border border-gray-50 hover:border-gray-100 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Light
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-dark text-white transition-all hover:bg-black rounded-md border border-dark hover:border-black ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Dark
          </button>
          <button
            className="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px] disabled:opacity-[.5] disabled:pointer-events-none"
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

export default BasicButtons;
