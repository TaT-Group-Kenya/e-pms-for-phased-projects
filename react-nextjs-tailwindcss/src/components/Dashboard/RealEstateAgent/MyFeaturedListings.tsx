"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  location: string;
  type: "rent" | "sale";
  price: string;
  imageUrl: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  viewLink: string;
}

const MyFeaturedListings: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const listings: Listing[] = [
    {
      id: "1",
      title: "White House Villa",
      location: "New Castle, United Kingdom",
      type: "rent",
      price: "$3,124/m",
      imageUrl: "/images/properties/property13.jpg",
      size: "321 Sft",
      bedrooms: 2,
      bathrooms: 2,
      viewLink: "/real-estate-agent/property-details/",
    },
    {
      id: "2",
      title: "Luxury Comfort Villa",
      location: "London, United Kingdom",
      type: "sale",
      price: "$4,274/m",
      imageUrl: "/images/properties/property14.jpg",
      size: "425 Sft",
      bedrooms: 3,
      bathrooms: 2,
      viewLink: "/real-estate-agent/property-details/",
    },
    {
      id: "3",
      title: "Modern City Apartment",
      location: "Manchester, United Kingdom",
      type: "rent",
      price: "$2,850/m",
      imageUrl: "/images/properties/property13.jpg",
      size: "380 Sft",
      bedrooms: 2,
      bathrooms: 1,
      viewLink: "/real-estate-agent/property-details/",
    },
    {
      id: "4",
      title: "Countryside Cottage",
      location: "Cotswolds, United Kingdom",
      type: "sale",
      price: "$5,500/m",
      imageUrl: "/images/properties/property14.jpg",
      size: "520 Sft",
      bedrooms: 4,
      bathrooms: 3,
      viewLink: "/real-estate-agent/property-details/",
    },
  ];

  const getListingBadgeStyle = (type: Listing["type"]) => {
    return type === "rent"
      ? "bg-danger-100 text-danger-700"
      : "bg-success-100 text-success-700";
  };

  return (
    <div className="trezo-card bg-orange-100 dark:bg-[#15203c] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">My Featured Listings</h5>
        </div>
      </div>

      <div
        className="trezo-card-content relative"
        id="myFeaturedListingsSlides"
      >
        <Swiper
          spaceBetween={20}
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
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {listings.map((listing) => (
            <SwiperSlide key={listing.id}>
              <div className="bg-white rounded-md dark:bg-[#0c1427]">
                <div
                  className="relative h-[202.5px] bg-center bg-cover bg-no-repeat rounded-t-md"
                  style={{
                    backgroundImage: `url(${listing.imageUrl})`,
                  }}
                >
                  <span
                    className={`inline-block absolute top-[10px] ltr:left-[10px] rtl:right-[10px] text-xs font-medium py-[2px] px-[8px] rounded-[4px] ${getListingBadgeStyle(
                      listing.type
                    )}`}
                  >
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <div className="p-[20px]">
                  <h6 className="!text-md !mb-[5px] !font-semibold">
                    <Link
                      href={listing.viewLink}
                      className="transition-all hover:text-primary-500"
                    >
                      {listing.title}
                    </Link>
                  </h6>

                  <span className="block">{listing.location}</span>

                  <ul className="mt-[13px] flex items-center justify-between">
                    <li className="text-xs text-black dark:text-white relative ltr:pl-[23px] rtl:pr-[23px]">
                      <i className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 !text-lg ltr:left-0 rtl:right-0 text-gray-400">
                        open_run
                      </i>
                      {listing.size}
                    </li>
                    <li className="text-xs text-black dark:text-white relative ltr:pl-[23px] rtl:pr-[23px]">
                      <i className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 !text-lg ltr:left-0 rtl:right-0 text-gray-400">
                        bed
                      </i>
                      {listing.bedrooms} Bed
                    </li>
                    <li className="text-xs text-black dark:text-white relative ltr:pl-[23px] rtl:pr-[23px]">
                      <i className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 !text-lg ltr:left-0 rtl:right-0 text-gray-400">
                        bathtub
                      </i>
                      {listing.bathrooms} Bath
                    </li>
                  </ul>

                  <div className="flex items-center justify-between mt-[13px] pt-[13px] border-t border-gray-100 dark:border-[#172036]">
                    <div className="text-md text-black dark:text-white font-bold leading-none">
                      {listing.price}
                    </div>
                    <Link
                      href={listing.viewLink}
                      className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-gray-100 dark:bg-[#15203c] transition-all hover:text-white hover:bg-primary-500"
                    >
                      <i className="ri-arrow-right-line"></i>
                    </Link>
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

export default MyFeaturedListings;
