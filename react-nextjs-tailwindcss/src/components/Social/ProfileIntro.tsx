"use client";

import React from "react";
import Image from "next/image"; 

const ProfileIntro: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Profile Intro</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="flex items-center">
            <Image
              src="/images/profile.jpg"
              alt="user-image"
              className="rounded-full w-[75px]"
              width={75}
              height={75}
            />
            <div className="ltr:ml-[15px] rtl:mr-[15px]">
              <span className="block text-black dark:text-white text-[17px] font-semibold">
                Alice Johnson
              </span>
              <span className="block">johnson@trezo.com</span>
            </div>
          </div>

          <span className="text-black dark:text-white font-semibold block mb-[5px] mt-[16px]">
            About Me
          </span>

          <p>
            Molestie tincidunt ut consequat a urna tortor. Vitae velit ac nisl
            velit mauris placerat nisi placerat. Pellentesque viverra lorem
            malesuada nunc tristique sapien. Imperdiet sit hendrerit tincidunt
            bibendum donec adipiscing.
          </p>

          <span className="text-black dark:text-white font-semibold block mb-[11px]">
            Social Profile
          </span>

          <div className="flex items-center gap-[7px]">
            <a
              href="#"
              className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#3a559f]"
              target="_blank"
            >
              <i className="ri-facebook-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
            </a>
            <a
              href="#"
              className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#03a9f4]"
              target="_blank"
            >
              <i className="ri-twitter-x-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
            </a>
            <a
              href="#"
              className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#007ab9]"
              target="_blank"
            >
              <i className="ri-linkedin-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
            </a>
            <a
              href="#"
              className="inline-block relative text-center rounded-full w-[28px] h-[28px] text-white bg-[#2196f3]"
              target="_blank"
            >
              <i className="ri-mail-fill absolute left-0 right-0 top-1/2 -translate-y-1/2"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileIntro;
