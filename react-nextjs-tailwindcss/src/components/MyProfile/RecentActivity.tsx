"use client";

import React from "react"; 

const RecentActivity: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Activity</h5>
          </div>
        </div>
        <div className="trezo-card-content pt-[10px] pb-[25px]">
          <div className="relative">
            <span className="block absolute top-0 bottom-0 ltr:left-[6px] rtl:right-[6px] ltr:md:left-[98px] rtl:md:right-[98px] mt-[5px] ltr:border-l rtl:border-r border-dashed border-gray-100 dark:border-[#172036]"></span>
            <div className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[132px] rtl:md:pr-[132px] mb-[25px] md:mb-[30px] last:mb-0">
              <span className="block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[93px] rtl:md:right-[93px] w-[12px] h-[12px] rounded-full bg-success-500"></span>
              <span className="md:absolute md:top-0 ltr:md:left-[5px] rtl:md:right-[5px] text-sm block mb-[10px] md:mb-0">
                Just now
              </span>
              <span className="mb-[10px] block text-black dark:text-white font-medium">
                Weekly Stand-Up Meetings:
              </span>
              <p className="md:max-w-[500px] text-sm leading-[1.7] mb-[11px]">
                We continued our weekly stand-up meetings where team members
                provided updates on their current tasks, discussed any
                roadblocks, and coordinated efforts for the week ahead.
              </p>
              <span className="block text-sm">
                By:
                <span className="text-primary-500">Olivia Rodriguez</span>
              </span>
            </div>
            
            <div className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[132px] rtl:md:pr-[132px] mb-[25px] md:mb-[30px] last:mb-0">
              <span className="block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[93px] rtl:md:right-[93px] w-[12px] h-[12px] rounded-full bg-orange-500"></span>
              <span className="md:absolute md:top-0 ltr:md:left-[5px] rtl:md:right-[5px] text-sm block mb-[10px] md:mb-0">
                1 day ago
              </span>
              <span className="mb-[10px] block text-black dark:text-white font-medium">
                Project Kickoff Session:
              </span>
              <p className="md:max-w-[500px] text-sm leading-[1.7] mb-[11px]">
                The session included introductions, a review of project goals
                and objectives, and initial planning discussions.
              </p>
              <span className="block text-sm">
                By:
                <span className="text-primary-500">Isabella Cooper</span>
              </span>
            </div>

            <div className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[132px] rtl:md:pr-[132px] mb-[25px] md:mb-[30px] last:mb-0">
              <span className="block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[93px] rtl:md:right-[93px] w-[12px] h-[12px] rounded-full bg-purple-500"></span>
              <span className="md:absolute md:top-0 ltr:md:left-[5px] rtl:md:right-[5px] text-sm block mb-[10px] md:mb-0">
                2 days ago
              </span>
              <span className="mb-[10px] block text-black dark:text-white font-medium">
                Team Building Workshop:
              </span>
              <p className="md:max-w-[500px] text-sm leading-[1.7] mb-[11px]">
                Last Friday, we conducted a team building workshop focused on
                improving communication and collaboration among team members.
                Activities included team challenges, icebreakers, and open
                discussions.
              </p>
              <span className="block text-sm">
                By:
                <span className="text-primary-500">Lucas Morgan</span>
              </span>
            </div>
            
            <div className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[132px] rtl:md:pr-[132px] mb-[25px] md:mb-[30px] last:mb-0">
              <span className="block absolute top-[3px] ltr:left-0 rtl:right-0 ltr:md:left-[93px] rtl:md:right-[93px] w-[12px] h-[12px] rounded-full bg-secondary-500"></span>
              <span className="md:absolute md:top-0 ltr:md:left-[5px] rtl:md:right-[5px] text-sm block mb-[10px] md:mb-0">
                3 days ago
              </span>
              <span className="mb-[10px] block text-black dark:text-white font-medium">
                Lunch and Learn Session:
              </span>
              <p className="md:max-w-[500px] text-sm leading-[1.7] mb-[11px]">
                We organized a lunch and learn session on March 15th where a
                guest speaker from the industry discussed emerging trends in our
                field. It was an insightful session that sparked valuable
                discussions among team members.
              </p>
              <span className="block text-sm">
                By:
                <span className="text-primary-500">Ethan Parker</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentActivity;
