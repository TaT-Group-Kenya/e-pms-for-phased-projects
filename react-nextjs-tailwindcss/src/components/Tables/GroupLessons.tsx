"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type Lesson = {
  id: number;
  title: string;
  date: string;
  participants: string[]; // Image URLs of participants
};

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: "Digital Marketing",
    date: "15 March 2024",
    participants: [
      "/images/users/user20.jpg",
      "/images/users/user21.jpg",
      "/images/users/user6.jpg",
    ],
  },
  {
    id: 2,
    title: "Web Development",
    date: "10 March 2024",
    participants: [
      "/images/users/user22.jpg",
      "/images/users/user23.jpg",
      "/images/users/user24.jpg",
    ],
  },
  {
    id: 3,
    title: "UX/UI Design",
    date: "05 March 2024",
    participants: [
      "/images/users/user25.jpg",
      "/images/users/user26.jpg",
      "/images/users/user27.jpg",
    ],
  },
  {
    id: 4,
    title: "Content Writing",
    date: "02 March 2024",
    participants: [
      "/images/users/user28.jpg",
      "/images/users/user29.jpg",
      "/images/users/user30.jpg",
    ],
  },
  {
    id: 5,
    title: "SEO Basics",
    date: "01 March 2024",
    participants: [
      "/images/users/user13.jpg",
      "/images/users/user14.jpg",
      "/images/users/user15.jpg",
    ],
  },
  {
    id: 6,
    title: "UX/UI Design",
    date: "05 March 2024",
    participants: [
      "/images/users/user1.jpg",
      "/images/users/user2.jpg",
      "/images/users/user3.jpg",
    ],
  },
  {
    id: 7,
    title: "Digital Marketing",
    date: "15 March 2024",
    participants: [
      "/images/users/user4.jpg",
      "/images/users/user5.jpg",
      "/images/users/user6.jpg",
    ],
  },
  {
    id: 8,
    title: "Web Development",
    date: "10 March 2024",
    participants: [
      "/images/users/user7.jpg",
      "/images/users/user8.jpg",
      "/images/users/user9.jpg",
    ],
  },
];

const ITEMS_PER_PAGE = 4;

const GroupLessons: React.FC = () => {
  const [lessons] = useState<Lesson[]>(initialLessons);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>("Last 6 Months");

  const totalPages = Math.ceil(lessons.length / ITEMS_PER_PAGE);

  const displayedLessons = lessons.slice(
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
            <h5 className="!mb-0">Group Lessons</h5>
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

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <tbody className="text-black dark:text-white">
                {displayedLessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 ltr:last:pr-0 rtl:first:pr-0 rtl:last:pl-0">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {lesson.participants.map((image, index) => (
                            <div
                              key={index}
                              className="rounded-full w-[45px] h-[45px] text-xs ltr:-mr-[21px] rtl:-ml-[21px] ltr:last:mr-0 rtl:last:ml-0 border-[2px] border-white"
                            >
                              <Image
                                alt="participant"
                                src={image}
                                className="rounded-full"
                                width={41}
                                height={41}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="ltr:ml-[10px] rtl:mr-[10px]">
                          <span className="block font-medium">
                            {lesson.title}
                          </span>
                          <span className="block mt-[5px] text-gray-500 dark:text-gray-400">
                            {lesson.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 ltr:last:pr-0 rtl:first:pr-0 rtl:last:pl-0">
                      <a
                        href="#"
                        className="inline-block relative w-[36px] h-[36px] text-center text-gray-500 dark:text-gray-400 transition-all border border-gray-100 dark:border-[#172036] rounded-full hover:bg-primary-500 hover:border-primary-500 hover:text-white"
                      >
                        <i className="material-symbols-outlined absolute left-0 right-0 !text-lg top-1/2 -translate-y-1/2">
                          arrow_outward
                        </i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-[17px]">
            <p className="!mb-0 !text-sm">
              Items per pages: <strong>{ITEMS_PER_PAGE}</strong>
            </p>

            <div className="flex items-center">
              <p className="!mb-0 !text-sm">
                {ITEMS_PER_PAGE * (currentPage - 1) + 1} –{" "}
                {Math.min(ITEMS_PER_PAGE * currentPage, lessons.length)} of{" "}
                {lessons.length}
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

export default GroupLessons;
