"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  email: string;
  image: string;
  tasks: number;
  progress: number; // Represented as a percentage
  progressClass: string; // Class for the progress bar
};

const initialTeamMembers: TeamMember[] = [
  {
    name: "Alex Davis",
    role: "Head of HR",
    email: "alex@trezo.com",
    image: "/images/users/user6.jpg",
    tasks: 55,
    progress: 55,
    progressClass: "bg-primary-500",
  },
  {
    name: "Laura Martinez",
    role: "Designer",
    email: "laura@trezo.com",
    image: "/images/users/user7.jpg",
    tasks: 125,
    progress: 70,
    progressClass: "bg-success-500",
  },
  {
    name: "Mark Thompson",
    role: "Developer",
    email: "mark@trezo.com",
    image: "/images/users/user8.jpg",
    tasks: 78,
    progress: 30,
    progressClass: "bg-purple-500",
  },
  {
    name: "Rachel White",
    role: "Manager",
    email: "rachel@trezo.com",
    image: "/images/users/user9.jpg",
    tasks: 95,
    progress: 90,
    progressClass: "bg-danger-500",
  },
  {
    name: "Kevin Lee",
    role: "Product Owner",
    email: "kevin@trezo.com",
    image: "/images/users/user10.jpg",
    tasks: 134,
    progress: 50,
    progressClass: "bg-secondary-500",
  },
];

const TeamMembers: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 7 Days");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Team Members</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto without-border">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Tasks
                  </th>

                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {teamMembers.map((member, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="rounded-full w-[44px]">
                          <Image
                            src={member.image}
                            className="inline-block rounded-full"
                            alt={member.name}
                            width={44}
                            height={44}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="font-medium inline-block">
                            {member.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {member.tasks}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                        <div
                          className={`flex flex-col justify-center overflow-hidden ${member.progressClass} rounded-md`}
                          style={{ width: `${member.progress}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMembers;
