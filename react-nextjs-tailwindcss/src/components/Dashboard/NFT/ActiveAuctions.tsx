"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

// Auction data
const initialAuctionData = [
  {
    id: 1,
    image: "/images/nfts/auction1.gif",
    title: "Christmas Eve",
    viewLink: "/nft/nft-details",
    author: "John Lira",
    openPrice: "11.75 ETH",
    yourOffer: "10.00 ETH",
    recentOffer: {
      userImage: "/images/users/user58.jpg",
      amount: "10.00 ETH",
    },
    timeLeft: 9900, // Duration in seconds
  },
  {
    id: 2,
    image: "/images/nfts/auction2.gif",
    title: "Rotating Flower",
    viewLink: "/nft/nft-details",
    author: "WalterW.",
    openPrice: "9.25 ETH",
    yourOffer: "6.10 ETH",
    recentOffer: {
      userImage: "/images/users/user59.jpg",
      amount: "7.15 ETH",
    },
    timeLeft: 4860, // Duration in seconds
  },
  {
    id: 3,
    image: "/images/nfts/auction3.jpg",
    title: "Windows Art",
    viewLink: "/nft/nft-details",
    author: "Christino",
    openPrice: "17.24 ETH",
    yourOffer: "11.75 ETH",
    recentOffer: {
      userImage: "/images/users/user60.jpg",
      amount: "14.11 ETH",
    },
    timeLeft: 2580, // Duration in seconds
  },
  {
    id: 4,
    image: "/images/nfts/auction4.jpg",
    title: "3D Logo",
    viewLink: "/nft/nft-details",
    author: "Hater",
    openPrice: "12.12 ETH",
    yourOffer: "10.24 ETH",
    recentOffer: {
      userImage: "/images/users/user61.jpg",
      amount: "12.08 ETH",
    },
    timeLeft: 6600, // Duration in seconds
  },
  {
    id: 5,
    image: "/images/nfts/auction5.jpg",
    title: "Awesome Bird",
    viewLink: "/nft/nft-details",
    author: "Liveslong",
    openPrice: "8.15 ETH",
    yourOffer: "7.15 ETH",
    recentOffer: {
      userImage: "/images/users/user62.jpg",
      amount: "8.08 ETH",
    },
    timeLeft: 15300, // Duration in seconds
  },
  {
    id: 6,
    image: "/images/nfts/auction2.gif",
    title: "Rotating Flower",
    viewLink: "/nft/nft-details",
    author: "WalterW.",
    openPrice: "9.25 ETH",
    yourOffer: "6.10 ETH",
    recentOffer: {
      userImage: "/images/users/user59.jpg",
      amount: "7.15 ETH",
    },
    timeLeft: 4860, // Duration in seconds
  },
  {
    id: 7,
    image: "/images/nfts/auction1.gif",
    title: "Christmas Eve",
    viewLink: "/nft/nft-details",
    author: "John Lira",
    openPrice: "11.75 ETH",
    yourOffer: "10.00 ETH",
    recentOffer: {
      userImage: "/images/users/user58.jpg",
      amount: "10.00 ETH",
    },
    timeLeft: 9900, // Duration in seconds
  },
  {
    id: 8,
    image: "/images/nfts/auction4.jpg",
    title: "3D Logo",
    viewLink: "/nft/nft-details",
    author: "Hater",
    openPrice: "12.12 ETH",
    yourOffer: "10.24 ETH",
    recentOffer: {
      userImage: "/images/users/user61.jpg",
      amount: "12.08 ETH",
    },
    timeLeft: 6600, // Duration in seconds
  },
  {
    id: 9,
    image: "/images/nfts/auction3.jpg",
    title: "Windows Art",
    viewLink: "/nft/nft-details",
    author: "Christino",
    openPrice: "17.24 ETH",
    yourOffer: "11.75 ETH",
    recentOffer: {
      userImage: "/images/users/user60.jpg",
      amount: "14.11 ETH",
    },
    timeLeft: 2580, // Duration in seconds
  },
  {
    id: 10,
    image: "/images/nfts/auction5.jpg",
    title: "Awesome Bird",
    viewLink: "/nft/nft-details",
    author: "Liveslong",
    openPrice: "8.15 ETH",
    yourOffer: "7.15 ETH",
    recentOffer: {
      userImage: "/images/users/user62.jpg",
      amount: "8.08 ETH",
    },
    timeLeft: 15300, // Duration in seconds
  },
];

const ActiveAuctions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");
  const [auctionData, setAuctionData] = useState(initialAuctionData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle dropdown selection
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Handle pagination
  const totalPages = Math.ceil(auctionData.length / itemsPerPage);
  const currentData = auctionData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionData((prevData) =>
        prevData.map((auction) => ({
          ...auction,
          timeLeft: auction.timeLeft > 0 ? auction.timeLeft - 1 : 0,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time left
  const formatTime = (timeLeft: number) => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
      2,
      "0"
    )}m ${String(seconds).padStart(2, "0")}s`;
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Active Auctions</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="rezo-card-dropdown-btn inline-block rounded-md border border-gray-100 bg-gray-100 dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
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
                  Item
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Open Price
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Your Offer
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Recent Offer
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  Time Left
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0 ltr:last:text-right rtl:last:text-left">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {currentData.map((auction) => (
                <tr key={auction.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[50px]">
                        <Image
                          src={auction.image}
                          className="inline-block rounded-[6px]"
                          alt="auction-image"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div>
                        <span className="font-semibold inline-block mb-px">
                          {auction.title}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          by {auction.author}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {auction.openPrice}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {auction.yourOffer}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={auction.recentOffer.userImage}
                        className="w-[22px] rounded-full"
                        alt="user-image"
                        width={50}
                        height={50}
                      />
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {auction.recentOffer.amount}
                      </span>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {formatTime(auction.timeLeft)}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <Link
                      href={auction.viewLink}
                      className="inline-block rounded-full w-[30px] h-[30px] bg-gray-100 dark:bg-[#172036] text-center leading-[30px] text-[18px] text-gray-400 transition-all hover:bg-primary-500 hover:text-white"
                    >
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-[10px] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-sm">
            Showing {currentData.length} of {auctionData.length} results
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

export default ActiveAuctions;
