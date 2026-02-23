"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

// Data for recent Instagram followers
const followers = [
  {
    id: 1,
    name: "Mason Lee",
    image: "/images/users/user69.jpg",
  },
  {
    id: 2,
    name: "Mia Patel",
    image: "/images/users/user70.jpg",
  },
  {
    id: 3,
    name: "James Nguyen",
    image: "/images/users/user71.jpg",
  },
  {
    id: 4,
    name: "Benjamin Kim",
    image: "/images/users/user72.jpg",
  },
  {
    id: 5,
    name: "Elijah Watson",
    image: "/images/users/user73.jpg",
  },
  {
    id: 6,
    name: "Daniel Flores",
    image: "/images/users/user74.jpg",
  },
];

const RecentInstagramFollowers: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-[3px] md:!mb-0 !text-lg md:!text-[20px]">
              Recent Instagram Followers
            </h5>
            <p>Check out your latest followers</p>
          </div>

          <Menu
            as="div"
            className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
          >
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
              <i className="ri-more-2-fill"></i>
            </MenuButton>

            <MenuItems className="transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ">
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <ul>
            {followers.slice(0, 6).map((follower) => (
              <li
                key={follower.id}
                className="flex items-center justify-between mb-[10px] pb-[10px] border-b border-gray-50 dark:border-[#172036] px-[20px] md:px-[25px] last:border-b-[0] last:pb-0 last:mb-0"
              >
                <div className="flex items-center gap-[10px]">
                  <Image
                    src={follower.image}
                    className="rounded-full"
                    alt="user-image"
                    width={34}
                    height={34}
                  />
                  <span className="block text-black dark:text-white font-medium">
                    {follower.name}
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <button
                    type="button"
                    className="inline-block text-xs text-primary-600 bg-primary-50 dark:bg-[#15203c] rounded-[4px] py-[3.5px] px-[10px] transition-all hover:bg-primary-600 hover:text-white"
                  >
                    Follow Back
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-[4px] w-[25px] h-[25px] bg-purple-100 dark:bg-[#15203c] text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
                  >
                    <i className="ri-message-2-line"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RecentInstagramFollowers;
