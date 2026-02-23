"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import Link from "next/link";
import Image from "next/image";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Booking {
  id: string;
  roomName: string;
  customerName: string;
  duration: string;
  imageUrl: string;
  viewLink: string;
}

const RecentBookings: React.FC = () => {
  // Get the current date and format it as "Month Day, Year" (e.g., "May 4, 2025")
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [value, onChange] = useState<Value>(new Date());

  // Sample data - in a real app, this would come from an API
  const bookings: Booking[] = [
    {
      id: "1",
      roomName: "Deluxe Room - G - 3215",
      customerName: "Angela Carter",
      duration: "10 Dec - 15 Dec",
      imageUrl: "/images/rooms/room1.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "2",
      roomName: "The Garden Suite 101",
      customerName: "Jack Smith",
      duration: "12 Dec - 16 Dec",
      imageUrl: "/images/rooms/room2.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "3",
      roomName: "The Tranquil S-02",
      customerName: "Jennifer Anderson",
      duration: "15 Dec - 20 Dec",
      imageUrl: "/images/rooms/room3.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "4",
      roomName: "The Queen - X - 231",
      customerName: "Angela Carter",
      duration: "11 Dec - 14 Dec",
      imageUrl: "/images/rooms/room4.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "5",
      roomName: "The Velvet - F - 32045",
      customerName: "Skyler White",
      duration: "11 Dec - 14 Dec",
      imageUrl: "/images/rooms/room5.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "6",
      roomName: "Deluxe Room - G - 3215",
      customerName: "Angela Carter",
      duration: "10 Dec - 15 Dec",
      imageUrl: "/images/rooms/room1.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "7",
      roomName: "The Garden Suite 101",
      customerName: "Jack Smith",
      duration: "12 Dec - 16 Dec",
      imageUrl: "/images/rooms/room2.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "8",
      roomName: "The Tranquil S-02",
      customerName: "Jennifer Anderson",
      duration: "15 Dec - 20 Dec",
      imageUrl: "/images/rooms/room3.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "9",
      roomName: "The Queen - X - 231",
      customerName: "Angela Carter",
      duration: "11 Dec - 14 Dec",
      imageUrl: "/images/rooms/room4.jpg",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "10",
      roomName: "The Velvet - F - 32045",
      customerName: "Skyler White",
      duration: "11 Dec - 14 Dec",
      imageUrl: "/images/rooms/room5.jpg",
      viewLink: "/hotel/room-details/",
    },
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Recent Bookings</h5>
        </div>

        <div className="trezo-card-subtitle mt-[12px] sm:mt-0">
          <div className="inline-block py-[6.5px] px-[19px] bg-[#f5f7f8] dark:bg-[#0a0e19] rounded-md">
            <span className="inline-block relative ltr:pr-[22px] rtl:pl-[22px]">
              <span>{currentDate}</span>
              <i className="ri-calendar-2-line absolute text-lg top-1/2 -translate-y-1/2 ltr:-right-[3px] rtl:-left-[3px]"></i>
            </span>
          </div>
        </div>
      </div>

      <Calendar
        onChange={onChange}
        value={value}
        className="working-schedule-calendar"
      />

      <div className="trezo-card-content">
        <div className="schedule-list h-[595px] overflow-y-scroll ltr:-mr-[20px] ltr:md:-mr-[25px] rtl:-ml-[20px] rtl:md:-ml-[25px] ltr:pr-[20px] ltr:md:pr-[25px] rtl:pl-[20px] rtl:md:pl-[25px] mt-[20px] md:mt-[25px]">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="relative flex items-center gap-[15px] mt-[15px] pt-[15px] border-t border-gray-100 dark:border-[#172036] first:border-t-0 first:pt-0 first:mt-0"
            >
              <Link
                href={booking.viewLink}
                className="image block rounded-[4px] w-[80px]"
              >
                <Image
                  src={booking.imageUrl}
                  className="rounded-[4px]"
                  alt="room-image"
                  width={80}
                  height={80}
                />
              </Link>

              <div>
                <h6 className="!font-semibold !mb-[6px]">
                  <Link
                    href={booking.viewLink}
                    className="text-black dark:text-white hover:text-primary-500 transition-all"
                  >
                    {booking.roomName}
                  </Link>
                </h6>
                <span className="block text-xs">
                  Booked by{" "}
                  <strong className="font-semibold">
                    {booking.customerName}
                  </strong>
                </span>
                <span className="inline-block text-xs px-[8px] text-primary-500 bg-primary-50 dark:bg-[#15203c] py-[3px] font-medium rounded-[4px] mt-[9px]">
                  {booking.duration}
                </span>
              </div>

              <Link
                href={booking.viewLink}
                className="flex items-center justify-center absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-gray-100 dark:bg-[#172036] transition-all hover:bg-primary-500 hover:text-white"
              >
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentBookings;
