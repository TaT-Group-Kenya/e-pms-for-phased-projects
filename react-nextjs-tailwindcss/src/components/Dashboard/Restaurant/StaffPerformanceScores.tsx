"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

interface StaffMember {
  id: string;
  name: string;
  score: number;
  image: string;
  performanceRating?: "excellent" | "good" | "average" | "needs-improvement";
}

const StaffPerformanceScores: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Staff performance data
  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "Joanna Watson",
      score: 98,
      image: "/images/users/user58.jpg",
      performanceRating: "excellent",
    },
    {
      id: "2",
      name: "Angela Carter",
      score: 97,
      image: "/images/users/user59.jpg",
      performanceRating: "excellent",
    },
    {
      id: "3",
      name: "Walter White",
      score: 96,
      image: "/images/users/user60.jpg",
      performanceRating: "excellent",
    },
    {
      id: "4",
      name: "Gary Simon",
      score: 88,
      image: "/images/users/user61.jpg",
      performanceRating: "good",
    },
    {
      id: "5",
      name: "Zinia Anderson",
      score: 85,
      image: "/images/users/user62.jpg",
      performanceRating: "good",
    },
    {
      id: "6",
      name: "Loren Walter",
      score: 82,
      image: "/images/users/user63.jpg",
      performanceRating: "good",
    },
    {
      id: "7",
      name: "Jessy Pinkman",
      score: 80,
      image: "/images/users/user64.jpg",
      performanceRating: "average",
    },
    {
      id: "8",
      name: "Handy Curter",
      score: 77,
      image: "/images/users/user65.jpg",
      performanceRating: "average",
    },
    {
      id: "9",
      name: "Skyler Lorensa",
      score: 75,
      image: "/images/users/user66.jpg",
      performanceRating: "needs-improvement",
    },
  ];

  // Get performance color based on score
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-success-500";
    if (score >= 80) return "text-primary-500";
    if (score >= 70) return "text-warning-500";
    return "text-danger-500";
  };

  // Get performance rating label
  const getPerformanceRating = (score: number) => {
    if (score >= 95) return "Excellent";
    if (score >= 85) return "Good";
    if (score >= 75) return "Average";
    return "Needs Improvement";
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Staff Performance Scores</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[25px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
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
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <tbody className="text-black dark:text-white">
                {staffMembers.map((staff) => (
                  <tr key={staff.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[30px]">
                          <Image
                            src={staff.image}
                            alt={staff.name}
                            className="inline-block rounded-full"
                            width={30}
                            height={30}
                          />
                        </div>
                        <div>
                          <span className="font-medium">{staff.name}</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {getPerformanceRating(staff.score)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span
                        className={`font-bold ${getPerformanceColor(
                          staff.score
                        )}`}
                      >
                        {staff.score}
                      </span>
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

export default StaffPerformanceScores;
