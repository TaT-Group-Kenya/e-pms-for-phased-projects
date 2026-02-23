"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import SwiperCore from "swiper";

// Interface for property details
interface PropertyImage {
  id: string;
  src: string;
  alt: string;
}

interface PropertyDetails {
  status: string;
  images: PropertyImage[];
}

const PropertyDetailsContent: React.FC = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  // Dynamic property data (can be passed as props or fetched from an API)
  const property: PropertyDetails = {
    status: "For Sale",
    images: [
      {
        id: "1",
        src: "/images/properties/property-details1.jpg",
        alt: "property-details-image-1",
      },
      {
        id: "2",
        src: "/images/properties/property-details2.jpg",
        alt: "property-details-image-2",
      },
      {
        id: "3",
        src: "/images/properties/property-details3.jpg",
        alt: "property-details-image-3",
      },
      {
        id: "4",
        src: "/images/properties/property-details4.jpg",
        alt: "property-details-image-4",
      },
    ],
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="xl:col-span-1">
          <div className="trezo-card">
            <div
              className="trezo-card-content relative" 
            >
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="property-details-image-slides"
              >
                {property.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="bg-white dark:bg-[#0c1427] p-[13px]">
                      <Image
                        className="rounded-md w-full"
                        src={image.src}
                        alt={image.alt}
                        width={640}
                        height={660}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={(swiper) => setThumbsSwiper(swiper)}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper mt-[15px]"
              >
                {property.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <Image
                      className="rounded-md cursor-pointer"
                      src={image.src}
                      alt={image.alt}
                      width={500}
                      height={500}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <span className="inline-block absolute top-[25px] ltr:right-[25px] rtl:left-[25px] bg-primary-50 dark:bg-[#0c1427] text-primary-500 text-xs font-medium py-[2px] px-[8px] rounded-[4px] z-[1]">
                {property.status}
              </span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md lg:h-full">
            <div className="trezo-card-content">
              <div className="sm:flex items-center justify-between">
                <div>
                  <span className="block text-xs">Code: TRZ-32</span>
                  <h3 className="!text-[20px] md:!text-xl !mb-[10px] mt-[7px]">
                    The Golden Haven
                  </h3>
                  <span className="block ltr:pl-[23px] rtl:pr-[23px] font-semibold relative">
                    <i className="ri-map-pin-line absolute ltr:left-0 rtl:right-0 text-primary-500 top-1/2 -translate-y-1/2 text-[17px] font-normal mt-px"></i>
                    123 Sunshine Boulevard, Vancouver, BC
                  </span>
                </div>
                <div className="mt-[12px] sm:mt-0 flex items-center leading-none gap-[2px]">
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

              <div className="sm:flex items-center justify-between border-t border-b border-gray-100 dark:border-[#172036] my-[20px] md:my-[25px] py-[12px]">
                <ul className="flex items-center gap-[15px] md:gap-[20px] lg:gap-[25px]">
                  <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-lg">
                      open_run
                    </i>
                    425 sft
                  </li>
                  <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-lg">
                      bed
                    </i>
                    3 Beds
                  </li>
                  <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-lg">
                      bathtub
                    </i>
                    2 Baths
                  </li>
                </ul>
                <div className="mt-[10px] sm:mt-0 font-bold text-black dark:text-white text-lg">
                  $4,274/m
                </div>
              </div>

              <h4 className="!text-lg !mb-[13px]">Property Description</h4>
              <p>
                Nestled in a serene neighborhood, this modern 3-bedroom home
                boasts an open-concept layout with abundant natural light. The
                chef’s kitchen features state-of-the-art appliances and a
                spacious island for entertaining.
              </p>
              <p>
                Enjoy the tranquility of a private backyard oasis with a patio
                and lush landscaping. Located minutes from top-rated schools,
                shopping, and parks, it offers convenience and comfort. This
                home is the perfect blend of style and functionality.
              </p>

              <div className="mb-[20px] md:mb-[25px]"></div>

              <h4 className="!text-lg !mb-[13px]">Property Details</h4>
              <ul className="mb-[20px] md:mb-[25px] grid grid-cols-1 sm:grid-cols-2">
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Beds</span>
                  <span className="block">
                    <span className="text-black dark:text-white">03</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Ceiling Height</span>
                  <span className="block">
                    <span className="text-black dark:text-white">3.20</span> m
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Baths</span>
                  <span className="block">
                    <span className="text-black dark:text-white">02</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Property Type</span>
                  <span className="block">
                    <span className="text-black dark:text-white">Villa</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Floor</span>
                  <span className="block">
                    <span className="text-black dark:text-white">Ground</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Year Built</span>
                  <span className="block">
                    <span className="text-black dark:text-white">2010</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Garage</span>
                  <span className="block">
                    <span className="text-black dark:text-white">Yes</span>
                  </span>
                </li>
                <li className="flex items-center justify-between py-[10px] px-[20px] border border-gray-100 dark:border-[#15203c]">
                  <span className="block">Status</span>
                  <span className="block">
                    <span className="text-black dark:text-white">For Sale</span>
                  </span>
                </li>
              </ul>

              <h4 className="!text-lg !mb-[13px]">Amenities</h4>
              <div className="mb-[20px] md:mb-[25px] grid grid-cols-1 sm:grid-cols-4 gap-[12px]">
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  A/C & Heating
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Parking
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  WiFi
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Pet Friendly
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Furniture
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Ceiling Height
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Play Ground
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Elevator
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Garage
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Fireplace
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Garden
                </div>
                <div className="relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="ri-check-line absolute top-1/2 -translate-y-1/2 ltr:-left-[3px] rtl:-right-[3px] text-primary-500 text-lg"></i>
                  Disabled Access
                </div>
              </div>
              
              <h4 className="!text-lg !mb-[13px]">Location</h4>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.94539481518!2d-74.26675559025065!3d40.69739290398433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1678355274384!5m2!1sen!2sbd"
                className="w-full rounded-md border-0 h-[250px]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailsContent;
