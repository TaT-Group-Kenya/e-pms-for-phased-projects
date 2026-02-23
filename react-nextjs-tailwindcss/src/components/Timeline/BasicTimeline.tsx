"use client";

import React from "react";
import Image from "next/image";

const timelineData = [
  {
    time: "Just now",
    title: "Weekly Stand-Up Meetings:",
    description:
      "We continued our weekly stand-up meetings where team members provided updates on their current tasks, discussed any roadblocks, and coordinated efforts for the week ahead.",
    author: "Olivia Rodriguez",
    color: "bg-success-500",
    participants: [
      "/images/users/user6.jpg",
      "/images/users/user7.jpg",
      "/images/users/user8.jpg",
      "/images/users/user9.jpg",
    ],
    extraParticipants: 15,
  },
  {
    time: "12:00 AM, Tuesday",
    title: "Project Kickoff Session:",
    description:
      "The session included introductions, a review of project goals and objectives, and initial planning discussions.",
    author: "Isabella Cooper",
    color: "bg-orange-500",
    participants: [],
  },
  {
    time: "03:00 PM, Sunday",
    title: "Team Building Workshop:",
    description:
      "Last Friday, we conducted a team building workshop focused on improving communication and collaboration among team members. Activities included team challenges, icebreakers, and open discussions.",
    author: "Lucas Morgan",
    color: "bg-purple-500",
    participants: [],
  },
  {
    time: "10:00 PM, Friday",
    title: "Lunch and Learn Session:",
    description:
      "We organized a lunch and learn session on March 15th where a guest speaker from the industry discussed emerging trends in our field. It was an insightful session that sparked valuable discussions among team members.",
    author: "Ethan Parker",
    color: "bg-secondary-500",
    participants: [
      "/images/users/user12.jpg",
      "/images/users/user14.jpg",
      "/images/users/user13.jpg",
    ],
    extraParticipants: 12,
  },
];

const BasicTimeline: React.FC = () => {
  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <h5 className="!mb-0">Basic Timeline</h5>
      </div>

      <div className="trezo-card-content pt-[10px] pb-[25px]">
        <div className="relative">
          <span className="block absolute top-0 bottom-0 ltr:left-[6px] rtl:right-[6px] ltr:md:left-[150px] rtl:md:right-[150px] mt-[5px] ltr:border-l rtl:border-r border-dashed border-gray-100 dark:border-[#172036]"></span>
          {timelineData.map((event, index) => (
            <div
              key={index}
              className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[180px] rtl:md:pr-[180px] mb-[25px] last:mb-0"
            >
              <span
                className={`block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[144px] rtl:md:right-[144px] w-[12px] h-[12px] rounded-full ${event.color}`}
              ></span>
              <span className="md:absolute md:top-0 ltr:md:left-0 rtl:md:right-0 text-sm block mb-[10px] md:mb-0 w-[120px] ltr:md:text-right rtl:md:text-left">
                {event.time}
              </span>
              <span className="mb-[8px] block text-black dark:text-white font-medium">
                {event.title}
              </span>
              <p className="md:max-w-[770px] text-sm leading-[1.7] mb-[12px]">
                {event.description}
              </p>
              {event.participants.length > 0 && (
                <div className="flex items-center mb-[12px]">
                  {event.participants.map((user, idx) => (
                    <div
                      key={idx}
                      className="w-[40px] h-[40px] rounded-full ltr:-mr-[12px] rtl:-ml-[12px] border-[2px] border-[#ECEEF2] dark:border-[#172036]"
                    >
                      <Image
                        alt="user-image"
                        className="rounded-full"
                        src={user}
                        width={40}
                        height={40}
                      />
                    </div>
                  ))}
                  {event.extraParticipants && (
                    <div className="w-[40px] h-[40px] text-xs rounded-full border-[2px] border-white bg-primary-500 text-white font-medium flex items-center justify-center">
                      +{event.extraParticipants}
                    </div>
                  )}
                </div>
              )}
              <span className="block text-sm">
                By: <span className="text-primary-500">{event.author}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicTimeline;
