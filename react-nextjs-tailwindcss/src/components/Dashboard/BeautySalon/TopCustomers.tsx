"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const TopCustomers: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Sample dynamic data
  const [customers] = useState([
    {
      id: "#001",
      name: "Johhna Loren",
      image: "/images/users/user36.jpg",
      phone: "+321 427 8690",
      email: "loren123@gmail.com",
      service: "Nail Art",
      lastVisit: "17 Oct, 2025",
      status: "VIP",
    },
    {
      id: "#002",
      name: "Skyler White",
      image: "/images/users/user37.jpg",
      phone: "+321 427 3980",
      email: "skyqueen@gmail.com",
      service: "Hair Cut",
      lastVisit: "18 Oct, 2025",
      status: "Royal",
    },
    {
      id: "#003",
      name: "Jonathon Watson",
      image: "/images/users/user38.jpg",
      phone: "+321 427 1243",
      email: "jona2134@gmail.com",
      service: "Manicure",
      lastVisit: "19 Oct, 2025",
      status: "Royal",
    },
    {
      id: "#004",
      name: "Walter Olivia",
      image: "/images/users/user43.jpg",
      phone: "+321 427 7685",
      email: "puzzleworld@gmail.com",
      service: "Pedicure",
      lastVisit: "21 Oct, 2025",
      status: "VIP",
    },
    {
      id: "#005",
      name: "David Carlen",
      image: "/images/users/user40.jpg",
      phone: "+321 427 9021",
      email: "liveslong@gmail.com",
      service: "Facial",
      lastVisit: "25 Oct, 2025",
      status: "Normal",
    },
    {
      id: "#006",
      name: "Emily Brown",
      image: "/images/users/user41.jpg",
      phone: "+321 427 7741",
      email: "emilyb@gmail.com",
      service: "Hair Spa",
      lastVisit: "26 Oct, 2025",
      status: "VIP",
    },
    {
      id: "#007",
      name: "Michael Clarke",
      image: "/images/users/user42.jpg",
      phone: "+321 427 3360",
      email: "mclarke89@gmail.com",
      service: "Beard Trim",
      lastVisit: "27 Oct, 2025",
      status: "Normal",
    },
    {
      id: "#008",
      name: "Sarah Connor",
      image: "/images/users/user44.jpg",
      phone: "+321 427 1109",
      email: "terminatormom@gmail.com",
      service: "Waxing",
      lastVisit: "28 Oct, 2025",
      status: "Royal",
    },
    {
      id: "#009",
      name: "Bruce Wayne",
      image: "/images/users/user45.jpg",
      phone: "+321 427 2255",
      email: "batman@wayneenterprises.com",
      service: "Hair Styling",
      lastVisit: "29 Oct, 2025",
      status: "VIP",
    },
    {
      id: "#010",
      name: "Diana Prince",
      image: "/images/users/user46.jpg",
      phone: "+321 427 8844",
      email: "wonderdiana@gmail.com",
      service: "Skin Polish",
      lastVisit: "30 Oct, 2025",
      status: "Normal",
    },
  ]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  // Status styling function
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "VIP":
        return "text-success-700 border-success-300 bg-success-100";
      case "Royal":
        return "text-purple-700 border-purple-300 bg-purple-100";
      case "Normal":
        return "text-primary-700 border-primary-300 bg-primary-100";
      default:
        return "text-gray border-gray-300 bg-gray-100";
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Top Customers</h5>
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
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  ID
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  Customer Name
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  Phone No
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  Email
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  Preferred Service
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  Last Visit
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0">
                  Status
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] text-left pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 first:pl-0 last:pr-0"></th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {currentItems.map((customer) => (
                <tr key={customer.id}>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {customer.id}
                    </span>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[40px]">
                        <Image
                          src={customer.image}
                          className="inline-block rounded-full"
                          alt="user-image"
                          width={40}
                          height={40}
                        />
                      </div>
                      <span className="font-semibold inline-block">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {customer.phone}
                    </span>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <span className="block text-xs text-gray-600 dark:text-gray-400">
                      {customer.email}
                    </span>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {customer.service}
                    </span>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {customer.lastVisit}
                    </span>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <span
                      className={`inline-block text-xs px-[9px] border dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] ${getStatusStyles(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0">
                    <div className="flex items-center gap-[9px]">
                      <button
                        type="button"
                        className="text-primary-500 leading-none custom-tooltip"

                      >
                        <i className="material-symbols-outlined !text-md">
                          visibility
                        </i>
                      </button>
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

        <div className="pt-[11px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-xs">
            Showing {currentItems.length} of {customers.length} results
          </p>

          <ol className="mt-[10px] sm:mt-0">
            <li className="inline-block mx-[2px] first:ml-0 last:mr-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
                className="inline-block mx-[2px] first:ml-0 last:mr-0"
              >
                <button
                  onClick={() => handlePageChange(page)}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border transition-all ${
                    currentPage === page
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className="inline-block mx-[2px] first:ml-0 last:mr-0">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-500 hover:text-white hover:border-primary-500"
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

export default TopCustomers;
