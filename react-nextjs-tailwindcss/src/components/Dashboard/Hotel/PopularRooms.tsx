"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

interface Room {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  status: "available" | "booked";
  viewLink: string;
}

const PopularRooms: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const rooms: Room[] = [
    {
      id: "1",
      name: "The Velvet - F - 32045",
      code: "SJ-32056",
      imageUrl: "/images/rooms/room6.jpg",
      status: "booked",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "2",
      name: "Deluxe Room - G - 3215",
      code: "SJ-56721",
      imageUrl: "/images/rooms/room7.jpg",
      status: "available",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "3",
      name: "The Garden Suite 101",
      code: "SJ-54214",
      imageUrl: "/images/rooms/room8.jpg",
      status: "booked",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "4",
      name: "The Tranquil S-02",
      code: "SJ-45672",
      imageUrl: "/images/rooms/room9.jpg",
      status: "available",
      viewLink: "/hotel/room-details/",
    },
    {
      id: "5",
      name: "The Velvet - F - 32045",
      code: "SJ-32056",
      imageUrl: "/images/rooms/room6.jpg",
      status: "booked",
      viewLink: "/hotel/room-details/",
    }, 
  ];

  const getStatusStyles = (status: Room["status"]) => {
    const baseStyles =
      "inline-block text-xs font-medium px-[9px] rounded-[100px] absolute top-[10px] ltr:right-[10px] rtl:left-[10px]";

    return status === "available"
      ? `${baseStyles} text-success-700 border border-success-500 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c]`
      : `${baseStyles} text-danger-700 border border-danger-400 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c]`;
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Popular Rooms</h5>
        </div>
      </div>

      <div className="trezo-card-content relative" id="popularRoomsSlides">
        <Swiper
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              spaceBetween: 25,
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3,
            },
            1440: {
              slidesPerView: 4,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {rooms.map((room) => (
            <SwiperSlide key={room.id}>
              <div className="relative">
                <Link href={room.viewLink} className="block rounded-md">
                  <Image
                    src={room.imageUrl}
                    alt="room-image"
                    className="rounded-md w-full"
                    width={500}
                    height={500}
                  />
                </Link>
                <span className={getStatusStyles(room.status)}>
                  {room.status === "available" ? "Available" : "Booked"}
                </span>
              </div>
              <h6 className="!font-semibold mt-[15px] !mb-[5px] !text-md">
                <Link
                  href={room.viewLink}
                  className="text-black dark:text-white hover:text-primary-500 transition-all"
                >
                  {room.name}
                </Link>
              </h6>
              <span className="block">
                Code <strong className="font-semibold">{room.code}</strong>
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PopularRooms;
