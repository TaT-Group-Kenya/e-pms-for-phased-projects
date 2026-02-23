"use client";

import React from "react";

const Checkbox: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Checkbox</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="defaultCheckbox"
            />
            <label htmlFor="defaultCheckbox" className="cursor-pointer">
              Default checkbox
            </label>
          </div>

          <div className="form-check flex items-center gap-[8px] mb-[10px] last:mb-0">
            <input
              type="checkbox"
              className="cursor-pointer"
              id="checkedCheckbox"
              defaultChecked
            />
            <label htmlFor="checkedCheckbox" className="cursor-pointer">
              Checked checkbox
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkbox;
