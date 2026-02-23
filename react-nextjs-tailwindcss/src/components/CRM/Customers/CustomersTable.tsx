"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  lastLogin: string;
  received: string;
  due: string;
  status: "Active" | "Deactive";
}

const initialCustomers: Customer[] = [
   {
    id: "#850",
    name: "Oliver Khan",
    avatar: "/images/users/user6.jpg",
    email: "oliver@trezo.com",
    phone: "+1 555-123-4567",
    lastLogin: "19 Jun 2024",
    received: "$6,855",
    due: "$125",
    status: "Active",
  },
  {
    id: "#851",
    name: "Carolyn Barnes",
    avatar: "/images/users/user7.jpg",
    email: "carolyn@trezo.com",
    phone: "+1 555-987-6543",
    lastLogin: "18 Jun 2024",
    received: "$258",
    due: "$99",
    status: "Active",
  },
  {
    id: "#852",
    name: "Donna Miller",
    avatar: "/images/users/user8.jpg",
    email: "donna@trezo.com",
    phone: "+1 555-456-7890",
    lastLogin: "17 Jun 2024",
    received: "$3,890",
    due: "$0",
    status: "Deactive",
  },
  {
    id: "#853",
    name: "Barbara Cross",
    avatar: "/images/users/user9.jpg",
    email: "barbara@trezo.com",
    phone: "+1 555-369-7878",
    lastLogin: "16 Jun 2024",
    received: "$2,500",
    due: "$279",
    status: "Active",
  },
  {
    id: "#854",
    name: "Rebecca Block",
    avatar: "/images/users/user10.jpg",
    email: "rebecca@trezo.com",
    phone: "+1 555-658-4488",
    lastLogin: "15 Jun 2024",
    received: "$8,200",
    due: "$0",
    status: "Deactive",
  },
  {
    id: "#855",
    name: "Sarah Green",
    avatar: "/images/users/user11.jpg",
    email: "sarah@trezo.com",
    phone: "+1 555-765-4321",
    lastLogin: "14 Jun 2024",
    received: "$1,200",
    due: "$500",
    status: "Active",
  },
  {
    id: "#856",
    name: "James Arnold",
    avatar: "/images/users/user12.jpg",
    email: "james@trezo.com",
    phone: "+1 555-234-5678",
    lastLogin: "13 Jun 2024",
    received: "$7,600",
    due: "$0",
    status: "Deactive",
  },
  {
    id: "#857",
    name: "Michael Gray",
    avatar: "/images/users/user13.jpg",
    email: "michael@trezo.com",
    phone: "+1 555-432-1234",
    lastLogin: "12 Jun 2024",
    received: "$5,500",
    due: "$1,000",
    status: "Active",
  },
  {
    id: "#858",
    name: "Sophia Wright",
    avatar: "/images/users/user14.jpg",
    email: "sophia@trezo.com",
    phone: "+1 555-123-4567",
    lastLogin: "11 Jun 2024",
    received: "$3,000",
    due: "$0",
    status: "Deactive",
  },
  {
    id: "#859",
    name: "David Lee",
    avatar: "/images/users/user15.jpg",
    email: "david@trezo.com",
    phone: "+1 555-678-9101",
    lastLogin: "10 Jun 2024",
    received: "$9,000",
    due: "$300",
    status: "Active",
  },
  {
    id: "#860",
    name: "Emily Turner",
    avatar: "/images/users/user16.jpg",
    email: "emily@trezo.com",
    phone: "+1 555-876-5432",
    lastLogin: "9 Jun 2024",
    received: "$2,150",
    due: "$150",
    status: "Active",
  },
  {
    id: "#861",
    name: "Christopher Scott",
    avatar: "/images/users/user17.jpg",
    email: "christopher@trezo.com",
    phone: "+1 555-234-8910",
    lastLogin: "8 Jun 2024",
    received: "$4,500",
    due: "$0",
    status: "Deactive",
  },
  {
    id: "#862",
    name: "Lisa Perez",
    avatar: "/images/users/user18.jpg",
    email: "lisa@trezo.com",
    phone: "+1 555-111-2233",
    lastLogin: "7 Jun 2024",
    received: "$1,800",
    due: "$200",
    status: "Active",
  },
  {
    id: "#863",
    name: "Steven Hall",
    avatar: "/images/users/user19.jpg",
    email: "steven@trezo.com",
    phone: "+1 555-332-4455",
    lastLogin: "6 Jun 2024",
    received: "$6,900",
    due: "$50",
    status: "Active",
  },
  {
    id: "#864",
    name: "Natalie Adams",
    avatar: "/images/users/user20.jpg",
    email: "natalie@trezo.com",
    phone: "+1 555-667-7889",
    lastLogin: "5 Jun 2024",
    received: "$3,500",
    due: "$1,000",
    status: "Deactive",
  },
  {
    id: "#865",
    name: "Andrew White",
    avatar: "/images/users/user21.jpg",
    email: "andrew@trezo.com",
    phone: "+1 555-789-6543",
    lastLogin: "4 Jun 2024",
    received: "$8,200",
    due: "$300",
    status: "Active",
  },
  {
    id: "#866",
    name: "Olivia King",
    avatar: "/images/users/user22.jpg",
    email: "olivia@trezo.com",
    phone: "+1 555-876-6543",
    lastLogin: "3 Jun 2024",
    received: "$5,400",
    due: "$450",
    status: "Active",
  },
  {
    id: "#867",
    name: "Jacob Foster",
    avatar: "/images/users/user23.jpg",
    email: "jacob@trezo.com",
    phone: "+1 555-345-6789",
    lastLogin: "2 Jun 2024",
    received: "$7,000",
    due: "$0",
    status: "Deactive",
  },
  {
    id: "#868",
    name: "Mia Collins",
    avatar: "/images/users/user24.jpg",
    email: "mia@trezo.com",
    phone: "+1 555-321-5432",
    lastLogin: "1 Jun 2024",
    received: "$2,000",
    due: "$50",
    status: "Active",
  },
  {
    id: "#869",
    name: "James Arnold",
    avatar: "/images/users/user12.jpg",
    email: "james@trezo.com",
    phone: "+1 555-234-5678",
    lastLogin: "13 Jun 2024",
    received: "$7,600",
    due: "$0",
    status: "Deactive",
  },
];

const CustomersTable: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredCustomers = customers
    .filter((customer) => {
      // Filter by search query
      return (
        customer.name.toLowerCase().includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery) ||
        customer.phone.includes(searchQuery)
      );
    })
    .filter((customer) => {
      // Filter by selected status
      if (selectedOption === "All") {
        return true;
      }
      return customer.status === selectedOption;
    });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const handleCheckboxChange = (customerId: string) => {
    setSelectedCustomers((prevSelected) =>
      prevSelected.includes(customerId)
        ? prevSelected.filter((id) => id !== customerId)
        : [...prevSelected, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === currentCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentCustomers.map((customer) => customer.id));
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== customerId)
    );
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search customer here..."
                value={searchQuery}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["All", "Active", "Deactive"].map((option) => (
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    <div className="form-check relative top-[2px]">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={
                          selectedCustomers.length ===
                            filteredCustomers.length &&
                          filteredCustomers.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Customer
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Phone
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Last Login
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Received
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Due
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="form-check relative top-[2px]">
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={() => handleCheckboxChange(customer.id)}
                          />
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.id}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <div className="w-[40px] rounded-full">
                            <Image
                              src={customer.avatar}
                              className="inline-block rounded-full"
                              alt={customer.name}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ltr:ml-[12px] rtl:mr-[12px]">
                            <span className="block font-medium">
                              {customer.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        {customer.email}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.lastLogin}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.received}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.due}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span
                          className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                            customer.status === "Active"
                              ? "bg-primary-50 text-primary-500"
                              : "bg-orange-100 text-orange-500"
                          }`}
                        >
                          {customer.status}
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
                              onClick={() => deleteCustomer(customer.id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              {" "}
              Showing {indexOfFirstCustomer + 1} to {indexOfLastCustomer} of{" "}
              {filteredCustomers.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
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
                    onClick={() => handlePageClick(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

export default CustomersTable;
