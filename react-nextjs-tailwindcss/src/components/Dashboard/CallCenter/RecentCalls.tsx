"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Call {
  id: number;
  name: string;
  phone: string;
  type: string;
  duration: string;
  status: string;
  time: string;
  csat: string;
  image: string;
}

const RecentCalls: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Call | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const itemsPerPage = 4; // Number of calls per page

  useEffect(() => {
    // Simulated API call
    const fetchCalls = () => {
      const data: Call[] = [
        {
          id: 1,
          name: "Emily Johnson",
          phone: "+1 555-123-4567",
          type: "Inbound",
          duration: "5 mins",
          status: "Resolved",
          time: "10:30 AM",
          csat: "90%",
          image: "/images/users/user58.jpg",
        },
        {
          id: 2,
          name: "Sarah Green",
          phone: "+44 20 7946 0958",
          type: "Outbound",
          duration: "3 mins",
          status: "Pending",
          time: "10:35 AM",
          csat: "85%",
          image: "/images/users/user59.jpg",
        },
        {
          id: 3,
          name: "Adam Smith",
          phone: "+1 555-234-5678",
          type: "Inbound",
          duration: "7 mins",
          status: "Resolved",
          time: "10:40 AM",
          csat: "83%",
          image: "/images/users/user60.jpg",
        },
        {
          id: 4,
          name: "Laura Martin",
          phone: "+61 2 1234 5678",
          type: "Inbound",
          duration: "4 mins",
          status: "Dropped",
          time: "10:45 AM",
          csat: "87%",
          image: "/images/users/user7.jpg",
        },
        {
          id: 5,
          name: "Michael Brown",
          phone: "+1 555-567-8901",
          type: "Outbound",
          duration: "6 mins",
          status: "Resolved",
          time: "11:00 AM",
          csat: "88%",
          image: "/images/users/user8.jpg",
        },
        {
          id: 6,
          name: "Sarah Keem",
          phone: "+44 20 7946 8738",
          type: "Outbound",
          duration: "3 mins",
          status: "Pending",
          time: "10:35 AM",
          csat: "85%",
          image: "/images/users/user1.jpg",
        },
        {
          id: 7,
          name: "Adam Jhon",
          phone: "+1 555-234-3589",
          type: "Inbound",
          duration: "7 mins",
          status: "Resolved",
          time: "10:40 AM",
          csat: "83%",
          image: "/images/users/user2.jpg",
        },
        {
          id: 8,
          name: "MM Martin",
          phone: "+61 2 1234 4795",
          type: "Inbound",
          duration: "4 mins",
          status: "Dropped",
          time: "10:45 AM",
          csat: "87%",
          image: "/images/users/user3.jpg",
        },
      ];
      setCalls(data);
    };

    fetchCalls();
  }, []);

  // Handle sorting
  const handleSort = (key: keyof Call) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort the calls
  const sortedCalls = React.useMemo(() => {
    if (sortConfig.key) {
      return [...calls].sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return calls;
  }, [calls, sortConfig]);

  // Filtered and paginated calls
  const filteredCalls = sortedCalls.filter((call) =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex sm:items-center sm:justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !sfont-semibold">Recent Calls</h5>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>

            <div className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]">
              <button
                type="button"
                className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500"
                id="dropdownToggleBtn"
              >
                <i className="ri-more-2-fill"></i>
              </button>
              <ul className="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    This Day
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    This Week
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    This Month
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    This Year
                  </button>
                </li>
              </ul>
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
                    onClick={() => handleSort("name")}
                  >
                    Caller Name
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("type")}
                  >
                    Call Type
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative"
                    onClick={() => handleSort("duration")}
                  >
                    Duration
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative ltr:text-right rtl:text-left"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative ltr:text-right rtl:text-left"
                    onClick={() => handleSort("time")}
                  >
                    Time
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                  <th
                    className="font-normal border-t border-gray-100 dark:border-[#172036] px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap cursor-pointer relative ltr:text-right rtl:text-left"
                    onClick={() => handleSort("csat")}
                  >
                    CSAT
                    <i className="ri-expand-up-down-fill text-gray-500 dark:text-gray-400"></i>
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedCalls.map((call) => (
                  <tr key={call.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={call.image}
                            alt={call.name}
                            className="inline-block rounded-full"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {call.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {call.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td
                      className={`font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]
                        ${
                          call.type === "Inbound"
                            ? "text-primary-600"
                            : call.type === "Outbound"
                            ? "text-orange-500"
                            : "text-purple-600"
                        }
                      `}
                    >
                      {call.type}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036]">
                      {call.duration}
                    </td>

                    <td
                      className={`font-medium whitespace-nowrap px-[20px] py-[17px]  md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ltr:text-right rtl:text-left
                        ${
                          call.status === "Resolved"
                            ? "text-success-600"
                            : call.status === "Pending"
                            ? "text-orange-500"
                            : "text-purple-600"
                        }
                      `}
                    >
                      {call.status}
                    </td>

                    <td className="font-medium whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ltr:text-right rtl:text-left">
                      {call.time}
                    </td>

                    <td className="text-success-700 font-medium whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] border-b border-gray-100 dark:border-[#172036] ltr:text-right rtl:text-left">
                      {call.csat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {paginatedCalls.length} of {filteredCalls.length} results
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
                  key={index + 1}
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

export default RecentCalls;