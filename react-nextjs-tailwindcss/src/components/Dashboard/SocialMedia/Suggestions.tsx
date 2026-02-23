"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Suggestions: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Data for user suggestions
  const suggestions = [
    {
      id: 1,
      name: "Sophia Adams",
      image: "/images/users/user40.jpg",
      mutualFriends: 12,
    },
    {
      id: 2,
      name: "Liam Roberts",
      image: "/images/users/user37.jpg",
      mutualFriends: 8,
    },
    {
      id: 3,
      name: "Olivia Martinez",
      image: "/images/users/user54.jpg",
      mutualFriends: 15,
    },
    {
      id: 4,
      name: "Ethan Clarke",
      image: "/images/users/user41.jpg",
      mutualFriends: 10,
    },
    {
      id: 5,
      name: "Isabella Cruz",
      image: "/images/users/user43.jpg",
      mutualFriends: 7,
    },
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-[3px] md:!mb-0 !text-lg md:!text-[20px]">
              Suggestions
            </h5>
            <p>People you may know</p>
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
            {suggestions.slice(0, 5).map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between mb-[10.7px] pb-[10.7px] border-b border-gray-50 dark:border-[#172036] px-[20px] md:px-[25px] last:border-b-[0] last:pb-0 last:mb-0"
              >
                <div className="flex items-center gap-[10px]">
                  <Image
                    src={user.image}
                    className="rounded-full"
                    alt="user-image"
                    width={44}
                    height={44}
                  />
                  <div>
                    <span className="block text-black dark:text-white font-medium">
                      {user.name}
                    </span>
                    <span className="text-xs">
                      {user.mutualFriends} mutual friends
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[5px]">
                  <button
                    type="button"
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-danger-200 dark:border-[#172036] text-orange-500 text-md transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500"
                  >
                    <i className="ri-delete-bin-7-line"></i>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-primary-200 dark:border-[#172036] text-primary-500 text-md transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  >
                    <i className="ri-user-add-line"></i>
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

export default Suggestions;
