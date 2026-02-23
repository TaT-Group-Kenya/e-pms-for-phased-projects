"use client";

import React from "react";
import Image from "next/image"; 

const Content: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="relative rounded-md">
            <Image
              src="/images/properties/property-details.jpg"
              className="inline-block rounded-md"
              alt="property-details-image"
              width={1000}
              height={578}
            />
            <span className="absolute top-[20px] ltr:right-[20px] rtl:left-[20px] inline-block rounded-[4px] bg-success-100 text-success-600 text-xs py-px px-[10px]">
              Sale
            </span>
          </div>

          <h3 className="text-lg mb-[9px] mt-[20px] text-orange-500">
            $18,000
          </h3>

          <span className="block relative pt-px ltr:pl-[22px] rtl:pr-[22px]">
            <i className="material-symbols-outlined text-primary-500 absolute ltr:-left-[2px] rtl:-right-[2px] top-1/2 -translate-y-1/2 !text-[19px]">
              location_on
            </i>
            35 Prince Consort Road
          </span>

          <div className="mt-[17px] sm:flex items-center justify-between py-[10px] border-y border-primary-50 dark:border-[#172036]">
            <ul className="mb-[10px] sm:mb-0">
              <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                  bed
                </i>
                6Bed
              </li>
              <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                  bathtub
                </i>
                5Bath
              </li>
              <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                  square_foot
                </i>
                1800sqft
              </li>
            </ul>
            <div className="flex items-center gap-[3px]">
              <i className="ri-star-fill text-orange-500"></i>
              <i className="ri-star-fill text-orange-500"></i>
              <i className="ri-star-fill text-orange-500"></i>
              <i className="ri-star-fill text-orange-500"></i>
              <i className="ri-star-fill text-orange-500"></i>
              <span className="block">4.9(Review)</span>
            </div>
          </div>

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Description
          </h3>
          <p>
            This stunning 4-bedroom, 3-bathroom residence offers 2,000 square
            feet of modern living space in a quiet, family-friendly
            neighborhood. Built in 2010, the home features a spacious layout
            with a bright and airy living room, perfect for relaxation or
            entertaining guests. The beautifully updated kitchen includes
            granite countertops and stainless steel appliances, ideal for home
            cooking.
          </p>
          <p>
            The master suite boasts an en-suite bathroom and plenty of closet
            space, while the additional bedrooms are perfect for family or
            guests. Step outside to your private backyard, complete with a deck
            for outdoor dining and a well-maintained garden area.
          </p>

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Features
          </h3>
          <ul>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Spacious living room with natural light
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Modern kitchen with granite countertops
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Master bedroom with en-suite bathroom
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Private backyard with deck
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              2-car garage
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Central heating and air conditioning
            </li>
          </ul>

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Neighborhood
          </h3>
          <ul>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Located in a quiet residential area with nearby parks
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Close to schools, shopping centers, and public transportation
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Safe and family-friendly community
            </li>
          </ul>

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Location
          </h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.94539481518!2d-74.26675559025065!3d40.69739290398433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1678355274384!5m2!1sen!2sbd"
            className="w-full rounded-md border-0 h-[250px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Recent Renovations
          </h3>
          <ul>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              New roof installed in 2023
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Fresh paint throughout the interior in 2024
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Updated appliances in the kitchen
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Content;
