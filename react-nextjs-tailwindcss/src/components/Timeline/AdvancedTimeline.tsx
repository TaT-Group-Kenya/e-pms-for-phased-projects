"use client";

import React from "react";
import Image from "next/image"; 

const AdvancedTimeline: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Advanced Timeline</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="relative ltr:pl-[15px] rtl:pr-[15px] ltr:md:pl-0 rtl:md:pr-0">
            <div className="absolute top-0 bottom-0 ltr:left-0 rtl:right-0 rtl:md:right-auto ltr:md:left-1/2 rtl:md:left-1/2 rtl:md:-translate-x-1/2 border-r border-gray-100 dark:border-[#172036] border-dashed"></div>

            <div className="relative z-[1] pb-[20px] md:pb-[25px] last:pb-0">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-success-500"></span>

              <div className="inline-block rounded-md bg-primary-500 text-white text-xs py-[5px] md:py-[8.5px] px-[18px] md:absolute md:top-1/2 md:-translate-y-1/2 ltr:md:left-1/2 ltr:md:-translate-x-1/2 rtl:md:right-1/2 rtl:md:translate-x-1/2 ltr:md:ml-[120px] rtl:md:mr-[120px] ltr:lg:ml-[135px] rtl:lg:mr-[135px] ltr:xl:ml-[164px] rtl:xl:mr-[164px] mb-[15px] md:mb-0">
                12:00 AM, 25 Mar 2024
              </div>

              <div className="rounded-md relative bg-[#ecf0ff] dark:bg-[#15203c] md:w-[45%] p-[15px] md:p-[20px]">
                <h6 className="!text-primary-500 !text-base !mb-[12px] !font-medium">
                  Weekly Stand-Up Meetings:
                </h6>
                <p className="leading-[1.5]">
                  We continued our weekly stand-up meetings where team members
                  provided updates on their current tasks, discussed any
                  roadblocks, and coordinated efforts for the week ahead.
                </p>

                <div className="flex items-center mb-[15px]">
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user6.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user7.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user8.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user9.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] text-xs rounded-full border border-white bg-primary-500 text-white font-medium flex items-center justify-center">
                    +15
                  </div>
                </div>
                <span className="block text-xs">
                  By:
                  <span className="text-primary-500">Olivia Rodriguez</span>
                </span>
              </div>
            </div>

            <div className="relative z-[1] pb-[20px] md:pb-[25px] last:pb-0">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-purple-500"></span>

              <div className="inline-block rounded-md bg-primary-500 text-white text-xs py-[5px] md:py-[8.5px] px-[18px] md:absolute md:top-1/2 md:-translate-y-1/2 ltr:md:right-1/2 ltr:md:-translate-x-1/2 rtl:md:left-1/2 rtl:md:translate-x-1/2 ltr:md:-ml-[120px] rtl:md:-mr-[120px] ltr:lg:-ml-[135px] rtl:lg:-mr-[135px] ltr:xl:-ml-[164px] rtl:xl:-mr-[164px] mb-[15px] md:mb-0">
                04:00 PM, 24 Mar 2024
              </div>

              <div className="rounded-md relative bg-[#ecf0ff] dark:bg-[#15203c] md:w-[45%] p-[15px] md:p-[20px] ltr:ml-auto rtl:mr-auto">
                <h6 className="!text-primary-500 !text-base !mb-[12px] !font-medium">
                  Project Kickoff Session:
                </h6>
                <p className="leading-[1.5]">
                  Briefly explain the purpose of the kickoff session and its
                  importance in setting the project on the right track. Discuss
                  any assumptions made about the scope and clarify.
                </p>
                <span className="block text-xs">
                  By:
                  <span className="text-primary-500">Olivia Rodriguez</span>
                </span>
              </div>
            </div>

            <div className="relative z-[1] pb-[20px] md:pb-[25px] last:pb-0">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-primary-500"></span>

              <div className="inline-block rounded-md bg-primary-500 text-white text-xs py-[5px] md:py-[8.5px] px-[18px] md:absolute md:top-1/2 md:-translate-y-1/2 ltr:md:left-1/2 ltr:md:-translate-x-1/2 rtl:md:right-1/2 rtl:md:translate-x-1/2 ltr:md:ml-[120px] rtl:md:mr-[120px] ltr:lg:ml-[135px] rtl:lg:mr-[135px] ltr:xl:ml-[164px] rtl:xl:mr-[164px] mb-[15px] md:mb-0">
                02 PM, 23 Mar 2024
              </div>

              <div className="rounded-md relative bg-[#ecf0ff] dark:bg-[#15203c] md:w-[45%] p-[15px] md:p-[20px]">
                <h6 className="!text-primary-500 !text-base !mb-[12px] !font-medium">
                  Team Building Workshop:
                </h6>
                <p className="leading-[1.5]">
                  Arrange for a suitable venue and ensure that any necessary
                  materials or resources are readily available. Start the
                  workshop with a fun icebreaker activity to help team members.
                </p>

                <div className="flex items-center mb-[15px]">
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user11.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user12.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] rounded-full ltr:-mr-[14px] rtl:-ml-[14px] border border-white dark:border-[#0c1427]">
                    <Image
                      alt="user-image"
                      className="rounded-full"
                      src="/images/users/user13.jpg"
                      width={34}
                      height={34}
                    />
                  </div>
                  <div className="w-[34px] h-[34px] text-xs rounded-full border border-white bg-success-500 text-white font-medium flex items-center justify-center">
                    +12
                  </div>
                </div>
                <span className="block text-xs">
                  By:
                  <span className="text-primary-500">Olivia Rodriguez</span>
                </span>
              </div>
            </div>

            <div className="relative z-[1] pb-[20px] md:pb-[25px] last:pb-0">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-danger-500"></span>

              <div className="inline-block rounded-md bg-primary-500 text-white text-xs py-[5px] md:py-[8.5px] px-[18px] md:absolute md:top-1/2 md:-translate-y-1/2 ltr:md:right-1/2 ltr:md:-translate-x-1/2 rtl:md:left-1/2 rtl:md:translate-x-1/2 ltr:md:-ml-[120px] rtl:md:-mr-[120px] ltr:lg:-ml-[135px] rtl:lg:-mr-[135px] ltr:xl:-ml-[164px] rtl:xl:-mr-[164px] mb-[15px] md:mb-0">
                12:00 PM, 22 Mar 2024
              </div>

              <div className="rounded-md relative bg-[#ecf0ff] dark:bg-[#15203c] md:w-[45%] p-[15px] md:p-[20px] ltr:ml-auto rtl:mr-auto">
                <h6 className="!text-primary-500 !text-base !mb-[12px] !font-medium">
                  Lunch & Learning Session:
                </h6>
                <p className="leading-[1.5]">
                  Determine a convenient time and date for the session, ideally
                  during a lunch break or over a lunch hour. Start the session
                  on time and welcome all participants.
                </p>
                <span className="block text-xs">
                  By:
                  <span className="text-primary-500">Olivia Rodriguez</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedTimeline;
