"use client";

import React from "react"; 

const OutlineButtons: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Outline Buttons</h5>
          </div>
        </div>
        <div className="trezo-card-content -mb-[15px]">
          <button
            className="inline-block py-[10px] px-[30px] text-primary-500 transition-all rounded-md border border-primary-500 hover:border-primary-500 hover:bg-primary-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Basic
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-secondary-500 transition-all rounded-md border border-secondary-500 hover:border-secondary-500 hover:bg-secondary-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Secondary
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-success-500 transition-all rounded-md border border-success-500 hover:border-success-500 hover:bg-success-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Success
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-danger-500 transition-all rounded-md border border-danger-500 hover:border-danger-500 hover:bg-danger-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Danger
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-warning-500 transition-all rounded-md border border-warning-500 hover:border-warning-500 hover:bg-warning-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Warning
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-info-500 transition-all rounded-md border border-info-500 hover:border-info-500 hover:bg-info-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Info
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-gray-500 transition-all rounded-md border border-gray-500 hover:border-gray-500 hover:bg-gray-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Light
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-dark transition-all rounded-md border border-dark hover:border-dark hover:bg-dark hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
            type="button"
          >
            Dark
          </button>
          <button
            className="inline-block py-[10px] px-[30px] text-primary-500 transition-all rounded-md border border-primary-500 hover:border-primary-500 hover:bg-primary-500 hover:text-white ltr:mr-[11px] rtl:ml-[11px] mb-[15px] disabled:opacity-[.5] disabled:pointer-events-none"
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

export default OutlineButtons;
