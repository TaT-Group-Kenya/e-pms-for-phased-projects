"use client";

import React, { useState } from "react";
import ManageReviews from "./ManageReviews";

const ProductDetailsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="trezo-tabs product-details-tabs" id="trezo-tabs">
        <ul className="navs">
          <li className="nav-item inline-block">
            <button
              type="button"
              onClick={() => handleTabClick(0)}
              className={`nav-link block md:text-md py-[10px] md:py-[12px] px-[15px] md:px-[20px] transition-all relative font-medium rounded-t-md ltr:-mr-[4px] rtl:-ml-[4px] ${
                activeTab === 0 ? "active" : ""
              }`}
            >
              Description
            </button>
          </li>

          <li className="nav-item inline-block">
            <button
              type="button"
              onClick={() => handleTabClick(1)}
              className={`nav-link block md:text-md py-[10px] md:py-[12px] px-[15px] md:px-[20px] transition-all relative font-medium rounded-t-md ltr:-mr-[4px] rtl:-ml-[4px] ${
                activeTab === 1 ? "active" : ""
              }`}
            >
              Specifications
            </button>
          </li>

          <li className="nav-item inline-block">
            <button
              type="button"
              onClick={() => handleTabClick(2)}
              className={`nav-link block md:text-md py-[10px] md:py-[12px] px-[15px] md:px-[20px] transition-all relative font-medium rounded-t-md ltr:-mr-[4px] rtl:-ml-[4px] ${
                activeTab === 2 ? "active" : ""
              }`}
            >
              Reviews
            </button>
          </li>
        </ul>

        <div>
          {activeTab === 0 && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-content">
                <p>
                  The Apple MacBook Pro 16.2 is a cutting-edge laptop designed
                  to deliver exceptional performance and advanced features for
                  professionals and creative enthusiasts. With its sleek
                  aluminum body and precision engineering, this MacBook Pro
                  represents the pinnacle of Apple laptop technology.
                </p>
                <p>
                  Stay connected with a variety of ports, including Thunderbolt
                  3, USB-C, and audio jacks. These versatile ports support
                  high-speed data transfer and external device connections.
                  Enjoy a rich audio experience with high-fidelity speakers that
                  deliver clear and immersive sound. Perfect for content
                  creators and multimedia enthusiasts.
                </p>
                <p>
                  Equipped with the latest processors, ample RAM, and
                  high-performance graphics, the MacBook Pro 16.2 ensures smooth
                  multitasking, fast rendering, and efficient handling of
                  resource-intensive tasks. Seamlessly integrate with the macOS
                  ecosystem, benefiting from features like iCloud, Siri, and a
                  vast selection of applications available on the App Store.
                </p>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-content">
                <h6 className="!font-semibold !mb-[12px] !text-[15px]">General</h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">Brand:</span>
                    Apple
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">Model:</span>
                    MacBook Pro
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">Price:</span>
                    $2499
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Dimensions (mm):
                    </span>
                    304.10 x 212.40 x 14.90
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Weight (kg):
                    </span>
                    1.37
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">Colors:</span>
                    Space Grey
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Operating system:
                    </span>
                    macOS
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Battery Life (up to hours):
                    </span>
                    10
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Display
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">Size:</span>
                    13.30-inch
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Resolution:
                    </span>
                    2560x1600 pixels
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Touch Screen:
                    </span>
                    No
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Processor
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Processor:
                    </span>
                    Intel Core i5 7th Gen
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Base Clock Speed:
                    </span>
                    2.3 GHz
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Memory
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">RAM:</span>
                    12GB
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Storage
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Hard disk:
                    </span>
                    No
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">SSD:</span>
                    512GB
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Connectivity
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Wi-Fi standards supported:
                    </span>
                    Apple
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Bluetooth version:
                    </span>
                    4.2
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Inputs
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Web Camera:
                    </span>
                    Yes
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Pointer Device:
                    </span>
                    Touchpad
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Touchpad:
                    </span>
                    Yes
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Internal Mic:
                    </span>
                    Yes
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Speakers:
                    </span>
                    Stereo Speakers
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Finger Print Sensor:
                    </span>
                    Yes
                  </li>
                </ul>
                <h6 className="!font-semibold !mb-[12px] !mt-[20px] md:!mt-[25px] !text-[15px]">
                  Ports and slots
                </h6>
                <ul>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      Number of USB Ports:
                    </span>
                    2
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">
                      USB Ports:
                    </span>
                    2 x USB 3.0
                  </li>
                  <li className="py-[11px] px-[20px] border-b border-l border-r border-gray-100 dark:border-[#172036] first:border-t">
                    <span className="text-black dark:text-white">Mic In:</span>
                    Yes
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-content">
                  <div className="md:grid md:grid-cols-3 gap-[25px] items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center relative gap-[15px] mb-[15px] ltr:pr-[48px] rtl:pl-[48px] last:mb-0">
                        <div className="flex items-center justify-center text-[#ee8336] text-lg gap-[5px]">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                        </div>
                        <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <span className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2">
                          359
                        </span>
                      </div>

                      <div className="flex items-center relative gap-[15px] mb-[15px] ltr:pr-[48px] rtl:pl-[48px] last:mb-0">
                        <div className="flex items-center justify-center text-[#ee8336] text-lg gap-[5px]">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                        </div>
                        <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                            style={{ width: "50%" }}
                          ></div>
                        </div>
                        <span className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2">
                          208
                        </span>
                      </div>

                      <div className="flex items-center relative gap-[15px] mb-[15px] ltr:pr-[48px] rtl:pl-[48px] last:mb-0">
                        <div className="flex items-center justify-center text-[#ee8336] text-lg gap-[5px]">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                        </div>
                        <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                            style={{ width: "35%" }}
                          ></div>
                        </div>
                        <span className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2">
                          124
                        </span>
                      </div>

                      <div className="flex items-center relative gap-[15px] mb-[15px] ltr:pr-[48px] rtl:pl-[48px] last:mb-0">
                        <div className="flex items-center justify-center text-[#ee8336] text-lg gap-[5px]">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                        </div>
                        <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                            style={{ width: "15%" }}
                          ></div>
                        </div>
                        <span className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2">
                          89
                        </span>
                      </div>

                      <div className="flex items-center relative gap-[15px] mb-[15px] ltr:pr-[48px] rtl:pl-[48px] last:mb-0">
                        <div className="flex items-center justify-center text-[#ee8336] text-lg gap-[5px]">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                        </div>
                        <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                          <div
                            className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                            style={{ width: "5%" }}
                          ></div>
                        </div>
                        <span className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2">
                          4
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <div className="text-center mt-[25px] md:mt-0">
                        <h3 className="!mb-[7px] !leading-none !text-5xl">4.28</h3>
                        <div className="flex items-center justify-center mb-[10px] text-[#ee8336] text-[30px] gap-[4px]">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-line text-[#e2e8f0] dark:text-[#334161]"></i>
                        </div>
                        <span className="block">of 3250 Reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ManageReviews />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailsTabs;
