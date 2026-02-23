"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import SwiperCore from "swiper";

// Interface for room image
interface RoomImage {
  id: string;
  src: string;
  alt: string;
}

// Interface for room details
interface RoomDetails {
  images: RoomImage[];
}

const RoomDetailsContent: React.FC = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  // Dynamic room data (can be passed as props or fetched from an API)
  const room: RoomDetails = {
    images: [
      {
        id: "1",
        src: "/images/rooms/room-details1.jpg",
        alt: "Deluxe Suite - Living Area",
      },
      {
        id: "2",
        src: "/images/rooms/room-details2.jpg",
        alt: "Deluxe Suite - Bedroom",
      },
      {
        id: "3",
        src: "/images/rooms/room-details3.jpg",
        alt: "Deluxe Suite - Bathroom",
      },
      {
        id: "4",
        src: "/images/rooms/room-details4.jpg",
        alt: "Deluxe Suite - View",
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="xl:col-span-1">
          <div className="trezo-card">
            <div className="trezo-card-content">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="room-details-image-slides"
              >
                {room.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="bg-white dark:bg-[#0c1427] p-[13px]">
                      <Image
                        className="rounded-md w-full"
                        src={image.src}
                        alt={image.alt}
                        width={640}
                        height={660}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={(swiper) => setThumbsSwiper(swiper)}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper mt-[15px]"
              >
                {room.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <Image
                      className="rounded-md cursor-pointer"
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md lg:h-full">
            <div className="trezo-card-content">
              <div className="sm:flex items-center gap-[15px]">
                <Image
                  src="/images/users/user80.jpg"
                  alt="user-image"
                  className="rounded-full w-[85px]"
                  width={85}
                  height={85}
                />
                <div className="mt-[15px] sm:mt-0">
                  <span className="block text-xs">Code: TRZ-32</span>
                  <h3 className="!text-[20px] md:!text-xl !mb-0 mt-[5px]">
                    Serenity Suite
                  </h3>
                  <ul>
                    <li className="inline-block relative mt-[10px] ltr:mr-[17px] rtl:ml-[17px] ltr:pl-[25px] rtl:pr-[25px] ltr:last:mr-0 rtl:last:ml-0">
                      <i className="ri-phone-fill absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-orange-500 text-lg"></i>
                      +321 1245 6457
                    </li>
                    <li className="inline-block relative mt-[10px] ltr:mr-[17px] rtl:ml-[17px] ltr:pl-[25px] rtl:pr-[25px] ltr:last:mr-0 rtl:last:ml-0">
                      <i className="ri-mail-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-orange-500 text-lg"></i>
                      anderson350@gmail.com
                    </li>
                  </ul>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 dark:bg-[#172036] my-[20px] md:my-[25px]"></div>

              <div className="sm:flex gap-[40px]">
                <div className="flex items-center gap-[10px] mb-[15px] last:mb-0 sm:mb-0">
                  <Image
                    src="/images/icons/schedule.svg"
                    alt="schedule"
                    width={28}
                    height={28}
                  />
                  <div>
                    <span className="text-xs block mb-px">Check In</span>
                    <span className="block font-semibold text-black dark:text-white">
                      23 June 2025, 15:12 AM
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[10px] mb-[15px] last:mb-0 sm:mb-0">
                  <Image
                    src="/images/icons/schedule.svg"
                    alt="schedule"
                    width={28}
                    height={28}
                  />
                  <div>
                    <span className="text-xs block mb-px">Check Out</span>
                    <span className="block font-semibold text-black dark:text-white">
                      25 June 2025, 14:20 PM
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 dark:bg-[#172036] my-[20px] md:my-[25px]"></div>

              <h4 className="!text-lg !mb-[13px]">Room Info</h4>
              <ul className="mb-[20px] md:mb-[25px] grid grid-cols-1 sm:grid-cols-2">
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Room Code</span>
                  <span className="block">
                    <span className="text-black dark:text-white">L1-15</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Bathroom</span>
                  <span className="block">
                    <span className="text-black dark:text-white">2</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Room Name</span>
                  <span className="block">
                    <span className="text-black dark:text-white">
                      Moonlight
                    </span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Air Conditioner</span>
                  <span className="block">
                    <span className="text-black dark:text-white">Yes</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Rate</span>
                  <span className="block">
                    <span className="text-black dark:text-white">$156</span>
                    /night
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Free WiFi</span>
                  <span className="block">
                    <span className="text-black dark:text-white">Yes</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Bed</span>
                  <span className="block">
                    <span className="text-black dark:text-white">2</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Heater</span>
                  <span className="block">
                    <span className="text-black dark:text-white">No</span>
                  </span>
                </li>
              </ul>

              <h4 className="!text-lg !mb-[13px]">Description</h4>
              <p>
                This room captures the essence of boundless potential,
                symbolized by a surreal landscape where the sky meets the earth
                in a dazzling fusion of colors. The intricate design features
                flowing lines that blend together, representing the limitless
                paths we can take in life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetailsContent;
