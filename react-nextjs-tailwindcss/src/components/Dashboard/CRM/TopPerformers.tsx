"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type Performer = {
  name: string;
  email: string;
  image: string;
  profileLink: string;
};

const performers: Performer[] = [
  {
    name: "Alex Davis",
    email: "alex@trezo.com",
    image: "/images/users/user6.jpg",
    profileLink: "#",
  },
  {
    name: "Laura Martinez",
    email: "laura@trezo.com",
    image: "/images/users/user7.jpg",
    profileLink: "#",
  },
  {
    name: "Mark Thompson",
    email: "mark@trezo.com",
    image: "/images/users/user8.jpg",
    profileLink: "#",
  },
  {
    name: "Rachel White",
    email: "rachel@trezo.com",
    image: "/images/users/user9.jpg",
    profileLink: "#",
  },
  {
    name: "Kevin Lee",
    email: "kevin@trezo.com",
    image: "/images/users/user10.jpg",
    profileLink: "#",
  },
  {
    name: "Wilson Lee",
    email: "wilson@trezo.com",
    image: "/images/users/user11.jpg",
    profileLink: "#",
  },
  {
    name: "Smith Martinez",
    email: "smith@trezo.com",
    image: "/images/users/user12.jpg",
    profileLink: "#",
  },
  {
    name: "Jones Thompson",
    email: "jones@trezo.com",
    image: "/images/users/user13.jpg",
    profileLink: "#",
  },
  {
    name: "Williams White",
    email: "wlliams@trezo.com",
    image: "/images/users/user14.jpg",
    profileLink: "#",
  },
  {
    name: "Gelbero Lee",
    email: "gelbero@trezo.com",
    image: "/images/users/user15.jpg",
    profileLink: "#",
  },
];

const TopPerformers: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(performers.length / itemsPerPage);

  // Get current page's performers
  const currentPerformers = performers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Navigate to the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Performers</h5>
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
                {currentPerformers.map((performer, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 ltr:last:pr-0 rtl:first:pr-0 rtl:last:pl-0">
                      <div className="flex items-center">
                        <div className="w-[44px] h-[44px] ltr:mr-[12px] rtl:ml-[12px]">
                          <Image
                            src={performer.image}
                            className="rounded-full inline-block"
                            alt={`${performer.name}`}
                            width={44}
                            height={44}
                          />
                        </div>
                        <div>
                          <span className="block font-medium">
                            {performer.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 block mt-px">
                            {performer.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[17px] border-b border-gray-100 dark:border-[#172036] ltr:first:pl-0 ltr:last:pr-0 rtl:first:pr-0 rtl:last:pl-0">
                      <a
                        href={performer.profileLink}
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-[17px]">
            <p className="!mb-0 text-sm">
              Items per page: <strong>{itemsPerPage}</strong>
            </p>
            <div className="flex items-center">
              <p className="!mb-0 text-sm">
                {currentPage * itemsPerPage - (itemsPerPage - 1)} –{" "}
                {Math.min(currentPage * itemsPerPage, performers.length)} of{" "}
                {performers.length}
              </p>
              <ol className="ltr:ml-[10px] rtl:mr-[10px] flex gap-[6px]">
                <li>
                  <button
                    className="w-[31px] h-[31px] flex items-center justify-center text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <i className="material-symbols-outlined">chevron_left</i>
                  </button>
                </li>
                <li>
                  <button
                    className="w-[31px] h-[31px] flex items-center justify-center text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <i className="material-symbols-outlined">chevron_right</i>
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

export default TopPerformers;
