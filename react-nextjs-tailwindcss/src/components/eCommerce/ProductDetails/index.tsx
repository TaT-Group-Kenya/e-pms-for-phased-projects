"use client";

import React, { useState } from "react";
import Image from "next/image";
import ProductDetailsTabs from "./ProductDetailsTabs";

const ProductDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState("Apple M1 Pro Chip");
  const [selectedCapacity, setSelectedCapacity] = useState("1 TB");
  const [selectedColor, setSelectedColor] = useState("Silver");
  const [quantity, setQuantity] = useState(1);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleStyleClick = (style: string) => {
    setSelectedStyle(style);
  };

  const handleCapacityClick = (capacity: string) => {
    setSelectedCapacity(capacity);
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content lg:max-w-[1070px] md:pt-[15px] md:px-[15px] md:pb-[75px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
            <div className="lg:ltr:mr-[30px] lg:rtl:ml-[30px]">
              <div>
                {activeTab === 0 && (
                  <div>
                    <Image
                      className="rounded-md"
                      src="/images/products/product-details1.jpg"
                      alt="product-details-image"
                      width={717}
                      height={677}
                    />
                  </div>
                )}

                {activeTab === 1 && (
                  <div>
                    <Image
                      className="rounded-md"
                      src="/images/products/product-details2.jpg"
                      alt="product-details-image"
                      width={717}
                      height={677}
                    />
                  </div>
                )}

                {activeTab === 2 && (
                  <div>
                    <Image
                      className="rounded-md"
                      src="/images/products/product-details3.jpg"
                      alt="product-details-image"
                      width={717}
                      height={677}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-[20px] mt-[20px]">
                <div
                  onClick={() => handleTabClick(0)}
                  className="cursor-pointer"
                >
                  <Image
                    className="rounded-md cursor-pointer"
                    src="/images/products/product-details1.jpg"
                    alt="product-details-image"
                    width={717}
                    height={677}
                  />
                </div>

                <div
                  onClick={() => handleTabClick(1)}
                  className="cursor-pointer"
                >
                  <Image
                    className="rounded-md cursor-pointer"
                    src="/images/products/product-details2.jpg"
                    alt="product-details-image"
                    width={717}
                    height={677}
                  />
                </div>

                <div
                  onClick={() => handleTabClick(2)}
                  className="cursor-pointer"
                >
                  <Image
                    className="rounded-md cursor-pointer"
                    src="/images/products/product-details3.jpg"
                    alt="product-details-image"
                    width={717}
                    height={677}
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block text-xs relative rounded-sm text-success-700 mb-[14px] bg-success-50 py-[4px] ltr:pr-[16px] rtl:pl-[16px] ltr:pl-[37px] rtl:pr-[37px]">
                <i className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 ltr:left-[12px] rtl:right-[12px] mt-[.2px] !text-[19px]">
                  check
                </i>
                in stock
              </span>

              <h6 className="!font-medium !text-lg !leading-[1.5] !mb-[16px]">
                Apple MacBook Pro 16.2&quot; with Liquid Retina XDR Display, M2 Max
                Chip with 12-Core CPU
              </h6>

              <div className="leading-none border-b border-gray-100 dark:border-[#172036] pb-[20px] md:pb-[25px] mb-[21px] text-md text-warning-500 flex items-center">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <span className="text-xs text-gray-500 dark:text-gray-400 relative top-[2px] ltr:ml-[15px] rtl:mr-[15px]">
                  (76 reviews)
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-black dark:text-white font-bold text-lg">
                  $3,499
                </span>
                <span className="text-md ltr:ml-[7px] rtl:mr-[7px] line-through">
                  $3,799
                </span>
              </div>

              <div className="mt-[20px]">
                <div className="flex items-center">
                  <span>Style:</span>
                  <span className="font-medium text-black dark:text-white ltr:ml-[3px] rtl:mr-[3px]">
                    {selectedStyle}
                  </span>
                </div>

                <div className="mt-[7px]">
                  <button
                    type="button"
                    onClick={() => handleStyleClick("Apple M1 Max Chip")}
                    className={`inline-block text-xs py-[4px] px-[15px] rounded-[4px] ltr:mr-[6px] rtl:ml-[6px] border ${
                      selectedStyle === "Apple M1 Max Chip"
                        ? "border-orange-400 text-black dark:text-white font-semibold"
                        : "border-gray-100 dark:border-[#172036]"
                    }`}
                  >
                    Apple M1 Max Chip
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStyleClick("Apple M1 Pro Chip")}
                    className={`inline-block text-xs py-[4px] px-[15px] rounded-[4px] ltr:mr-[6px] rtl:ml-[6px] border ${
                      selectedStyle === "Apple M1 Pro Chip"
                        ? "border-orange-400 text-black dark:text-white font-semibold"
                        : "border-gray-100 dark:border-[#172036]"
                    }`}
                  >
                    Apple M1 Pro Chip
                  </button>
                </div>
              </div>

              <div className="mt-[15px]">
                <div className="flex items-center">
                  <span>Capacity:</span>
                  <span className="font-medium text-black dark:text-white ltr:ml-[3px] rtl:mr-[3px]">
                    {selectedCapacity}
                  </span>
                </div>

                <div className="mt-[6px]">
                  <button
                    type="button"
                    onClick={() => handleCapacityClick("512 GB")}
                    className={`inline-block text-xs py-[4px] px-[15px] rounded-[4px] ltr:mr-[6px] rtl:ml-[6px] border ${
                      selectedCapacity === "512 GB"
                        ? "border-orange-400 text-black dark:text-white font-semibold"
                        : "border-gray-100 dark:border-[#172036]"
                    }`}
                  >
                    512 GB
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCapacityClick("1 TB")}
                    className={`inline-block text-xs py-[4px] px-[15px] rounded-[4px] ltr:mr-[6px] rtl:ml-[6px] border ${
                      selectedCapacity === "1 TB"
                        ? "border-orange-400 text-black dark:text-white font-semibold"
                        : "border-gray-100 dark:border-[#172036]"
                    }`}
                  >
                    1 TB
                  </button>
                </div>
              </div>

              <div className="mt-[15px]">
                <div className="flex items-center">
                  <span>Color:</span>
                  <span className="font-medium text-black dark:text-white ltr:ml-[3px] rtl:mr-[3px]">
                    {selectedColor}
                  </span>
                </div>

                <div className="mt-[6px]">
                  <button
                    type="button"
                    onClick={() => handleColorClick("Silver")}
                    className={`inline-block ltr:mr-[7px] rtl:ml-[7px] rounded-full w-[29px] h-[29px] bg-gray-100 border ${
                      selectedColor === "Silver"
                        ? "border-orange-400"
                        : "border-gray-100"
                    }`}
                  ></button>
                  <button
                    type="button"
                    onClick={() => handleColorClick("Gray")}
                    className={`inline-block ltr:mr-[7px] rtl:ml-[7px] rounded-full w-[29px] h-[29px] bg-gray-200 border ${
                      selectedColor === "Gray"
                        ? "border-orange-400"
                        : "border-gray-200"
                    }`}
                  ></button>
                </div>
              </div>

              <div className="mt-[26px] flex items-center gap-[8px]">
                <div
                  className="counter-container relative w-[102px]"
                  id="inputCounter"
                >
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="decrease-btn top-1/2 -translate-y-1/2 absolute text-[20px] ltr:left-[17px] rtl:right-[17px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="counter text-base h-[34px] rounded-md text-center block w-full bg-primary-50 dark:bg-[#15203c] text-black outline-0 font-medium dark:text-white"
                    value={quantity}
                    readOnly
                  />
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="increase-btn top-1/2 -translate-y-1/2 absolute text-[20px] ltr:right-[17px] rtl:left-[17px] text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="rounded-md inline-block font-medium py-[6.5px] px-[21px] text-white bg-primary-500"
                >
                  <span className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
                    <i className="ri-shopping-cart-line absolute ltr:left-0 rtl:right-0 text-[17px] top-1/2 -translate-y-1/2"></i>
                    Add To Cart
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="mt-[20px] inline-block font-medium text-black dark:text-white"
              >
                <span className="flex items-center">
                  <i className="ri-heart-line w-[31px] h-[31px] text-lg text-gray-500 dark:text-gray-400 leading-[33px] text-center ltr:mr-[10px] rtl:ml-[10px] rounded-full inline-block bg-gray-100 dark:bg-[#172036]"></i>
                  Add to wishlist
                </span>
              </button>

              <div className="mt-[11px] flex items-center">
                <i className="material-symbols-outlined w-[31px] h-[31px] !text-lg text-gray-500 dark:text-gray-400 !leading-[33px] text-center ltr:mr-[10px] rtl:ml-[10px] rounded-full inline-block bg-gray-100 dark:bg-[#172036]">
                  visibility
                </i>
                565 people are viewing the products
              </div>

              <ul className="my-[19px] border-t border-b border-gray-100 py-[15px] dark:border-[#172036]">
                <li className="relative ltr:pl-[27px] rtl:pr-[27px] mb-[7px] last:mb-0 text-black dark:text-white">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px] text-success-700">
                    check
                  </i>
                  Free delivery today
                </li>
                <li className="relative ltr:pl-[27px] rtl:pr-[27px] mb-[7px] last:mb-0 text-black dark:text-white">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px] text-success-700">
                    check
                  </i>
                  100% money back Guarantee
                </li>
                <li className="relative ltr:pl-[27px] rtl:pr-[27px] mb-[7px] last:mb-0 text-black dark:text-white">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px] text-success-700">
                    check
                  </i>
                  7 days product return policy
                </li>
              </ul>

              <ul className="mb-[20px]">
                <li className="mb-[6px] last:mb-0">
                  SKU:
                  <span className="font-medium text-black dark:text-white">
                    SMTGS6T45
                  </span>
                </li>
                <li className="mb-[6px] last:mb-0">
                  Category:
                  <span className="font-medium text-black dark:text-white">
                    computer
                  </span>
                </li>
                <li className="mb-[6px] last:mb-0">
                  Tags:
                  <span className="font-medium text-black dark:text-white">
                    laptop, macbook, PC
                  </span>
                </li>
              </ul>

              <div className="flex items-center gap-[4px]">
                <span className="relative text-md ltr:mr-[5px] rtl:ml-[5px] -top-px">
                  Share:
                </span>
                <a
                  href="https://www.facebook.com/"
                  className="w-[23.844px] h-[23.844px] text-sm leading-[23.844px] text-black dark:text-white bg-gray-100 dark:bg-[#172036] rounded-full text-center transition-all hover:text-white hover:bg-primary-500"
                  target="_blank"
                >
                  <i className="ri-facebook-fill"></i>
                </a>
                <a
                  href="https://www.twitter.com/"
                  className="w-[23.844px] h-[23.844px] text-sm leading-[23.844px] text-black dark:text-white bg-gray-100 dark:bg-[#172036] rounded-full text-center transition-all hover:text-white hover:bg-primary-500"
                  target="_blank"
                >
                  <i className="ri-twitter-x-fill"></i>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  className="w-[23.844px] h-[23.844px] text-sm leading-[23.844px] text-black dark:text-white bg-gray-100 dark:bg-[#172036] rounded-full text-center transition-all hover:text-white hover:bg-primary-500"
                  target="_blank"
                >
                  <i className="ri-linkedin-fill"></i>
                </a>
                <a
                  href="https://www.whatsapp.com/"
                  className="w-[23.844px] h-[23.844px] text-sm leading-[23.844px] text-black dark:text-white bg-gray-100 dark:bg-[#172036] rounded-full text-center transition-all hover:text-white hover:bg-primary-500"
                  target="_blank"
                >
                  <i className="ri-whatsapp-line"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ProductDetailsTabs */}
      <ProductDetailsTabs />
    </>
  );
};

export default ProductDetails;
