"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface User {
  id: number;
  name: string;
  role: string;
  image: string;
  status: "online" | "offline";
}

const Users: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch or set user data based on the selected option
    const fetchUsers = async () => {
      // Simulate fetching data based on the selected option
      const data: User[] = [
        {
          id: 1,
          name: "Johhna Loren",
          role: "Admin",
          image: "/images/users/user60.jpg",
          status: "online",
        },
        {
          id: 2,
          name: "Zinia Watson Loren",
          role: "Moderator",
          image: "/images/users/user61.jpg",
          status: "online",
        },
        {
          id: 3,
          name: "Angela Carter",
          role: "Editor",
          image: "/images/users/user62.jpg",
          status: "online",
        },
        {
          id: 4,
          name: "Skyler White",
          role: "Admin",
          image: "/images/users/user63.jpg",
          status: "offline",
        },
        {
          id: 5,
          name: "Jane Ronan",
          role: "Editor",
          image: "/images/users/user64.jpg",
          status: "online",
        },
        {
          id: 6,
          name: "Viktor James",
          role: "Editor",
          image: "/images/users/user65.jpg",
          status: "offline",
        },
      ];

      // Filter or process data based on the selected option
      setUsers(data);
    };

    fetchUsers();
  }, [selectedOption]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Users</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
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
          <ul>
            {users.slice(0, 6).map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-[12px] py-[10px] border-b first:border-t border-primary-50 dark:border-[#172036]"
              >
                <div className="relative ltr:pr-[2px] rtl:pl-[2px] pb-[2px]">
                  <Image
                    src={user.image}
                    alt="user-image"
                    className="rounded-full w-[33px]"
                    width={33}
                    height={33}
                  />
                  <span
                    className={`absolute ltr:right-0 rtl:left-0 bottom-0 w-[12px] h-[12px] rounded-full border-[2px] border-white dark:border-[#0c1427] ${
                      user.status === "online"
                        ? "bg-success-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div>
                  <span className="block font-semibold text-gray-900 dark:text-gray-400">
                    {user.name}
                  </span>
                  <span className="block text-xs mt-[2px]">{user.role}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Users;
