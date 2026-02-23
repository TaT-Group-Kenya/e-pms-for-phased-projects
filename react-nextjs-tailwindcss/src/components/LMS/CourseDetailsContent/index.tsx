"use client";

import React from "react";
import Image from "next/image"; 
import CourseInstructor from "./CourseInstructor";
import EnrolledStudents from "./EnrolledStudents";
import OverallReviews from "./OverallReviews";
import ManageReviews from "./ManageReviews";

const CourseDetailsContent: React.FC = () => {
  // Initialize openIndex to 0 to open the first item by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Course</h5>
          </div>
        </div>
        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Course Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Category
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Instructor
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Enrolled
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    End Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Price
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                <tr>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      #854
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <div className="inline-block font-medium transition-all text-gray-500 dark:text-gray-400 hover:text-primary-500">
                      Cybersecurity Awareness
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    Technology
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center">
                      <div className="rounded-full w-[40px]">
                        <Image
                          src="/images/users/user6.jpg"
                          className="inline-block rounded-full"
                          alt="user-image"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ltr:ml-[12px] rtl:mr-[12px]">
                        <span className="block font-medium">Oliver Khan</span>
                      </div>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      180
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      25 Mar 2024
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      25 Apr 2024
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-500 dark:text-gray-400">
                      $49.99
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                    >
                      <i className="material-symbols-outlined !text-md">edit</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Tables Of Content</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="lg:grid lg:grid-cols-3 gap-[25px] items-center">
            <div className="lg:col-span-2">
              <div className="2xl:ltr:pr-[120px] 2xl:rtl:pl-[120px]">
                <div className="toc-accordion" id="tablesOfContentAccordion">
                  <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[10px] last:mb-0">
                    <button
                      className={`toc-accordion-button open text-base md:text-[15px] py-[19px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-semibold relative ${
                        openIndex === 0 ? "open" : ""
                      }`}
                      type="button"
                      onClick={() => toggleAccordion(0)}
                    >
                      Introduction to Cybersecurity
                      <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
                    </button>

                    <div
                      className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[18px] ${
                        openIndex === 0 ? "open" : "hidden"
                      }`}
                    >
                      <ul>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              info
                            </i>
                            Course Introduction
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 24s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              play_circle
                            </i>
                            Cyber Security Introduction
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            0m 46s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              list
                            </i>
                            What is Cyber Security and the CIA Triad
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            3m 32s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Threat Actors: Who are They?
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 2s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              hotel_class
                            </i>
                            Types of Threat Actors
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 13s
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[10px] last:mb-0">
                    <button
                      className={`toc-accordion-button open text-base md:text-[15px] py-[19px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-semibold relative ${
                        openIndex === 1 ? "open" : ""
                      }`}
                      type="button"
                      onClick={() => toggleAccordion(1)}
                    >
                      Secure Networking
                      <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
                    </button>
                    <div
                      className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[18px] ${
                        openIndex === 1 ? "open" : "hidden"
                      }`}
                    >
                      <ul>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              info
                            </i>
                            Network Security Introduction
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 24s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              play_circle
                            </i>
                            Introduction to Wired and Wireless Networks
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 13s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              list
                            </i>
                            Wired Network Vulnerabilities and How to Protect
                            Wired Networks
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            3m 32s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Wireless Network Vulnerabilities and How to Protect
                            Wireless Networks
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 2s
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[10px] last:mb-0">
                    <button
                      className={`toc-accordion-button open text-base md:text-[15px] py-[19px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-semibold relative ${
                        openIndex === 2 ? "open" : ""
                      }`}
                      type="button"
                      onClick={() => toggleAccordion(2)}
                    >
                      Secure E-Mail
                      <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
                    </button>

                    <div
                      className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[18px] ${
                        openIndex === 2 ? "open" : "hidden"
                      }`}
                    >
                      <ul>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              info
                            </i>
                            E-Mail Security Introduction
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 24s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              play_circle
                            </i>
                            E-Mail: Overview and Importance
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 13s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              list
                            </i>
                            Phishing: Techniques, Implications and How to Spot
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            3m 32s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Understanding E-Mail Headers for Verification
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 2s
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[10px] last:mb-0">
                    <button
                      className={`toc-accordion-button open text-base md:text-[15px] py-[19px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-semibold relative ${
                        openIndex === 3 ? "open" : ""
                      }`}
                      type="button"
                      onClick={() => toggleAccordion(3)}
                    >
                      Secure Internet Browsing
                      <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
                    </button>
                    <div
                      className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[18px] ${
                        openIndex === 3 ? "open" : "hidden"
                      }`}
                    >
                      <ul>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              info
                            </i>
                            Internet Security Introduction
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 24s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              play_circle
                            </i>
                            Exploring Web-Based Threats
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            0m 46s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              list
                            </i>
                            Typo Squatting: Risks and Mitigation
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            3m 32s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Watering Hole Attacks: Tactics and Countermeasures
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 2s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Secure Browsing Best Practices
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 13s
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[10px] last:mb-0">
                    <button
                      className={`toc-accordion-button open text-base md:text-[15px] py-[19px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-semibold relative ${
                        openIndex === 4 ? "open" : ""
                      }`}
                      type="button"
                      onClick={() => toggleAccordion(4)}
                    >
                      Device Security & Password Management
                      <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
                    </button>

                    <div
                      className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[18px] ${
                        openIndex === 4 ? "open" : "hidden"
                      }`}
                    >
                      <ul>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              info
                            </i>
                            Device Security Introduction
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 24s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              play_circle
                            </i>
                            Securing Computers, Laptops, and Mobile Devices
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 13s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              list
                            </i>
                            Password Best Practices
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            3m 32s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Multi-Factor Authentication (MFA)
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 2s
                          </span>
                        </li>
                        <li className="border-b border-gray-100 sm:flex items-center justify-between py-[12px] md:py-[15px] dark:border-[#1c2846] first:pt-0 last:border-0 last:pb-0">
                          <a
                            href="javascript:void(0);"
                            className="relative inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500 ltr:pl-[27px] rtl:pr-[27px]"
                          >
                            <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-[20px] -mt-[.5px] text-primary-500 top-1/2 -translate-y-1/2">
                              star
                            </i>
                            Keeping Devices Up-to-Date
                          </a>
                          <span className="block text-gray-500 dark:text-gray-400 mt-[10px] sm:mt-0">
                            2m 13s
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-primary-500 rounded-md text-center py-[30px] md:py-[50px] px-[20px] md:px-[30px] 2xl:ltr:-ml-[30px] 2xl:rtl:-mr-[30px] 2xl:ltr:mr-[85px] 2xl:rtl:ml-[85px] mt-[20px] md:mt-[25px] lg:mt-0">
                <h4 className="!mb-[10px] !text-white !text-lg md:!text-[21px]">
                  Unlock Library
                </h4>

                <p className="mb-[20px] text-[#e3eaef]">
                  Get access to all videos in the library
                </p>

                <a
                  href="/authentication/sign-up"
                  className="inline-block rounded-md font-medium md:text-md py-[11px] md:py-[13px] px-[22px] mb-[15px] text-white bg-[#ffffff14] transition-all hover:bg-white hover:text-black"
                >
                  Sign Up - Only $120/mo
                </a>

                <p className="mb-[20px] text-[#e3eaef]">
                  Have an account?{" "}
                  <a href="/authentication/sign-in" className="text-white">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <CourseInstructor />
        </div>

        <div className="lg:col-span-2">
          <EnrolledStudents />
        </div>
      </div>

      <OverallReviews />

      <ManageReviews />
    </>
  );
};

export default CourseDetailsContent;
