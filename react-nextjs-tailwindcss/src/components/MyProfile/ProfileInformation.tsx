"use client";

import React from "react"; 

const ProfileInformation: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Profile Information</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <ul>
            <li className="mb-[12.5px] last:mb-0">
              User ID:
              <span className="text-black dark:text-white font-medium">
                7001
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Full Name:
              <span className="text-black dark:text-white font-medium">
                Olivia John
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Email:
              <span className="text-black dark:text-white font-medium">
                olivia@trezo.com
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Role:
              <span className="text-black dark:text-white font-medium">
                Administrator
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Location:
              <span className="text-black dark:text-white font-medium">
                New York, USA
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Join Date:
              <span className="text-black dark:text-white font-medium">
                10 May 2022
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileInformation;
