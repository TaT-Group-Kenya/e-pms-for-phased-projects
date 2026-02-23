"use client";

import React from "react";
import Image from "next/image";

const ContactUs: React.FC = () => {
  return (
    <>
      <div className="pt-[60px] md:pt-[80px] lg:pt-[100px] xl:pt-[150px]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="p-[15px] md:p-[20px] lg:py-[30px] lg:px-[20px] rounded-[7px] ltr:xl:mr-[50px] rtl:xl:ml-[50px] bg-white/[.31] dark:bg-black/[.54] border border-white/[.13] dark:border-black/[.13] backdrop-blur-[5.099999904632568px]">
              <Image
                src="/images/front-pages/contact.jpg"
                alt="contact-image"
                className="rounded-[7px]"
                width={554}
                height={724}
              />
            </div>

            <div>
              <div className="mb-[25px] md:mb-[30px] lg:mb-[35px] xl:mb-[40px] md:max-w-[540px] lg:max-w-full">
                <div className="inline-block relative mt-[10px] mb-[20px]">
                  <span className="absolute top-[4.5px] w-[5px] h-[5px] ltr:-left-[3.6px] rtl:-right-[3.6px] bg-purple-600 -rotate-[6.536deg]"></span>
                  <span className="absolute -top-[9.5px] w-[5px] h-[5px] ltr:right-0 rtl:left-0 bg-purple-600 -rotate-[6.536deg]"></span>
                  <span className="inline-block relative text-purple-600 border border-purple-600 py-[5.5px] px-[17.2px] -rotate-[6.536deg]">
                    Contact Us
                    <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-left-[3.5px] rtl:-right-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
                    <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-right-[3.5px] rtl:-left-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
                  </span>
                </div>
                <h2 className="!mb-0 !text-[24px] md:!text-[28px] lg:!text-[34px] xl:!text-[36px] -tracking-[.5px] md:-tracking-[.6px] lg:-tracking-[.8px] xl:-tracking-[1px] !leading-[1.2]">
                  How Can We Help? We Love to Hear From You. Send Us a Message!
                </h2>
              </div>

              <form>
                <div className="mb-[20px] md:mb-[25px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="h-[50px] md:h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#0a0e19] px-[15px] md:px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="Your full name"
                  />
                </div>

                <div className="mb-[20px] md:mb-[25px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="h-[50px] md:h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#0a0e19] px-[15px] md:px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="Your email address"
                  />
                </div>

                <div className="mb-[20px] md:mb-[25px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="h-[50px] md:h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#0a0e19] px-[15px] md:px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="mb-[20px] md:mb-[25px]">
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Message
                  </label>
                  <textarea
                    className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-gray-50 dark:bg-[#0a0e19] p-[15px] md:p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                    placeholder="Write your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="block w-full lg:text-[15px] xl:text-[16px] py-[12px] px-[17px] bg-primary-600 text-white rounded-md transition-all font-medium hover:bg-primary-500"
                >
                  <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[29px] rtl:md:pr-[29px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px] md:!text-[24px]">
                      autorenew
                    </i>
                    Send
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
