"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const users = [
  {
    id: "JAN-158",
    name: "Marcia Baker",
    email: "marcia@trezo.com",
    location: "Washington D.C",
    phone: "+1 555-445-4455",
    projects: 6,
    joinDate: "01 Dec 2024",
    image: "/images/users/user6.jpg",
  },
  {
    id: "JAN-325",
    name: "Carolyn Barnes",
    email: "barnes@trezo.com",
    location: "Chicago",
    phone: "+1 555-455-9966",
    projects: 10,
    joinDate: "02 Dec 2024",
    image: "/images/users/user7.jpg",
  },
  {
    id: "JAN-214",
    name: "James Smith",
    email: "james@trezo.com",
    location: "New York",
    phone: "+1 555-789-1234",
    projects: 5,
    joinDate: "03 Dec 2024",
    image: "/images/users/user8.jpg",
  },
  {
    id: "JAN-402",
    name: "Patricia Johnson",
    email: "patricia@trezo.com",
    location: "San Francisco",
    phone: "+1 555-321-9876",
    projects: 7,
    joinDate: "04 Dec 2024",
    image: "/images/users/user9.jpg",
  },
  {
    id: "JAN-518",
    name: "Robert Brown",
    email: "robert@trezo.com",
    location: "Los Angeles",
    phone: "+1 555-654-3210",
    projects: 12,
    joinDate: "05 Dec 2024",
    image: "/images/users/user10.jpg",
  },
  {
    id: "JAN-628",
    name: "Emily Davis",
    email: "emily@trezo.com",
    location: "Seattle",
    phone: "+1 555-159-7532",
    projects: 9,
    joinDate: "06 Dec 2024",
    image: "/images/users/user11.jpg",
  },
  {
    id: "JAN-731",
    name: "Michael Wilson",
    email: "michael@trezo.com",
    location: "Houston",
    phone: "+1 555-852-7413",
    projects: 8,
    joinDate: "07 Dec 2024",
    image: "/images/users/user12.jpg",
  },
  {
    id: "JAN-845",
    name: "Linda Moore",
    email: "linda@trezo.com",
    location: "Boston",
    phone: "+1 555-369-2581",
    projects: 11,
    joinDate: "08 Dec 2024",
    image: "/images/users/user13.jpg",
  },
  {
    id: "JAN-956",
    name: "David Martinez",
    email: "david@trezo.com",
    location: "Miami",
    phone: "+1 555-951-7534",
    projects: 6,
    joinDate: "09 Dec 2024",
    image: "/images/users/user14.jpg",
  },
  {
    id: "JAN-102",
    name: "Sarah Anderson",
    email: "sarah@trezo.com",
    location: "Austin",
    phone: "+1 555-357-9514",
    projects: 13,
    joinDate: "10 Dec 2024",
    image: "/images/users/user15.jpg",
  },
  {
    id: "JAN-113",
    name: "Richard Thomas",
    email: "richard@trezo.com",
    location: "Denver",
    phone: "+1 555-684-1593",
    projects: 4,
    joinDate: "11 Dec 2024",
    image: "/images/users/user16.jpg",
  },
  {
    id: "JAN-224",
    name: "Karen White",
    email: "karen@trezo.com",
    location: "Dallas",
    phone: "+1 555-742-9516",
    projects: 14,
    joinDate: "12 Dec 2024",
    image: "/images/users/user17.jpg",
  },
  {
    id: "JAN-335",
    name: "Christopher Harris",
    email: "chris@trezo.com",
    location: "Phoenix",
    phone: "+1 555-963-8521",
    projects: 7,
    joinDate: "13 Dec 2024",
    image: "/images/users/user18.jpg",
  },
  {
    id: "JAN-446",
    name: "Nancy Clark",
    email: "nancy@trezo.com",
    location: "San Diego",
    phone: "+1 555-357-2486",
    projects: 9,
    joinDate: "14 Dec 2024",
    image: "/images/users/user19.jpg",
  },
  {
    id: "JAN-557",
    name: "Matthew Lewis",
    email: "matthew@trezo.com",
    location: "Portland",
    phone: "+1 555-753-6842",
    projects: 10,
    joinDate: "15 Dec 2024",
    image: "/images/users/user20.jpg",
  },
  {
    id: "JAN-668",
    name: "Barbara Walker",
    email: "barbara@trezo.com",
    location: "Philadelphia",
    phone: "+1 555-852-3574",
    projects: 8,
    joinDate: "16 Dec 2024",
    image: "/images/users/user21.jpg",
  },
  {
    id: "JAN-779",
    name: "Steven Hall",
    email: "steven@trezo.com",
    location: "Las Vegas",
    phone: "+1 555-741-3698",
    projects: 11,
    joinDate: "17 Dec 2024",
    image: "/images/users/user22.jpg",
  },
  {
    id: "JAN-880",
    name: "Jessica Young",
    email: "jessica@trezo.com",
    location: "Orlando",
    phone: "+1 555-951-2587",
    projects: 5,
    joinDate: "18 Dec 2024",
    image: "/images/users/user23.jpg",
  },
  {
    id: "JAN-991",
    name: "Daniel King",
    email: "daniel@trezo.com",
    location: "Minneapolis",
    phone: "+1 555-357-6548",
    projects: 12,
    joinDate: "19 Dec 2024",
    image: "/images/users/user24.jpg",
  },
];

const UsersListTable: React.FC = () => {
  const itemsPerPage = 10; // Number of users per page
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total pages based on filtered users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Slice the filtered users array based on current page and items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search user here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/users/add-user"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New User
              </span>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    User ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    User
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Location
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Phone
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Projects
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Join Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      #{user.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={user.image}
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

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {user.email}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {user.location}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {user.phone}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {user.projects}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {user.joinDate}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <button
                          type="button"
                          className="text-primary-500 leading-none"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>

                        <button
                          type="button"
                          className="text-gray-500 dark:text-gray-400 leading-none"
                        >
                          <i className="material-symbols-outlined !text-md">
                            edit
                          </i>
                        </button>
                        
                        <button
                          type="button"
                          className="text-danger-500 leading-none"
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

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, users.length)} of{" "}
              {users.length} results
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

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
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

export default UsersListTable;
