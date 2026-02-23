"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Profile: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title flex items-center">
            <Image
              src="/images/users/user11.jpg"
              alt="user-image"
              className="rounded-full w-[65px] h-[65px] border-[2px] border-gray-100 dark:border-[#172036]"
              width={65}
              height={65}
            />
            <div className="ltr:ml-[12px] rtl:mr-[12px]">
              <span className="block font-medium text-black dark:text-white mb-[2px] text-md">
                Ava Turner
              </span>
              <span className="block">Team Leader</span>
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
            <li className="mb-[15px] md:mb-[17px] last:mb-0 text-black dark:text-white font-medium">
              <span className="block font-normal mb-[5px] text-gray-500 dark:text-gray-400">
                Account ID:
              </span>
              ID-12174123
            </li>

            <li className="mb-[15px] md:mb-[17px] last:mb-0 text-black dark:text-white font-medium">
              <span className="block font-normal mb-[5px] text-gray-500 dark:text-gray-400">
                Billing Email:
              </span>
              ava@trezo.com
            </li>

            <li className="mb-[15px] md:mb-[17px] last:mb-0 text-black dark:text-white font-medium">
              <span className="block font-normal mb-[5px] text-gray-500 dark:text-gray-400">
                Delivery Address:
              </span>
              715 Maple St, Hamletville, England
            </li>

            <li className="mb-[15px] md:mb-[17px] last:mb-0 text-black dark:text-white font-medium">
              <span className="block font-normal mb-[5px] text-gray-500 dark:text-gray-400">
                Language:
              </span>
              English, Spanish
            </li>

            <li className="mb-[15px] md:mb-[17px] last:mb-0 text-black dark:text-white font-medium">
              <span className="block font-normal mb-[5px] text-gray-500 dark:text-gray-400">
                Latest Transaction:
              </span>
              #JAN-121
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Profile;
