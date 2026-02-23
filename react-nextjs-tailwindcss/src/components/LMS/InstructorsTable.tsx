"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";

interface Instructor {
  id: string;
  name: string;
  role: string;
  courses: number;
  totalEarnings: string;
  email: string;
  ratings: number;
  status: "Active" | "Deactive";
  avatar: string;
}

const initialInstructors: Instructor[] = [
  {
    id: "#A-1217",
    name: "Olivia Clark",
    role: "Big Data",
    courses: 55,
    totalEarnings: "$6,855.00",
    email: "olivia@trezo.com",
    ratings: 5,
    status: "Active",
    avatar: "/images/users/user13.jpg",
  },
  {
    id: "#A-1364",
    name: "Ava Turner",
    role: "UX/UI",
    courses: 120,
    totalEarnings: "$258.00",
    email: "ava@trezo.com",
    ratings: 4.5,
    status: "Deactive",
    avatar: "/images/users/user16.jpg",
  },
  {
    id: "#A-2951",
    name: "Lucas Morgan",
    role: "Developer",
    courses: 86,
    totalEarnings: "$3,890.00",
    email: "lucas@trezo.com",
    ratings: 4,
    status: "Active",
    avatar: "/images/users/user17.jpg",
  },
  {
    id: "#A-7342",
    name: "Isabella Cooper",
    role: "Designer",
    courses: 75,
    totalEarnings: "$2,500.00",
    email: "isabella@trezo.com",
    ratings: 4.5,
    status: "Active",
    avatar: "/images/users/user18.jpg",
  },
  {
    id: "#A-8593",
    name: "Ethan Wright",
    role: "Machine Learning",
    courses: 95,
    totalEarnings: "$4,200.00",
    email: "ethan@trezo.com",
    ratings: 4.8,
    status: "Active",
    avatar: "/images/users/user19.jpg",
  },
  {
    id: "#A-9274",
    name: "Sophia Hall",
    role: "Cybersecurity",
    courses: 63,
    totalEarnings: "$3,150.00",
    email: "sophia@trezo.com",
    ratings: 4.7,
    status: "Active",
    avatar: "/images/users/user20.jpg",
  },
  {
    id: "#A-1023",
    name: "Benjamin Carter",
    role: "Cloud Computing",
    courses: 78,
    totalEarnings: "$5,300.00",
    email: "benjamin@trezo.com",
    ratings: 4.6,
    status: "Active",
    avatar: "/images/users/user21.jpg",
  },
  {
    id: "#A-3847",
    name: "Mia Adams",
    role: "Artificial Intelligence",
    courses: 88,
    totalEarnings: "$6,150.00",
    email: "mia@trezo.com",
    ratings: 4.9,
    status: "Active",
    avatar: "/images/users/user22.jpg",
  },
  {
    id: "#A-5621",
    name: "Daniel Evans",
    role: "Data Science",
    courses: 102,
    totalEarnings: "$7,200.00",
    email: "daniel@trezo.com",
    ratings: 5,
    status: "Active",
    avatar: "/images/users/user23.jpg",
  },
  {
    id: "#A-6789",
    name: "Charlotte Brooks",
    role: "Web Development",
    courses: 115,
    totalEarnings: "$8,500.00",
    email: "charlotte@trezo.com",
    ratings: 4.9,
    status: "Active",
    avatar: "/images/users/user24.jpg",
  },
  {
    id: "#A-7891",
    name: "Jack Thompson",
    role: "Blockchain",
    courses: 70,
    totalEarnings: "$4,750.00",
    email: "jack@trezo.com",
    ratings: 4.6,
    status: "Active",
    avatar: "/images/users/user25.jpg",
  },
  {
    id: "#A-8523",
    name: "Lily Parker",
    role: "Game Development",
    courses: 54,
    totalEarnings: "$3,600.00",
    email: "lily@trezo.com",
    ratings: 4.5,
    status: "Active",
    avatar: "/images/users/user26.jpg",
  },
  {
    id: "#A-9632",
    name: "Henry Mitchell",
    role: "DevOps",
    courses: 47,
    totalEarnings: "$3,400.00",
    email: "henry@trezo.com",
    ratings: 4.3,
    status: "Active",
    avatar: "/images/users/user27.jpg",
  },
  {
    id: "#A-1048",
    name: "Emily Rivera",
    role: "Software Testing",
    courses: 39,
    totalEarnings: "$2,900.00",
    email: "emily@trezo.com",
    ratings: 4.2,
    status: "Deactive",
    avatar: "/images/users/user28.jpg",
  },
  {
    id: "#A-1195",
    name: "Owen Bennett",
    role: "Network Security",
    courses: 50,
    totalEarnings: "$3,700.00",
    email: "owen@trezo.com",
    ratings: 4.4,
    status: "Active",
    avatar: "/images/users/user29.jpg",
  },
  {
    id: "#A-1324",
    name: "Natalie Hughes",
    role: "UI/UX",
    courses: 66,
    totalEarnings: "$4,500.00",
    email: "natalie@trezo.com",
    ratings: 4.7,
    status: "Active",
    avatar: "/images/users/user30.jpg",
  },
  {
    id: "#A-1456",
    name: "Isaac Phillips",
    role: "Full Stack Developer",
    courses: 90,
    totalEarnings: "$6,000.00",
    email: "isaac@trezo.com",
    ratings: 4.8,
    status: "Active",
    avatar: "/images/users/user31.jpg",
  },
  {
    id: "#A-1592",
    name: "Grace Foster",
    role: "Database Administration",
    courses: 48,
    totalEarnings: "$3,200.00",
    email: "grace@trezo.com",
    ratings: 4.3,
    status: "Deactive",
    avatar: "/images/users/user32.jpg",
  },
  {
    id: "#A-1721",
    name: "Elijah Murphy",
    role: "Mobile App Development",
    courses: 81,
    totalEarnings: "$5,750.00",
    email: "elijah@trezo.com",
    ratings: 4.9,
    status: "Active",
    avatar: "/images/users/user33.jpg",
  },
  {
    id: "#A-1835",
    name: "Scarlett Henderson",
    role: "Software Engineering",
    courses: 110,
    totalEarnings: "$7,900.00",
    email: "scarlett@trezo.com",
    ratings: 5,
    status: "Active",
    avatar: "/images/users/user34.jpg",
  },
];

const InstructorsTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10; // Adjust as needed

  // Filter instructors based on search term
  const filteredInstructors = initialInstructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalInstructors = filteredInstructors.length;
  const totalPages = Math.ceil(totalInstructors / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const instructorsToDisplay = filteredInstructors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center leading-none gap-[2px] text-[#fe7a36] text-[15px]">
        {Array.from({ length: fullStars }, (_, i) => (
          <i key={`full-${i}`} className="ri-star-fill"></i>
        ))}
        {halfStar && <i key="half-star" className="ri-star-half-fill"></i>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <i key={`empty-${i}`} className="ri-star-line"></i>
        ))}
      </div>
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
                placeholder="Search instructor here..."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Instructor
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Courses
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Total Earnings
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Ratings
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {instructorsToDisplay.map((instructor) => (
                  <tr key={instructor.id}>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {instructor.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[44px] h-[44px] ltr:mr-[12px] rtl:ml-[12px]">
                          <Image
                            src={instructor.avatar}
                            className="rounded-full inline-block"
                            alt="user-image"
                            width={44}
                            height={44}
                          />
                        </div>
                        <div>
                          <span className="block font-medium">
                            {instructor.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 block mt-px">
                            {instructor.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {instructor.courses}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {instructor.totalEarnings}
                    </td>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {instructor.email}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {renderRatingStars(instructor.ratings)}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block ${
                          instructor.status === "Active"
                            ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                            : "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                        } rounded-sm font-medium text-xs`}
                      >
                        {instructor.status}
                      </span>
                    </td>

                    <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <button
                        type="button"
                        className="text-danger-500 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          delete
                        </i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, totalInstructors)}{" "}
              of {totalInstructors} results
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

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[550px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0">Add New Instructor</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content">
                  <form>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. Olivia"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Designation
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. UX/UI"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Total Earnings
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. $6,855.00"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Email
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. olivia@trezo.com"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Ratings
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">5 Star</option>
                          <option value="2">4.5 Star</option>
                          <option value="3">4 Star</option>
                          <option value="4">3.5 Star</option>
                          <option value="5">3 Star</option>
                          <option value="6">2.5 Star</option>
                          <option value="7">2 Star</option>
                          <option value="8">1.5 Star</option>
                          <option value="9">1 Star</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Active</option>
                          <option value="2">Deactive</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Instructor Image
                        </label>
                        <div id="fileUploader">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[48px] px-[20px] border border-gray-200 dark:border-[#172036]">
                            <div className="flex items-center justify-center">
                              <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                                <i className="ri-upload-2-line"></i>
                              </div>
                              <p className="leading-[1.5]">
                                <strong className="text-black dark:text-white">
                                  Click to upload
                                </strong>
                                <br /> you file here
                              </p>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                            />
                          </div>
                          <ul id="fileList"></ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-[20px] md:mt-[25px] ltr:text-right rtl:text-left">
                      <button
                        type="button"
                        className="rounded-md inline-block transition-all font-medium ltr:mr-[15px] rtl:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400"
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            add
                          </i>
                          Create
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default InstructorsTable;
