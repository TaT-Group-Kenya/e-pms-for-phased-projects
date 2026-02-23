"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type StudentProgress = {
  id: number;
  name: string;
  course: string;
  progress: number; // Percentage of completion
  color: string; // Progress bar color
};

const initialProgressData: StudentProgress[] = [
  {
    id: 1,
    name: "Olivia Clark",
    course: "Web Design",
    progress: 55,
    color: "bg-primary-500",
  },
  {
    id: 2,
    name: "Alexander Garcia",
    course: "Python Dev",
    progress: 70,
    color: "bg-success-500",
  },
  {
    id: 3,
    name: "Chloe Lewis",
    course: "Front-end",
    progress: 30,
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Ava Turner",
    course: "Back-end",
    progress: 90,
    color: "bg-danger-500",
  },
  {
    id: 5,
    name: "Ryan Flores",
    course: "Data Analytics",
    progress: 50,
    color: "bg-secondary-500",
  },
  {
    id: 6,
    name: "John Doe",
    course: "Plugin Dev",
    progress: 50,
    color: "bg-purple-500",
  },
  {
    id: 7,
    name: "Sophia Brown",
    course: "AI Development",
    progress: 75,
    color: "bg-success-500",
  },
  {
    id: 8,
    name: "Lucas Morgan",
    course: "Mobile Apps",
    progress: 40,
    color: "bg-danger-500",
  },
  {
    id: 9,
    name: "Williams",
    course: "AI Development",
    progress: 75,
    color: "bg-success-500",
  },
  {
    id: 10,
    name: "Martin",
    course: "Mobile Apps",
    progress: 40,
    color: "bg-danger-500",
  },
  {
    id: 11,
    name: "Anderson",
    course: "Data Analytics",
    progress: 50,
    color: "bg-secondary-500",
  },
  {
    id: 12,
    name: "Anderson",
    course: "Plugin Dev",
    progress: 50,
    color: "bg-purple-500",
  },
];

const ITEMS_PER_PAGE = 6;

const StudentsProgress: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Last 6 Months");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(initialProgressData.length / ITEMS_PER_PAGE);

  const displayedData = initialProgressData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (direction: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected time period: ${option}`);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Student&apos;s Progress</h5>
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
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Course Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {displayedData.map((student) => (
                  <tr key={student.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] font-medium">
                      {student.name}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {student.course}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                        <div
                          className={`flex flex-col justify-center overflow-hidden ${student.color} rounded-md`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] flex items-center justify-between">
            <p className="!mb-0 !text-sm">
              Items per pages: <strong>{ITEMS_PER_PAGE}</strong>
            </p>

            <div className="flex items-center">
              <p className="!mb-0 !text-sm">
                {ITEMS_PER_PAGE * (currentPage - 1) + 1} –{" "}
                {Math.min(
                  ITEMS_PER_PAGE * currentPage,
                  initialProgressData.length
                )}{" "}
                of {initialProgressData.length}
              </p>

              <ol className="ltr:ml-[10px] rtl:mr-[10px]">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange("prev")}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange("next")}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_right
                    </i>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsProgress;
