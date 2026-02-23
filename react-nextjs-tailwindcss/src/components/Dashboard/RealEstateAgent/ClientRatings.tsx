"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

type Rating = {
  id: number;
  name: string;
  avatar: string;
  location: string;
  comment: string;
  rating: number;
  bgColor: "primary" | "orange" | "success"; // Add more colors as needed
};

const ClientRatings: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Top Rated");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Dynamic ratings data
  const ratingsData: Rating[] = [
    {
      id: 1,
      name: "David Carlen",
      avatar: "/images/users/user72.jpg",
      location: "New Castle, United Kingdom",
      comment:
        "Working with William was an absolute pleasure. His market knowledge and attention to detail helped us sell our home quickly and at a great price.",
      rating: 5.0,
      bgColor: "primary",
    },
    {
      id: 2,
      name: "Zinia Anderson",
      avatar: "/images/users/user76.jpg",
      location: "New Brunchwick, Canada",
      comment:
        "William's professionalism and responsiveness set him apart from other agents. He listened, and delivered outstanding results.",
      rating: 4.5,
      bgColor: "orange",
    },
    {
      id: 3,
      name: "Walter White",
      avatar: "/images/users/user75.jpg",
      location: "New York, USA",
      comment:
        "Thanks to William, I felt confident every step of the way during my first home purchase. His friendly demeanor and expert advice helped us.",
      rating: 4.0,
      bgColor: "success",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      avatar: "/images/users/user74.jpg",
      location: "Los Angeles, USA",
      comment:
        "Exceptional service from start to finish. William went above and beyond to find us our dream home within our budget.",
      rating: 5.0,
      bgColor: "primary",
    },
  ];

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-line"></i>);
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line"></i>);
    }

    return stars;
  };

  // Get background color class
  const getBgColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-50 dark:bg-[#0a0e19]";
      case "orange":
        return "bg-orange-50 dark:bg-[#0a0e19]";
      case "success":
        return "bg-success-50 dark:bg-[#0a0e19]";
      default:
        return "bg-primary-50 dark:bg-[#0a0e19]";
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Client Ratings</h5>
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
              {["Top Rated", "Latest", "Oldest"].map((option) => (
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

      <div className="trezo-card-content" id="clientRatingsSlides">
        <Swiper
          spaceBetween={20}
          autoHeight={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              spaceBetween: 25,
              slidesPerView: 2,
            },
            1024: {
              spaceBetween: 25,
              slidesPerView: 3,
            },
            1440: {
              spaceBetween: 25,
              slidesPerView: 3,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {ratingsData.map((rating) => (
            <SwiperSlide key={rating.id}>
              <div
                className={`p-[20px] md:p-[25px] ${getBgColorClass(
                  rating.bgColor
                )} rounded-md`}
              >
                <div className="flex items-center gap-[12px] mb-[20px] md:mb-[25px]">
                  <Image
                    src={rating.avatar}
                    alt="user-image"
                    className="rounded-full w-[38px]"
                    width={38}
                    height={38}
                  />
                  <div>
                    <h6 className="!font-semibold !text-base !mb-[3px]">
                      {rating.name}
                    </h6>
                    <span className="block text-xs">{rating.location}</span>
                  </div>
                </div>
                <p className="text-black dark:text-white !text-md !leading-[1.5]">
                  &quot;{rating.comment}&ldquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-base flex items-center leading-none gap-[1px] text-orange-500">
                    {renderStars(rating.rating)}
                    <span className="relative text-gray-500 dark:text-gray-400 top-[1.7px] text-xs ltr:ml-[2px] rtl:mr-[2px]">
                      {rating.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-[30px] text-white leading-none">
                    <i className="ri-double-quotes-r"></i>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ClientRatings;
