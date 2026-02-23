"use client";

import React from "react";
import Image from "next/image"; 

const CourseInstructor: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Course Instructor</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="flex items-center">
            <Image
              src="/images/users/user7.jpg"
              alt="user-image"
              className="rounded-full w-[100px]"
              width={100}
              height={100}
            />
            <div className="ltr:ml-[15px] rtl:mr-[15px]">
              <span className="block text-black dark:text-white text-[17px] mb-[2px] font-medium">
                Aliva Cohen
              </span>
              <span className="block">aliva@trezo.com</span>
            </div>
          </div>
          <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
            Course Description
          </span>
          <p>
            This course is designed for beginners who want to learn the
            fundamentals of the Python programming language. The course covers
            basic syntax, data types, control structures, and an introduction to
            object-oriented programming. Participants will have hands-on coding
            exercises to reinforce their learning.
          </p>
          <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
            Course Schedule
          </span>
          <p>
            Start Date: 01 August 2024
            <br />
            End Date: 30 December 2024
          </p>
          <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
            Status
          </span>
          <p>
            The course is currently in progress. Students are actively engaged
            in the learning materials, and the instructor is providing guidance
            and support.
          </p>
        </div>
      </div>
    </>
  );
};

export default CourseInstructor;
