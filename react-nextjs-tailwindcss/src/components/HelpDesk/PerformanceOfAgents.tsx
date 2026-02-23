"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type Agent = {
  id: number;
  name: string;
  image: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: string;
  satisfactionRate: number;
  color: string;
  availability: "Available" | "Not Available";
};

const initialAgents: Agent[] = [
  {
    id: 850,
    name: "Oliver Khan",
    image: "/images/users/user6.jpg",
    totalTickets: 230,
    openTickets: 20,
    resolvedTickets: 75,
    avgResolutionTime: "2.5 hours",
    satisfactionRate: 80,
    color: "#605DFF", // Circle progress color
    availability: "Available",
  },
  {
    id: 851,
    name: "Ava Cooper",
    image: "/images/users/user13.jpg",
    totalTickets: 180,
    openTickets: 16,
    resolvedTickets: 35,
    avgResolutionTime: "1.4 hours",
    satisfactionRate: 75,
    color: "#AD63F6",
    availability: "Available",
  },
  {
    id: 852,
    name: "Isabella Evans",
    image: "/images/users/user14.jpg",
    totalTickets: 150,
    openTickets: 35,
    resolvedTickets: 45,
    avgResolutionTime: "3.2 hours",
    satisfactionRate: 80,
    color: "#25B003",
    availability: "Available",
  },
  {
    id: 853,
    name: "Mia Hughes",
    image: "/images/users/user15.jpg",
    totalTickets: 75,
    openTickets: 86,
    resolvedTickets: 25,
    avgResolutionTime: "4.5 hours",
    satisfactionRate: 100,
    color: "#25B003",
    availability: "Available",
  },
  {
    id: 854,
    name: "Noah Mitchell",
    image: "/images/users/user16.jpg",
    totalTickets: 320,
    openTickets: 90,
    resolvedTickets: 10,
    avgResolutionTime: "3.8 hours",
    satisfactionRate: 100,
    color: "#FD5812",
    availability: "Not Available",
  },
  {
    id: 855,
    name: "Oliver Khan",
    image: "/images/users/user17.jpg",
    totalTickets: 120,
    openTickets: 55,
    resolvedTickets: 20,
    avgResolutionTime: "5.3 hours",
    satisfactionRate: 60,
    color: "#605DFF", // Circle progress color
    availability: "Available",
  },
  {
    id: 856,
    name: "Isabella Evans",
    image: "/images/users/user18.jpg",
    totalTickets: 150,
    openTickets: 35,
    resolvedTickets: 45,
    avgResolutionTime: "3.2 hours",
    satisfactionRate: 80,
    color: "#25B003",
    availability: "Available",
  },
  {
    id: 857,
    name: "Oliver Khan",
    image: "/images/users/user19.jpg",
    totalTickets: 230,
    openTickets: 20,
    resolvedTickets: 75,
    avgResolutionTime: "2.5 hours",
    satisfactionRate: 80,
    color: "#605DFF", // Circle progress color
    availability: "Available",
  },
  {
    id: 858,
    name: "Ava Cooper",
    image: "/images/users/user20.jpg",
    totalTickets: 180,
    openTickets: 16,
    resolvedTickets: 35,
    avgResolutionTime: "1.4 hours",
    satisfactionRate: 75,
    color: "#AD63F6",
    availability: "Available",
  },
  {
    id: 859,
    name: "Noah Mitchell",
    image: "/images/users/user21.jpg",
    totalTickets: 320,
    openTickets: 90,
    resolvedTickets: 10,
    avgResolutionTime: "3.8 hours",
    satisfactionRate: 100,
    color: "#FD5812",
    availability: "Not Available",
  },
  {
    id: 860,
    name: "Oliver Khan",
    image: "/images/users/user22.jpg",
    totalTickets: 120,
    openTickets: 55,
    resolvedTickets: 20,
    avgResolutionTime: "5.3 hours",
    satisfactionRate: 60,
    color: "#605DFF", // Circle progress color
    availability: "Available",
  },
  {
    id: 861,
    name: "Mia Hughes",
    image: "/images/users/user23.jpg",
    totalTickets: 75,
    openTickets: 86,
    resolvedTickets: 25,
    avgResolutionTime: "4.5 hours",
    satisfactionRate: 100,
    color: "#25B003",
    availability: "Available",
  },
];

const ITEMS_PER_PAGE = 10;

const PerformanceOfAgents: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 30 Days");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(agents.length / ITEMS_PER_PAGE);

  const displayedAgents = agents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: number) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Performance of Agents</h5>
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "ID",
                    "Agent Name",
                    "Total Tickets",
                    "Open Tickets",
                    "Resolved Tickets",
                    "Avg. Resolution Time",
                    "Satisfaction Rate",
                    "Availability",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {displayedAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        #{agent.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={agent.image}
                            alt={agent.name}
                            className="inline-block rounded-full"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {agent.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {agent.totalTickets}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {agent.openTickets}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {agent.resolvedTickets}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {agent.avgResolutionTime}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="rounded-full relative w-[40px] h-[40px]">
                        {/* Create Here: https://nikitahl.github.io/svg-circle-progress-generator/ */}
                        <svg
                          width="50"
                          height="50"
                          viewBox="-25 -25 250 250"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative -top-[5px] ltr:-left-[5px] rtl:-right-[5px]"
                          style={{ transform: "rotate(-90deg)" }}
                        >
                          <circle
                            r="90"
                            cx="100"
                            cy="100"
                            fill="transparent"
                            stroke="transparent"
                            strokeWidth="16px"
                            strokeDasharray="565.48px"
                            strokeDashoffset="0"
                          ></circle>
                          <circle
                            r="90"
                            cx="100"
                            cy="100"
                            stroke={agent.color}
                            strokeWidth="16px"
                            strokeLinecap="round"
                            strokeDashoffset={
                              (1 - agent.satisfactionRate / 100) * 565.48
                            }
                            fill="transparent"
                            strokeDasharray="565.48px"
                          ></circle>
                        </svg>
                        <span className="block text-gray-500 dark:text-gray-400 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[10px] absolute">
                          {agent.satisfactionRate}%
                        </span>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          agent.availability === "Available"
                            ? "bg-primary-50 text-primary-500"
                            : "bg-danger-50 text-danger-500"
                        }`}
                      >
                        {agent.availability}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
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
                            onClick={() => handleDelete(agent.id)}
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
              Showing {displayedAgents.length} of {agents.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 space-x-1">
              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li className="inline-block" key={index}>
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default PerformanceOfAgents;
