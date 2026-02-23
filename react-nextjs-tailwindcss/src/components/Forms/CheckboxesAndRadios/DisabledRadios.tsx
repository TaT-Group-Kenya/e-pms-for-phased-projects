"use client";

import React from "react";

const DisabledRadios: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Disabled Radios</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="form-radio flex items-center gap-[8px] mb-[10px] last:mb-0">
            <input
              type="radio"
              name="disabledFlexRadioDefault"
              id="disabledFlexRadioDefault1"
              disabled
            />
            <label htmlFor="disabledFlexRadioDefault1">Disabled radio</label>
          </div>

          <div className="form-radio flex items-center gap-[8px] mb-[10px] last:mb-0">
            <input
              type="radio"
              defaultChecked
              name="disabledFlexRadioDefault"
              id="disabledFlexRadioDefault2"
              disabled
            />
            <label htmlFor="disabledFlexRadioDefault2">
              Disabled checked radio
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisabledRadios;
