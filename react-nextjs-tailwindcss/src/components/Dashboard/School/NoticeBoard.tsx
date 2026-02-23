"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Notice {
  title: string;
  description: string;
  date: string;
  icon: string;
  iconColor: string; // Tailwind color classes
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // Simulated API call to fetch notices
    const fetchNotices = () => {
      const data: Notice[] = [
        {
          title: "Science Fair Registration",
          description: "Registration for the annual Science Fair",
          date: "October 28, 2024",
          icon: "/images/icons/note.svg",
          iconColor: "bg-purple-500",
        },
        {
          title: "Parent-Teacher Meeting",
          description: "The Parent-Teacher meeting for Term 1 will take place",
          date: "November 1, 2024",
          icon: "/images/icons/video-chat.svg",
          iconColor: "bg-primary-500",
        },
        {
          title: "Winter Sports Tryouts",
          description: "Tryouts for the winter sports teams will begin on",
          date: "November 12, 2024",
          icon: "/images/icons/ball.svg",
          iconColor: "bg-orange-500",
        },
        {
          title: "School Holiday Reminder",
          description: "A reminder that school will be closed on November",
          date: "November 28, 2024",
          icon: "/images/icons/celebration.svg",
          iconColor: "bg-secondary-500",
        },
      ];
      setNotices(data);
    };

    fetchNotices();
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Notice Board</h5>
          </div>
          <div className="trezo-card-subtitle">
            <button
              type="button"
              className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
            >
              View All{" "}
              <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
            </button>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="relative border-b border-gray-50 dark:border-[#172036] pb-[10px] mb-[11px] px-[70px] md:px-[76px] last:border-b-0 last:pb-0 last:mb-0"
            >
              <div
                className={`w-[40px] h-[40px] ${notice.iconColor} rounded-full flex items-center justify-center absolute ltr:left-[20px] ltr:md:left-[25px] rtl:right-[20px] rtl:md:right-[25px] mt-[2px]`}
              >
                <Image
                  src={notice.icon}
                  alt={notice.title}
                  width={22}
                  height={22}
                />
              </div>
              <h6 className="!text-base !font-medium !mb-[4px]">
                <a
                  href="#"
                  className="text-gray-700 dark:text-gray-400 transition-all hover:text-primary-500"
                >
                  {notice.title}
                </a>
              </h6>
              <p className="!text-xs !max-w-[166px] !leading-[1.4] !mb-[4px]">
                {notice.description}
              </p>
              <span className="block relative text-primary-500 text-xs ltr:pl-[16px] rtl:pr-[16px]">
                <i className="ri-calendar-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px"></i>
                {notice.date}
              </span>
              <a
                href="#"
                className="inline-block absolute ltr:right-[20px] rtl:left-[20px] ltr:md:right-[25px] rtl:md:left-[25px] top-1/2 -translate-y-1/2 -mt-[10px] w-[40px] h-[40px] md:w-[43px] md:h-[43px] text-center text-gray-400 transition-all border border-gray-100 dark:border-[#172036] rounded-full hover:bg-primary-500 hover:border-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined absolute left-0 right-0 !text-[22px] top-1/2 -translate-y-1/2">
                  arrow_outward
                </i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NoticeBoard;
