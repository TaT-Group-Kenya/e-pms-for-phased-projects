"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-primary-600 mb-[25px] p-[20px] md:p-[25px] rounded-md relative z-[1]">
        <div className="trezo-card-content">
          <div className="sm:grid sm:grid-cols-5 gap-[25px]">
            <div className="sm:col-span-3">
              <h3 className="!text-[20px] !mb-[2px] !text-white">
                Hi, <span className="text-orange-100">Dr. Olivia!</span>
              </h3>

              <p className="text-white">Your schedule today</p>

              <div className="info flex items-center mt-[20px] sm:mt-[60px] md:mt-[76px]">
                <div className="flex items-center ltr:mr-[30px] rtl:ml-[30px] ltr:last:mr-0] rtl:last:ml-0">
                  <div className="bg-orange-100 text-orange-500 flex items-center justify-center rounded-md w-[42px] h-[42px] ltr:mr-[12px] rtl:ml-[12px]">
                    <i className="material-symbols-outlined">airplay</i>
                  </div>
                  <div>
                    <span className="block text-lg text-white font-semibold">
                      320
                    </span>
                    <span className="block text-gray-200">Patients</span>
                  </div>
                </div>

                <div className="flex items-center ltr:mr-[30px] rtl:ml-[30px] ltr:last:mr-0] rtl:last:ml-0">
                  <div className="bg-purple-100 text-purple-500 flex items-center justify-center rounded-md w-[42px] h-[42px] ltr:mr-[12px] rtl:ml-[12px]">
                    <i className="material-symbols-outlined">local_library</i>
                  </div>
                  <div>
                    <span className="block text-lg text-white font-semibold">
                      18
                    </span>
                    <span className="block text-gray-200">Surgeries</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-center mt-[20px] sm:mt-0">
                <Image
                  src="/images/female-doctor.png"
                  className="inline-block"
                  alt="female-doctor"
                  width={152}
                  height={173}
                />
              </div>
            </div>
          </div>
        </div>

        <Image
          src="/images/vector1.png"
          className="absolute ltr:right-0 rtl:left-0 -z-[1] top-0"
          alt="vector-image"
          width={147}
          height={89}
        />
        <Image
          src="/images/vector2.png"
          className="absolute ltr:right-0 rtl:left-0 -z-[1] bottom-0"
          alt="vector-image"
          width={170}
          height={84}
        />
      </div>
    </>
  );
};

export default Welcome;
