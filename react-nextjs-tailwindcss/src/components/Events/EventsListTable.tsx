"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  viewLink: string;
  dateTime: string;
  location: string;
  organizer: string;
  status: "Happening" | "Upcoming" | "Past";
  imageUrl: string;
}

const eventData: Event[] = [
  {
    id: "#JAN-258",
    name: "Annual Conference 2024",
    viewLink: "/events/event-details/",
    dateTime: "01 Dec 2024 09:00 AM",
    location: "Convention Center",
    organizer: "ABC Corporation",
    status: "Happening",
    imageUrl: "/images/events/event1.jpg",
  },
  {
    id: "#JAN-648",
    name: "Leadership Summit 2024",
    viewLink: "/events/event-details/",
    dateTime: "10 Dec 2024 03:00 AM",
    location: "Online",
    organizer: "Marketing Pros",
    status: "Upcoming",
    imageUrl: "/images/events/event2.jpg",
  },
  {
    id: "#JAN-945",
    name: "Product Launch Webinar",
    viewLink: "/events/event-details/",
    dateTime: "15 Dec 2024 06:00 PM",
    location: "City Sky Lounge",
    organizer: "Tech Solutions Inc.",
    status: "Past",
    imageUrl: "/images/events/event3.jpg",
  },
  {
    id: "#JAN-457",
    name: "Tech Talk 2024",
    viewLink: "/events/event-details/",
    dateTime: "05 Jan 2025 10:00 AM",
    location: "Tech Park",
    organizer: "Innovators Hub",
    status: "Upcoming",
    imageUrl: "/images/events/event4.jpg",
  },
  {
    id: "#JAN-532",
    name: "Startup Expo 2024",
    viewLink: "/events/event-details/",
    dateTime: "12 Jan 2025 02:00 PM",
    location: "Exhibition Center",
    organizer: "Startup Inc.",
    status: "Happening",
    imageUrl: "/images/events/event5.jpg",
  },
  {
    id: "#JAN-678",
    name: "Investor Summit 2024",
    viewLink: "/events/event-details/",
    dateTime: "20 Jan 2025 01:00 PM",
    location: "Convention Hall B",
    organizer: "Global Investors",
    status: "Upcoming",
    imageUrl: "/images/events/event6.jpg",
  },
  {
    id: "#JAN-832",
    name: "Marketing Masterclass 2024",
    viewLink: "/events/event-details/",
    dateTime: "25 Jan 2025 09:00 AM",
    location: "Online",
    organizer: "Marketing Masters",
    status: "Past",
    imageUrl: "/images/events/event7.jpg",
  },
  {
    id: "#JAN-910",
    name: "AI Conference 2024",
    viewLink: "/events/event-details/",
    dateTime: "05 Feb 2025 04:00 PM",
    location: "Silicon Valley Conference Center",
    organizer: "AI Innovators",
    status: "Happening",
    imageUrl: "/images/events/event8.jpg",
  },
  {
    id: "#JAN-217",
    name: "Leadership Workshop 2024",
    viewLink: "/events/event-details/",
    dateTime: "10 Feb 2025 11:00 AM",
    location: "Luxury Hotel",
    organizer: "Leaders Network",
    status: "Upcoming",
    imageUrl: "/images/events/event9.jpg",
  },
  {
    id: "#JAN-307",
    name: "E-Commerce Summit 2024",
    viewLink: "/events/event-details/",
    dateTime: "15 Feb 2025 05:00 PM",
    location: "E-commerce Hub",
    organizer: "E-Com Solutions",
    status: "Past",
    imageUrl: "/images/events/event10.jpg",
  },
  {
    id: "#JAN-814",
    name: "Cybersecurity Conference 2024",
    viewLink: "/events/event-details/",
    dateTime: "18 Feb 2025 08:00 AM",
    location: "Cyber Hub Auditorium",
    organizer: "CyberTech Solutions",
    status: "Happening",
    imageUrl: "/images/events/event1.jpg",
  },
  {
    id: "#JAN-132",
    name: "Design Thinking Workshop 2024",
    viewLink: "/events/event-details/",
    dateTime: "22 Feb 2025 03:00 PM",
    location: "Design Studio",
    organizer: "Creative Minds",
    status: "Upcoming",
    imageUrl: "/images/events/event2.jpg",
  },
  {
    id: "#JAN-229",
    name: "Global Networking Forum 2024",
    viewLink: "/events/event-details/",
    dateTime: "28 Feb 2025 06:00 PM",
    location: "International Convention Center",
    organizer: "Global Connect",
    status: "Past",
    imageUrl: "/images/events/event3.jpg",
  },
  {
    id: "#JAN-513",
    name: "Entrepreneurship Bootcamp 2024",
    viewLink: "/events/event-details/",
    dateTime: "05 Mar 2025 07:00 AM",
    location: "Startup Incubator",
    organizer: "Entrepreneur Inc.",
    status: "Happening",
    imageUrl: "/images/events/event4.jpg",
  },
  {
    id: "#JAN-726",
    name: "Data Science Conference 2024",
    viewLink: "/events/event-details/",
    dateTime: "12 Mar 2025 04:00 PM",
    location: "Tech Hub Auditorium",
    organizer: "Data Science Experts",
    status: "Upcoming",
    imageUrl: "/images/events/event5.jpg",
  },
  {
    id: "#JAN-983",
    name: "Blockchain Summit 2024",
    viewLink: "/events/event-details/",
    dateTime: "18 Mar 2025 01:00 PM",
    location: "Blockchain Center",
    organizer: "Crypto World",
    status: "Past",
    imageUrl: "/images/events/event6.jpg",
  },
  {
    id: "#JAN-238",
    name: "Mobile App Development Workshop 2024",
    viewLink: "/events/event-details/",
    dateTime: "22 Mar 2025 09:00 AM",
    location: "Developer Hub",
    organizer: "App Builders",
    status: "Happening",
    imageUrl: "/images/events/event7.jpg",
  },
  {
    id: "#JAN-374",
    name: "VR Experience Expo 2024",
    viewLink: "/events/event-details/",
    dateTime: "30 Mar 2025 02:00 PM",
    location: "Virtual Reality Center",
    organizer: "FutureTech",
    status: "Upcoming",
    imageUrl: "/images/events/event8.jpg",
  },
  {
    id: "#JAN-821",
    name: "Cloud Computing Conference 2024",
    viewLink: "/events/event-details/",
    dateTime: "05 Apr 2025 03:00 PM",
    location: "CloudTech Auditorium",
    organizer: "Tech Giants",
    status: "Past",
    imageUrl: "/images/events/event9.jpg",
  },
  {
    id: "#JAN-994",
    name: "AI Workshop 2024",
    viewLink: "/events/event-details/",
    dateTime: "12 Apr 2025 11:00 AM",
    location: "Innovation Center",
    organizer: "AI Experts",
    status: "Happening",
    imageUrl: "/images/events/event10.jpg",
  },
];

const statusColors: Record<string, string> = {
  Happening: "bg-primary-50 dark:bg-[#15203c] text-primary-500",
  Upcoming: "bg-success-50 dark:bg-[#15203c] text-success-500",
  Past: "bg-danger-50 dark:bg-[#15203c] text-danger-500",
};

const EventsListTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = eventData.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
                placeholder="Search event here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/events/create-an-event/"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Event
              </span>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "Event ID",
                    "Event",
                    "Date and Time",
                    "Location",
                    "Organizer",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentItems.map((event) => (
                  <tr key={event.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {event.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <Link
                        href={event.viewLink}
                        className="flex items-center text-black dark:text-white transition-all hover:text-primary-500"
                      >
                        <Image
                          className="rounded-md w-[40px]"
                          alt="event-image"
                          src={event.imageUrl}
                          width={40}
                          height={40}
                        />
                        <span className="block text-[15px] font-medium ltr:ml-[12px] rtl:mr-[12px]">
                          {event.name}
                        </span>
                      </Link>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {event.dateTime}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {event.location}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {event.organizer}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${
                          statusColors[event.status]
                        }`}
                      >
                        {event.status}
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
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, eventData.length)} of{" "}
              {eventData.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
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

export default EventsListTable;
