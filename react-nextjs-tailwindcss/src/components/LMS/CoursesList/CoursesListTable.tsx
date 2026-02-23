"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Course {
  id: string;
  name: string;
  viewLink: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
  };
  enrolled: number;
  startDate: string;
  endDate: string;
  price: string;
}

const initialCourses: Course[] = [
  {
    id: "#800",
    name: "Cybersecurity Awareness",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Oliver Khan",
      avatar: "/images/users/user6.jpg",
    },
    enrolled: 180,
    startDate: "25 Mar 2024",
    endDate: "25 Apr 2024",
    price: "$49.99",
  },
  {
    id: "#801",
    name: "Python Programming",
    viewLink: "/lms/course-details/",
    category: "Science",
    instructor: {
      name: "Ava Cooper",
      avatar: "/images/users/user7.jpg",
    },
    enrolled: 250,
    startDate: "20 Mar 2024",
    endDate: "20 Apr 2024",
    price: "$45.32",
  },
  {
    id: "#802",
    name: "Big Data Analytics",
    viewLink: "/lms/course-details/",
    category: "Health & Wellness",
    instructor: {
      name: "Isabella Evans",
      avatar: "/images/users/user8.jpg",
    },
    enrolled: 320,
    startDate: "15 Mar 2024",
    endDate: "15 Apr 2024",
    price: "$99.00",
  },
  {
    id: "#803",
    name: "Introduction to Blockchain",
    viewLink: "/lms/course-details/",
    category: "Education",
    instructor: {
      name: "Mia Hughes",
      avatar: "/images/users/user9.jpg",
    },
    enrolled: 135,
    startDate: "10 Mar 2024",
    endDate: "10 Apr 2024",
    price: "$29.75",
  },
  {
    id: "#804",
    name: "Machine Learning Basics",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Noah Smith",
      avatar: "/images/users/user10.jpg",
    },
    enrolled: 290,
    startDate: "5 Mar 2024",
    endDate: "5 Apr 2024",
    price: "$69.00",
  },
  {
    id: "#805",
    name: "Financial Planning Essentials",
    viewLink: "/lms/course-details/",
    category: "Finance",
    instructor: {
      name: "Emma Taylor",
      avatar: "/images/users/user11.jpg",
    },
    enrolled: 175,
    startDate: "1 Mar 2024",
    endDate: "1 Apr 2024",
    price: "$55.50",
  },
  {
    id: "#806",
    name: "Digital Marketing Strategies",
    viewLink: "/lms/course-details/",
    category: "Marketing",
    instructor: {
      name: "Liam Johnson",
      avatar: "/images/users/user12.jpg",
    },
    enrolled: 400,
    startDate: "25 Feb 2024",
    endDate: "25 Mar 2024",
    price: "$39.99",
  },
  {
    id: "#807",
    name: "Graphic Design for Beginners",
    viewLink: "/lms/course-details/",
    category: "Art & Design",
    instructor: {
      name: "Sophia Brown",
      avatar: "/images/users/user13.jpg",
    },
    enrolled: 220,
    startDate: "20 Feb 2024",
    endDate: "20 Mar 2024",
    price: "$65.00",
  },
  {
    id: "#808",
    name: "Public Speaking Mastery",
    viewLink: "/lms/course-details/",
    category: "Personal Development",
    instructor: {
      name: "James Lee",
      avatar: "/images/users/user14.jpg",
    },
    enrolled: 315,
    startDate: "15 Feb 2024",
    endDate: "15 Mar 2024",
    price: "$30.25",
  },
  {
    id: "#809",
    name: "Game Development with Unity",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Charlotte White",
      avatar: "/images/users/user15.jpg",
    },
    enrolled: 500,
    startDate: "10 Feb 2024",
    endDate: "10 Mar 2024",
    price: "$99.99",
  },
  {
    id: "#810",
    name: "Fitness & Nutrition Basics",
    viewLink: "/lms/course-details/",
    category: "Health & Wellness",
    instructor: {
      name: "Daniel Carter",
      avatar: "/images/users/user16.jpg",
    },
    enrolled: 180,
    startDate: "5 Feb 2024",
    endDate: "5 Mar 2024",
    price: "$25.00",
  },
  {
    id: "#811",
    name: "Business Communication Skills",
    viewLink: "/lms/course-details/",
    category: "Business",
    instructor: {
      name: "Emily Harris",
      avatar: "/images/users/user17.jpg",
    },
    enrolled: 275,
    startDate: "1 Feb 2024",
    endDate: "1 Mar 2024",
    price: "$60.00",
  },
  {
    id: "#812",
    name: "Cloud Computing Fundamentals",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Benjamin Allen",
      avatar: "/images/users/user18.jpg",
    },
    enrolled: 340,
    startDate: "25 Jan 2024",
    endDate: "25 Feb 2024",
    price: "$79.95",
  },
  {
    id: "#813",
    name: "Photography Masterclass",
    viewLink: "/lms/course-details/",
    category: "Art & Design",
    instructor: {
      name: "Amelia Scott",
      avatar: "/images/users/user19.jpg",
    },
    enrolled: 215,
    startDate: "20 Jan 2024",
    endDate: "20 Feb 2024",
    price: "$50.99",
  },
  {
    id: "#814",
    name: "Ethical Hacking for Beginners",
    viewLink: "/lms/course-details/",
    category: "Cybersecurity",
    instructor: {
      name: "Henry Martinez",
      avatar: "/images/users/user20.jpg",
    },
    enrolled: 390,
    startDate: "15 Jan 2024",
    endDate: "15 Feb 2024",
    price: "$89.99",
  },
  {
    id: "#815",
    name: "Web Development Bootcamp",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Olivia Wilson",
      avatar: "/images/users/user21.jpg",
    },
    enrolled: 600,
    startDate: "10 Jan 2024",
    endDate: "10 Feb 2024",
    price: "$110.00",
  },
  {
    id: "#816",
    name: "Project Management Basics",
    viewLink: "/lms/course-details/",
    category: "Business",
    instructor: {
      name: "William Brown",
      avatar: "/images/users/user22.jpg",
    },
    enrolled: 290,
    startDate: "5 Jan 2024",
    endDate: "5 Feb 2024",
    price: "$40.00",
  },
  {
    id: "#817",
    name: "React & Next.js Masterclass",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Lucas Johnson",
      avatar: "/images/users/user23.jpg",
    },
    enrolled: 480,
    startDate: "1 Jan 2024",
    endDate: "1 Feb 2024",
    price: "$120.00",
  },
  {
    id: "#818",
    name: "Excel for Data Analysis",
    viewLink: "/lms/course-details/",
    category: "Finance",
    instructor: {
      name: "Charlotte Turner",
      avatar: "/images/users/user24.jpg",
    },
    enrolled: 230,
    startDate: "28 Dec 2023",
    endDate: "28 Jan 2024",
    price: "$35.00",
  },
  {
    id: "#819",
    name: "Web Development Bootcamp",
    viewLink: "/lms/course-details/",
    category: "Technology",
    instructor: {
      name: "Olivia Wilson",
      avatar: "/images/users/user21.jpg",
    },
    enrolled: 600,
    startDate: "10 Jan 2024",
    endDate: "10 Feb 2024",
    price: "$110.00",
  },
];

const CoursesListTable: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("All Courses");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [courses, setCourses] = useState<Course[]>(initialCourses); // Store courses in state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10; // Adjust as needed

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const coursesToDisplay = filteredCourses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const deleteCourse = (id: string) => {
    // Filter out the course with the specified id
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses); // Update state with the new list of courses
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
                placeholder="Search course here..."
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Paid", "Free", "Top Rated", "Best Seller"].map((option) => (
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
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Course Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Category
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Instructor
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Enrolled
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    End Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Price
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {coursesToDisplay.map((course) => (
                  <tr key={course.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {course.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <Link
                        href={course.viewLink}
                        className="inline-block font-medium transition-all text-gray-500 dark:text-gray-400 hover:text-primary-500"
                      >
                        {course.name}
                      </Link>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {course.category}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={course.instructor.avatar}
                            className="inline-block rounded-full"
                            alt="user-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {course.instructor.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {course.enrolled}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {course.startDate}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {course.endDate}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {course.price}
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
                            onClick={() => deleteCourse(course.id)}
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
              Showing {startIndex + 1} to {Math.min(endIndex, totalCourses)} of{" "}
              {totalCourses} results
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

export default CoursesListTable;
