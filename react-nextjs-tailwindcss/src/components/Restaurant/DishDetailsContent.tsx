"use client";

import React, { useState } from "react";
import Image from "next/image";

const DishDetailsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="2xl:col-span-1">
          <div className="trezo-card">
            <div className="trezo-card-content">
              <div>
                <div className="payment-method-content">
                  {activeTab === 0 && (
                    <div className="bg-white dark:bg-[#0c1427] p-[13px] mb-[15px]">
                      <Image
                        className="rounded-md cursor-pointer w-full"
                        src="/images/restaurant/dish-details1.jpg"
                        alt="dish-details-image"
                        width={640}
                        height={660}
                      />
                    </div>
                  )}
                  {activeTab === 1 && (
                    <div className="bg-white dark:bg-[#0c1427] p-[13px] mb-[15px]">
                      <Image
                        className="rounded-md cursor-pointer w-full"
                        src="/images/restaurant/dish-details2.jpg"
                        alt="dish-details-image"
                        width={640}
                        height={660}
                      />
                    </div>
                  )}
                  {activeTab === 2 && (
                    <div className="bg-white dark:bg-[#0c1427] p-[13px] mb-[15px]">
                      <Image
                        className="rounded-md cursor-pointer w-full"
                        src="/images/restaurant/dish-details3.jpg"
                        alt="dish-details-image"
                        width={640}
                        height={660}
                      />
                    </div>
                  )}
                  {activeTab === 3 && (
                    <div className="bg-white dark:bg-[#0c1427] p-[13px] mb-[15px]">
                      <Image
                        className="rounded-md cursor-pointer w-full"
                        src="/images/restaurant/dish-details4.jpg"
                        alt="dish-details-image"
                        width={640}
                        height={660}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleTabClick(0)}
                    className={` ${
                      activeTab === 0
                        ? "bg-[#fff] border-[1px] border-solid border-[#ffffff]"
                        : ""
                    }`}
                  >
                    <Image
                      className="rounded-md cursor-pointer"
                      src="/images/restaurant/dish-details1.jpg"
                      alt="dish-details-image"
                      width={120}
                      height={120}
                    />
                  </button>

                  <button
                    onClick={() => handleTabClick(1)}
                    className={` ${
                      activeTab === 1
                        ? "bg-[#fff] border-[1px] border-solid border-[#ffffff]"
                        : ""
                    }`}
                  >
                    <Image
                      className="rounded-md cursor-pointer"
                      src="/images/restaurant/dish-details2.jpg"
                      alt="dish-details-image"
                      width={120}
                      height={120}
                    />
                  </button>

                  <button
                    onClick={() => handleTabClick(2)}
                    className={` ${
                      activeTab === 2
                        ? "bg-[#fff] border-[1px] border-solid border-[#ffffff]"
                        : ""
                    }`}
                  >
                    <Image
                      className="rounded-md cursor-pointer"
                      src="/images/restaurant/dish-details3.jpg"
                      alt="dish-details-image"
                      width={120}
                      height={120}
                    />
                  </button>

                  <button
                    onClick={() => handleTabClick(3)}
                    className={` ${
                      activeTab === 3
                        ? "bg-[#fff] border-[1px] border-solid border-[#ffffff]"
                        : ""
                    }`}
                  >
                    <Image
                      className="rounded-md cursor-pointer"
                      src="/images/restaurant/dish-details4.jpg"
                      alt="dish-details-image"
                      width={120}
                      height={120}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="2xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md lg:h-full">
            <div className="trezo-card-content">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs">Code: 3479</span>
                  <h2 className="!text-lg md:!text-xl !my-[8.5px]">
                    Beef Cheesy Burger
                  </h2>
                  <span className="block font-semibold text-danger-600 md:text-md">
                    $11.50 USD
                  </span>
                </div>

                <div className="flex items-center justify-end leading-none gap-[2px]">
                  <i className="ri-star-fill text-orange-500"></i>
                  <i className="ri-star-fill text-orange-500"></i>
                  <i className="ri-star-fill text-orange-500"></i>
                  <i className="ri-star-fill text-orange-500"></i>
                  <i className="ri-star-fill text-orange-500"></i>
                  <span className="block relative top-px text-xs text-gray-500 dark:text-gray-400 ltr:ml-[2px] rtl:mr-[2px]">
                    5.0
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 dark:bg-[#172036] my-[20px] md:my-[25px]"></div>

              <h4 className="!font-semibold !text-lg !mb-[12px]">
                Ingredients Details
              </h4>
              <p>
                Spaghetti, shredded chicken, buffalo sauce, ranch dressing,
                mozzarella.
              </p>

              <div className="mb-[20px] md:mb-[25px]"></div>

              <h4 className="!font-semibold !text-lg !mb-[12px]">
                Nutrition Values
              </h4>

              <ul className="mb-[20px] md:mb-[25px] grid grid-cols-1 sm:grid-cols-2">
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Calories</span>
                  <span className="block">
                    <span className="text-black dark:text-white">1200</span>{" "}
                    Kcal
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Carbs</span>
                  <span className="block">
                    <span className="text-black dark:text-white">120</span> gm
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Protein</span>
                  <span className="block">
                    <span className="text-black dark:text-white">120</span> gm
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Fibres</span>
                  <span className="block">
                    <span className="text-black dark:text-white">400</span> gm
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Fat</span>
                  <span className="block">
                    <span className="text-black dark:text-white">890</span> gm
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Vitamins</span>
                  <span className="block">
                    <span className="text-black dark:text-white">350</span> gm
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Sugar</span>
                  <span className="block">
                    <span className="text-black dark:text-white">30</span> gm
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Minerals</span>
                  <span className="block">
                    <span className="text-black dark:text-white">5</span> gm
                  </span>
                </li>
              </ul>

              <h4 className="!font-semibold !text-lg !flex !items-center !justify-between">
                Orders In Queue
                <span>17</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DishDetailsContent;
