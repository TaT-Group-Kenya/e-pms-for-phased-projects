"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joiningDate: string;
  salary: string;
  status: "Active" | "On Leave" | "Resigned";
  image: string;
}

const EmployeeList: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });

  // Fetch employees
  useEffect(() => {
    // Simulated API call to fetch employees
    const fetchEmployees = () => {
      const data: Employee[] = [
        {
          id: "EMP001",
          name: "Olivia Turner",
          email: "olivia@gmail.com",
          department: "Marketing",
          position: "Marketing Lead",
          joiningDate: "Jan 15, 2020",
          salary: "$85,000",
          status: "Active",
          image: "/images/users/user36.jpg",
        },
        {
          id: "EMP002",
          name: "Liam Bennett",
          email: "liam@gmail.com",
          department: "Human Resources",
          position: "HR Manager",
          joiningDate: "Mar 10, 2021",
          salary: "$75,000",
          status: "On Leave",
          image: "/images/users/user37.jpg",
        },
        {
          id: "EMP003",
          name: "Sophia Myers",
          email: "sophia@gmail.com",
          department: "IT",
          position: "Software Engineer",
          joiningDate: "Feb 22, 2019",
          salary: "$95,000",
          status: "Active",
          image: "/images/users/user38.jpg",
        },
        {
          id: "EMP004",
          name: "Ethan Collins",
          email: "ethan@gmail.com",
          department: "Sales",
          position: "Sales Manager",
          joiningDate: "Apr 12, 2022",
          salary: "$90,000",
          status: "Active",
          image: "/images/users/user39.jpg",
        },
        {
          id: "EMP005",
          name: "Isabella Reed",
          email: "isabella@gmail.com",
          department: "Finance",
          position: "Financial Analyst",
          joiningDate: "Aug 05, 2020",
          salary: "$80,000",
          status: "Resigned",
          image: "/images/users/user40.jpg",
        },
        {
          id: "EMP006",
          name: "Isabella Reed",
          email: "isabella@gmail.com",
          department: "Finance",
          position: "Financial Analyst",
          joiningDate: "Aug 05, 2020",
          salary: "$80,000",
          status: "Resigned",
          image: "/images/users/user41.jpg",
        },
        {
          id: "EMP007",
          name: "Liam Bennett",
          email: "liam@gmail.com",
          department: "Human Resources",
          position: "HR Manager",
          joiningDate: "Mar 10, 2021",
          salary: "$75,000",
          status: "On Leave",
          image: "/images/users/user42.jpg",
        },
        {
          id: "EMP008",
          name: "Olivia Turner",
          email: "olivia@gmail.com",
          department: "Marketing",
          position: "Marketing Lead",
          joiningDate: "Jan 15, 2020",
          salary: "$85,000",
          status: "Active",
          image: "/images/users/user42.jpg",
        },
        {
          id: "EMP009",
          name: "Ethan Collins",
          email: "ethan@gmail.com",
          department: "Sales",
          position: "Sales Manager",
          joiningDate: "Apr 12, 2022",
          salary: "$90,000",
          status: "Active",
          image: "/images/users/user43.jpg",
        },
        {
          id: "EMP010",
          name: "Sophia Myers",
          email: "sophia@gmail.com",
          department: "IT",
          position: "Software Engineer",
          joiningDate: "Feb 22, 2019",
          salary: "$95,000",
          status: "Active",
          image: "/images/users/user44.jpg",
        },
      ];
      setEmployees(data);
    };

    fetchEmployees();
  }, []);

  // Filter employees based on the search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting function
  const sortEmployees = (employees: Employee[]) => {
    const sortedEmployees = [...employees];

    sortedEmployees.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Employee];
      const bValue = b[sortConfig.key as keyof Employee];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sortedEmployees;
  };

  const sortedEmployees = sortEmployees(filteredEmployees);

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: string) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    setEmployees(updatedEmployees);

    if (paginatedEmployees.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const statusStyles: Record<Employee["status"], string> = {
    Active: "bg-success-100 text-success-700",
    "On Leave": "bg-purple-100 text-purple-700",
    Resigned: "bg-danger-100 text-danger-700",
  };

  const handleSort = (column: keyof Employee) => {
    setSortConfig((prevState) => {
      if (prevState.key === column) {
        return {
          key: column,
          direction: prevState.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key: column,
          direction: "asc",
        };
      }
    });
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Employee List</h5>
          </div>

          <div className="trezo-card-subtitle flex items-center mt-[15px] sm:mt-0">
            <form className="relative w-[225px] sm:w-[265px] ltr:mr-[10px] rtl:ml-[10px] ltr:sm:mr-[15px] rtl:sm:ml-[15px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>

              <input
                type="text"
                placeholder="Search for a name...."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="trezo-card-subtitle">
              <Menu as="div" className="trezo-card-dropdown relative">
                <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                  <i className="ri-more-2-fill"></i>
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
                    Employee
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("department")}
                  >
                    Department
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("position")}
                  >
                    Position
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("joiningDate")}
                  >
                    Joining Date
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>

                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("salary")}
                  >
                    Salary
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
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {employee.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={employee.image}
                            alt={employee.name}
                            className="inline-block rounded-full"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {employee.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {employee.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {employee.department}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {employee.position}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {employee.joiningDate}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {employee.salary}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block font-medium dark:bg-[#15203c] rounded-sm text-xs ${
                          statusStyles[employee.status]
                        }`}
                      >
                        {employee.status}
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
                            onClick={() => handleDelete(employee.id)}
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
              Showing {paginatedEmployees.length} of {employees.length} results
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

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036]"
                    } transition-all hover:bg-primary-500 hover:text-white`}
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

export default EmployeeList;
