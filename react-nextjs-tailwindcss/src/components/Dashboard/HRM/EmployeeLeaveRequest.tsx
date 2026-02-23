"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Mock data type
type EmployeeLeave = {
  id: number;
  name: string;
  department: string;
  leaveType: string;
  days: number;
  status: string;
  imageUrl: string;
};

const EmployeeLeaveRequest: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("This Month");
  const [leaveRequests, setLeaveRequests] = useState<EmployeeLeave[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Simulating data fetching
  useEffect(() => {
    // Simulate fetching data from an API or backend
    const fetchData = () => {
      const data = [
        {
          id: 1,
          name: "John Doe",
          department: "Marketing",
          leaveType: "Vacation",
          days: 3,
          status: "Approved",
          imageUrl: "/images/users/user42.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          department: "HR",
          leaveType: "Sick Leave",
          days: 2,
          status: "Pending",
          imageUrl: "/images/users/user41.jpg",
        },
        {
          id: 3,
          name: "Alex Johnson",
          department: "Developer",
          leaveType: "Maternity Leave",
          days: 4,
          status: "Rejected",
          imageUrl: "/images/users/user43.jpg",
        },
        {
          id: 4,
          name: "Emily Davis",
          department: "UX Designer",
          leaveType: "Vacation",
          days: 2,
          status: "Approved",
          imageUrl: "/images/users/user44.jpg",
        },
        {
          id: 5,
          name: "Michael Brown",
          department: "Finance",
          leaveType: "Personal Leave",
          days: 1,
          status: "Pending",
          imageUrl: "/images/users/user45.jpg",
        },

        {
          id: 6,
          name: "Alex Johnson",
          department: "Developer",
          leaveType: "Maternity Leave",
          days: 4,
          status: "Rejected",
          imageUrl: "/images/users/user46.jpg",
        },
        {
          id: 7,
          name: "Emily Davis",
          department: "UX Designer",
          leaveType: "Vacation",
          days: 2,
          status: "Approved",
          imageUrl: "/images/users/user47.jpg",
        },
        {
          id: 8,
          name: "Jane Smith",
          department: "HR",
          leaveType: "Sick Leave",
          days: 2,
          status: "Pending",
          imageUrl: "/images/users/user48.jpg",
        },
        {
          id: 9,
          name: "Michael Brown",
          department: "Finance",
          leaveType: "Personal Leave",
          days: 1,
          status: "Pending",
          imageUrl: "/images/users/user49.jpg",
        },
        {
          id: 50,
          name: "John Doe",
          department: "Marketing",
          leaveType: "Vacation",
          days: 3,
          status: "Approved",
          imageUrl: "/images/users/user50.jpg",
        },
      ];

      setLeaveRequests(data); // Update the state with the fetched data
    };

    fetchData();
  }, []); // This will run once on mount

  // Handle delete
  const handleDelete = (id: number) => {
    const updatedRequests = leaveRequests.filter(
      (request) => request.id !== id
    );
    setLeaveRequests(updatedRequests); // Update state with filtered list
  };

  // Pagination calculations
  const totalItems = leaveRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const currentData = leaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Employee Leave Request</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap">
                    Employee
                  </th>
                  <th className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap">
                    Leave Type
                  </th>
                  <th className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap">
                    Days
                  </th>
                  <th className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentData.map((leaveRequest) => (
                  <tr key={leaveRequest.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={leaveRequest.imageUrl}
                            className="inline-block rounded-full"
                            alt="Employee"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {leaveRequest.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {leaveRequest.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {leaveRequest.leaveType}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {leaveRequest.days}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block font-medium dark:bg-[#15203c] rounded-sm text-xs ${
                          leaveRequest.status === "Approved"
                            ? "bg-success-100 text-success-700"
                            : leaveRequest.status === "Pending"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-danger-100 text-danger-700"
                        } rounded-sm`}
                      >
                        {leaveRequest.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <div className="relative group">
                          <button
                            type="button"
                            className="text-primary-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-gray-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              edit
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-danger-500 leading-none"
                            onClick={() => handleDelete(leaveRequest.id)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {currentData.length} of {totalItems} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036]"
                    } transition-all hover:bg-primary-500 hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
    </>
  );
};

export default EmployeeLeaveRequest;
