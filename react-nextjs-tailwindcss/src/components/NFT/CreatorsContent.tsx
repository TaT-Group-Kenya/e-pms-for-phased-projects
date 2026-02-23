"use client";

import React, { useState } from "react";
import Image from "next/image";

// Define the data structure for creators
interface Creator {
  id: number;
  banner: string;
  avatar: string;
  name: string;
  items: number;
  isFollowing: boolean;
}

// Initial data for creators
const initialCreators: Creator[] = [
  {
    id: 1,
    banner: "/images/nfts/creator1.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Hunny Bunny",
    items: 3204,
    isFollowing: false,
  },
  {
    id: 2,
    banner: "/images/nfts/creator2.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Aristocrat",
    items: 5301,
    isFollowing: false,
  },
  {
    id: 3,
    banner: "/images/nfts/creator3.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Hooman Robotic",
    items: 4213,
    isFollowing: true,
  },
  {
    id: 4,
    banner: "/images/nfts/creator4.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Colorful Life",
    items: 2314,
    isFollowing: false,
  },
  {
    id: 5,
    banner: "/images/nfts/creator5.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Digital Mystic",
    items: 3652,
    isFollowing: true,
  },
  {
    id: 6,
    banner: "/images/nfts/creator6.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Pixel Warrior",
    items: 2998,
    isFollowing: false,
  },
  {
    id: 7,
    banner: "/images/nfts/creator7.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Neon Dreamer",
    items: 4120,
    isFollowing: false,
  },
  {
    id: 8,
    banner: "/images/nfts/creator8.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Abstract Vision",
    items: 2894,
    isFollowing: true,
  },
  {
    id: 9,
    banner: "/images/nfts/creator1.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Futuristic Soul",
    items: 5240,
    isFollowing: false,
  },
  {
    id: 10,
    banner: "/images/nfts/creator2.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Retro King",
    items: 3675,
    isFollowing: true,
  },
  {
    id: 11,
    banner: "/images/nfts/creator3.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Cyber Punk",
    items: 3999,
    isFollowing: false,
  },
  {
    id: 12,
    banner: "/images/nfts/creator4.jpg",
    avatar: "/images/nfts/user.gif",
    name: "Surreal Vibes",
    items: 4702,
    isFollowing: true,
  },
];

const CreatorsContent: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>(initialCreators); // Manage creators state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate the current creators to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCreators = creators.slice(indexOfFirstItem, indexOfLastItem);

  // Handle follow/unfollow
  const handleFollowToggle = (id: number) => {
    const updatedCreators = creators.map((creator) =>
      creator.id === id
        ? { ...creator, isFollowing: !creator.isFollowing }
        : creator
    );
    setCreators(updatedCreators); // Update the state
  };

  // Handle pagination
  const totalPages = Math.ceil(creators.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Filter</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[15px] sm:gap-[20px]">
              <div>
                <input
                  type="text"
                  className="h-[44px] rounded-md text-black dark:text-white bg-gray-50 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Search"
                />
              </div>
              <div>
                <select className="h-[44px] rounded-md bg-gray-50 dark:bg-[#0a0e19] px-[13px] block w-full outline-0 cursor-pointer">
                  <option value={0}>Category</option>
                  <option value={1}>Bird</option>
                  <option value={2}>Pool</option>
                  <option value={3}>Watermelon</option>
                  <option value={4}>Flower</option>
                  <option value={5}>Cookies</option>
                </select>
              </div>
              <div>
                <select className="h-[44px] rounded-md bg-gray-50 dark:bg-[#0a0e19] px-[13px] block w-full outline-0 cursor-pointer">
                  <option value={0}>File Type</option>
                  <option value={1}>.zip</option>
                  <option value={2}>.jpg</option>
                  <option value={3}>.png</option>
                  <option value={4}>.gif</option>
                  <option value={5}>.pdf</option>
                </select>
              </div>
              <div>
                <select className="h-[44px] rounded-md bg-gray-50 dark:bg-[#0a0e19] px-[13px] block w-full outline-0 cursor-pointer">
                  <option value={0}>Featured</option>
                  <option value={1}>Bird</option>
                  <option value={2}>Pool</option>
                  <option value={3}>Watermelon</option>
                  <option value={4}>Flower</option>
                  <option value={5}>Cookies</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[25px]">
            {currentCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white dark:bg-[#0c1427] p-[10px] rounded-md"
              >
                <Image
                  src={creator.banner}
                  className="rounded-md"
                  alt="creator-image"
                  width={484}
                  height={252}
                />
                <div className="text-center -mt-[34px]">
                  <div className="relative mb-[15px] inline-block">
                    <Image
                      src={creator.avatar}
                      className="rounded-full inline-block w-[68px]"
                      alt="user-image"
                      width={68}
                      height={68}
                    />
                    <Image
                      src="/images/nfts/verified2.svg"
                      className="absolute bottom-0 ltr:right-0 rtl:left-0"
                      alt="verified"
                      width={20}
                      height={20}
                    />
                  </div>

                  <h3 className="!text-md !font-semibold !mb-[8px]">
                    {creator.name}
                  </h3>

                  <span className="block text-xs">ITEMS: {creator.items}</span>

                  <div className="h-[1px] bg-primary-50 dark:bg-[#172036] my-[15px]"></div>

                  <button
                    type="button"
                    onClick={() => handleFollowToggle(creator.id)}
                    className={`inline-block rounded-[7px] py-[6px] px-[17px] font-medium md:text-md ${
                      creator.isFollowing
                        ? "bg-gray-400 hover:bg-gray-400"
                        : "bg-primary-500 hover:bg-primary-400"
                    } text-white transition-all`}
                  >
                    {creator.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, creators.length)} of {creators.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => setCurrentPage(index + 1)}
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
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
    </>
  );
};

export default CreatorsContent;
