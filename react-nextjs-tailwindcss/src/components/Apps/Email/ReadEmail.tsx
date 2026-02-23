"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const ReadEmail: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[15px] md:pb-[19px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-md !font-semibold">Sales Review Meeting</h5>
          </div>

          <div className="trezo-card-subtitle flex items-center gap-[10px] md:gap-[15px] mt-[12px] sm:mt-0">
            <button
              type="button"
              className="transition-all hover:text-primary-500 relative top-px"
            >
              <i className="material-symbols-outlined !text-[20px]">archive</i>
            </button>

            <button
              type="button"
              className="transition-all hover:text-primary-500 relative top-px"
            >
              <i className="material-symbols-outlined !text-[20px]">
                help_clinic
              </i>
            </button>

            <button
              type="button"
              className="transition-all hover:text-primary-500 relative top-px"
            >
              <i className="material-symbols-outlined !text-[20px]">delete</i>
            </button>

            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] leading-none text-black dark:text-white hover:text-primary-500">
                <i className="material-symbols-outlined !text-[20px]">
                  more_vert
                </i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {[
                  "Reply",
                  "Forward",
                  "Print",
                  "Download",
                  "Mark as unread",
                  "Report Spam",
                  "Delete",
                  "Block Sarah",
                ].map((option) => (
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
          <div className="sm:flex items-center justify-between mb-[20px] md:mb-[25px]">
            <div className="flex items-center">
              <Image
                src="/images/users/user31.jpg"
                alt="user-image"
                className="rounded-full w-[45px]"
                width={45}
                height={45}
              />
              <div className="ltr:ml-[12px] rtl:mr-[12px]">
                <span className="block text-black dark:text-white font-semibold">
                  Sarah Smith
                </span>
                <span className="block text-xs mt-[2px]">sarah@trezo.com</span>
              </div>
            </div>

            <div className="flex items-center mt-[15px] sm:mt-0">
              <button
                type="button"
                className="inline-block relative sm:top-px leading-none ltr:mr-[10px] rtl:ml-[10px] transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[20px]">grade</i>
              </button>
              <span className="block">26 March 2024</span>
            </div>
          </div>

          <div className="md:ltr:pl-[57px] md:rtl:pr-[57px]">
            <span className="mb-[20px] md:mb-[25px] font-semibold text-black dark:text-white block">
              Subject: Re: Quarterly Sales Review Meeting
            </span>

            <span className="text-black dark:text-white block font-medium mb-[20px] md:mb-[25px]">
              Hi Smith,
            </span>

            <p className="!mb-[20px] last:!mb-0">
              Great, I&apos;ll go ahead and send out the calendar invite shortly.
            </p>

            <p className="!mb-[20px] last:!mb-0">
              Regarding the agenda, I think your suggestions are spot on. I&apos;ll
              add them to the agenda and circulate it to everyone before the
              meeting so they can come prepared.
            </p>

            <p className="!mb-[20px] last:!mb-0">
              In addition to our current initiatives, I believe it would be
              advantageous to have a concise yet comprehensive update on any new
              products or promotions that are scheduled to launch in the next
              quarter. This information will not only keep us informed but also
              assist in aligning our strategies with upcoming opportunities.
            </p>

            <p className="!mb-[20px] last:!mb-0">
              Let me know if you think that&apos;s a valuable addition to the agenda.
            </p>

            <div className="mt-[50px]">
              <span className="block text-black dark:text-white font-medium mb-[5px]">
                Best regards,
              </span>
              <span className="block text-black dark:text-white font-medium">
                Olivia Parker
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-[20px] md:mt-[25px] pt-[20px] md:pt-[25px] md:ltr:pl-[57px] md:rtl:pr-[57px] dark:border-[#15203c]">
            <button
              className="inline-block font-semibold md:text-md py-[7px] px-[25px] border border-primary-500 ltr:mr-[15px] rtl:ml-[15px] transition-all rounded-md text-white bg-primary-500 hover:bg-primary-400 hover:border-primary-400"
              type="submit"
            >
              Reply
            </button>
            <button
              className="inline-block font-semibold md:text-md py-[7px] px-[25px] border border-primary-500 ltr:mr-[15px] rtl:ml-[15px] transition-all rounded-md text-primary-500 hover:bg-primary-500 hover:text-white"
              type="submit"
            >
              Forward
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadEmail;
