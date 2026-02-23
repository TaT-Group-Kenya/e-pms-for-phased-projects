"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const friendsData = [
  {
    id: 1,
    name: "Carolyn Barnes",
    email: "barnes@trezo.com",
    image: "/images/users/user7.jpg",
    status: "offline",
  },
  {
    id: 2,
    name: "Marcia Baker",
    email: "baker@trezo.com",
    image: "/images/users/user6.jpg",
    status: "online",
  },
  {
    id: 3,
    name: "Donna Miller",
    email: "miller@trezo.com",
    image: "/images/users/user8.jpg",
    status: "online",
  },
  {
    id: 4,
    name: "Barbara Cross",
    email: "cross@trezo.com",
    image: "/images/users/user9.jpg",
    status: "offline",
  },
  {
    id: 5,
    name: "Rebecca Block",
    email: "block@trezo.com",
    image: "/images/users/user10.jpg",
    status: "offline",
  },
  {
    id: 6,
    name: "James Fitzgerald",
    email: "fitzgerald@trezo.com",
    image: "/images/users/user1.jpg",
    status: "online",
  },
  {
    id: 7,
    name: "Emily Davis",
    email: "davis@trezo.com",
    image: "/images/users/user2.jpg",
    status: "offline",
  },
  {
    id: 8,
    name: "John Smith",
    email: "smith@trezo.com",
    image: "/images/users/user3.jpg",
    status: "online",
  },
  {
    id: 9,
    name: "Amanda King",
    email: "king@trezo.com",
    image: "/images/users/user4.jpg",
    status: "offline",
  },
  {
    id: 10,
    name: "David Clark",
    email: "clark@trezo.com",
    image: "/images/users/user5.jpg",
    status: "online",
  },
];

const Friends: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Month");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter the friends data based on the search query
  const filteredFriends = friendsData.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Friends</h5>
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
          <form className="relative mb-[20px]">
            <label className="absolute ltr:left-[13px] rtl:right-[13px] mt-[2px] top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              className="block w-full rounded-md text-black dark:text-white bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] focus:border-primary-500 h-[44px] outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 ltr:pl-[37px] rtl:pr-[37px] ltr:pr-[15px] rtl:pl-[15px]"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between mb-[15px] pb-[15px] border-b border-gray-100 dark:border-[#172036] last:border-none last:pb-0 last:mb-0"
              >
                <div className="flex items-center">
                  <div className="relative w-[45px]">
                    <Image
                      src={friend.image}
                      alt="user-image"
                      className="rounded-full"
                      width={45}
                      height={45}
                    />
                    <span
                      className={`absolute w-[10px] h-[10px] rounded-full bottom-[4px] border-[2px] border-white dark:border-[#0c1427] ${
                        friend.status === "online"
                          ? "bg-success-500"
                          : "bg-danger-500"
                      } ltr:-right-[2px] rtl:-left-[2px]`}
                    ></span>
                  </div>
                  <div className="ltr:ml-[13px] rtl:mr-[13px]">
                    <span className="block text-black dark:text-white font-medium">
                      {friend.name}
                    </span>
                    <span className="block mt-[2px]">{friend.email}</span>
                  </div>
                </div>
                <button className="flex items-center justify-center w-[36px] h-[36px] rounded-full border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:border-primary-500 hover:text-white">
                  <i className="material-symbols-outlined !text-lg">
                    arrow_outward
                  </i>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No friends found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Friends;
