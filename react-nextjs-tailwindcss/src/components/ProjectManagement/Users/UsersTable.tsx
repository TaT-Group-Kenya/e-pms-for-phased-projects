"use client";

import React, { useState } from "react";
import Image from "next/image"; 

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  projectAccess: string;
  status: string;
  avatar: string;
}

const initialUsers: User[] = [
  {
    id: "#999",
    name: "Carolyn Barnes",
    email: "carolyn@trezo.com",
    role: "Developer",
    projectAccess: "Project Monitoring, Project Alpho",
    status: "Active",
    avatar: "/images/users/user7.jpg",
  },
  {
    id: "#1000",
    name: "Donna Miller",
    email: "donna@trezo.com",
    role: "Business Analyst",
    projectAccess: "Aegis Accounting Service, Beja Banking Finance",
    status: "Deactive",
    avatar: "/images/users/user8.jpg",
  },
  {
    id: "#1001",
    name: "Ethan Parker",
    email: "ethan@trezo.com",
    role: "Team Leader",
    projectAccess: "Finance System, AI Analytics",
    status: "Active",
    avatar: "/images/users/user9.jpg",
  },
  {
    id: "#1002",
    name: "Mia Roberts",
    email: "mia@trezo.com",
    role: "Marketing Manager",
    projectAccess: "Social Media Strategy, Branding",
    status: "Active",
    avatar: "/images/users/user10.jpg",
  },
  {
    id: "#1003",
    name: "Daniel Carter",
    email: "daniel@trezo.com",
    role: "HR Manager",
    projectAccess: "Hiring & Employee Relations",
    status: "Active",
    avatar: "/images/users/user11.jpg",
  },
  {
    id: "#1004",
    name: "Sophia Johnson",
    email: "sophia@trezo.com",
    role: "Graphic Designer",
    projectAccess: "UI/UX Design, Branding",
    status: "Active",
    avatar: "/images/users/user12.jpg",
  },
  {
    id: "#1005",
    name: "Liam Brown",
    email: "liam@trezo.com",
    role: "Software Engineer",
    projectAccess: "Web Development, API Integration",
    status: "Active",
    avatar: "/images/users/user13.jpg",
  },
  {
    id: "#1006",
    name: "Emma Wilson",
    email: "emma@trezo.com",
    role: "QA Tester",
    projectAccess: "Product Development, Trezo Dashboard",
    status: "Deactive",
    avatar: "/images/users/user14.jpg",
  },
  {
    id: "#1007",
    name: "Noah Clark",
    email: "noah@trezo.com",
    role: "Frontend Developer",
    projectAccess: "React & Next.js UI",
    status: "Active",
    avatar: "/images/users/user15.jpg",
  },
  {
    id: "#1008",
    name: "Olivia Martinez",
    email: "olivia@trezo.com",
    role: "Backend Developer",
    projectAccess: "Node.js, Database Management",
    status: "Active",
    avatar: "/images/users/user16.jpg",
  },
  {
    id: "#1009",
    name: "William Hall",
    email: "william@trezo.com",
    role: "Product Owner",
    projectAccess: "Agile & Scrum Management",
    status: "Deactive",
    avatar: "/images/users/user17.jpg",
  },
  {
    id: "#1010",
    name: "Ava King",
    email: "ava@trezo.com",
    role: "Cybersecurity Analyst",
    projectAccess: "System Security, Threat Detection",
    status: "Active",
    avatar: "/images/users/user18.jpg",
  },
  {
    id: "#1011",
    name: "James Walker",
    email: "james@trezo.com",
    role: "Data Scientist",
    projectAccess: "AI & Machine Learning Models",
    status: "Active",
    avatar: "/images/users/user19.jpg",
  },
  {
    id: "#1012",
    name: "Emily Young",
    email: "emily@trezo.com",
    role: "Technical Writer",
    projectAccess: "Documentation, API Guides",
    status: "Active",
    avatar: "/images/users/user20.jpg",
  },
  {
    id: "#1013",
    name: "Lucas Wright",
    email: "lucas@trezo.com",
    role: "Cloud Engineer",
    projectAccess: "AWS & DevOps",
    status: "Active",
    avatar: "/images/users/user21.jpg",
  },
  {
    id: "#1014",
    name: "Charlotte Turner",
    email: "charlotte@trezo.com",
    role: "IT Support",
    projectAccess: "Hardware & Network Management",
    status: "Deactive",
    avatar: "/images/users/user22.jpg",
  },
  {
    id: "#1015",
    name: "Benjamin Harris",
    email: "benjamin@trezo.com",
    role: "Full Stack Developer",
    projectAccess: "MERN Stack, Python Backend",
    status: "Active",
    avatar: "/images/users/user23.jpg",
  },
  {
    id: "#1016",
    name: "Amelia Lewis",
    email: "amelia@trezo.com",
    role: "Project Manager",
    projectAccess: "Trello, Jira & Agile Workflow",
    status: "Active",
    avatar: "/images/users/user24.jpg",
  },
  {
    id: "#1017",
    name: "Henry Robinson",
    email: "henry@trezo.com",
    role: "DevOps Engineer",
    projectAccess: "CI/CD Pipelines, Kubernetes",
    status: "Active",
    avatar: "/images/users/user25.jpg",
  },
  {
    id: "#1018",
    name: "Zoe Campbell",
    email: "zoe@trezo.com",
    role: "Legal Advisor",
    projectAccess: "Compliance & Contracts",
    status: "Active",
    avatar: "/images/users/user26.jpg",
  },
];

const UsersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>(initialUsers); // State to hold users
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set()); // Track selected users
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const itemsPerPage = 10;

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = filteredUsers.length;

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectUser = (id: string) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(id)) {
      newSelectedUsers.delete(id); // Deselect the user
    } else {
      newSelectedUsers.add(id); // Select the user
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.size === usersToDisplay.length) {
      setSelectedUsers(new Set()); // Deselect all users
    } else {
      const newSelectedUsers = new Set(usersToDisplay.map((user) => user.id));
      setSelectedUsers(newSelectedUsers); // Select all users
    }
  };

  // Delete handler
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id)); // Remove the user by ID
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
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
                placeholder="Search user here....."
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              id="add-new-popup-toggle"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New User
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    <div className="form-check relative top-[2px]">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={selectedUsers.size === usersToDisplay.length}
                        onChange={handleSelectAllUsers}
                      />
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    User
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Role
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Project Access
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {usersToDisplay.map((user) => (
                  <tr key={user.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="form-check relative top-[2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </div>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {user.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={user.avatar}
                            className="inline-block rounded-full"
                            alt="product-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">{user.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {user.email}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {user.role}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {user.projectAccess}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          user.status === "Active"
                            ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                            : "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                        } rounded-sm font-medium text-xs`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
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
                            onClick={() => handleDeleteUser(user.id)}
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

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, totalUsers)} of{" "}
              {totalUsers} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default UsersTable;
