"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type Rating = {
  id: number;
  name: string;
  specialization: string;
  image: string;
  date: string;
  ratings: number; // Number of full ratings out of 5
};

const initialRatings: Rating[] = [
  {
    id: 1,
    name: "Olivia Clark",
    specialization: "Big Data",
    image: "/images/users/user13.jpg",
    date: "1 April 2024",
    ratings: 5,
  },
  {
    id: 2,
    name: "Ava Turner",
    specialization: "UX/UI",
    image: "/images/users/user16.jpg",
    date: "2 April 2024",
    ratings: 4.5,
  },
  {
    id: 3,
    name: "Lucas Morgan",
    specialization: "Developer",
    image: "/images/users/user17.jpg",
    date: "3 April 2024",
    ratings: 4,
  },
  {
    id: 4,
    name: "Isabella Cooper",
    specialization: "Designer",
    image: "/images/users/user18.jpg",
    date: "4 April 2024",
    ratings: 4.5,
  },
  {
    id: 5,
    name: "Sophia Brown",
    specialization: "Marketing",
    image: "/images/users/user19.jpg",
    date: "5 April 2024",
    ratings: 5,
  },
  {
    id: 6,
    name: "Olivia Clark",
    specialization: "Big Data",
    image: "/images/users/user20.jpg",
    date: "6 April 2024",
    ratings: 5,
  },
  {
    id: 7,
    name: "Lucas Morgan",
    specialization: "Developer",
    image: "/images/users/user21.jpg",
    date: "7 April 2024",
    ratings: 4,
  },
  {
    id: 8,
    name: "Ava Turner",
    specialization: "UX/UI",
    image: "/images/users/user22.jpg",
    date: "8 April 2024",
    ratings: 4.5,
  },
  {
    id: 9,
    name: "Sophia Brown",
    specialization: "Marketing",
    image: "/images/users/user19.jpg",
    date: "5 April 2024",
    ratings: 5,
  },
  {
    id: 10,
    name: "Isabella Cooper",
    specialization: "Designer",
    image: "/images/users/user18.jpg",
    date: "4 April 2024",
    ratings: 4.5,
  },
];

const ITEMS_PER_PAGE = 5;

const RecentCustomerRatings: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 6 Months");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(initialRatings.length / ITEMS_PER_PAGE);

  const displayedRatings = initialRatings.slice(
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

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Customer Ratings</h5>
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
                    Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Ratings
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {displayedRatings.map((rating) => (
                  <tr key={rating.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[44px] h-[44px] ltr:mr-[12px] rtl:ml-[12px]">
                          <Image
                            src={rating.image}
                            className="rounded-full inline-block"
                            alt={`${rating.name}`}
                            width={44}
                            height={44}
                          />
                        </div>
                        <div>
                          <span className="block font-medium">
                            {rating.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 block mt-px">
                            {rating.specialization}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {rating.date}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="text-[15px] leading-none text-orange-400">
                        {Array.from({ length: 5 }, (_, i) =>
                          i < Math.floor(rating.ratings) ? (
                            <i key={i} className="ri-star-fill"></i>
                          ) : rating.ratings > i ? (
                            <i key={i} className="ri-star-half-fill"></i>
                          ) : (
                            <i key={i} className="ri-star-line"></i>
                          )
                        )}
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
                {" "}
                {ITEMS_PER_PAGE * (currentPage - 1) + 1} –{" "}
                {Math.min(ITEMS_PER_PAGE * currentPage, initialRatings.length)}{" "}
                of {initialRatings.length}
              </p>

              <ol className="ltr:ml-[10px] rtl:mr-[10px]">
                <li className="inline-block mx-[3px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    className="w-[31px] h-[31px] block leading-[31px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange("prev")}
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>
                <li className="inline-block mx-[3px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                  <button
                    className="w-[31px] h-[31px] block leading-[31px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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

export default RecentCustomerRatings;
