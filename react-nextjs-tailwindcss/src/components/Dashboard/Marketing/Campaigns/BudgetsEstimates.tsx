"use client";

import React, { useState } from "react";

const BudgetsEstimates: React.FC = () => {
  // State for selected budget option
  const [selectedOption, setSelectedOption] = useState("continuousDuration");

  // State for daily budget range
  const [minBudget, setMinBudget] = useState(18);
  const [maxBudget, setMaxBudget] = useState(100);

  // Handle budget option change
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.id);
  };

  // Handle minimum budget change
  const handleMinBudgetChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.min(Number(event.target.value), maxBudget - 1);
    setMinBudget(value);
  };

  // Handle maximum budget change
  const handleMaxBudgetChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(Number(event.target.value), minBudget + 1);
    setMaxBudget(value);
  };

  return (
    <>
      <h3 className="!mb-[20px] md:!mb-[25px] !text-gray-900 dark:!text-gray-400 !text-lg">
        Budgets Estimates
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[25px]">
        <div className="form-radio border-[2px] rounded-[4px] border-dashed border-gray-100 dark:border-[#172036]">
          <label
            htmlFor="continuousDuration"
            className="cursor-pointer relative block py-[18px] ltr:pl-[52px] rtl:pr-[52px] ltr:pr-[20px] rtl:pl-[20px]"
          >
            <input
              type="radio"
              name="budgetEstimatesRatio"
              className="absolute ltr:left-[20px] rtl:right-[20px] top-1/2 -translate-y-1/2 scale-[1.5] w-[15px]"
              id="continuousDuration"
              checked={selectedOption === "continuousDuration"}
              onChange={handleOptionChange}
            />
            <span className="block mb-[5px] font-medium text-gray-900 dark:text-gray-400">
              Continuous Duration
            </span>
            <span className="block text-gray-400">
              Your Ad will run continuously for a daily budget.
            </span>
          </label>
        </div>

        <div className="form-radio border-[2px] rounded-[4px] border-dashed border-gray-100 dark:border-[#172036]">
          <label
            htmlFor="fixedDuration"
            className="cursor-pointer relative block py-[18px] ltr:pl-[52px] rtl:pr-[52px] ltr:pr-[20px] rtl:pl-[20px]"
          >
            <input
              type="radio"
              name="budgetEstimatesRatio"
              className="absolute ltr:left-[20px] rtl:right-[20px] top-1/2 -translate-y-1/2 scale-[1.5] w-[15px]"
              id="fixedDuration"
              checked={selectedOption === "fixedDuration"}
              onChange={handleOptionChange}
            />
            <span className="block mb-[5px] font-medium text-gray-900 dark:text-gray-400">
              Fixed Duration
            </span>
            <span className="block text-gray-400">
              Your Ad will run only specified dates only.
            </span>
          </label>
        </div>
      </div>

      <div className="my-[20px] lg:my-[35px]">
        <label className="mb-[15px] text-gray-500 dark:text-white font-medium block">
          Daily Budget
        </label>

        <div id="priceRangeSlider2">
          <div id="rangeSlider2" className="range-slider2">
            <div className="number-group flex items-center justify-between">
              <div className="flex items-center">
                <span className="md:text-md font-semibold text-gray-900 dark:text-gray-400">
                  $
                </span>
                <input
                  className="number-input md:text-md font-semibold text-gray-900 dark:text-gray-400 dark:bg-[#0c1427] !outline-0 pointer-events-none"
                  type="number"
                  value={minBudget}
                  onChange={handleMinBudgetChange}
                  min="0"
                  max="100"
                />
              </div>

              {/* below content text should be right aligned */}
              <div className="flex items-center">
                <span className="md:text-md font-semibold text-gray-900 dark:text-gray-400">
                  $
                </span>
                <input
                  className="number-input w-[30px] md:text-md font-semibold text-gray-900 dark:text-gray-400 dark:bg-[#0c1427] !outline-0 pointer-events-none"
                  type="number"
                  value={maxBudget}
                  onChange={handleMaxBudgetChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="range-group relative -mt-[10px] ltr:ml-[40px] rtl:mr-[40px] ltr:mr-[55px] rtl:ml-[55px]">
              <input
                className="range-input"
                value={minBudget}
                onChange={handleMinBudgetChange}
                min="0"
                max="100"
                step="1"
                type="range"
              />
              <input
                className="range-input"
                value={maxBudget}
                onChange={handleMaxBudgetChange}
                min="0"
                max="100"
                step="1"
                type="range"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetsEstimates;
