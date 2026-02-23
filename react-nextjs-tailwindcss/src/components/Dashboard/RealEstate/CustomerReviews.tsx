"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Sample data for reviews
const reviewsData = [
  {
    id: 1,
    name: "Jose Grafton",
    image: "/images/users/user64.jpg",
    time: "5m ago",
    rating: 4.5,
    comment:
      "Impressed with the timely responses and professional approach. Highly recommend for anyone seeking real estate solutions!",
    period: "This Day",
  },
  {
    id: 2,
    name: "Irene George",
    image: "/images/users/user65.jpg",
    time: "10m ago",
    rating: 5,
    comment:
      "Great service! Found exactly what I needed for my property, and the process was smooth and hassle-free.",
    period: "This Day",
  },
  {
    id: 3,
    name: "Paula McClelland",
    image: "/images/users/user63.jpg",
    time: "15m ago",
    rating: 4,
    comment:
      "The entire process was seamless, and I couldn't be happier with the results. Excellent customer service throughout!",
    period: "This Day",
  },
  {
    id: 4,
    name: "Irene George",
    image: "/images/users/user65.jpg",
    time: "10m ago",
    rating: 5,
    comment:
      "Great service! Found exactly what I needed for my property, and the process was smooth and hassle-free.",
    period: "This Week",
  },
  {
    id: 5,
    name: "Jose Grafton",
    image: "/images/users/user64.jpg",
    time: "5m ago",
    rating: 4.5,
    comment:
      "Impressed with the timely responses and professional approach. Highly recommend for anyone seeking real estate solutions!",
    period: "This Week",
  },
  {
    id: 6,
    name: "Paula McClelland",
    image: "/images/users/user63.jpg",
    time: "15m ago",
    rating: 4,
    comment:
      "The entire process was seamless, and I couldn't be happier with the results. Excellent customer service throughout!",
    period: "This Month",
  },
  {
    id: 7,
    name: "Irene George",
    image: "/images/users/user65.jpg",
    time: "10m ago",
    rating: 5,
    comment:
      "Great service! Found exactly what I needed for my property, and the process was smooth and hassle-free.",
    period: "This Month",
  },
  {
    id: 8,
    name: "Jose Grafton",
    image: "/images/users/user64.jpg",
    time: "5m ago",
    rating: 4.5,
    comment:
      "Impressed with the timely responses and professional approach. Highly recommend for anyone seeking real estate solutions!",
    period: "This Year",
  },
  {
    id: 9,
    name: "Irene George",
    image: "/images/users/user65.jpg",
    time: "10m ago",
    rating: 5,
    comment:
      "Great service! Found exactly what I needed for my property, and the process was smooth and hassle-free.",
    period: "This Year",
  },
];

const CustomerReviews: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("This Day");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Filter reviews based on the selected option
  const filteredReviews = reviewsData.filter(
    (review) => review.period === selectedOption
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-m">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Customer Reviews</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
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

        <div className="trezo-card-content" id="customerReviewsSlides">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              1024: {
                slidesPerView: 2,
              },
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            modules={[Autoplay, Pagination]}
          >
            {filteredReviews.map((review) => (
              <SwiperSlide
                key={review.id}
                className="bg-gray-50 dark:bg-[#0a0e19] rounded-md py-[20px] md:py-[25px] px-[20px]"
              >
                <div className="sm:flex items-center justify-between mb-[10px] sm:mb-[12px]">
                  <div className="flex items-center gap-[12px]">
                    <Image
                      src={review.image}
                      className="w-[45px] rounded-full"
                      alt="user-image"
                      width={45}
                      height={45}
                    />
                    <div>
                      <span className="block sm:text-[15px] text-black dark:text-white font-semibold">
                        {review.name}
                      </span>
                      <span className="block">{review.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[3px] mt-[15px] sm:mt-0">
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        key={index}
                        className={`ri-star-${
                          index + 1 <= Math.floor(review.rating)
                            ? "fill"
                            : review.rating % 1 !== 0 &&
                              index === Math.floor(review.rating)
                            ? "half-fill"
                            : "line"
                        } text-orange-500`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="md:max-w-[365px]">{review.comment}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default CustomerReviews;
