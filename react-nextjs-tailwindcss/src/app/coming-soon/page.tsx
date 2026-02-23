"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";

export default function Page() {
  // Memoizing the target date to prevent unnecessary re-renders
  const targetDate = useMemo(() => new Date("2025-12-31T23:59:59"), []);

  // State to hold the countdown values
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0");
        const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0");
        const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    };

    // Update the countdown every second
    updateCountdown(); // Initial call to prevent 1-second delay
    const timer = setInterval(updateCountdown, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <>
      <div className="coming-soon-content bg-white dark:bg-[#0a0e19] py-[30px] h-screen overflow-x-hidden">
        <div className="w-full h-full table">
          <div className="table-cell align-middle">
            <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
                <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] rounded-md order-2 lg:order-1">
                  <Image
                    src="/images/coming-soon.jpg"
                    alt="coming-soon-image"
                    className="rounded-md"
                    width={627}
                    height={582}
                  />
                </div>

                <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2">
                  <Image
                    src="/images/logo-big.svg"
                    alt="logo"
                    className="inline-block dark:hidden"
                    width={142}
                    height={38}
                  />
                  <Image
                    src="/images/white-logo-big.svg"
                    alt="logo"
                    className="hidden dark:inline-block"
                    width={142}
                    height={38}
                  />

                  <div className="my-[17px] md:my-[25px]">
                    <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl 2xl:!text-4xl !mb-[5px] md:!mb-[12px]">
                      We&apos;re working on launching soon, stay tuned!
                    </h1>
                    <p className="font-medium leading-[1.5] lg:text-md">
                      We&apos;re coming soon..
                    </p>
                  </div>

                  <div className="countdown mb-[10px]" id="comingSoonCountDown">
                    <div className="inline-block ltr:mr-[20px] ltr:md:mr-[25px] rtl:ml-[20px] rtl:md:ml-[25px] mb-[15px]">
                      <span
                        id="days"
                        className="block text-black dark:text-white font-bold text-xl lg:text-2xl"
                      >
                        {timeLeft.days}
                      </span>
                      Days
                    </div>
                    <div className="inline-block ltr:mr-[20px] ltr:md:mr-[25px] rtl:ml-[20px] rtl:md:ml-[25px] mb-[15px]">
                      <span
                        id="hours"
                        className="block text-black dark:text-white font-bold text-xl lg:text-2xl"
                      >
                        {timeLeft.hours}
                      </span>
                      Hours
                    </div>
                    <div className="inline-block ltr:mr-[20px] ltr:md:mr-[25px] rtl:ml-[20px] rtl:md:ml-[25px] mb-[15px]">
                      <span
                        id="minutes"
                        className="block text-black dark:text-white font-bold text-xl lg:text-2xl"
                      >
                        {timeLeft.minutes}
                      </span>
                      Minutes
                    </div>
                    <div className="inline-block ltr:mr-[20px] ltr:md:mr-[25px] rtl:ml-[20px] rtl:md:ml-[25px] mb-[15px]">
                      <span
                        id="seconds"
                        className="block text-black dark:text-white font-bold text-xl lg:text-2xl"
                      >
                        {timeLeft.seconds}
                      </span>
                      Seconds
                    </div>
                  </div>

                  <div className="mb-[15px] relative">
                    <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                      Be the first to know when our site is live
                    </label>
                    <input
                      type="text"
                      className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                      placeholder="example@trezo.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="md:text-md block w-full text-center transition-all rounded-md font-medium py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
                  >
                    <span className="flex items-center justify-center gap-[5px]">
                      <i className="material-symbols-outlined">autorenew</i>
                      Send
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
