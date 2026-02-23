"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

interface Client {
  id: string;
  name: string;
  profession: string;
  imageUrl: string;
  status: "online" | "offline";
}

const RecentClients: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Sample data - in a real app, this would come from an API
  const clients: Client[] = [
    {
      id: "1",
      name: "Johhna Loren",
      profession: "Doctor",
      imageUrl: "/images/users/user48.jpg",
      status: "online",
    },
    {
      id: "2",
      name: "Zinia Watson",
      profession: "Lawyer",
      imageUrl: "/images/users/user37.jpg",
      status: "online",
    },
    {
      id: "3",
      name: "Angela Carter",
      profession: "Businesswoman",
      imageUrl: "/images/users/user38.jpg",
      status: "online",
    },
    {
      id: "4",
      name: "Skyler White",
      profession: "Entrepreneur",
      imageUrl: "/images/users/user39.jpg",
      status: "offline",
    },
    {
      id: "5",
      name: "Jane Ronan",
      profession: "Editor",
      imageUrl: "/images/users/user40.jpg",
      status: "online",
    },
    {
      id: "6",
      name: "Viktor James",
      profession: "Businessman",
      imageUrl: "/images/users/user42.jpg",
      status: "offline",
    },
  ];

  const getStatusColor = (status: Client["status"]) => {
    return status === "online" ? "bg-success-500" : "bg-gray-400";
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Recent Clients</h5>
        </div>

        <Menu
          as="div"
          className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
        >
          <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
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

      <div className="trezo-card-content">
        <ul>
          {clients.map((client) => (
            <li
              key={client.id}
              className="relative flex items-center gap-[12px] py-[12px] border-b first:border-t border-primary-50 dark:border-[#172036]"
            >
              <div className="relative ltr:pr-[2px] rtl:pl-[2px] pb-[2px]">
                <Image
                  src={client.imageUrl}
                  alt={client.name}
                  width={35}
                  height={35}
                  className="rounded-full w-[35px] h-[35px] object-cover"
                />
                <span
                  className={`absolute ltr:right-0 rtl:left-0 bottom-0 w-[12px] h-[12px] rounded-full border-[1px] border-white dark:border-[#0c1427] ${getStatusColor(
                    client.status
                  )}`}
                />
              </div>
              <div>
                <span className="block font-semibold text-gray-900 dark:text-gray-400">
                  {client.name}
                </span>
                <span className="block text-xs mt-[3px]">
                  {client.profession}
                </span>
              </div>
              <a
                href="#"
                className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 text-lg inline-block transition-all hover:text-primary-500"
              >
                <i className="ri-arrow-right-line"></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentClients;
