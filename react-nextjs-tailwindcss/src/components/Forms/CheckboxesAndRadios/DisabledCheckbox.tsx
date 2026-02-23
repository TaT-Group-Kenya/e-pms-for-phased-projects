"use client";

import React from "react"; 

const DisabledCheckbox: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Disabled Checkbox</h5>
          </div>
        </div>
        
        <div className="trezo-card-content">
          <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
            <input type="checkbox" id="disabledCheckbox" disabled />
            <label htmlFor="disabledCheckbox">Disabled checkbox</label>
          </div>

          <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
            <input
              type="checkbox"
              checked
              id="disabledCheckedCheckbox"
              disabled
            />
            <label htmlFor="disabledCheckedCheckbox">
              Disabled checked checkbox
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisabledCheckbox;
