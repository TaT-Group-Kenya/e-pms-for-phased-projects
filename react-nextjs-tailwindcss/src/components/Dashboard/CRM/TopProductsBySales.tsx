"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type Product = {
  name: string;
  brand: string;
  icon: string;
  iconClass: string; // For styling the icon (e.g., "text-primary-500 bg-primary-100")
  sales: string;
  link: string;
};

const products: Product[] = [
  {
    name: "Samsung Galaxy",
    brand: "Samsung",
    icon: "smartphone",
    iconClass: "text-primary-500 bg-primary-100",
    sales: "$96,455",
    link: "product-details.html",
  },
  {
    name: "iPhone 15 Plus",
    brand: "Apple inc.",
    icon: "tap_and_play",
    iconClass: "text-purple-500 bg-purple-100",
    sales: "$89,670",
    link: "product-details.html",
  },
  {
    name: "Vivo V30",
    brand: "Vivo Ltd.",
    icon: "edgesensor_low",
    iconClass: "text-danger-500 bg-danger-100",
    sales: "$75,329",
    link: "product-details.html",
  },
  {
    name: "Watch Series 7",
    brand: "Apple",
    icon: "watch",
    iconClass: "text-success-500 bg-success-100",
    sales: "$98,256",
    link: "product-details.html",
  },
  {
    name: "Sony WF-SP800N",
    brand: "Sony",
    icon: "headphones",
    iconClass: "text-secondary-500 bg-secondary-100",
    sales: "$65,987",
    link: "product-details.html",
  },
];

const TopProductsBySales: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Products by Sales</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
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
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <ul>
            {products.map((product, index) => (
              <li
                key={index}
                className="flex items-center justify-between border-b border-gray-100 dark:border-[#172036] pb-[14px] mb-[15px] last:mb-0 last:pb-0 last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className={`${product.iconClass} dark:bg-[#15203c] flex items-center justify-center w-[48px] h-[48px] ltr:mr-[15px] rtl:ml-[15px] rounded-sm`}
                  >
                    <i className="material-symbols-outlined">{product.icon}</i>
                  </div>
                  <div>
                    <a
                      href={product.link}
                      className="block mb-[2px] text-black dark:text-white font-medium transition-all hover:text-primary-500"
                    >
                      {product.name}
                    </a>
                    <span className="block">{product.brand}</span>
                  </div>
                </div>
                <span className="block text-black dark:text-white font-medium">
                  {product.sales}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TopProductsBySales;
