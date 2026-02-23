"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Reservation {
  id: string;
  code: string;
  room: string;
  customer: string;
  duration: string;
  viewLink: string;
}

const UpcomingVIPReservations: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Sample data - in a real app, this would come from an API
  const allReservations: Reservation[] = [
    {
      id: "1",
      code: "TRZ-32",
      room: "Deluxe Room - G - 3215",
      customer: "Angela Carter",
      duration: "10 Dec - 15 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "2",
      code: "TRZ-34",
      room: "Sweet Suite - S - 1265",
      customer: "Walter White",
      duration: "12 Dec - 16 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "3",
      code: "TRZ-42",
      room: "The Queensland - Q32",
      customer: "Zennifer Loren",
      duration: "15 Dec - 20 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "4",
      code: "TRZ-15",
      room: "Sweet Suite - S - 3214",
      customer: "Johna Mandala",
      duration: "11 Dec - 14 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "5",
      code: "TRZ-29",
      room: "Deluxe Room - F - 7213",
      customer: "Viktor James",
      duration: "10 Dec - 15 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "6",
      code: "TRZ-45",
      room: "Presidential Suite - P - 1001",
      customer: "Michael Johnson",
      duration: "18 Dec - 25 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "7",
      code: "TRZ-22",
      room: "Executive Room - E - 502",
      customer: "Sarah Williams",
      duration: "14 Dec - 19 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "8",
      code: "TRZ-38",
      room: "Ocean View - O - 2103",
      customer: "David Brown",
      duration: "16 Dec - 22 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "9",
      code: "TRZ-15",
      room: "Sweet Suite - S - 3214",
      customer: "Johna Mandala",
      duration: "11 Dec - 14 Dec",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "10",
      code: "TRZ-29",
      room: "Deluxe Room - F - 7213",
      customer: "Viktor James",
      duration: "10 Dec - 15 Dec",
      viewLink: "/hotel/room-details/",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalItems = allReservations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentReservations = allReservations.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Upcoming VIP Reservations</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-[#F5F7F8] bg-[#F5F7F8] dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
              <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                {selectedOption}
                <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
              </span>
            </MenuButton>

            <MenuItems
              transition
              className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {["Weekly", "Monthly", "Yearly"].map((option) => (
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
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>

      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Code
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Room
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Customer
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Duration
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0"></th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {currentReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {reservation.code}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <Link
                      href={reservation.viewLink}
                      className="font-semibold text-black dark:text-white hover:text-primary-500 transition-all"
                    >
                      {reservation.room}
                    </Link>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {reservation.customer}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <span className="inline-block text-xs px-[8px] text-primary-500 bg-primary-50 dark:bg-[#15203c] py-[3px] font-medium rounded-[4px]">
                      {reservation.duration}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                    <div className="flex items-center gap-[10px]">
                      <Link href={reservation.viewLink} className="inline-flex">
                        <button
                          type="button"
                          className="text-primary-500 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>
                      </Link>

                      <button
                        type="button"
                        className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          edit
                        </i>
                      </button>
                      <button
                        type="button"
                        className="text-danger-500 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          delete
                        </i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-[10px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 text-xs">
            Showing {startIndex + 1} to {endIndex} of {totalItems} results
          </p>

          <ol className="mt-[10px] sm:mt-0 flex items-center">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === 1
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                    currentPage === page
                      ? "border border-primary-500 bg-primary-500 text-white"
                      : "border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === totalPages
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}
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
  );
};

export default UpcomingVIPReservations;
