"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Seller data
const sellerData = [
  {
    id: 1,
    image: "/images/users/user58.jpg",
    name: "Johhna Loren",
    location: "Queensland",
    deliveries: 6240,
    earnings: "624 ETH",
    rating: 5.0,
  },
  {
    id: 2,
    image: "/images/users/user53.jpg",
    name: "Skyler White",
    location: "Neverdies",
    deliveries: 5135,
    earnings: "597 ETH",
    rating: 4.5,
  },
  {
    id: 3,
    image: "/images/users/user37.jpg",
    name: "Jonathon Watson",
    location: "Emoticons",
    deliveries: 4321,
    earnings: "413 ETH",
    rating: 4.0,
  },
  {
    id: 4,
    image: "/images/users/user36.jpg",
    name: "Walter White",
    location: "Puzzleworld",
    deliveries: 3124,
    earnings: "321 ETH",
    rating: 3.5,
  },
  {
    id: 5,
    image: "/images/users/user30.jpg",
    name: "David Carlen",
    location: "Liveslong",
    deliveries: 2137,
    earnings: "246 ETH",
    rating: 5.0,
  },
  {
    id: 6,
    image: "/images/users/user53.jpg",
    name: "Skyler White",
    location: "Neverdies",
    deliveries: 5135,
    earnings: "597 ETH",
    rating: 4.5,
  },
  {
    id: 7,
    image: "/images/users/user58.jpg",
    name: "Johhna Loren",
    location: "Queensland",
    deliveries: 6240,
    earnings: "624 ETH",
    rating: 5.0,
  },
  {
    id: 8,
    image: "/images/users/user37.jpg",
    name: "Jonathon Watson",
    location: "Emoticons",
    deliveries: 4321,
    earnings: "413 ETH",
    rating: 4.0,
  },
  {
    id: 9,
    image: "/images/users/user30.jpg",
    name: "David Carlen",
    location: "Liveslong",
    deliveries: 2137,
    earnings: "246 ETH",
    rating: 5.0,
  },
  {
    id: 10,
    image: "/images/users/user36.jpg",
    name: "Walter White",
    location: "Puzzleworld",
    deliveries: 3124,
    earnings: "321 ETH",
    rating: 3.5,
  },
];

const MostPopularSellers: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(sellerData.length / itemsPerPage);

  // Get current page data
  const currentData = sellerData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <i key={`full-${index}`} className="ri-star-fill text-orange-500"></i>
        ))}
        {halfStar && (
          <i key="half" className="ri-star-half-fill text-orange-500"></i>
        )}
        {Array.from({ length: emptyStars }, (_, index) => (
          <i
            key={`empty-${index}`}
            className="ri-star-line text-orange-500"
          ></i>
        ))}
        <span className="block relative top-px text-xs text-gray-500 dark:text-gray-400 ltr:ml-[2px] rtl:mr-[2px]">
          {rating.toFixed(1)}
        </span>
      </>
    );
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Most Popular Sellers</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 bg-gray-100 dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
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
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Sellers
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Deliveries
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Earnings
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Ratings
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {currentData.map((seller) => (
                <tr key={seller.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[40px]">
                        <Image
                          src={seller.image}
                          className="inline-block rounded-full"
                          alt="user-image"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className="font-semibold inline-block mb-px">
                          {seller.name}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          {seller.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {seller.deliveries}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {seller.earnings}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center leading-none gap-[2px]">
                      {renderStars(seller.rating)}
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <a
                      href="nft-details.html"
                      className="inline-block rounded-full w-[30px] h-[30px] bg-gray-100 dark:bg-[#172036] text-center leading-[30px] text-[18px] text-gray-400 transition-all hover:bg-primary-500 hover:text-white"
                    >
                      <i className="ri-arrow-right-line"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-[10px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-sm">
            Showing {currentData.length} of {sellerData.length} results
          </p>

          <ol className="mt-[10px] sm:mt-0">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
              >
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                    currentPage === index + 1
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_right
                </i>
              </button>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MostPopularSellers;
