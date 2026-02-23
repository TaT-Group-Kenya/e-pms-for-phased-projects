"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  id: number;
  projectName: string;
  projectLink: string;
  client: string;
  assignees: string[];
  budget: string;
  startDate: string;
  endDate: string;
  status: string;
  statusClass: string;
};

const initialProjects: Project[] = [
  {
    id: 850,
    projectName: "Project CyberSphere",
    projectLink: "/project-management/project-overview/",
    client: "NovaTech Solutions",
    assignees: [
      "/images/users/user15.jpg",
      "/images/users/user11.jpg",
      "/images/users/user6.jpg",
      "/images/users/user9.jpg",
    ],
    budget: "$4,500",
    startDate: "25 Mar 2024",
    endDate: "25 Apr 2024",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },
  {
    id: 851,
    projectName: "Digital Oasis Initiative",
    projectLink: "/project-management/project-overview/",
    client: "AlphaWave Innovations",
    assignees: [
      "/images/users/user7.jpg",
      "/images/users/user8.jpg",
      "/images/users/user9.jpg",
    ],
    budget: "$6,800",
    startDate: "20 Mar 2024",
    endDate: "20 Apr 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 852,
    projectName: "CloudScape Evolution",
    projectLink: "/project-management/project-overview/",
    client: "InnovateIQ Inc.",
    assignees: ["/images/users/user10.jpg", "/images/users/user12.jpg"],
    budget: "$2,500",
    startDate: "15 Mar 2024",
    endDate: "15 Apr 2024",
    status: "Pending",
    statusClass: "bg-purple-50 text-purple-500",
  },
  {
    id: 853,
    projectName: "Data Dynamo Drive",
    projectLink: "/project-management/project-overview/",
    client: "BlueSky Technologies",
    assignees: [
      "/images/users/user13.jpg",
      "/images/users/user14.jpg",
      "/images/users/user15.jpg",
      "/images/users/user12.jpg",
    ],
    budget: "$7,500",
    startDate: "10 Mar 2024",
    endDate: "10 Apr 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 855,
    projectName: "Agency Revolution",
    projectLink: "/project-management/project-overview/",
    client: "ET Technologies",
    assignees: [
      "/images/users/user1.jpg",
      "/images/users/user2.jpg",
      "/images/users/user5.jpg",
    ],
    budget: "$5,500",
    startDate: "5 Mar 2024",
    endDate: "5 Jan 2025",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },

  {
    id: 856,
    projectName: "ET Evolution",
    projectLink: "/project-management/project-overview/",
    client: "Envy Inc.",
    assignees: ["/images/users/user10.jpg", "/images/users/user12.jpg"],
    budget: "$2,500",
    startDate: "15 Mar 2024",
    endDate: "15 Apr 2024",
    status: "Pending",
    statusClass: "bg-purple-50 text-purple-500",
  },
  {
    id: 857,
    projectName: "Project IT Solutions",
    projectLink: "/project-management/project-overview/",
    client: "IT Solutions",
    assignees: [
      "/images/users/user15.jpg",
      "/images/users/user11.jpg",
      "/images/users/user6.jpg",
      "/images/users/user9.jpg",
    ],
    budget: "$4,500",
    startDate: "25 Mar 2024",
    endDate: "25 Apr 2024",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },
  {
    id: 858,
    projectName: "Digital Agency",
    projectLink: "/project-management/project-overview/",
    client: "MM Innovations",
    assignees: [
      "/images/users/user7.jpg",
      "/images/users/user8.jpg",
      "/images/users/user9.jpg",
    ],
    budget: "$6,800",
    startDate: "20 Mar 2024",
    endDate: "20 Apr 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 859,
    projectName: "React Template",
    projectLink: "/project-management/project-overview/",
    client: "ET Technologies",
    assignees: [
      "/images/users/user13.jpg",
      "/images/users/user14.jpg",
      "/images/users/user15.jpg",
      "/images/users/user12.jpg",
    ],
    budget: "$7,500",
    startDate: "10 Mar 2024",
    endDate: "10 Apr 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 860,
    projectName: "IT Agency",
    projectLink: "/project-management/project-overview/",
    client: "ET Technologies",
    assignees: [
      "/images/users/user1.jpg",
      "/images/users/user2.jpg",
      "/images/users/user5.jpg",
    ],
    budget: "$5,500",
    startDate: "5 Mar 2024",
    endDate: "5 Jan 2025",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },
];

const ITEMS_PER_PAGE = 5;

const MyProjects: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const displayedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">My Projects</h5>
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "ID",
                    "Project Name",
                    "Client",
                    "Assignees",
                    "Budget",
                    "Start Date",
                    "End Date",
                    "Status",
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
                {displayedProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        #{project.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <Link
                        href={project.projectLink}
                        className="inline-block font-medium transition-all text-gray-500 dark:text-gray-400 hover:text-primary-500"
                      >
                        {project.projectName}
                      </Link>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {project.client}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        {project.assignees.slice(0, 3).map((assignee, idx) => (
                          <div
                            key={idx}
                            className="w-[34px] h-[34px] rounded-full ltr:-mr-[13px] rtl:-ml-[13px] border border-white"
                          >
                            <Image
                              alt="assignee"
                              className="rounded-full"
                              src={assignee}
                              width={34}
                              height={34}
                            />
                          </div>
                        ))}
                        {project.assignees.length > 3 && (
                          <div className="w-[34px] h-[34px] text-xs rounded-full border border-white bg-primary-500 text-white font-medium flex items-center justify-center">
                            +{project.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.budget}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.startDate}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.endDate}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${project.statusClass}`}
                      >
                        {project.status}
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
                            onClick={() => handleDelete(project.id)}
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
              Showing {displayedProjects.length} of {projects.length} results
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

export default MyProjects;
