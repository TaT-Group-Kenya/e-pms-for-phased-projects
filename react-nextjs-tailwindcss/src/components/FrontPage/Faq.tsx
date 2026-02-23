"use client";

import React from "react";

const Faq: React.FC = () => {
  // Initialize openIndex to 0 to open the first item by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="relative z-[1] pt-[60px] md:pt-[80px] lg:pt-[100px] xl:pt-[150px]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          <div className="mx-auto text-center lg:max-w-[650px] xl:max-w-[810px] 2xl:max-w-[785px] mb-[35px] md:mb-[50px] lg:mb-[65px] xl:mb-[90px]">
            <div className="inline-block relative mt-[10px] mb-[20px]">
              <span className="absolute top-[4.5px] w-[5px] h-[5px] ltr:-left-[3.6px] rtl:-right-[3.6px] bg-purple-600 -rotate-[6.536deg]"></span>
              <span className="absolute -top-[9.5px] w-[5px] h-[5px] ltr:right-0 rtl:left-0 bg-purple-600 -rotate-[6.536deg]"></span>
              <span className="inline-block relative text-purple-600 border border-purple-600 py-[5.5px] px-[17.2px] -rotate-[6.536deg]">
                FAQ&apos;s
                <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-left-[3.5px] rtl:-right-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
                <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-right-[3.5px] rtl:-left-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
              </span>
            </div>
            <h2 className="!mb-0 !text-[24px] md:!text-[28px] lg:!text-[34px] xl:!text-[36px] -tracking-[.5px] md:-tracking-[.6px] lg:-tracking-[.8px] xl:-tracking-[1px] !leading-[1.2]">
              Do You Have Questions? We Have Answers (Well, Most of the Time!)
            </h2>
          </div>

          <div
            className="toc-accordion mx-auto md:max-w-[738px]"
            id="tablesOfContentAccordion"
          >
            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
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

            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
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

            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
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

            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
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

            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button open text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
                  openIndex === 4 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(4)}
              >
                Can I customize Trezo to fit my team&apos;s specific needs?
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

            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
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

            <div className="toc-accordion-item bg-white dark:bg-[#0c1427] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
