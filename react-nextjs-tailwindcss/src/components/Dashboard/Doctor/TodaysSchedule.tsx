"use client";

import React, { useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  patientName: string;
  patientImage: string;
  type: "appointment" | "surgery" | "meeting";
}

const TodaysSchedule: React.FC = () => {
  // Calendar
  const [value, onChange] = useState<Value>(new Date());

  // Sample schedule data
  const scheduleItems: ScheduleItem[] = [
    {
      id: 1,
      time: "10:00 AM",
      title: "Appointment With Cardiac Patient",
      patientName: "Jonathon Ronan",
      patientImage: "/images/users/user1.jpg",
      type: "appointment",
    },
    {
      id: 2,
      time: "12:00 PM",
      title: "Major Cardiac Surgery of the patient",
      patientName: "Walter White",
      patientImage: "/images/users/user2.jpg",
      type: "surgery",
    },
    {
      id: 3,
      time: "02:00 PM",
      title: "Board Meeting With",
      patientName: "Jessy Pinkman",
      patientImage: "/images/users/user3.jpg",
      type: "meeting",
    },
    // Add more schedule items as needed
  ];

  // Get card styling based on schedule type
  const getCardStyle = (type: string) => {
    switch (type) {
      case "appointment":
        return {
          bg: "bg-primary-100 dark:bg-[#172036]",
          text: "text-primary-500",
          hover: "hover:bg-primary-500 hover:text-white",
        };
      case "surgery":
        return {
          bg: "bg-secondary-100 dark:bg-[#172036]",
          text: "text-secondary-500",
          hover: "hover:bg-secondary-500 hover:text-white",
        };
      case "meeting":
        return {
          bg: "bg-purple-100 dark:bg-[#172036]",
          text: "text-purple-500",
          hover: "hover:bg-purple-500 hover:text-white",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-[#172036]",
          text: "text-gray",
          hover: "hover:bg-gray-500 hover:text-white",
        };
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[22px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Today&apos;s Schedule</h5>
        </div>
      </div>

      <div className="trezo-card-content">
        <Calendar
          onChange={onChange}
          value={value}
          className="working-schedule-calendar"
        />

        <div className="border-top border-[1px] border-gray-100 dark:border-[#172036] border-dashed mt-[10px] mb-[20px]"></div>

        <div className="schedule-list h-[520px] overflow-y-scroll ltr:-mr-[20px] ltr:md:-mr-[25px] rtl:-ml-[20px] rtl:md:-ml-[25px] ltr:pr-[20px] ltr:md:pr-[25px] rtl:pl-[20px] rtl:md:pl-[25px]">
          {scheduleItems.map((item) => {
            const style = getCardStyle(item.type);
            return (
              <div
                key={item.id}
                className={`p-[20px] md:p-[25px] rounded-md ${style.bg} relative z-[1] mt-[12px] first:mt-0`}
              >
                <span className="block text-black dark:text-white font-semibold">
                  {item.time}
                </span>
                <p className="mt-[3px] mb-[9px]">{item.title}</p>
                <div className="flex items-center gap-[5px]">
                  <Image
                    src={item.patientImage}
                    alt="user-image"
                    className="rounded-full w-[24px] border-[1px] border-white dark:border-black"
                    width={24}
                    height={24}
                  />
                  <span className="block font-medium">{item.patientName}</span>
                </div>
                <div className="mt-[15px] flex items-center justify-between">
                  <button
                    type="button"
                    className={`inline-block font-medium py-[5.5px] px-[16px] bg-white dark:bg-[#0C1427] rounded-md ${style.text} transition-all ${style.hover}`}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center rounded-full bg-white dark:bg-[#0C1427] ${style.text} transition-all ${style.hover} w-[28px] h-[28px]`}
                  >
                    <i className="ri-notification-2-line"></i>
                  </button>
                </div>
                <div className="absolute -z-[1] ltr:right-0 rtl:left-0 top-0 rtl:-scale-x-[1] dark:opacity-[0.2]">
                  <Image
                    src="/images/cut-circle.png"
                    alt="cut-circle"
                    width={55}
                    height={80}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TodaysSchedule;
