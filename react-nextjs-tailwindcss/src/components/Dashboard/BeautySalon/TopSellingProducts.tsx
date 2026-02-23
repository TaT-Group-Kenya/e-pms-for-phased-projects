"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  soldCount: number;
  imageUrl: string;
  href: string;
}

const TopSellingProducts: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Month");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Sample product data
  const products: Product[] = [
    {
      id: 1,
      name: "Hair Treatment",
      price: 23.5,
      soldCount: 321,
      imageUrl: "/images/products/product24.jpg",
      href: "/ecommerce/product-details/",
    },
    {
      id: 2,
      name: "Focial Kit",
      price: 20.5,
      soldCount: 124,
      imageUrl: "/images/products/product25.jpg",
      href: "/ecommerce/product-details/",
    },
    {
      id: 3,
      name: "Winter Cream",
      price: 12.43,
      soldCount: 99,
      imageUrl: "/images/products/product26.jpg",
      href: "/ecommerce/product-details/",
    },
    {
      id: 4,
      name: "Perfume",
      price: 22.12,
      soldCount: 23,
      imageUrl: "/images/products/product27.jpg",
      href: "/ecommerce/product-details/",
    },
    {
      id: 5,
      name: "Shampoo & Conditioner",
      price: 18.99,
      soldCount: 75,
      imageUrl: "/images/products/product28.jpg",
      href: "/ecommerce/product-details/",
    },
    {
      id: 6,
      name: "Aloe Vera Gel",
      price: 10.0,
      soldCount: 210,
      imageUrl: "/images/products/product29.jpg",
      href: "/ecommerce/product-details/",
    },
    {
      id: 7,
      name: "Organic Face Wash",
      price: 15.25,
      soldCount: 156,
      imageUrl: "/images/products/product30.jpg",
      href: "/ecommerce/product-details/",
    },
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Selling Products</h5>
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

        <div className="trezo-card-content relative">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 3,
              },
              1440: {
                spaceBetween: 25,
                slidesPerView: 4,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="top-selling-products-slides"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <Link
                  href={product.href}
                  className="h-[183px] rounded-md block bg-no-repeat bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></Link>
                <div className="flex justify-between mt-[15px]">
                  <div>
                    <h6 className="!text-base !font-semibold !mb-[4px]">
                      <Link
                        href={product.href}
                        className="text-black dark:text-white transition-all hover:text-primary-500"
                      >
                        {product.name}
                      </Link>
                    </h6>
                    <span className="block font-semibold text-primary-800">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block text-xs rounded-[30px] px-[10px] border border-success-300 text-success-700 bg-success-100 dark:border-[#15203c] dark:bg-[#15203c]">
                      {product.soldCount}
                    </span>
                    <span className="text-xs block mt-[2px]">sold</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default TopSellingProducts;
