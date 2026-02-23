"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card mb-[25px] p-[20px] md:p-[25px] rounded-md"
        style={{
          background: "linear-gradient(81deg, #605DFF 3.39%, #9747FF 93.3%)",
        }}
      >
        <div className="trezo-card-content relative sm:ltr:pr-[250px] sm:rtl:pl-[250px]">
          <div className="md:py-[25px]">
            <h5 className="!mb-[5px] md:!mb-px !font-semibold !text-white">
              Welcome Back, <span className="text-orange-100">Olivia!</span>
            </h5>

            <p className="text-white">Your progress this week is Awesome.</p>

            <div className="md:mt-[35px] md:flex items-center">
              <div className="mt-[20px] md:mt-0 flex items-center md:ltr:mr-[35px] md:rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
                <div className="w-[42px] h-[42px] ltr:mr-[12px] rtl:ml-[12px] bg-danger-200 text-danger-500 rounded-md flex items-center justify-center">
                  <i className="material-symbols-outlined">airplay</i>
                </div>
                <div>
                  <span className="block font-semibold text-white text-md">
                    75h
                  </span>
                  <span className="block text-gray-200">Hours Spent</span>
                </div>
              </div>

              <div className="mt-[20px] md:mt-0 flex items-center md:ltr:mr-[35px] md:rtl:ml-[35px] ltr:last:mr-0 rtl:last:ml-0">
                <div className="w-[42px] h-[42px] ltr:mr-[12px] rtl:ml-[12px] bg-success-100 text-success-600 rounded-md flex items-center justify-center">
                  <i className="material-symbols-outlined">local_library</i>
                </div>
                <div>
                  <span className="block font-semibold text-white text-md">
                    15
                  </span>
                  <span className="block text-gray-200">Courses Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:ltr:-right-[15px] sm:rtl:-left-[15px] sm:-mt-[8px] sm:max-w-[285px]">
            <Image
              src="/images/online-learning.gif"
              alt="online-learning-image"
              width={290}
              height={222}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
