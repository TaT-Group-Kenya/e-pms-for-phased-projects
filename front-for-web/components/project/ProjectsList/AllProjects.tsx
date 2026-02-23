"use client";

import React, { useState } from "react";
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
    id: 854,
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
    id: 855,
    projectName: "Quantum Leap",
    projectLink: "/project-management/project-overview/",
    client: "Quantum Technologies",
    assignees: ["/images/users/user3.jpg", "/images/users/user4.jpg"],
    budget: "$8,200",
    startDate: "1 Mar 2024",
    endDate: "1 May 2024",
    status: "Pending",
    statusClass: "bg-purple-50 text-purple-500",
  },
  {
    id: 856,
    projectName: "Cyber Security Hub",
    projectLink: "/project-management/project-overview/",
    client: "CyberSec Corp",
    assignees: ["/images/users/user5.jpg", "/images/users/user6.jpg"],
    budget: "$12,500",
    startDate: "15 Feb 2024",
    endDate: "15 May 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 857,
    projectName: "NextGen AI",
    projectLink: "/project-management/project-overview/",
    client: "Future AI Solutions",
    assignees: [
      "/images/users/user7.jpg",
      "/images/users/user8.jpg",
      "/images/users/user9.jpg",
    ],
    budget: "$6,900",
    startDate: "10 Feb 2024",
    endDate: "10 May 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 858,
    projectName: "EcoTech Revamp",
    projectLink: "/project-management/project-overview/",
    client: "EcoTech Innovations",
    assignees: ["/images/users/user10.jpg", "/images/users/user12.jpg"],
    budget: "$3,200",
    startDate: "5 Feb 2024",
    endDate: "5 Apr 2024",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },
  {
    id: 859,
    projectName: "Blockchain Solutions",
    projectLink: "/project-management/project-overview/",
    client: "Crypto Innovators",
    assignees: [
      "/images/users/user13.jpg",
      "/images/users/user14.jpg",
      "/images/users/user15.jpg",
    ],
    budget: "$15,000",
    startDate: "1 Feb 2024",
    endDate: "1 May 2024",
    status: "Pending",
    statusClass: "bg-purple-50 text-purple-500",
  },
  {
    id: 860,
    projectName: "E-commerce Redesign",
    projectLink: "/project-management/project-overview/",
    client: "ShopEase Ltd.",
    assignees: ["/images/users/user3.jpg", "/images/users/user5.jpg"],
    budget: "$9,800",
    startDate: "1 Jan 2024",
    endDate: "1 Apr 2024",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },
  {
    id: 861,
    projectName: "Healthcare AI System",
    projectLink: "/project-management/project-overview/",
    client: "MediTech Labs",
    assignees: ["/images/users/user2.jpg", "/images/users/user6.jpg"],
    budget: "$22,000",
    startDate: "15 Dec 2023",
    endDate: "15 Jun 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 862,
    projectName: "Smart Home Hub",
    projectLink: "/project-management/project-overview/",
    client: "HomeAutomation Inc.",
    assignees: ["/images/users/user9.jpg", "/images/users/user10.jpg"],
    budget: "$11,500",
    startDate: "10 Dec 2023",
    endDate: "10 Jun 2024",
    status: "Pending",
    statusClass: "bg-purple-50 text-purple-500",
  },
  {
    id: 863,
    projectName: "EdTech Revolution",
    projectLink: "/project-management/project-overview/",
    client: "EdTech Pro",
    assignees: ["/images/users/user11.jpg", "/images/users/user12.jpg"],
    budget: "$8,700",
    startDate: "5 Dec 2023",
    endDate: "5 May 2024",
    status: "In Progress",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 864,
    projectName: "Autonomous Vehicle AI",
    projectLink: "/project-management/project-overview/",
    client: "AutoDrive Systems",
    assignees: ["/images/users/user13.jpg", "/images/users/user14.jpg"],
    budget: "$45,000",
    startDate: "1 Dec 2023",
    endDate: "1 Dec 2024",
    status: "Pending",
    statusClass: "bg-purple-50 text-purple-500",
  },
  {
    id: 865,
    projectName: "Food Delivery App",
    projectLink: "/project-management/project-overview/",
    client: "FastBite Tech",
    assignees: ["/images/users/user15.jpg", "/images/users/user1.jpg"],
    budget: "$6,300",
    startDate: "20 Nov 2023",
    endDate: "20 Apr 2024",
    status: "Finished",
    statusClass: "bg-success-50 text-success-500",
  },
];

const ITEMS_PER_PAGE = 10;

const AllProjects: React.FC = () => {
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
            <h5 className="!mb-0">All Projects</h5>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/project-management/create-project"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Create New Project
              </span>
            </Link>
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

export default AllProjects;
