"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  icon: string;
  color: string;
  message: string;
  time: string;
  link: string;
  isNew?: boolean;
};

const notifications: Notification[] = [
  {
    id: "1",
    icon: "sms",
    color: "text-primary-500",
    message:
      'You have requested to <strong className="font-semibold">withdrawal</strong>',
    time: "2 hrs ago",
    link: "/notifications",
  },
  {
    id: "2",
    icon: "person",
    color: "text-[#39b2de]",
    message:
      '<strong className="font-semibold">A new user</strong> added in Trezo',
    time: "3 hrs ago",
    link: "/notifications",
    isNew: true,
  },
  {
    id: "3",
    icon: "mark_email_unread",
    color: "text-[#00b69b]",
    message:
      'You have requested to <strong className="font-semibold">withdrawal</strong>',
    time: "1 day ago",
    link: "/notifications",
  },
];

const Notifications: React.FC = () => {
  const handleClearAll = () => {
    console.log("Clear all notifications clicked");
    // Add logic to clear notifications
  };

  const [active, setActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  const handleDropdownToggle = () => {
    setActive((prevState) => !prevState);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActive(false); // Close the dropdown if clicked outside
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative notifications-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleDropdownToggle}
        className={`leading-none inline-block transition-all relative top-[2px] hover:text-primary-500 ${
          active ? "active" : ""
        }`}
      >
        <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
          notifications
        </i>
        <span className="top-[3px] ltr:right-[4px] rtl:left-[4px] w-[6px] h-[6px] rounded-full absolute bg-orange-500"></span>
      </button>

      {active && (
        <div className="notifications-menu-dropdown bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none py-[17px] absolute mt-[17px] md:mt-[20px] w-[290px] md:w-[350px] z-[1] top-full ltr:-right-[120px] ltr:md:right-0 rtl:-left-[120px] rtl:md:left-0 rounded-md">
          <div className="flex items-center justify-between px-[20px] pb-[17px]">
            <span className="font-semibold text-black dark:text-white text-[15px]">
              Notifications{" "}
              <span className="text-gray-500 dark:text-gray-400 font-normal text-base">
                ({notifications.length})
              </span>
            </span>
            <button
              type="button"
              className="text-primary-500"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>

          <ul className="mb-[18px]">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="relative border-b border-gray-100 dark:border-[#172036] border-dashed py-[17px] ltr:pl-[75px] ltr:pr-[20px] rtl:pr-[75px] rtl:pl-[20px] first:border-t first:border-gray-100 dark:first:border-[#172036]"
              >
                <div
                  className={`rounded-full flex items-center justify-center absolute text-center transition-all top-1/2 -translate-y-1/2 ltr:left-[20px] rtl:right-[20px] w-[44px] h-[44px] ${notification.color} bg-[#4936f50d]`}
                >
                  <i className="material-symbols-outlined !text-[22px]">
                    {notification.icon}
                  </i>
                </div>
                <span
                  className="block mb-[3px] text-black dark:text-white"
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />
                <span className="block text-gray-500 dark:text-gray-400">
                  {notification.time}
                </span>
                <Link
                  href={notification.link}
                  className="block left-0 top-0 right-0 bottom-0 z-[1] absolute"
                ></Link>
                {notification.isNew && (
                  <span className="inline-block rounded-full bg-primary-500 absolute w-[6px] h-[6px] right-[20px] top-1/2 -translate-y-1/2"></span>
                )}
              </li>
            ))}
          </ul>

          <div className="text-center">
            <Link
              href="/notifications/"
              className="inline-block font-medium relative text-primary-500 transition-all hover:underline"
            >
              See All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
