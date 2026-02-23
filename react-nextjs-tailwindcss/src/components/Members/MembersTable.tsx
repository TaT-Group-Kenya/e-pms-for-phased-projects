"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joiningDate: string;
  lastActive: string;
  image: string;
}

const membersData: Member[] = [
  {
    id: "#JAN-854",
    name: "Oliver Khan",
    email: "oliver@trezo.com",
    phone: "+1 555-123-4567",
    location: "Washington D.C",
    joiningDate: "10 Oct 2024",
    lastActive: "01 Dec 2024 08:23 AM",
    image: "/images/users/user6.jpg",
  },
  {
    id: "#JAN-853",
    name: "Carolyn Barnes",
    email: "carolyn@trezo.com",
    phone: "+1 555-987-6543",
    location: "Chicago",
    joiningDate: "11 Sep 2024",
    lastActive: "02 Dec 2024 05:09 PM",
    image: "/images/users/user7.jpg",
  },
  {
    id: "#JAN-852",
    name: "Donna Miller",
    email: "donna@trezo.com",
    phone: "+1 555-456-7890",
    location: "Oklahoma City",
    joiningDate: "12 Aug 2024",
    lastActive: "03 Dec 2024 09:30 AM",
    image: "/images/users/user8.jpg",
  },
  {
    id: "#JAN-851",
    name: "James Smith",
    email: "james@trezo.com",
    phone: "+1 555-234-5678",
    location: "Los Angeles",
    joiningDate: "05 Jul 2024",
    lastActive: "04 Dec 2024 10:15 AM",
    image: "/images/users/user9.jpg",
  },
  {
    id: "#JAN-850",
    name: "Sophia Johnson",
    email: "sophia@trezo.com",
    phone: "+1 555-876-5432",
    location: "New York",
    joiningDate: "20 Jun 2024",
    lastActive: "30 Nov 2024 02:45 PM",
    image: "/images/users/user10.jpg",
  },
  {
    id: "#JAN-849",
    name: "Liam Brown",
    email: "liam@trezo.com",
    phone: "+1 555-765-4321",
    location: "Miami",
    joiningDate: "15 May 2024",
    lastActive: "29 Nov 2024 09:00 AM",
    image: "/images/users/user11.jpg",
  },
  {
    id: "#JAN-848",
    name: "Emma Wilson",
    email: "emma@trezo.com",
    phone: "+1 555-654-3210",
    location: "Seattle",
    joiningDate: "22 Apr 2024",
    lastActive: "28 Nov 2024 07:30 PM",
    image: "/images/users/user12.jpg",
  },
  {
    id: "#JAN-847",
    name: "Noah Davis",
    email: "noah@trezo.com",
    phone: "+1 555-543-2109",
    location: "Austin",
    joiningDate: "10 Mar 2024",
    lastActive: "27 Nov 2024 01:25 PM",
    image: "/images/users/user13.jpg",
  },
  {
    id: "#JAN-846",
    name: "Isabella Martinez",
    email: "isabella@trezo.com",
    phone: "+1 555-432-1098",
    location: "San Francisco",
    joiningDate: "18 Feb 2024",
    lastActive: "26 Nov 2024 05:50 PM",
    image: "/images/users/user14.jpg",
  },
  {
    id: "#JAN-845",
    name: "Mason Taylor",
    email: "mason@trezo.com",
    phone: "+1 555-321-0987",
    location: "Dallas",
    joiningDate: "25 Jan 2024",
    lastActive: "25 Nov 2024 11:10 AM",
    image: "/images/users/user15.jpg",
  },
  {
    id: "#JAN-844",
    name: "Ethan White",
    email: "ethan@trezo.com",
    phone: "+1 555-111-2222",
    location: "Houston",
    joiningDate: "10 Dec 2023",
    lastActive: "24 Nov 2024 03:45 PM",
    image: "/images/users/user16.jpg",
  },
  {
    id: "#JAN-843",
    name: "Ava Garcia",
    email: "ava@trezo.com",
    phone: "+1 555-222-3333",
    location: "Boston",
    joiningDate: "15 Jan 2023",
    lastActive: "23 Nov 2024 06:30 PM",
    image: "/images/users/user17.jpg",
  },
  {
    id: "#JAN-842",
    name: "William Clark",
    email: "william@trezo.com",
    phone: "+1 555-333-4444",
    location: "Phoenix",
    joiningDate: "20 Mar 2023",
    lastActive: "22 Nov 2024 09:10 AM",
    image: "/images/users/user18.jpg",
  },
  {
    id: "#JAN-841",
    name: "Mia Rodriguez",
    email: "mia@trezo.com",
    phone: "+1 555-444-5555",
    location: "Denver",
    joiningDate: "25 May 2023",
    lastActive: "21 Nov 2024 07:20 AM",
    image: "/images/users/user19.jpg",
  },
  {
    id: "#JAN-840",
    name: "Benjamin Harris",
    email: "benjamin@trezo.com",
    phone: "+1 555-555-6666",
    location: "Philadelphia",
    joiningDate: "30 Jul 2023",
    lastActive: "20 Nov 2024 04:50 PM",
    image: "/images/users/user20.jpg",
  },
  {
    id: "#JAN-839",
    name: "Charlotte Lewis",
    email: "charlotte@trezo.com",
    phone: "+1 555-666-7777",
    location: "Portland",
    joiningDate: "05 Sep 2023",
    lastActive: "19 Nov 2024 02:30 PM",
    image: "/images/users/user21.jpg",
  },
  {
    id: "#JAN-838",
    name: "Henry Scott",
    email: "henry@trezo.com",
    phone: "+1 555-777-8888",
    location: "San Diego",
    joiningDate: "10 Oct 2023",
    lastActive: "18 Nov 2024 11:45 AM",
    image: "/images/users/user22.jpg",
  },
  {
    id: "#JAN-837",
    name: "Amelia Adams",
    email: "amelia@trezo.com",
    phone: "+1 555-888-9999",
    location: "Atlanta",
    joiningDate: "15 Nov 2023",
    lastActive: "17 Nov 2024 08:15 AM",
    image: "/images/users/user23.jpg",
  },
  {
    id: "#JAN-836",
    name: "Lucas Moore",
    email: "lucas@trezo.com",
    phone: "+1 555-999-0000",
    location: "Las Vegas",
    joiningDate: "20 Dec 2023",
    lastActive: "16 Nov 2024 10:05 PM",
    image: "/images/users/user24.jpg",
  },
  {
    id: "#JAN-835",
    name: "Ella Thompson",
    email: "ella@trezo.com",
    phone: "+1 555-000-1111",
    location: "Orlando",
    joiningDate: "25 Jan 2024",
    lastActive: "15 Nov 2024 06:30 PM",
    image: "/images/users/user25.jpg",
  },
];

const MembersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredMembers = membersData.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const displayedMembers = filteredMembers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
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
                placeholder="Search member here..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "ID",
                    "Member",
                    "Email",
                    "Phone",
                    "Location",
                    "Joining Date",
                    "Last Active",
                    "Action",
                  ].map((heading, index) => (
                    <th
                      key={index}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {displayedMembers.map((member, index) => (
                  <tr key={index}>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {member.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={member.image}
                            width={40}
                            height={40}
                            className="rounded-full"
                            alt={member.name}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {member.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {member.email}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {member.phone}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {member.location}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {member.joiningDate}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {member.lastActive}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
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
                          <i className="material-symbols-outlined !text-md">
                            edit
                          </i>
                        </button>
                        <button
                          type="button"
                          className="text-danger-500 leading-none custom-tooltip"
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

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {displayedMembers.length} of {filteredMembers.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-primary-500 bg-primary-500 text-white">
                  {currentPage}
                </button>
              </li>

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default MembersTable;
