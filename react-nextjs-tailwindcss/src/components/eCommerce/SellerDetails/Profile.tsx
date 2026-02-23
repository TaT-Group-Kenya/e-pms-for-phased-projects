"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

const Profile: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title flex items-center">
            <Image
              src="/images/sellers/seller1.png"
              alt="seller-image"
              width={50}
              height={50}
            />

            <div className="ltr:ml-[15px] rtl:mr-[15px]">
              <span className="text-md block mb-[2px] font-medium text-black dark:text-white">
                Ava Turner
              </span>
              <span className="block">turner@trezo.com</span>
            </div>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Block", "Delete", "Report"].map((option) => (
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
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <ul>
            <li className="text-black dark:text-white mb-[10px] last:mb-0">
              <span className="text-gray-500 dark:text-gray-400">
                Last Sale Date:
              </span>
              25 Nov 2024
            </li>
            <li className="text-black dark:text-white mb-[10px] last:mb-0">
              <span className="text-gray-500 dark:text-gray-400">
                Item Stock:
              </span>
              50
            </li>
            <li className="text-black dark:text-white mb-[10px] last:mb-0">
              <span className="text-gray-500 dark:text-gray-400">
                Wallet Balance:
              </span>
              $9,999.50
            </li>
            <li className="text-black dark:text-white mb-[10px] last:mb-0">
              <span className="text-gray-500 dark:text-gray-400">Revenue:</span>
              $5,999.50
            </li>
            <li className="text-black dark:text-white mb-[10px] last:mb-0">
              <span className="text-gray-500 dark:text-gray-400">Store:</span>
              TechMaster Store
            </li>
          </ul>

          <form className="mt-[20px]">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Contact Support
            </label>

            <textarea
              className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="Type here...."
            ></textarea>

            <button
              type="button"
              className="mt-[15px] font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  send
                </i>
                Send Message
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
