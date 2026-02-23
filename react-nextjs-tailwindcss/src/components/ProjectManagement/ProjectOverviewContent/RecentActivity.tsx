"use client";

import React, { useState } from "react";

interface Activity {
  id: number;
  timestamp: string;
  title: string;
  description: string;
  author: string;
  color: string;
}

const RecentActivity: React.FC = () => {
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      timestamp: "Just now",
      title: "Weekly Stand-Up Meetings",
      description:
        "We continued our weekly stand-up meetings where team members provided updates on their current tasks, discussed any roadblocks, and coordinated efforts for the week ahead.",
      author: "Olivia Rodriguez",
      color: "bg-success-500",
    },
    {
      id: 2,
      timestamp: "1 day ago",
      title: "Project Kickoff Session",
      description:
        "The session included introductions, a review of project goals and objectives, and initial planning discussions.",
      author: "Isabella Cooper",
      color: "bg-orange-500",
    },
    {
      id: 3,
      timestamp: "2 days ago",
      title: "Team Building Workshop",
      description:
        "Last Friday, we conducted a team building workshop focused on improving communication and collaboration among team members.",
      author: "Lucas Morgan",
      color: "bg-purple-500",
    },
    {
      id: 4,
      timestamp: "3 days ago",
      title: "Lunch and Learn Session",
      description:
        "We organized a lunch and learn session where a guest speaker discussed emerging trends in our field.",
      author: "Ethan Parker",
      color: "bg-secondary-500",
    },
  ]);

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <h5 className="!mb-0">Recent Activity</h5>
      </div>

      <div className="trezo-card-content pt-[10px] pb-[25px]">
        <div className="relative">
          <span className="block absolute top-0 bottom-0 ltr:left-[6px] rtl:right-[6px] ltr:md:left-[98px] rtl:md:right-[98px] mt-[5px] ltr:border-l rtl:border-r border-dashed border-gray-100 dark:border-[#172036]"></span>

          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[132px] rtl:md:pr-[132px] mb-[25px] md:mb-[30px] last:mb-0"
            >
              <span
                className={`block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[93px] rtl:md:right-[93px] w-[12px] h-[12px] rounded-full ${activity.color}`}
              ></span>
              <span className="md:absolute md:top-0 ltr:md:left-[5px] rtl:md:right-[5px] text-sm block mb-[10px] md:mb-0">
                {activity.timestamp}
              </span>
              <span className="mb-[10px] block text-black dark:text-white font-medium">
                {activity.title}
              </span>
              <p className="md:max-w-[500px] text-sm leading-[1.7] mb-[11px]">
                {activity.description}
              </p>
              <span className="block text-sm">
                By: <span className="text-primary-500">{activity.author}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
