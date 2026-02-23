"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
};

const events: Event[] = [
  {
    id: 1,
    title: "Pythons Unleashed: A Development Expedition",
    date: "15 April 2024",
    time: "12.00 PM - 6.00 PM",
  },
  {
    id: 2,
    title: "React Advanced Workshop",
    date: "20 May 2024",
    time: "10.00 AM - 3.00 PM",
  },
  {
    id: 3,
    title: "TypeScript for Professionals",
    date: "10 June 2024",
    time: "9.00 AM - 5.00 PM",
  },
  {
    id: 4,
    title: "Next.js Conference 2024",
    date: "25 July 2024",
    time: "11.00 AM - 4.00 PM",
  },
];

const WorkingSchedule: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Working Schedule</h5>
          </div>
        </div>

        <div className="trezo-card-content relative">
          <Calendar onChange={onChange} value={value} className='working-schedule-calendar' />

          <div className="mt-[19px] relative" id="upcomingEventsSlides">
            <span className="block mb-[14px] font-medium">
              Upcoming Events:
            </span>

            <Swiper
              slidesPerView={1}
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {events.map((event) => (
                <SwiperSlide key={event.id}>
                  <div className="relative ltr:pl-[14px] rtl:pr-[14px]">
                    <div className="absolute ltr:left-0 rtl:right-0 top-[4px] w-[7px] h-[7px] rounded-sm bg-primary-500"></div>
                    <h6 className="!text-sm !mb-[5px] !font-semibold">
                      {event.title}
                    </h6>
                    <span className="text-xs">
                      <span className="text-primary-500">{event.date}</span>-
                      {event.time}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkingSchedule;
