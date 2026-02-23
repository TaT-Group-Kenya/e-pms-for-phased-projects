"use client";

import React, { useState } from "react";
import Image from "next/image";

const teamsData = [
  {
    id: 1,
    name: "Ava Turner",
    role: "Team Leader",
    image: "/images/users/user11.jpg",
    project: {
      name: "Project Management",
      color: "bg-purple-100 dark:bg-[#15203c]",
    },
    progress: 85,
    teamMembers: [
      "/images/users/user15.jpg",
      "/images/users/user16.jpg",
      "/images/users/user17.jpg",
    ],
  },
  {
    id: 2,
    name: "Ethan Parker",
    role: "Team Leader",
    image: "/images/users/user12.jpg",
    project: {
      name: "eCommerce Theme",
      color: "bg-secondary-100 dark:bg-[#15203c]",
    },
    progress: 45,
    teamMembers: [
      "/images/users/user6.jpg",
      "/images/users/user7.jpg",
      "/images/users/user8.jpg",
    ],
  },
  {
    id: 3,
    name: "Isabella Lee",
    role: "Team Leader",
    image: "/images/users/user13.jpg",
    project: {
      name: "Shopify Theme Dev",
      color: "bg-success-100 dark:bg-[#15203c]",
    },
    progress: 70,
    teamMembers: ["/images/users/user10.jpg", "/images/users/user11.jpg"],
  },
  {
    id: 4,
    name: "Thompson Torres",
    role: "Team Leader",
    image: "/images/users/user14.jpg",
    project: {
      name: "Oito - HTML",
      color: "bg-orange-100 dark:bg-[#15203c]",
    },
    progress: 90,
    teamMembers: [
      "/images/users/user30.jpg",
      "/images/users/user29.jpg",
      "/images/users/user28.jpg",
    ],
  },
  {
    id: 5,
    name: "Sophia Martinez",
    role: "Team Leader",
    image: "/images/users/user18.jpg",
    project: {
      name: "Social Media Campaign",
      color: "bg-primary-100 dark:bg-[#15203c]",
    },
    progress: 60,
    teamMembers: [
      "/images/users/user19.jpg",
      "/images/users/user20.jpg",
      "/images/users/user21.jpg",
    ],
  },
  {
    id: 6,
    name: "Liam Johnson",
    role: "Team Leader",
    image: "/images/users/user22.jpg",
    project: {
      name: "Mobile App Development",
      color: "bg-danger-100 dark:bg-[#15203c]",
    },
    progress: 75,
    teamMembers: [
      "/images/users/user23.jpg",
      "/images/users/user24.jpg",
      "/images/users/user25.jpg",
    ],
  },
  {
    id: 7,
    name: "Olivia Brown",
    role: "Team Leader",
    image: "/images/users/user26.jpg",
    project: {
      name: "UI/UX Design",
      color: "bg-gray-100 dark:bg-[#15203c]",
    },
    progress: 80,
    teamMembers: [
      "/images/users/user27.jpg",
      "/images/users/user28.jpg",
      "/images/users/user29.jpg",
    ],
  },
  {
    id: 8,
    name: "Noah Garcia",
    role: "Team Leader",
    image: "/images/users/user30.jpg",
    project: {
      name: "Data Analytics",
      color: "bg-warning-100 dark:bg-[#15203c]",
    },
    progress: 65,
    teamMembers: [
      "/images/users/user31.jpg",
      "/images/users/user32.jpg",
      "/images/users/user33.jpg",
    ],
  },
  {
    id: 9,
    name: "Emma Wilson",
    role: "Team Leader",
    image: "/images/users/user34.jpg",
    project: {
      name: "Content Marketing",
      color: "bg-info-100 dark:bg-[#15203c]",
    },
    progress: 55,
    teamMembers: [
      "/images/users/user35.jpg",
      "/images/users/user36.jpg",
      "/images/users/user37.jpg",
    ],
  },
  {
    id: 10,
    name: "James Anderson",
    role: "Team Leader",
    image: "/images/users/user38.jpg",
    project: {
      name: "SEO Optimization",
      color: "bg-primary-100 dark:bg-[#15203c]",
    },
    progress: 50,
    teamMembers: [
      "/images/users/user39.jpg",
      "/images/users/user40.jpg",
      "/images/users/user41.jpg",
    ],
  },
  {
    id: 11,
    name: "Charlotte Thomas",
    role: "Team Leader",
    image: "/images/users/user42.jpg",
    project: {
      name: "E-commerce Strategy",
      color: "bg-secondary-100 dark:bg-[#15203c]",
    },
    progress: 70,
    teamMembers: [
      "/images/users/user43.jpg",
      "/images/users/user44.jpg",
      "/images/users/user45.jpg",
    ],
  },
  {
    id: 12,
    name: "Benjamin Hernandez",
    role: "Team Leader",
    image: "/images/users/user46.jpg",
    project: {
      name: "Branding",
      color: "bg-purple-100 dark:bg-[#15203c]",
    },
    progress: 85,
    teamMembers: [
      "/images/users/user47.jpg",
      "/images/users/user48.jpg",
      "/images/users/user49.jpg",
    ],
  },
  {
    id: 13,
    name: "Amelia Moore",
    role: "Team Leader",
    image: "/images/users/user50.jpg",
    project: {
      name: "Video Production",
      color: "bg-success-100 dark:bg-[#15203c]",
    },
    progress: 40,
    teamMembers: [
      "/images/users/user51.jpg",
      "/images/users/user52.jpg",
      "/images/users/user53.jpg",
    ],
  },
  {
    id: 14,
    name: "Lucas Taylor",
    role: "Team Leader",
    image: "/images/users/user54.jpg",
    project: {
      name: "Web Development",
      color: "bg-orange-100 dark:bg-[#15203c]",
    },
    progress: 95,
    teamMembers: [
      "/images/users/user55.jpg",
      "/images/users/user56.jpg",
      "/images/users/user57.jpg",
    ],
  },
  {
    id: 15,
    name: "Mia Jackson",
    role: "Team Leader",
    image: "/images/users/user58.jpg",
    project: {
      name: "Product Launch",
      color: "bg-danger-100 dark:bg-[#15203c]",
    },
    progress: 30,
    teamMembers: [
      "/images/users/user59.jpg",
      "/images/users/user60.jpg",
      "/images/users/user61.jpg",
    ],
  },
  {
    id: 16,
    name: "Alexander White",
    role: "Team Leader",
    image: "/images/users/user62.jpg",
    project: {
      name: "Customer Support",
      color: "bg-gray-100 dark:bg-[#15203c]",
    },
    progress: 90,
    teamMembers: [
      "/images/users/user63.jpg",
      "/images/users/user64.jpg",
      "/images/users/user65.jpg",
    ],
  },
];

const TeamsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items per page

  // Calculate the start and end index of the items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeams = teamsData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(teamsData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        {currentTeams.map((team) => (
          <div
            key={team.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={team.image}
                    alt="user-image"
                    className="w-[65px] h-[65px] rounded-full border-[2px] border-gray-100 dark:border-[#172036]"
                    width={65}
                    height={65}
                  />
                  <div className="ltr:ml-[12px] rtl:mr-[12px]">
                    <span className="text-md inline-block mb-px font-medium text-black dark:text-white">
                      {team.name}
                    </span>
                    <span className="block">{team.role}</span>
                  </div>
                </div>

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
                    <i className="material-symbols-outlined !text-md">edit</i>
                  </button>

                  <button
                    type="button"
                    className="text-danger-500 leading-none custom-tooltip"
                  >
                    <i className="material-symbols-outlined !text-md">delete</i>
                  </button>
                </div>
              </div>

              <div className="text-center mt-[15px]">
                <span
                  className={`inline-block font-medium ${team.project.color} text-black dark:text-white rounded-full px-[15px] py-[4.5px] mb-[15px]`}
                >
                  {team.project.name}
                </span>

                <span className="block mb-[8px]">Team Members</span>

                <div className="flex items-center justify-center">
                  {team.teamMembers.map((member, index) =>
                    typeof member === "string" && member.startsWith("+") ? (
                      <div
                        key={index}
                        className="rounded-full w-[40px] h-[40px] font-medium text-xs border-[2px] border-gray-100 dark:border-[#172036] bg-primary-500 text-white flex items-center justify-center -mx-[6px]"
                      >
                        {member}
                      </div>
                    ) : (
                      <Image
                        key={index}
                        src={member}
                        alt="user-image"
                        className="rounded-full w-[40px] h-[40px] border-[2px] border-gray-100 dark:border-[#172036] -mx-[6px]"
                        width={40}
                        height={40}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="mt-[18px] mb-[20px] md:mb-[25px] lg:mb-[30px]">
                <div className="flex items-center justify-between">
                  <span className="block font-medium mb-[8px]">Progress</span>
                  <span className="block font-medium mb-[8px]">
                    {team.progress}%
                  </span>
                </div>

                <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                    style={{ width: `${team.progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                type="button"
                className="block w-full rounded-md text-center font-medium border border-primary-500 py-[8.5px] px-[15px] text-primary-500 transition-all hover:bg-primary-500 hover:text-white"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, teamsData.length)} of{" "}
              {teamsData.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, pageIndex) => (
                <li
                  key={pageIndex}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => setCurrentPage(pageIndex + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === pageIndex + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : ""
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handleNextPage}
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

export default TeamsList;
