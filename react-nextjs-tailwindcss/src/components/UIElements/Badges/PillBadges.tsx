"use client";

import React from "react"; 

const PillBadges: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Pill Badges</h5>
          </div>
        </div>

        <div className="trezo-card-content mb-[5px] md:mb-[10px] lg:mb-[15px]">
          <span className="inline-block px-[15px] py-[.2em] text-white border border-primary-500 bg-primary-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Primary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-secondary-500 bg-secondary-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Secondary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-success-500 bg-success-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Success
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-danger-500 bg-danger-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Danger
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-warning-500 bg-warning-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Warning
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-info-500 bg-info-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Info
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-dark border border-gray-50 bg-gray-50 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Light
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-dark bg-dark text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Dark
          </span>
        </div>

        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Outline Pill Badges</h5>
          </div>
        </div>
        <div className="trezo-card-content mb-[5px] md:mb-[10px] lg:mb-[15px]">
          <span className="inline-block px-[15px] py-[.2em] text-primary-500 border border-primary-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Primary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-secondary-500 border border-secondary-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Secondary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-success-500 border border-success-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Success
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-danger-500 border border-danger-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Danger
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-warning-500 border border-warning-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Warning
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-info-500 border border-info-500 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Info
          </span>
          <span className="inline-block px-[15px] py-[.2em] border border-gray-100 text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Light
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-dark border border-dark text-xs rounded-[100px] ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Dark
          </span>
        </div>

        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Outline Badges</h5>
          </div>
        </div>
        <div className="trezo-card-content mb-[5px] md:mb-[10px] lg:mb-[15px]">
          <span className="inline-block px-[15px] py-[.2em] text-primary-500 border border-primary-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Primary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-secondary-500 border border-secondary-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Secondary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-success-500 border border-success-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Success
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-danger-500 border border-danger-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Danger
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-warning-500 border border-warning-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Warning
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-info-500 border border-info-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Info
          </span>
          <span className="inline-block px-[15px] py-[.2em] border border-gray-100 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Light
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-dark border border-dark text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Dark
          </span>
        </div>
        
        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Background Colors</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <span className="inline-block px-[15px] py-[.2em] text-white border border-primary-500 bg-primary-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Primary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-secondary-500 bg-secondary-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Secondary
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-success-500 bg-success-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Success
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-danger-500 bg-danger-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Danger
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-warning-500 bg-warning-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Warning
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-info-500 bg-info-500 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Info
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-dark border border-gray-50 bg-gray-50 text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Light
          </span>
          <span className="inline-block px-[15px] py-[.2em] text-white border border-dark bg-dark text-xs rounded-md ltr:mr-[10px] rtl:ml-[10px] mb-[15px]">
            Dark
          </span>
        </div>
      </div>
    </>
  );
};

export default PillBadges;
