"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
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

  // Modal
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Working Schedule</h5>
          </div>
        </div>

        <div className="trezo-card-content relative">
          <Calendar
            onChange={onChange}
            value={value}
            className="working-schedule-calendar"
          />

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

          <div className="ltr:text-right rtl:text-left">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white mt-[20px] md:mt-[25px]"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Event
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[550px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0">Add Event</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content">
                  <form>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Add title
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Add title"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div className="mt-[20px] md:mt-[25px] ltr:text-right rtl:text-left">
                      <button
                        type="button"
                        className="rounded-md inline-block transition-all font-medium ltr:mr-[15px] rtl:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400"
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            add
                          </i>
                          Create
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default WorkingSchedule;
