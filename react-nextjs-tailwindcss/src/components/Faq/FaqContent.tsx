"use client";

import React from "react";

const FaqContent: React.FC = () => {
  // Initialize openIndex to 0 to open the first item by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content py-[10px] md:py-[25px]">
          <div className="text-center mx-auto md:max-w-[550px] mb-[25px] md:mb-[35px]">
            <h3 className="!mb-[10px] md:!mb-[12px] !text-lg md:!text-xl">
              Frequently Asked Questions
            </h3>
            <p className="leading-[1.7]">
              Trezo offers customization options to tailor the platform to your
              team unique requirements. You can customize workflows,
              templates, and dashboards to align with your processes.
            </p>
          </div>

          <div className="toc-accordion mx-auto max-w-[738px]">
            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 0 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(0)}
              >
                What is Trezo?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 0 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 1 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(1)}
              >
                What features does Trezo offer?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 1 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
                <ul className="list-disc ltr:pl-[17px] rtl:pr-[17px]">
                  <li className="text-gray-500 dark:text-gray-400 leading-[1.6] mb-[7px] last:mb-0">
                    Pellentesque viverra lorem malesuada nunc tristique sapien.
                  </li>
                  <li className="text-gray-500 dark:text-gray-400 leading-[1.6] mb-[7px] last:mb-0">
                    Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                  </li>
                  <li className="text-gray-500 dark:text-gray-400 leading-[1.6] mb-[7px] last:mb-0">
                    Tellus non morbi nascetur cursus etiam facilisis mi.
                  </li>
                  <li className="text-gray-500 dark:text-gray-400 leading-[1.6] mb-[7px] last:mb-0">
                    Imperdiet sit hendrerit tincidunt bibendum donec adipiscing.
                  </li>
                </ul>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 2 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(2)}
              >
                How can Trezo benefit my team?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 2 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 3 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(3)}
              >
                Is Trezo suitable for small businesses?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 3 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 4 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(4)}
              >
                Can I customize Trezo to fit my team specific needs?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 4 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 5 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(5)}
              >
                Is Trezo cloud-based or on-premises?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 5 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 6 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(6)}
              >
                Does Trezo integrate with other tools?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 6 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 7 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(7)}
              >
                How secure is Trezo?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 7 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 8 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(8)}
              >
                Can I try Trezo before purchasing?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 8 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 9 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(9)}
              >
                What type of customer support does Trezo provide?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 9 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 10 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(10)}
              >
                How do I get started with Trezo?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 10 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 11 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(11)}
              >
                Does Trezo offer training for new users?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 11 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 12 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(12)}
              >
                Is Trezo GDPR compliant?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 12 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 13 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(13)}
              >
                Does Trezo offer a mobile app?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 13 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 14 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(14)}
              >
                How does billing work for Trezo?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 14 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 15 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(15)}
              >
                Can I cancel my Trezo subscription at any time?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 15 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 16 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(16)}
              >
                Can I track time spent on tasks with Trezo?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 16 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 17 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(17)}
              >
                Does Trezo offer recurring task capabilities?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 17 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 18 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(18)}
              >
                Does Trezo offer Gantt chart functionality?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 18 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>

            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 19 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(19)}
              >
                Can I generate custom reports in Trezo?
                <i className="ri-arrow-down-s-line absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] md:ltr:right-[25px] md:rtl:left-[25px] text-[20px]"></i>
              </button>

              <div
                className={`toc-accordion-collapse px-[20px] md:px-[25px] pb-[20px] ${
                  openIndex === 19 ? "open" : "hidden"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-[1.7]">
                  Trezo is a comprehensive project management software designed
                  to help teams streamline their workflow, collaborate
                  effectively, and achieve project success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqContent;
