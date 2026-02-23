"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

interface Patient {
  id: string;
  name: string;
  email: string;
  avatar: string;
  disease: string;
  paymentStatus: "Paid" | "Unpaid";
  status: "Completed" | "Pending" | "Failed";
}

const MyRecentPatients: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Sample patient data
  const allPatients: Patient[] = [
    {
      id: "#001",
      name: "Johhna Loren",
      email: "loren123@gmail.com",
      avatar: "/images/users/user33.jpg",
      disease: "Heart Attack",
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: "#002",
      name: "Skyler White",
      email: "skyqueen@gmail.com",
      avatar: "/images/users/user34.jpg",
      disease: "Chest Pain",
      paymentStatus: "Paid",
      status: "Pending",
    },
    {
      id: "#003",
      name: "Jonathon Watson",
      email: "jona2134@gmail.com",
      avatar: "/images/users/user35.jpg",
      disease: "Breathing Issue",
      paymentStatus: "Unpaid",
      status: "Failed",
    },
    {
      id: "#004",
      name: "Walter White",
      email: "puzzleworld@gmail.com",
      avatar: "/images/users/user36.jpg",
      disease: "Heart Surgery",
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: "#005",
      name: "David Carlen",
      email: "liveslong@gmail.com",
      avatar: "/images/users/user37.jpg",
      disease: "CVD",
      paymentStatus: "Unpaid",
      status: "Pending",
    },
    {
      id: "#006",
      name: "Emily Brown",
      email: "emilyb@gmail.com",
      avatar: "/images/users/user38.jpg",
      disease: "Arrhythmia",
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: "#007",
      name: "Michael Clarke",
      email: "mclarke89@gmail.com",
      avatar: "/images/users/user39.jpg",
      disease: "Angina",
      paymentStatus: "Unpaid",
      status: "Pending",
    },
    {
      id: "#008",
      name: "Sarah Connor",
      email: "sarah@gmail.com",
      avatar: "/images/users/user40.jpg",
      disease: "Valve Disorder",
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: "#009",
      name: "Bruce Wayne",
      email: "batman@gmail.com",
      avatar: "/images/users/user41.jpg",
      disease: "High Blood Pressure",
      paymentStatus: "Unpaid",
      status: "Failed",
    },
    {
      id: "#010",
      name: "Diana Prince",
      email: "diana@gmail.com",
      avatar: "/images/users/user42.jpg",
      disease: "Cardiomyopathy",
      paymentStatus: "Paid",
      status: "Pending",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  // Calculate current patients to display
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = allPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(allPatients.length / patientsPerPage);

  // Get status styling based on status value
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-success-700 border-success-300 bg-success-100";
      case "Pending":
        return "text-purple-700 border-purple-300 bg-purple-100";
      case "Failed":
        return "text-danger-700 border-danger-300 bg-danger-100";
      default:
        return "text-gray border-gray-300 bg-gray-100";
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">My Recent Patients</h5>
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
        <div className="table-responsive overflow-x-auto overflow-y-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[9px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  ID
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[9px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Patient Name
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[9px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Disease
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[9px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Payment Status
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[9px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Status
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[9px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left"></th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {currentPatients.map((patient, index) => (
                <tr key={patient.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {patient.id}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[40px]">
                        <Image
                          src={patient.avatar}
                          className="inline-block rounded-full"
                          alt="user-image"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className="font-semibold inline-block mb-px">
                          {patient.name}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          {patient.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {patient.disease}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {patient.paymentStatus}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span
                      className={`inline-block text-xs px-[9px] border ${getStatusStyle(
                        patient.status
                      )} dark:bg-[#15203c] dark:border-[#15203c] text-sm rounded-[100px]`}
                    >
                      {patient.status}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <Menu as="div" className="trezo-card-dropdown relative">
                      <MenuButton
                        className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500"
                        id="dropdownToggleBtn"
                      >
                        <i className="ri-more-2-fill"></i>
                      </MenuButton>

                      <MenuItems
                        className={`transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ${
                          index >= currentPatients.length - 2
                            ? "bottom-full"
                            : "top-full"
                        }`}
                      >
                        <MenuItem>
                          <button
                            type="button"
                            className="flex gap-1 w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                          >
                            <i className="ri-add-fill text-primary-500"></i>
                            View
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            type="button"
                            className="flex gap-1 w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                          >
                            <i className="ri-multi-image-line text-primary-500"></i>
                            Edit
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            type="button"
                            className="flex gap-1 w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                          >
                            <i className="ri-dropbox-line text-primary-500"></i>
                            Delete
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pt-[9px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-xs">
            Showing {indexOfFirstPatient + 1} to{" "}
            {Math.min(indexOfLastPatient, allPatients.length)} of{" "}
            {allPatients.length} results
          </p>

          <ol className="mt-[10px] sm:mt-0">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <li
                  key={pageNumber}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === pageNumber
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            )}

            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default MyRecentPatients;
