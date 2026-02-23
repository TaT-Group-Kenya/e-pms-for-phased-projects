"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Student {
  id: string;
  name: string;
  email: string;
  subject: string;
  className: string;
  contact: string;
  result: string;
  status: string;
  statusColor: string; // Tailwind color classes
  image: string;
}

const StudentsList: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Tables
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 7; // Number of items per page
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc" as "asc" | "desc",
  });

  useEffect(() => {
    // Simulated API call to fetch students
    const fetchStudents = () => {
      const data: Student[] = [
        {
          id: "#101",
          name: "Emily Johnson",
          email: "emily@gmail.com",
          subject: "Math",
          className: "5A",
          contact: "(555) 123-4567",
          result: "89% Overall (A)",
          status: "Passed",
          statusColor: "bg-success-100 text-success-700",
          image: "/images/users/user46.jpg",
        },
        {
          id: "#102",
          name: "Michael Thompson",
          email: "michael@gmail.com",
          subject: "English",
          className: "8B",
          contact: "(555) 234-5678",
          result: "32% Overall (F)",
          status: "Fail",
          statusColor: "bg-danger-100 text-danger-700",
          image: "/images/users/user47.jpg",
        },
        {
          id: "#103",
          name: "Sarah Williams",
          email: "sarah@gmail.com",
          subject: "Geography",
          className: "4C",
          contact: "(555) 345-6789",
          result: "92% Overall (A+)",
          status: "Dropped",
          statusColor: "bg-primary-100 text-primary-700",
          image: "/images/users/user48.jpg",
        },
        {
          id: "#104",
          name: "David Anderson",
          email: "david@gmail.com",
          subject: "Physics",
          className: "6A",
          contact: "(555) 456-7890",
          result: "85% Overall (B+)",
          status: "Passed",
          statusColor: "bg-success-100 text-success-700",
          image: "/images/users/user49.jpg",
        },
        {
          id: "#105",
          name: "Jessica Martinez",
          email: "jessica@gmail.com",
          subject: "History",
          className: "7B",
          contact: "(555) 567-8901",
          result: "25% Overall (F)",
          status: "Fail",
          statusColor: "bg-danger-100 text-danger-700",
          image: "/images/users/user50.jpg",
        },
        {
          id: "#106",
          name: "James Lee",
          email: "james@gmail.com",
          subject: "Biology",
          className: "5B",
          contact: "(555) 678-9012",
          result: "88% Overall (A)",
          status: "Passed",
          statusColor: "bg-success-100 text-success-700",
          image: "/images/users/user51.jpg",
        },
        {
          id: "#107",
          name: "Ethan Clark",
          email: "ethan@gmail.com",
          subject: "Music",
          className: "8A",
          contact: "(555) 789-0123",
          result: "93% Overall (A+)",
          status: "Dropped",
          statusColor: "bg-primary-100 text-primary-700",
          image: "/images/users/user52.jpg",
        },
        {
          id: "#108",
          name: "Michael Thompson",
          email: "michael@gmail.com",
          subject: "English",
          className: "8B",
          contact: "(555) 234-5678",
          result: "32% Overall (F)",
          status: "Fail",
          statusColor: "bg-danger-100 text-danger-700",
          image: "/images/users/user47.jpg",
        },
        {
          id: "#109",
          name: "Emily Johnson",
          email: "emily@gmail.com",
          subject: "Math",
          className: "5A",
          contact: "(555) 123-4567",
          result: "89% Overall (A)",
          status: "Passed",
          statusColor: "bg-success-100 text-success-700",
          image: "/images/users/user46.jpg",
        },
        {
          id: "#110",
          name: "David Anderson",
          email: "david@gmail.com",
          subject: "Physics",
          className: "6A",
          contact: "(555) 456-7890",
          result: "85% Overall (B+)",
          status: "Passed",
          statusColor: "bg-success-100 text-success-700",
          image: "/images/users/user49.jpg",
        },
        {
          id: "#111",
          name: "Sarah Williams",
          email: "sarah@gmail.com",
          subject: "Geography",
          className: "4C",
          contact: "(555) 345-6789",
          result: "92% Overall (A+)",
          status: "Dropped",
          statusColor: "bg-primary-100 text-primary-700",
          image: "/images/users/user48.jpg",
        },
        {
          id: "#112",
          name: "Ethan Clark",
          email: "ethan@gmail.com",
          subject: "Music",
          className: "8A",
          contact: "(555) 789-0123",
          result: "93% Overall (A+)",
          status: "Dropped",
          statusColor: "bg-primary-100 text-primary-700",
          image: "/images/users/user52.jpg",
        },
        {
          id: "#113",
          name: "Jessica Martinez",
          email: "jessica@gmail.com",
          subject: "History",
          className: "7B",
          contact: "(555) 567-8901",
          result: "25% Overall (F)",
          status: "Fail",
          statusColor: "bg-danger-100 text-danger-700",
          image: "/images/users/user50.jpg",
        },
        {
          id: "#114",
          name: "James Lee",
          email: "james@gmail.com",
          subject: "Biology",
          className: "5B",
          contact: "(555) 678-9012",
          result: "88% Overall (A)",
          status: "Passed",
          statusColor: "bg-success-100 text-success-700",
          image: "/images/users/user51.jpg",
        },
      ];
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const handleDelete = (id: string) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Sort students
  const handleSort = (key: keyof Student) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedStudents = [...students].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setStudents(sortedStudents);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex sm:items-center sm:justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Students List</h5>
          </div>
          <div className="trezo-card-subtitle flex items-center mt-[15px] sm:mt-0">
            <form className="relative w-[225px] sm:w-[265px] ltr:mr-[10px] rtl:ml-[10px] ltr:sm:mr-[15px] rtl:sm:ml-[15px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search for a name...."
                value={searchQuery}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>

            <div className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]">
              <Menu as="div" className="trezo-card-dropdown relative">
                <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                  <i className="ri-more-2-fill"></i>
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
        </div>

        <div
          className="trezo-card-content -mx-[20px] md:-mx-[25px]"
          id="dataTable"
        >
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("subject")}
                  >
                    Subject
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("className")}
                  >
                    Class
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("contact")}
                  >
                    Contact
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("result")}
                  >
                    Result
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {paginatedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={student.image}
                            className="inline-block rounded-full"
                            alt={student.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {student.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.subject}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.className}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.contact}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.result}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block font-medium dark:bg-[#15203c] rounded-sm text-xs ${student.statusColor}`}
                      >
                        {student.status}
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
                            onClick={() => handleDelete(student.id)}
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
              Showing {paginatedStudents.length} of {filteredStudents.length}{" "}
              results
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
                        ? "bg-primary-500 text-white"
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

export default StudentsList;
