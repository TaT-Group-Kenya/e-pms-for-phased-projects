"use client";

import React from "react";
import RecentActivity from "./RecentActivity";
import ProjectRoadmap from "./ProjectRoadmap";
import ProjectOverview from "./ProjectOverview";
import TeamMembers from "./TeamMembers";
import ToDoList from "./ToDoList";
import TasksOverview from "./TasksOverview";

const ProjectOverviewContent: React.FC = () => {
  return (
    <>
      <div className="lg:grid xl:grid-cols-2 gap-[25px]">
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Shopify Theme Development</h5>
              </div>
            </div>

            <div className="trezo-card-content">
              <div className="bg-primary-500 rounded-md mb-[12px] pt-[20px] md:pt-[25px] px-[20px] md:px-[25px] pb-[18px]">
                <div className="md:flex items-center justify-between">
                  <div className="flex items-center mt-[15px] first:mt-0 md:mt-0">
                    <div className="w-[45px] h-[45px] rounded-full bg-primary-600 text-white flex items-center justify-center">
                      <i className="material-symbols-outlined">for_you</i>
                    </div>
                    <div className="ltr:ml-[12px] rtl:mr-[12px]">
                      <span className="block text-white">Client</span>
                      <span className="font-semibold text-white block text-md">
                        Innovatech
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mt-[15px] first:mt-0 md:mt-0">
                    <div className="w-[45px] h-[45px] rounded-full bg-primary-600 text-white flex items-center justify-center">
                      <i className="material-symbols-outlined">attach_money</i>
                    </div>
                    <div className="ltr:ml-[12px] rtl:mr-[12px]">
                      <span className="block text-white">Budget</span>
                      <span className="font-semibold text-white block text-md">
                        $25,500
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mt-[15px] first:mt-0 md:mt-0">
                    <div className="w-[45px] h-[45px] rounded-full bg-primary-600 text-white flex items-center justify-center">
                      <i className="material-symbols-outlined">pace</i>
                    </div>
                    <div className="ltr:ml-[12px] rtl:mr-[12px]">
                      <span className="block text-white">Duration</span>
                      <span className="font-semibold text-white block text-md">
                        360 hrs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full h-[7px] overflow-hidden rounded-md bg-gray-200 mt-[20px] mb-[8px]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-orange-400 rounded-md"
                    style={{ width: "60%" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="block text-white">Progress</span>
                  <span className="block text-white">60%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="block">Project Started: 01 Mar 2024</span>
                <span className="block">Project Deadline: 25 Jun 2024</span>
              </div>

              <span className="block text-black dark:text-white mb-[8px] mt-[20px] font-bold">
                Project Details
              </span>

              <p className="leading-[1.7]">
                Vestibulum euismod nisi vitae orci placerat, vitae vehicula eros
                dictum. Phasellus ut pharetra felis. Nulla facilisi. Nullam
                congue semper nunc, at sodales magna laoreet id. Nullam et lacus
                vitae ligula pretium suscipit. Fusce nec viverra enim. Sed
                feugiat gravida nibh sit amet suscipit. Integer tempor sapien
                eget metus lacinia, nec finibus lacus tincidunt. Sed sodales
                tellus nec metus aliquam, nec dignissim arcu lobortis.
              </p>

              <ul className="list-disc ltr:pl-[22px] rtl:pr-[22px]">
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  Outline the boundaries and deliverables of the project.
                </li>
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  List team members, their roles, and responsibilities.
                </li>
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  Specify the technology stack and tools to be used for
                  development.
                </li>
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  Break down the project into manageable phases or sprints.
                </li>
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  Outline the design phase, including wireframing, prototyping
                </li>
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  Outline the boundaries and deliverables of the project.
                </li>
                <li className="leading-[1.7] mb-[4px] last:mb-0">
                  Specify the technology stack and tools to be used for
                  development.
                </li>
              </ul>
            </div>
          </div>

          {/* RecentActivity */}
          <RecentActivity />
        </div>

        <div>
          <ProjectRoadmap />

          <ProjectOverview />

          <TeamMembers />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <ToDoList />
        </div>

        <div className="lg:col-span-1">
          <TasksOverview />
        </div>
      </div>
    </>
  );
};

export default ProjectOverviewContent;
