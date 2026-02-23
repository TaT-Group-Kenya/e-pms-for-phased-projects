"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Event Data Interface
interface Event {
  id: number;
  name: string;
  viewLink: string;
  date: string;
  price: string;
  description: string;
  image: string;
  attendees: string[];
  bookedSeats: number;
  totalSeats: number;
}

// Sample Dynamic Events Data (20 Items)
const eventData: Event[] = [
  {
    id: 1,
    name: "Annual Conference 2024",
    viewLink: "/events/event-details/",
    date: "April 30, 2024",
    price: "$120",
    description: "A high-impact business conference to boost networking.",
    image: "/images/events/event1.jpg",
    attendees: ["/images/users/user6.jpg", "/images/users/user7.jpg"],
    bookedSeats: 1156,
    totalSeats: 1350,
  },
  {
    id: 2,
    name: "Leadership Summit 2024",
    viewLink: "/events/event-details/",
    date: "May 5, 2024",
    price: "$59",
    description: "Join top leaders and executives in an exclusive summit.",
    image: "/images/events/event2.jpg",
    attendees: ["/images/users/user10.jpg", "/images/users/user11.jpg"],
    bookedSeats: 556,
    totalSeats: 2300,
  },
  {
    id: 3,
    name: "Product Launch Webinar",
    viewLink: "/events/event-details/",
    date: "June 15, 2024",
    price: "$123",
    description: "Live product showcase and Q&A session with experts.",
    image: "/images/events/event3.jpg",
    attendees: ["/images/users/user12.jpg", "/images/users/user13.jpg"],
    bookedSeats: 356,
    totalSeats: 550,
  },
  {
    id: 4,
    name: "Tech Innovation Expo",
    viewLink: "/events/event-details/",
    date: "July 20, 2024",
    price: "$99",
    description: "Explore the latest advancements in technology and AI.",
    image: "/images/events/event4.jpg",
    attendees: ["/images/users/user15.jpg", "/images/users/user16.jpg"],
    bookedSeats: 870,
    totalSeats: 1000,
  },
  {
    id: 5,
    name: "Cyber Security Workshop",
    viewLink: "/events/event-details/",
    date: "August 10, 2024",
    price: "$75",
    description:
      "Learn the latest in cybersecurity techniques and best practices.",
    image: "/images/events/event5.jpg",
    attendees: ["/images/users/user18.jpg", "/images/users/user19.jpg"],
    bookedSeats: 320,
    totalSeats: 600,
  },
  {
    id: 6,
    name: "AI & Machine Learning Conference",
    viewLink: "/events/event-details/",
    date: "September 5, 2024",
    price: "$200",
    description:
      "Join AI experts for in-depth discussions and hands-on sessions.",
    image: "/images/events/event6.jpg",
    attendees: ["/images/users/user20.jpg", "/images/users/user21.jpg"],
    bookedSeats: 980,
    totalSeats: 1500,
  },
  {
    id: 7,
    name: "Blockchain Summit 2024",
    viewLink: "/events/event-details/",
    date: "October 15, 2024",
    price: "$150",
    description: "The latest trends and innovations in blockchain technology.",
    image: "/images/events/event7.jpg",
    attendees: ["/images/users/user22.jpg", "/images/users/user23.jpg"],
    bookedSeats: 740,
    totalSeats: 1000,
  },
  {
    id: 8,
    name: "Digital Marketing Bootcamp",
    viewLink: "/events/event-details/",
    date: "November 20, 2024",
    price: "$99",
    description: "Master digital marketing strategies and tools.",
    image: "/images/events/event8.jpg",
    attendees: ["/images/users/user24.jpg", "/images/users/user25.jpg"],
    bookedSeats: 420,
    totalSeats: 700,
  },
  {
    id: 9,
    name: "E-commerce Growth Summit",
    viewLink: "/events/event-details/",
    date: "December 10, 2024",
    price: "$130",
    description: "Scale your e-commerce business with expert insights.",
    image: "/images/events/event9.jpg",
    attendees: ["/images/users/user26.jpg", "/images/users/user27.jpg"],
    bookedSeats: 600,
    totalSeats: 1200,
  },
  {
    id: 10,
    name: "Startup Pitch Competition",
    viewLink: "/events/event-details/",
    date: "January 25, 2025",
    price: "Free",
    description: "Watch top startups pitch their ideas to investors.",
    image: "/images/events/event10.jpg",
    attendees: ["/images/users/user28.jpg", "/images/users/user29.jpg"],
    bookedSeats: 300,
    totalSeats: 500,
  },
  {
    id: 11,
    name: "SaaS Product Development Workshop",
    viewLink: "/events/event-details/",
    date: "February 14, 2025",
    price: "$180",
    description: "Develop scalable SaaS products with hands-on guidance.",
    image: "/images/events/event1.jpg",
    attendees: ["/images/users/user30.jpg", "/images/users/user31.jpg"],
    bookedSeats: 520,
    totalSeats: 800,
  },
  {
    id: 12,
    name: "Remote Work & Productivity Conference",
    viewLink: "/events/event-details/",
    date: "March 7, 2025",
    price: "$90",
    description: "Enhance productivity and efficiency in remote work.",
    image: "/images/events/event2.jpg",
    attendees: ["/images/users/user32.jpg", "/images/users/user33.jpg"],
    bookedSeats: 450,
    totalSeats: 900,
  },
];

const EventsGrid: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate the total number of pages
  const totalPages = Math.ceil(eventData.length / itemsPerPage);

  // Get the events for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = eventData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        {currentEvents.map((event) => (
          <div
            key={event.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content">
              <div className="relative mb-[22px]">
                <Link href={event.viewLink} className="block rounded-md">
                  <Image
                    src={event.image}
                    alt="event-image"
                    className="rounded-md"
                    width={700}
                    height={467}
                  />
                </Link>

                <div className="absolute bg-primary-500 top-0 text-white font-bold flex items-center justify-center ltr:right-0 rtl:left-0 text-md w-[60px] h-[60px] rounded-md z-[1]">
                  {event.price}
                </div>
                <div className="absolute top-0 ltr:right-0 rtl:left-0 w-[65px] h-[65px] bg-white dark:bg-[#0a0e19] ltr:rounded-bl-md rtl:rounded-br-md"></div>
              </div>

              <h6 className="!text-lg !mb-[10px]">
                <Link
                  href={event.viewLink}
                  className="text-black dark:text-white transition-all hover:text-primary-500"
                >
                  {event.name}
                </Link>
              </h6>

              <p>{event.description}</p>

              <div className="flex items-center">
                {event.attendees.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt="user-image"
                    className="rounded-full w-[40px] h-[40px] ltr:-mr-[12px] rtl:-ml-[12px] ltr:last:mr-0 rtl:last:ml-0 border-[2px] border-gray-100 dark:border-[#172036]"
                    width={40}
                    height={40}
                  />
                ))}
              </div>

              <div className="mt-[20px]">
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="block">Seat Booked</span>
                  <span className="block font-semibold text-black dark:text-white">
                    {event.bookedSeats}
                  </span>
                </div>

                <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                    style={{
                      width: `${(event.bookedSeats / event.totalSeats) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {startIndex + 1} to {Math.min(endIndex, eventData.length)}{" "}
              of {eventData.length} results
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

export default EventsGrid;
