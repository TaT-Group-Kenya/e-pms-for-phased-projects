"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Chat: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <div className="flex items-center">
              <div className="relative ltr:mr-[15px] rtl:ml-[15px]">
                <Image
                  src="/images/users/user31.jpg"
                  alt="user-image"
                  className="rounded-full w-[75px]"
                  width={75}
                  height={75}
                />
                <span className="absolute bg-success-500 w-[10px] h-[10px] rounded-full border-[2px] border-white dark:border-[#0c1427] bottom-[5px] ltr:right-[5px] rtl:left-[5px]"></span>
              </div>
              <div>
                <span className="font-semibold block text-black dark:text-white text-md">
                  Sarah Smith
                </span>
                <span className="mt-[2px]">Active Now</span>
              </div>
            </div>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0 flex items-center gap-[15px]">
            <button
              type="button"
              className="inline-block transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined !text-md">call</i>
            </button>

            <button
              type="button"
              className="inline-block transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined !text-md">videocam</i>
            </button>

            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 relative -top-px leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Mute Chat", "Delete", "Block"].map((option) => (
                  <MenuItem
                    key={option}
                    as="div"
                    className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                      selectedOption === option ? "font-semibold" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="border-t border-gray-100 dark:border-[#172036] mt-[20px] mb-[18px]"></div>

          <span className="text-xs pb-[18px] block">2023-11-10 09:15 AM</span>

          <div className="chat-body h-[703px] overflow-y-scroll ltr:-mr-[25px] rtl:-ml-[25px] rotate-180">
            <ul className="flex-col-reverse flex ltr:pl-[25px] rtl:pr-[25px] justify-end">
              <li className="relative rotate-180 ltr:pl-[45px] rtl:pr-[45px] w-full md:w-[90%]">
                <Image
                  src="/images/users/user31.jpg"
                  alt="user"
                  className="rounded-full top-0 ltr:left-0 rtl:right-0 absolute"
                  width={35}
                  height={35}
                />
                <div className="ltr:text-left rtl:text-right">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md">
                      Hey Olivia, have you had a chance to check out the new
                      admin dashboard?
                    </p>
                  </div>
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md">
                      Oh, they&apos;ve got this Kanban board for task management. You
                      can drag and drop tasks between columns – it&apos;s so
                      intuitive. Makes managing tasks a breeze. 🔥
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-left rtl:text-right mb-[20px] mt-[7px]">
                  09:10 AM
                </span>
              </li>

              <li className="relative rotate-180 w-full md:w-[90%] ltr:text-right md:rtl:text-left md:ltr:mr-auto rtl:ml-auto">
                <div className="ltr:text-right rtl:text-left">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-primary-500 text-white ltr:rounded-l-md rtl:rounded-l-md">
                      Oh, you mean the one for project management?
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-right rtl:text-left mb-[20px] mt-[7px]">
                  09:20 AM
                </span>
              </li>

              <li className="relative rotate-180 ltr:pl-[45px] rtl:pr-[45px] w-full md:w-[90%]">
                <Image
                  src="/images/users/user31.jpg"
                  alt="user"
                  className="rounded-full top-0 ltr:left-0 rtl:right-0 absolute"
                  width={35}
                  height={35}
                />
                <div className="ltr:text-left rtl:text-right">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md">
                      Yeah, that&apos;s the one! It&apos;s got a sleek Material Design,
                      and the features are pretty robust.
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-left rtl:text-right mb-[20px] mt-[7px]">
                  09:20 AM
                </span>
              </li>

              <li className="relative rotate-180 w-full md:w-[90%] ltr:text-right md:rtl:text-left md:ltr:mr-auto rtl:ml-auto">
                <div className="ltr:text-right rtl:text-left">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-primary-500 text-white ltr:rounded-l-md rtl:rounded-l-md">
                      Nice! What features are you finding interesting?
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-right rtl:text-left mb-[20px] mt-[7px]">
                  09:21 AM
                </span>
              </li>

              <li className="relative rotate-180 ltr:pl-[45px] rtl:pr-[45px] w-full md:w-[90%]">
                <Image
                  src="/images/users/user31.jpg"
                  alt="user"
                  className="rounded-full top-0 ltr:left-0 rtl:right-0 absolute"
                  width={35}
                  height={35}
                />
                <div className="ltr:text-left rtl:text-right">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md">
                      Well, it has a project overview with all the key metrics
                      on the landing page – project
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-left rtl:text-right mb-[20px] mt-[7px]">
                  09:22 AM
                </span>
              </li>

              <li className="relative rotate-180 w-full md:w-[90%] ltr:text-right md:rtl:text-left md:ltr:mr-auto rtl:ml-auto">
                <div className="ltr:text-right rtl:text-left">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-primary-500 text-white ltr:rounded-l-md rtl:rounded-l-md">
                      That sounds handy. How about the task management features?
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-right rtl:text-left mb-[20px] mt-[7px]">
                  09:25 AM
                </span>
              </li>

              <li className="relative rotate-180 ltr:pl-[45px] rtl:pr-[45px] w-full md:w-[90%]">
                <Image
                  src="/images/users/user31.jpg"
                  alt="user"
                  className="rounded-full top-0 ltr:left-0 rtl:right-0 absolute"
                  width={35}
                  height={35}
                />
                <div className="ltr:text-left rtl:text-right">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-gray-50 dark:bg-[#15203c] ltr:rounded-r-md rtl:rounded-l-md">
                      Oh, they&apos;ve got this Kanban board for task management. You
                      can drag and drop tasks between columns – it&apos;s so
                      intuitive.
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-left rtl:text-right mb-[20px] mt-[7px]">
                  09:30 AM
                </span>
              </li>

              <li className="relative rotate-180 w-full md:w-[90%] ltr:text-right md:rtl:text-left md:ltr:mr-auto rtl:ml-auto">
                <div className="ltr:text-right rtl:text-left">
                  <div className="mb-[5px] last:mb-0">
                    <p className="py-[10px] px-[15px] inline-block bg-primary-500 text-white ltr:rounded-l-md rtl:rounded-l-md">
                      Sweet! What about team collaboration?
                    </p>
                  </div>
                </div>
                <span className="block text-xs ltr:text-right rtl:text-left mb-[20px] mt-[7px]">
                  09:31 AM
                </span>
              </li>
            </ul>
          </div>

          <div className="md:flex gap-[20px] rounded-md p-[20px] bg-gray-50 dark:bg-[#15203c]">
            <div className="relative flex gap-[10px] items-center top-[2px]">
              <button
                className="inline-block transition-all hover:text-primary-500"
                type="button"
              >
                <i className="material-symbols-outlined !text-md">
                  sentiment_satisfied
                </i>
              </button>
              <button
                className="inline-block transition-all hover:text-primary-500"
                type="button"
              >
                <i className="material-symbols-outlined !text-md">
                  attach_file
                </i>
              </button>
              <button
                className="inline-block transition-all hover:text-primary-500"
                type="button"
              >
                <i className="material-symbols-outlined !text-md">mic_none</i>
              </button>
              <button
                className="inline-block transition-all hover:text-primary-500"
                type="button"
              >
                <i className="material-symbols-outlined !text-md">image</i>
              </button>
            </div>
            <div className="relative mt-[15px] md:mt-0 md:ltr:pr-[70px] md:rtl:pl-[70px] flex-auto">
              <input
                type="text"
                className="block w-full rounded-md bg-white dark:bg-[#0c1427] px-[15px] h-[55px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
                placeholder="Type your message"
              />
              <button
                type="submit"
                className="md:absolute flex items-center justify-center ltr:right-0 rtl:left-0 rounded-sm transition-all bg-primary-500 text-white hover:bg-primary-400 md:top-1/2 md:-translate-y-1/2 w-[55px] h-[55px] mt-[15px] md:mt-0"
              >
                <i className="material-symbols-outlined">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
