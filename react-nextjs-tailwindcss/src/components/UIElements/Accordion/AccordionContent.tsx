"use client";

import React from "react";

const AccordionContent: React.FC = () => {
  // Initialize openIndex to 0 to open the first item by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="toc-accordion" id="tablesOfContentAccordion">
            <div className="toc-accordion-item bg-gray-50 dark:bg-[#15203c] rounded-md text-black dark:text-white mb-[15px] last:mb-0">
              <button
                className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
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
                className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
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
                className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
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
                className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
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
                className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
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
                className={`toc-accordion-button text-base md:text-[15px] lg:text-md py-[13px] px-[20px] md:px-[25px] block w-full ltr:text-left rtl:text-right font-medium relative ${
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AccordionContent;
