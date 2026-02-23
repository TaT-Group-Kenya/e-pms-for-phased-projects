"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Define your followers data array
const followersData = [
  {
    id: 1,
    name: "Salvatore Dewall",
    email: "dewall@trezo.com",
    image: "/images/users/user6.jpg",
  },
  {
    id: 2,
    name: "Alina Smith",
    email: "smith@trezo.com",
    image: "/images/users/user7.jpg",
  },
  {
    id: 3,
    name: "Russell Colon",
    email: "colon@trezo.com",
    image: "/images/users/user8.jpg",
  },
  {
    id: 4,
    name: "Leslie Shadle",
    email: "shadle@trezo.com",
    image: "/images/users/user9.jpg",
  },
  {
    id: 5,
    name: "Raymond Nguyen",
    email: "nguyen@trezo.com",
    image: "/images/users/user10.jpg",
  },
  {
    id: 6,
    name: "James Fitzgerald",
    email: "fitzgerald@trezo.com",
    image: "/images/users/user1.jpg",
  },
  {
    id: 7,
    name: "Emily Davis",
    email: "davis@trezo.com",
    image: "/images/users/user2.jpg",
  },
  {
    id: 8,
    name: "John Smith",
    email: "smith@trezo.com",
    image: "/images/users/user3.jpg",
  },
  {
    id: 9,
    name: "Amanda King",
    email: "king@trezo.com",
    image: "/images/users/user4.jpg",
  },
  {
    id: 10,
    name: "David Clark",
    email: "clark@trezo.com",
    image: "/images/users/user5.jpg",
  },
];

const Followers: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Month");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Followers</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
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

        <div className="trezo-card-content">
          {followersData.slice(0, 6).map((follower) => (
            <div
              key={follower.id}
              className="flex items-center justify-between mb-[15px] pb-[15px] border-b border-gray-100 dark:border-[#172036] last:border-none last:pb-0 last:mb-0"
            >
              <div className="flex items-center">
                <Image
                  src={follower.image}
                  alt="user-image"
                  className="rounded-full w-[42px]"
                  width={42}
                  height={42}
                />
                <div className="ltr:ml-[12px] rtl:mr-[12px]">
                  <span className="block text-black dark:text-white font-medium">
                    {follower.name}
                  </span>
                  <span className="block mt-[2px]">{follower.email}</span>
                </div>
              </div>

              <button className="flex items-center justify-center w-[36px] h-[36px] rounded-full border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:border-primary-500 hover:text-white">
                <i className="material-symbols-outlined !text-lg">
                  arrow_outward
                </i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Followers;
