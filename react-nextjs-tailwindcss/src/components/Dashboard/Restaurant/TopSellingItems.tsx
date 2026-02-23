"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  sold: number;
  viewLink: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Thai Bean Soup",
    image: "/images/products/product28.jpg",
    rating: 5.0,
    sold: 1235,
    viewLink: "/ecommerce/product-details/",
  },
  {
    id: 2,
    name: "Meat Lasagna",
    image: "/images/products/product29.jpg",
    rating: 4.8,
    sold: 1045,
    viewLink: "/ecommerce/product-details/",
  },
  {
    id: 3,
    name: "Veg Sandwich",
    image: "/images/products/product30.jpg",
    rating: 4.9,
    sold: 1015,
    viewLink: "/ecommerce/product-details/",
  },
  {
    id: 4,
    name: "Creamy Fish",
    image: "/images/products/product31.jpg",
    rating: 4.7,
    sold: 996,
    viewLink: "/ecommerce/product-details/",
  },
];

const TopSellingItems: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Weekly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Selling Items</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-[#F5F7F8] bg-[#F5F7F8] dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Weekly", "Monthly", "Yearly"].map((option) => (
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
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[25px]">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <div className="bg-[#212529] rounded-[30px] absolute top-1 ltr:right-1 rtl:left-1 py-1 px-1 flex items-center leading-none text-white gap-1">
                  <i className="ri-star-fill text-orange-500"></i>
                  <span className="block relative top-px text-xs font-semibold">
                    {product.rating.toFixed(1)}
                  </span>
                </div>

                <Link
                  href={product.viewLink}
                  className="block rounded-md mb-4 h-[137px] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${product.image})` }}
                ></Link>

                <h6 className="!mb-1 !font-semibold !text-base">
                  <Link
                    href={product.viewLink}
                    className="transition-all hover:text-primary-500"
                  >
                    {product.name}
                  </Link>
                </h6>
                <span className="block text-xs">{product.sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopSellingItems;
