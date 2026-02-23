"use client";

import React from "react";
import Image from "next/image";

const PatientDetails: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-content">
              <div className="flex items-center gap-[20px] mb-[20px] md:mb-[25px]">
                <Image
                  src="/images/patient.jpg"
                  alt="patient-image"
                  className="rounded-full w-[100px]"
                  width={100}
                  height={100}
                />
                <div>
                  <h4 className="!text-[20px] !mb-[6px]">Walter White</h4>
                  <span className="block">
                    Patient ID:{" "}
                    <span className="text-black dark:text-white">#P-3214</span>
                  </span>
                </div>
              </div>
              <h3 className="!text-lg !mb-[15px]">Personal Information</h3>
              <ul>
                <li className="mb-[12px] last:mb-0">
                  Occupation:{" "}
                  <span className="text-black dark:text-white">Teacher</span>
                </li>
                <li className="mb-[12px] last:mb-0">
                  Age:{" "}
                  <span className="text-black dark:text-white">65 Years</span>
                </li>
                <li className="mb-[12px] last:mb-0">
                  Admitted On:{" "}
                  <span className="text-black dark:text-white">
                    21 October, 2025
                  </span>
                </li>
                <li className="mb-[12px] last:mb-0">
                  Bed No:{" "}
                  <span className="text-black dark:text-white">L2 - 205</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-content flex items-center gap-[15px]">
              <Image
                src="/images/icons/email.svg"
                alt="email"
                width={40}
                height={40}
              />
              <div>
                <span className="block">Email</span>
                <h5 className="!mb-0 !font-semibold !text-md !mt-[4px]">
                  walter32@gmail.com
                </h5>
              </div>
            </div>
          </div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-content flex items-center gap-[15px]">
              <Image
                src="/images/icons/call9.svg"
                alt="call"
                width={40}
                height={40}
              />
              <div>
                <span className="block">Phone No</span>
                <h5 className="!mb-0 !font-semibold !text-md !mt-[4px]">
                  +1 444 266 5599
                </h5>
              </div>
            </div>
          </div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content flex items-center gap-[15px]">
              <Image
                src="/images/icons/map.svg"
                alt="map"
                width={40}
                height={40}
              />
              <div>
                <span className="block">Address</span>
                <h5 className="!mb-0 !font-semibold !text-md !mt-[4px]">
                  S. Arrowhead Court Branford9
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-content">
              <h3 className="!text-lg !mb-[15px] !mt-[20px] md:!mt-[25px] first:!mt-0">
                Disease History
              </h3>
              <p>
                Molestie tincidunt ut consequat a urna tortor. Vitae velit ac
                nisl velit mauris placerat nisi placerat. Pellentesque viverra
                lorem malesuada nunc tristique sapien. Imperdiet sit hendrerit
                tincidunt bibendum donec adipiscing.
              </p>
              <h3 className="!text-lg !mb-[15px] !mt-[20px] md:!mt-[25px] first:!mt-0">
                Key Symptoms
              </h3>
              <ul className="mt-[20px]">
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Molestie tincidunt ut consequat a urna tortor.
                </li>
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Vitae velit ac nisl velit mauris placerat nisi placerat.
                  Pellentesque viverra lorem malesuada nunc tristique sapien.
                  Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                </li>
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Ad minim veniam, quis nostrud exercitation ullamco laboris nis
                </li>
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum accusantium
                  doloremque laudantium.
                </li>
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                  fugit, sed quia consequuntur magni dolores eos qui ratione
                  voluptate.
                </li>
              </ul>
            </div>
          </div>

          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content">
              <h3 className="!text-lg !mb-[15px] !mt-[20px] md:!mt-[25px] first:!mt-0">
                Note For Patient
              </h3>
              <p>
                Molestie tincidunt ut consequat a urna tortor. Vitae velit ac
                nisl velit mauris placerat nisi placerat. Pellentesque viverra
                lorem malesuada nunc tristique sapien. Imperdiet sit hendrerit
                tincidunt bibendum donec adipiscing.
              </p>
              <h3 className="!text-lg !mb-[15px] !mt-[20px] md:!mt-[25px] first:!mt-0">
                Advice:
              </h3>
              <ul className="mt-[20px]">
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Molestie tincidunt ut consequat a urna tortor.
                </li>
                <li className="ltr:pl-[20px] rtl:pr-[20px] mb-[15px] last:mb-0 relative">
                  <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-primary-500 rounded-full"></span>
                  Vitae velit ac nisl velit mauris placerat nisi placerat.
                  Pellentesque viverra lorem malesuada nunc tristique sapien.
                  Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDetails;
