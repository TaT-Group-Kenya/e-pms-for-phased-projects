"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const UpcomingEvents: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Upcoming Events</h5>
          </div>
        </div>

        <div
          className="trezo-card-content relative"
          id="schoolUpcomingEventsSlides"
        >
          <Swiper
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
          >
            <SwiperSlide className="bg-gray-50 dark:bg-[#0a0e19] p-[12px] rounded-md">
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="block font-medium text-md text-black dark:text-white transition-all hover:text-primary-500"
                >
                  Science Fair
                </a>
                <span className="block">October 25, 2024</span>
              </div>
              <ul className="mt-[10px]">
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-time-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg mt-px"></i>
                  9:00 AM - 3:00 PM
                </li>
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-map-pin-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg"></i>
                  Auditorium
                </li>
              </ul>
            </SwiperSlide>

            <SwiperSlide className="bg-gray-50 dark:bg-[#0a0e19] p-[12px] rounded-md">
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="block font-medium text-md text-black dark:text-white transition-all hover:text-primary-500"
                >
                  Science Fair
                </a>
                <span className="block">October 25, 2024</span>
              </div>
              <ul className="mt-[10px]">
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-time-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg mt-px"></i>
                  9:00 AM - 3:00 PM
                </li>
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-map-pin-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg"></i>
                  Auditorium
                </li>
              </ul>
            </SwiperSlide>

            <SwiperSlide className="bg-gray-50 dark:bg-[#0a0e19] p-[12px] rounded-md">
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="block font-medium text-md text-black dark:text-white transition-all hover:text-primary-500"
                >
                  Science Fair
                </a>
                <span className="block">October 25, 2024</span>
              </div>
              <ul className="mt-[10px]">
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-time-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg mt-px"></i>
                  9:00 AM - 3:00 PM
                </li>
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-map-pin-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg"></i>
                  Auditorium
                </li>
              </ul>
            </SwiperSlide>

            <SwiperSlide className="bg-gray-50 dark:bg-[#0a0e19] p-[12px] rounded-md">
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="block font-medium text-md text-black dark:text-white transition-all hover:text-primary-500"
                >
                  Science Fair
                </a>
                <span className="block">October 25, 2024</span>
              </div>
              <ul className="mt-[10px]">
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-time-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg mt-px"></i>
                  9:00 AM - 3:00 PM
                </li>
                <li className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                  <i className="ri-map-pin-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg"></i>
                  Auditorium
                </li>
              </ul>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default UpcomingEvents;
