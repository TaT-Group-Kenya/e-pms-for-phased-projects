"use client";

import React from "react";
import Image from "next/image";

const Prescriptions: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex justify-between">
            <div>
              <h4 className="!mb-[7px] !text-[20px] !font-semibold">
                Dr. Walter White
              </h4>
              <span className="block md:text-md mt-[5px]">
                MBBS, MD, MS (Reg No: 321456)
              </span>
              <span className="block md:text-md mt-[5px] text-black dark:text-white">
                Mobile No: +321 4567 5643
              </span>
            </div>

            <div className="mt-[20px] sm:mt-0">
              <Image
                src="/images/logo.svg"
                alt="logo"
                className="mb-[10px] dark:hidden"
                width={100}
                height={26}
              />
              <Image
                src="/images/white-logo.svg"
                alt="logo"
                className="mb-[10px] hidden dark:block"
                width={100}
                height={26}
              />
              <span className="block md:text-md mt-[5px]">
                S. Arrowhead Court Branford9
              </span>
              <span className="block md:text-md mt-[5px]">+1 444 266 5599</span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] -mx-[20px] md:-mx-[25px] my-[20px] md:my-[23px]"></div>

          <Image
            src="/images/bar-code.svg"
            className="dark:invert"
            alt="bar-code"
            width={145}
            height={47}
          />

          <div className="sm:flex justify-between mt-[20px]">
            <ul className="mb-[7px] sm:mb-0">
              <li className="mb-[7px] last:mb-0">
                ID: <span className="text-black dark:text-white">321456</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Name:{" "}
                <span className="text-black dark:text-white">Jane Ronan</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Address:{" "}
                <span className="text-black dark:text-white">Bradford, UK</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Temperature(Farenhite):{" "}
                <span className="text-black dark:text-white">101 degree</span>
              </li>
              <li className="mb-[7px] last:mb-0">
                Blood Pressure:{" "}
                <span className="text-black dark:text-white">85/123</span>
              </li>
            </ul>
            <span className="block text-black dark:text-white font-semibold">
              Date: 07 November, 2025
            </span>
          </div>

          <span className="block font-semibold text-black dark:text-white text-[20px] mt-[20px] md:mt-[30px] lg:mt-[40px] xl:mt-[50px]">
            R
          </span>

          <div className="-mx-[20px] md:-mx-[25px]">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Medicine Name
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Dosage
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Duration
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1. Tab. Ibuprofen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Night
                      <span className="block text-xs font-normal mt-[5px] text-gray-500 dark:text-gray-400">
                        (Before Food)
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                      <span className="block text-xs font-normal mt-[5px] text-gray-500 dark:text-gray-400">
                        (Total 20 Tablets)
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      2. Cap. Acetaminophen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Midday - 1 Night
                      <span className="block text-xs font-normal mt-[5px] text-gray-500 dark:text-gray-400">
                        (After Food)
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                      <span className="block text-xs font-normal mt-[5px] text-gray-500 dark:text-gray-400">
                        (Total 20 Tablets)
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      3. Tab. Naproxen
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      1 Morning - 1 Night
                      <span className="block text-xs font-normal mt-[5px] text-gray-500 dark:text-gray-400">
                        (After Food)
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top font-semibold whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px]">
                      10 Days
                      <span className="block text-xs font-normal mt-[5px] text-gray-500 dark:text-gray-400">
                        (Total 20 Tablets)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] -mx-[20px] md:-mx-[25px] lg:mt-[32px]"></div>

          <span className="block font-semibold text-black dark:text-white mt-[20px] md:mt-[25px]">
            Advice Given:
          </span>

          <ul className="mt-[7px]">
            <li className="relative ltr:pl-[15px]">
              <span className="w-[7px] h-[7px] bg-gray-400 dark:bg-gray-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 rounded-full"></span>
              Avoid oily and spicy food.
            </li>
          </ul>

          <div className="max-w-[255px] ltr:pr-[25px] rtl:pl-[25px] ltr:md:ml-auto rtl:md:mr-auto mt-[20px] md:mt-[25px]">
            <div className="text-center mb-[15px] md:mb-[20px] pb-[5px] border-b border-gray-100 dark:border-[#15203c]">
              <Image
                src="/images/signature.svg"
                className="inline-block dark:invert"
                alt="signature"
                width={77}
                height={38}
              />
            </div>

            <span className="block text-black dark:text-white font-semibold">
              Dr. Walter White
            </span>

            <span className="block text-xs mt-[5px]">
              MBBS, MD, MS (Reg No: 321456)
            </span>
          </div>

          <div className="mt-[20px] md:mt-[25px] lg:mt-[35px] xl:mt-[50px] text-center md:pb-[25px] lg:pb-[50px]">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400 mx-[8px]"
            >
              Print
            </button>

            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 mx-[8px]"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  download
                </i>
                Download
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescriptions;
