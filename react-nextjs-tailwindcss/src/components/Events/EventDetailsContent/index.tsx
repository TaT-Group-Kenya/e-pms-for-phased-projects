"use client";

import React from "react";
import Image from "next/image"; 
import Speakers from "./Speakers";

const EventDetailsContent: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] rounded-md">
        <div className="trezo-card-content">
          <Image
            src="/images/events/event-details.jpg"
            alt="event-details-image"
            className="rounded-md"
            width={1600}
            height={400}
          />
        </div>
      </div>

      <div className="2xl:grid 2xl:grid-cols-5 gap-[25px]">
        <div className="2xl:col-span-3">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Event Details</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <span className="block text-black dark:text-white font-semibold mb-[10px]">
                Annual Conference 2024
              </span>
              <p>
                The Annual Conference 2024 is a flagship event organized by ABC
                Corporation. This conference aims to bring together industry
                leaders, experts, and enthusiasts to discuss the latest trends,
                innovations, and challenges in our field. Participants can
                expect insightful keynote sessions, engaging panel discussions,
                and valuable networking opportunities.
              </p>

              <div className="md:flex items-center mt-[20px]">
                <div className="flex items-center ltr:mr-[30px] rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0 mt-[20px] md:mt-0">
                  <div className="rounded-full text-primary-500 flex items-center justify-center bg-[#f4f6fc] dark:bg-[#15203c] w-[70px] h-[70px]">
                    <i className="material-symbols-outlined !text-[35px]">
                      schedule
                    </i>
                  </div>
                  <div className="ltr:ml-[15px] rtl:mr-[15px]">
                    <span className="block text-black dark:text-white font-semibold">
                      Time
                    </span>
                    <span className="block mt-[3px]">
                      01 Dec 2024, 09:00 AM
                    </span>
                  </div>
                </div>

                <div className="flex items-center ltr:mr-[30px] rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0 mt-[20px] md:mt-0">
                  <div className="rounded-full text-info-500 flex items-center justify-center bg-[#f4f6fc] dark:bg-[#15203c] w-[70px] h-[70px]">
                    <i className="material-symbols-outlined !text-[35px]">
                      place
                    </i>
                  </div>
                  <div className="ltr:ml-[15px] rtl:mr-[15px]">
                    <span className="block text-black dark:text-white font-semibold">
                      Location
                    </span>
                    <span className="block mt-[3px]">Convention Center</span>
                  </div>
                </div>

                <div className="flex items-center ltr:mr-[30px] rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0 mt-[20px] md:mt-0">
                  <div className="rounded-full text-purple-500 flex items-center justify-center bg-[#f4f6fc] dark:bg-[#15203c] w-[70px] h-[70px]">
                    <i className="material-symbols-outlined !text-[35px]">
                      event_seat
                    </i>
                  </div>
                  <div className="ltr:ml-[15px] rtl:mr-[15px]">
                    <span className="block text-black dark:text-white font-semibold">
                      Event Seat
                    </span>
                    <span className="block mt-[3px]">50</span>
                  </div>
                </div>
              </div>

              <div className="mt-[20px] md:mt-[30px] pt-[10px] md:pt-[20px] border-t border-dashed border-gray-100 dark:border-[#172036]">
                <button
                  type="button"
                  className="inline-block rounded-md font-medium md:text-md bg-primary-500 border border-primary-500 text-white py-[11px] px-[27px] transition-all hover:bg-primary-400 hover:border-primary-400 mt-[10px] ltr:mr-[6px] rtl:ml-[6px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <span className="flex items-center">
                    <i className="material-symbols-outlined !text-[20px] ltr:mr-[8px] rtl:ml-[8px]">
                      local_activity
                    </i>
                    Get Ticket
                  </span>
                </button>

                <button
                  type="button"
                  className="inline-block rounded-md font-medium md:text-md border border-gray-100 dark:border-[#172036] py-[11px] px-[27px] transition-all hover:border-primary-500 mt-[10px] ltr:mr-[6px] rtl:ml-[6px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <span className="flex items-center">
                    <i className="material-symbols-outlined !text-[20px] ltr:mr-[8px] rtl:ml-[8px]">
                      event
                    </i>
                    Add To Calendar
                  </span>
                </button>

                <button
                  type="button"
                  className="inline-block rounded-md font-medium md:text-md border border-gray-100 dark:border-[#172036] py-[11px] px-[27px] transition-all hover:border-primary-500 mt-[10px] ltr:mr-[6px] rtl:ml-[6px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <span className="flex items-center">
                    <i className="material-symbols-outlined !text-[20px] ltr:mr-[8px] rtl:ml-[8px]">
                      favorite_border
                    </i>
                    5937
                  </span>
                </button>
                
                <button
                  type="button"
                  className="inline-block rounded-md font-medium md:text-md border border-gray-100 dark:border-[#172036] py-[11px] px-[27px] transition-all hover:border-primary-500 mt-[10px] ltr:mr-[6px] rtl:ml-[6px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <span className="flex items-center">
                    <i className="material-symbols-outlined !text-[20px] ltr:mr-[8px] rtl:ml-[8px]">
                      share
                    </i>
                    2582
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Event Info</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <ul>
                <li className="mb-[12.5px] last:mb-0">
                  <span className="text-black dark:text-white">08:00 AM</span>-
                  Registration
                </li>
                <li className="mb-[12.5px] last:mb-0">
                  <span className="text-black dark:text-white">09:00 AM</span>-
                  Opening Keynote
                </li>
                <li className="mb-[12.5px] last:mb-0">
                  <span className="text-black dark:text-white">10:30 AM</span>-
                  Panel Discussion: Future Trends
                </li>
                <li className="mb-[12.5px] last:mb-0">
                  <span className="text-black dark:text-white">12:00 PM</span>-
                  Lunch Break
                </li>
                <li className="mb-[12.5px] last:mb-0">
                  <span className="text-black dark:text-white">02:00 PM</span>-
                  Interactive Workshops
                </li>
                <li className="mb-[12.5px] last:mb-0">
                  <span className="text-black dark:text-white">04:30 PM</span>-
                  Networking Reception
                </li>
              </ul>
              <h5 className="!mt-[23px] !mb-[16px] !text-lg">
                Registration Information
              </h5>
              <ul>
                <li className="mb-[12.5px] last:mb-0">
                  Early Bird Registration Deadline: 15 November 2024
                </li>
                <li className="mb-[12.5px] last:mb-0">
                  Standard Registration Deadline: 30 November 2024
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 gap-[25px] mb-[25px]">
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">About This Event</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <p>
                Pellentesque viverra lorem malesuada nunc tristique sapien.
                Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                Tellus non morbi nascetur cursus etiam facilisis mi. Dolor
                aliquam sed amet aliquam venenatis. Ac viverra interdum tortor
                enim. Molestie tincidunt ut consequat a urna tortor. Vitae velit
                ac nisl velit mauris placerat nisi placerat.
              </p>
              <p>
                Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                Tellus non morbi nascetur cursus etiam facilisis mi. Dolor
                aliquam sed amet aliquam venenatis. Ac viverra interdum tortor
                enim. Molestie tincidunt ut consequat a urna tortor. Vitae velit
                ac nisl velit mauris placerat nisi placerat.
              </p>
              <ul className="mt-[21px]">
                <li className="relative ltr:pl-[15px] rtl:pr-[11px] mb-[11px] last:mb-0">
                  <span className="absolute w-[6px] h-[6px] rounded-full bg-primary-500 ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px"></span>
                  Pellentesque viverra lorem malesuada nunc tristique sapien.
                </li>
                <li className="relative ltr:pl-[15px] rtl:pr-[11px] mb-[11px] last:mb-0">
                  <span className="absolute w-[6px] h-[6px] rounded-full bg-primary-500 ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px"></span>
                  Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                </li>
                <li className="relative ltr:pl-[15px] rtl:pr-[11px] mb-[11px] last:mb-0">
                  <span className="absolute w-[6px] h-[6px] rounded-full bg-primary-500 ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px"></span>
                  Tellus non morbi nascetur cursus etiam facilisis mi.
                </li>
                <li className="relative ltr:pl-[15px] rtl:pr-[11px] mb-[11px] last:mb-0">
                  <span className="absolute w-[6px] h-[6px] rounded-full bg-primary-500 ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px"></span>
                  Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Speakers */}
        <div>
          <Speakers />
        </div>
      </div>
    </>
  );
};

export default EventDetailsContent;
