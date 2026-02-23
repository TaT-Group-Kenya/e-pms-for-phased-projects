"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const TotalSales: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div
        className="trezo-card rounded-md border border-gray-100 dark:border-[#172036]"
        style={{
          background: "linear-gradient(102deg, #4936F5 3.78%, #757DFF 70.84%)",
        }}
      >
        <div className="trezo-card-header py-[15px] px-[20px] md:px-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-white !text-md !font-medium">Total Sales</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block text-[22px] text-white leading-none">
                <i className="ri-more-2-fill"></i>
              </MenuButton>

              <MenuItems className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content bg-white dark:bg-[#15203c] rounded-[4px] p-[20px] md:p-[25px] border-t border-gray-100 dark:border-[#172036]">
          <div className="flex items-center justify-between">
            <h3 className="!font-semibold !mb-0 !text-[22px] md:!text-xl">
              $75,000
            </h3>
            <div className="flex items-center justify-center w-[51px] h-[51px] bg-primary-50 dark:bg-dark rounded-full">
              <Image
                src="/images/icons/dollar-bag.svg"
                alt="dollar-bag"
                width={26}
                height={26}
              />
            </div>
          </div>

          <div className="relative mt-[15px] ltr:pl-[29px] rtl:pr-[29px]">
            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] text-success-600 top-1/2 -translate-y-1/2">
              trending_up
            </i>
            <span className="font-semibold">+15%</span> from last month
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalSales;
