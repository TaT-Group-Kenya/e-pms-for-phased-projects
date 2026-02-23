"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const UpcomingEpisodes: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // State to manage the list of episodes
  const [episodes] = useState([
    {
      id: 1,
      icon: "/images/icons/note.svg",
      iconBg: "bg-purple-500",
      title: "AI for Content Strategy",
      author: "Amanda Garcia",
      date: "October 28, 2025",
    },
    {
      id: 2,
      icon: "/images/icons/video-chat.svg",
      iconBg: "bg-primary-500",
      title: "Secrets to Viral Marketing",
      author: "Sarah Johnson",
      date: "November 1, 2025",
    },
    {
      id: 3,
      icon: "/images/icons/ball.svg",
      iconBg: "bg-orange-500",
      title: "Social Media Strategy",
      author: "David Chen",
      date: "November 12, 2025",
    },
    {
      id: 4,
      icon: "/images/icons/celebration.svg",
      iconBg: "bg-secondary-500",
      title: "Content Trends for 2025",
      author: "Tom Richards",
      date: "November 28, 2025",
    },
  ]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Upcoming Episodes</h5>
          </div>

          <Menu
            as="div"
            className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
          >
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
              <i className="ri-more-2-fill"></i>
            </MenuButton>

            <MenuItems className="transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ">
              {["Add Episode", "Block Episode", "Delete Episode"].map((option) => (
                <MenuItem
                  key={option}
                  as="div"
                  className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                    selectedOption === option ? "font-semibold" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="relative border-b border-gray-50 dark:border-[#172036] pb-[16px] mb-[16px] px-[70px] md:px-[76px] last:border-b-0 last:pb-0 last:mb-0"
            >
              <div
                className={`w-[40px] h-[40px] ${episode.iconBg} rounded-full flex items-center justify-center absolute ltr:left-[20px] ltr:md:left-[25px] rtl:right-[20px] rtl:md:right-[25px] mt-[2px]`}
              >
                <Image src={episode.icon} alt="icon" width={22} height={22} />
              </div>

              <h6 className="!text-base !font-medium !mb-[5px]">
                <Link
                  href="#"
                  className="text-gray-700 dark:text-gray-400 transition-all hover:text-primary-500"
                >
                  {episode.title}
                </Link>
              </h6>

              <p className="!text-xs !max-w-[166px] !leading-[1.4] !mb-[5px]">
                {episode.author}
              </p>

              <span className="block relative text-primary-500 text-xs ltr:pl-[16px] rtl:pr-[16px]">
                <i className="ri-calendar-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-px"></i>
                {episode.date}
              </span>

              <Link
                href="#"
                className="inline-block absolute ltr:right-[20px] rtl:left-[20px] ltr:md:right-[25px] rtl:md:left-[25px] top-1/2 -translate-y-1/2 -mt-[10px] w-[40px] h-[40px] md:w-[43px] md:h-[43px] text-center text-gray-400 transition-all border border-gray-100 dark:border-[#172036] rounded-full hover:bg-primary-500 hover:border-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined absolute left-0 right-0 !text-[22px] top-1/2 -translate-y-1/2">
                  arrow_outward
                </i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpcomingEpisodes;
