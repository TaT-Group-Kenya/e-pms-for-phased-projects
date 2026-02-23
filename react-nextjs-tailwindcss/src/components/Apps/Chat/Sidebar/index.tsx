"use client";

import React, { useState } from "react";
import Image from "next/image";

const Sidebar: React.FC = () => {
  // Tabs
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-md !font-medium">Messages</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <form className="relative mb-[20px]">
            <label className="absolute ltr:left-[13px] rtl:right-[13px] mt-[2px] text-black dark:text-white top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-lg">search</i>
            </label>
            <input
              type="text"
              className="block w-full rounded-md text-black dark:text-white bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] focus:border-primary-500 h-[40px] outline-0 transition-all text-xs placeholder:text-gray-500 dark:placeholder:text-gray-400 ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[15px] rtl:pl-[15px]"
              placeholder="Search"
            />
          </form>

          <div className="trezo-tabs" id="trezo-tabs">
            {/* Tabs navs */}
            <ul className="chat-sidebar-navs flex border-b border-gray-100 dark:border-[#172036]">
              <li className="nav-item ltr:mr-[19px] rtl:ml-[19px] xl:ltr:mr-[30px] xl:rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handleTabClick(0)}
                  className={`nav-link font-medium relative pb-[8px] transition-all ${
                    activeTab === 0 ? "active" : ""
                  }`}
                >
                  All Message
                </button>
              </li>
              <li className="nav-item ltr:mr-[19px] rtl:ml-[19px] xl:ltr:mr-[30px] xl:rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handleTabClick(1)}
                  className={`nav-link font-medium relative pb-[8px] transition-all ${
                    activeTab === 1 ? "active" : ""
                  }`}
                >
                  Group Chat
                </button>
              </li>
              <li className="nav-item ltr:mr-[19px] rtl:ml-[19px] xl:ltr:mr-[30px] xl:rtl:ml-[30px] ltr:last:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handleTabClick(2)}
                  className={`nav-link font-medium relative pb-[8px] transition-all ${
                    activeTab === 2 ? "active" : ""
                  }`}
                >
                  Contacts
                </button>
              </li>
            </ul>
            
            {/* Tabs Content */}
            <div className="chat-sidebar-tab-content">
              {activeTab === 0 && (
                <div className="ltr:-mr-[20px] rtl:-ml-[20px] md:ltr:-mr-[25px] md:rtl:-ml-[25px]">
                  <div className="chat-users-list overflow-y-scroll h-[476px] md:h-[559px] lg:h-[720px] xl:h-[820px] ltr:pr-[20px] rtl:pl-[20px] md:ltr:pr-[25px] md:rtl:pl-[25px] pt-[20px]">
                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user31.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Sarah Smith
                          </span>
                          <span className="text-success-600 block text-xs mt-[2px]">
                            Typing...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">Just Now</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user6.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Michael Johnson
                          </span>
                          <span className="block text-xs mt-[2px] relative ltr:pl-[16px] rtl:pr-[16px]">
                            <i className="ri-file-text-line ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 -mt-[.5px]"></i>
                            Attachment...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">10:20 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user7.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Emily Brown
                          </span>
                          <span className="block text-xs mt-[2px] relative ltr:pl-[16px] rtl:pr-[16px]">
                            <i className="ri-mic-line ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 -mt-[.5px]"></i>
                            Voice message
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">9:30 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user8.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            David Martinez
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Excellent work...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">3:20 PM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user9.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Jessica Taylor
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Hello! Mr.. 🔥
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">12:00 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user10.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Christopher Lee
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Very good...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">8:30 PM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user11.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Amanda Rodriguez
                          </span>
                          <span className="block text-xs mt-[2px]">
                            That’s cool...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">2:20 PM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user12.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Daniel Garcia
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Good morning!😀
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">10:00 PM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user13.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Jennifer Thomas
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Hi John!
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">11:10 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user14.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Elizabeth Clark
                          </span>
                          <span className="text-success-600 block text-xs mt-[2px]">
                            Sounds good...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">12:30 PM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user15.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            William Lewis
                          </span>
                          <span className="block text-xs mt-[2px]">
                            How are you?😐
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">11:20 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user16.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Michelle King
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Good evening!
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">10:40 PM</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="ltr:-mr-[20px] rtl:-ml-[20px] md:ltr:-mr-[25px] md:rtl:-ml-[25px]">
                  <div className="mt-[20px] ltr:pr-[20p] rtl:pl-[20px] ltr:md:pr-[25px] rtl:md:pl-[20px]">
                    <button
                      type="button"
                      className="block w-full text-center py-[11.8px] px-[22px] text-white bg-primary-500 transition-all text-md font-medium hover:bg-primary-400"
                    >
                      + Create New Group
                    </button>
                  </div>

                  <div className="chat-users-list overflow-y-scroll h-[476px] md:h-[559px] lg:h-[720px] xl:h-[820px] ltr:pr-[20px] rtl:pl-[20px] md:ltr:pr-[25px] md:rtl:pl-[25px] pt-[20px]">
                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/products/product1.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            UI/UX Designer Group
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Divan: Sure I’ll submit the file...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">Just Now</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/products/product2.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Web Development Group
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Divan:{" "}
                            <span className="text-success-600">Typing...</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">10:20 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/products/product3.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Discussion Group
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Divan: Great ! 🔥
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">9:30 AM</span>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/products/product4.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Design Group
                          </span>
                          <span className="block text-xs mt-[2px]">
                            Olivia: Hello! Mr..
                          </span>
                        </div>
                      </div>
                      <span className="text-xs block">12:00 AM</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="ltr:-mr-[20px] rtl:-ml-[20px] md:ltr:-mr-[25px] md:rtl:-ml-[25px]">
                  <div className="chat-users-list overflow-y-scroll h-[476px] md:h-[559px] lg:h-[720px] xl:h-[820px] ltr:pr-[20px] rtl:pl-[20px] md:ltr:pr-[25px] md:rtl:pl-[25px] pt-[20px]">
                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user31.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Sarah Smith
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user6.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Michael Johnson
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user7.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Emily Brown
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user8.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            David Martinez
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user9.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Jessica Taylor
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user10.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Christopher Lee
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user11.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Amanda Rodriguez
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user12.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-success-500 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Daniel Garcia
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user13.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Jennifer Thomas
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user14.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Elizabeth Clark
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user15.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            William Lewis
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-[13.5px] pb-[13.5px] border-b border-gray-100 dark:border-[#172036] last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center">
                        <div className="relative ltr:mr-[10px] rtl:ml-[10px]">
                          <Image
                            src="/images/users/user16.jpg"
                            alt="user-image"
                            className="rounded-full w-[35px]"
                            width={35}
                            height={35}
                          />
                          <span className="absolute ltr:right-0 rtl:left-0 bottom-0 w-[10px] h-[10px] rounded-full bg-orange-400 border-[2px] border-white dark:border-[#0c1427]"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-black dark:text-white">
                            Michelle King
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
