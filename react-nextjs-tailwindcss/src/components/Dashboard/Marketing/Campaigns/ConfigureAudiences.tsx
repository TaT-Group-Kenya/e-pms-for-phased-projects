"use client";

import React, { useState } from "react";

const ConfigureAudiences: React.FC = () => {
  // State for age range
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);

  // Handle minimum age change
  const handleMinAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxAge - 1);
    setMinAge(value);
  };

  // Handle maximum age change
  const handleMaxAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minAge + 1);
    setMaxAge(value);
  };

  return (
    <>
      <h3 className="!mb-[20px] md:!mb-[25px] lg:!mb-[33px] !text-gray-900 dark:!text-gray-400 !text-lg">
        Configure Audiences
      </h3>

      <div className="mb-[20px] lg:mb-[35px]">
        <label className="mb-[15px] text-gray-500 dark:text-white font-medium block">
          Gender
        </label>

        <div className="grid grid-cols-3 gap-[25px]">
          <div className="form-radio border-[2px] rounded-[4px] border-dashed border-gray-100 dark:border-[#172036]">
            <label
              htmlFor="genderAll"
              className="cursor-pointer relative block py-[18px] ltr:pl-[48px] rtl:pr-[48px] ltr:pr-[20px] rtl:pl-[20px]"
            >
              <input
                defaultChecked
                type="radio"
                name="genderRadio"
                className="absolute ltr:left-[20px] rtl:right-[20px] top-1/2 -translate-y-1/2 scale-[1.5] w-[15px]"
                id="genderAll"
              />
              <span className="block font-medium text-gray-900 dark:text-gray-400">
                All
              </span>
            </label>
          </div>

          <div className="form-radio border-[2px] rounded-[4px] border-dashed border-gray-100 dark:border-[#172036]">
            <label
              htmlFor="genderMale"
              className="cursor-pointer relative block py-[18px] ltr:pl-[48px] rtl:pr-[48px] ltr:pr-[20px] rtl:pl-[20px]"
            >
              <input
                type="radio"
                name="genderRadio"
                className="absolute ltr:left-[20px] rtl:right-[20px] top-1/2 -translate-y-1/2 scale-[1.5] w-[15px]"
                id="genderMale"
              />
              <span className="block font-medium text-gray-900 dark:text-gray-400">
                Male
              </span>
            </label>
          </div>

          <div className="form-radio border-[2px] rounded-[4px] border-dashed border-gray-100 dark:border-[#172036]">
            <label
              htmlFor="genderFemale"
              className="cursor-pointer relative block py-[18px] ltr:pl-[48px] rtl:pr-[48px] ltr:pr-[20px] rtl:pl-[20px]"
            >
              <input
                type="radio"
                name="genderRadio"
                className="absolute ltr:left-[20px] rtl:right-[20px] top-1/2 -translate-y-1/2 scale-[1.5] w-[15px]"
                id="genderFemale"
              />
              <span className="block font-medium text-gray-900 dark:text-gray-400">
                Female
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-[20px] lg:mb-[35px]">
        <label className="mb-[18px] text-gray-500 dark:text-white font-medium block">
          Age
        </label>
        <div id="priceRangeSlider">
          <div id="rangeSlider" className="range-slider">
            <div className="number-group flex items-center justify-between">
              <input
                className="number-input md:text-md font-semibold text-gray-900 dark:text-gray-400 dark:bg-[#0c1427] !outline-0 pointer-events-none"
                type="number"
                value={minAge}
                onChange={handleMinAgeChange}
                min="0"
                max="50"
              />
              <input
                className="number-input md:text-md font-semibold ltr:text-end rtl:text-left text-gray-900 dark:text-gray-400 dark:bg-[#0c1427] !outline-0 pointer-events-none"
                type="number"
                value={maxAge}
                onChange={handleMaxAgeChange}
                min="0"
                max="50"
              />
            </div>
            <div className="range-group relative -mt-[10px] ltr:ml-[32px] rtl:mr-[32px] ltr:mr-[40px] rtl:ml-[40px]">
              <input
                className="range-input"
                value={minAge}
                onChange={handleMinAgeChange}
                min="0"
                max="50"
                step="1"
                type="range"
              />
              <input
                className="range-input"
                value={maxAge}
                onChange={handleMaxAgeChange}
                min="0"
                max="50"
                step="1"
                type="range"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-[20px] lg:mb-[35px]">
        <label className="mb-[15px] text-gray-500 dark:text-white font-medium block">
          Location
        </label>
        <select className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400">
          <option>Select</option>
          <option>United States</option>
          <option>Switzerland</option>
          <option>Germany</option>
          <option>Sweden</option>
          <option>Denmark</option>
        </select>
      </div>

      <div className="mb-[20px] lg:mb-[35px]">
        <label className="mb-[15px] text-gray-500 dark:text-white font-medium block">
          Media
        </label>
        <select className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400">
          <option>Select</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>LinkedIn</option>
          <option>Twitter</option>
          <option>Threads</option>
        </select>
      </div>

      <div className="mb-[20px] lg:mb-[35px]">
        <label className="mb-[15px] text-gray-500 dark:text-white font-medium block">
          Team Member
        </label>
        <select className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400">
          <option>Select</option>
          <option>Olivia Smith</option>
          <option>Jason Smith</option>
          <option>Alina Lyes</option>
          <option>Jonathon Ronan</option>
          <option>Walter White</option>
        </select>
      </div>
    </>
  );
};

export default ConfigureAudiences;
