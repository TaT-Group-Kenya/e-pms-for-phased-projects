"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Sample data for top properties
const topPropertiesData = [
  {
    id: 1,
    image: "/images/properties/top1.jpg",
    type: "Industrial",
    address: "36 Clay Street Indianapolis",
  },
  {
    id: 2,
    image: "/images/properties/top2.jpg",
    type: "Office",
    address: "07 Maple Street Los Angeles",
  },
  {
    id: 3,
    image: "/images/properties/top3.jpg",
    type: "Multi-Family",
    address: "94 Brooke Street Houston",
  },
  {
    id: 4,
    image: "/images/properties/top4.jpg",
    type: "Retail",
    address: "84 Pick Street Centennial",
  },
];

const TopProperty: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Day");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Property</h5>
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

        <div className="trezo-card-content">
          {topPropertiesData.map((property) => (
            <div
              key={property.id}
              className="flex items-center gap-[12px] mb-[13px] last:mb-0"
            >
              <Image
                src={property.image}
                className="w-[40px] rounded-[5px]"
                alt="top-image"
                width={40}
                height={40}
              />
              <div>
                <a
                  href="#"
                  className="inline-block font-semibold sm:text-[15px] md:text-md text-black dark:text-white transition-all hover:text-primary-500"
                >
                  {property.type}
                </a>
                <span className="block">{property.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TopProperty;
