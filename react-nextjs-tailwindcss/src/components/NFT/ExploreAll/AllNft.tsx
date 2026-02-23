"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NFT {
  id: string;
  image: string;
  title: string;
  viewLink: string;
  authorImage: string;
  nftId: string;
  highestBid: string;
  currentBid: string;
  likes: string;
  totalLikes: string;
}

const AllNft: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State for filter criteria
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("0");
  const [fileType, setFileType] = useState("0");
  const [salesType, setSalesType] = useState("0");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });

  // Example dynamic data
  const nfts: NFT[] = [
    {
      id: "1",
      image: "/images/nfts/featured1.jpg",
      title: "Christmas Eve",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35246",
      highestBid: "9.75 ETH",
      currentBid: "5.50 ETH",
      likes: "9.2",
      totalLikes: "10",
    },
    {
      id: "2",
      image: "/images/nfts/featured2.jpg",
      title: "Humming Bird",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35247",
      highestBid: "10.75 ETH",
      currentBid: "12.50 ETH",
      likes: "9.5",
      totalLikes: "10",
    },
    {
      id: "3",
      image: "/images/nfts/featured3.jpg",
      title: "Naughty Pool",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35228",
      highestBid: "8.75 ETH",
      currentBid: "9.50 ETH",
      likes: "9.7",
      totalLikes: "10",
    },
    {
      id: "4",
      image: "/images/nfts/featured4.jpg",
      title: "Hello Thumbs",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35227",
      highestBid: "9.30 ETH",
      currentBid: "8.15 ETH",
      likes: "9.3",
      totalLikes: "10",
    },
    {
      id: "5",
      image: "/images/nfts/featured5.jpg",
      title: "Pixel Watermelon",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35248",
      highestBid: "1.75 ETH",
      currentBid: "3.50 ETH",
      likes: "9.1",
      totalLikes: "10",
    },
    {
      id: "6",
      image: "/images/nfts/featured6.gif",
      title: "Dancing Cookies",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35258",
      highestBid: "10.75 ETH",
      currentBid: "12.50 ETH",
      likes: "9.1",
      totalLikes: "10",
    },
    {
      id: "7",
      image: "/images/nfts/featured7.jpg",
      title: "Rotating Flower",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35158",
      highestBid: "3.95 ETH",
      currentBid: "6.50 ETH",
      likes: "8.7",
      totalLikes: "10",
    },
    {
      id: "8",
      image: "/images/nfts/featured8.jpg",
      title: "Flying Bulb",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35782",
      highestBid: "8.75 ETH",
      currentBid: "9.50 ETH",
      likes: "9.7",
      totalLikes: "10",
    },
    {
      id: "9",
      image: "/images/nfts/featured1.jpg",
      title: "Glowing Cube",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35892",
      highestBid: "6.20 ETH",
      currentBid: "7.30 ETH",
      likes: "9.0",
      totalLikes: "10",
    },
    {
      id: "10",
      image: "/images/nfts/featured2.jpg",
      title: "Ethereal Waves",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "35912",
      highestBid: "12.00 ETH",
      currentBid: "11.50 ETH",
      likes: "9.8",
      totalLikes: "10",
    },
    {
      id: "11",
      image: "/images/nfts/featured3.jpg",
      title: "Astronaut's Dream",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "36002",
      highestBid: "15.75 ETH",
      currentBid: "13.25 ETH",
      likes: "9.6",
      totalLikes: "10",
    },
    {
      id: "12",
      image: "/images/nfts/featured4.jpg",
      title: "Galactic Harmony",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "36033",
      highestBid: "18.50 ETH",
      currentBid: "17.20 ETH",
      likes: "9.9",
      totalLikes: "10",
    },
    {
      id: "13",
      image: "/images/nfts/featured5.jpg",
      title: "Neon Jungle",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "36100",
      highestBid: "7.50 ETH",
      currentBid: "6.80 ETH",
      likes: "8.9",
      totalLikes: "10",
    },
    {
      id: "14",
      image: "/images/nfts/featured6.gif",
      title: "Future City",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "36175",
      highestBid: "11.25 ETH",
      currentBid: "10.80 ETH",
      likes: "9.4",
      totalLikes: "10",
    },
    {
      id: "15",
      image: "/images/nfts/featured7.jpg",
      title: "Cyber Cat",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "36202",
      highestBid: "5.50 ETH",
      currentBid: "4.80 ETH",
      likes: "8.6",
      totalLikes: "10",
    },
    {
      id: "16",
      image: "/images/nfts/featured8.jpg",
      title: "Mystic Portal",
      viewLink: "/nft/nft-details",
      authorImage: "/images/nfts/author.gif",
      nftId: "36250",
      highestBid: "14.00 ETH",
      currentBid: "13.50 ETH",
      likes: "9.5",
      totalLikes: "10",
    },
  ];

  // Filter NFTs based on criteria
  const filteredNfts = nfts.filter((nft) => {
    const matchesSearch = nft.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      category === "0" ||
      nft.title.toLowerCase().includes(category.toLowerCase());
    const matchesFileType =
      fileType === "0" || nft.image.endsWith(`.${fileType}`);
    const matchesSalesType =
      salesType === "0" ||
      nft.title.toLowerCase().includes(salesType.toLowerCase());
    const matchesPriceRange =
      parseFloat(nft.currentBid) >= priceRange.min &&
      parseFloat(nft.currentBid) <= priceRange.max;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFileType &&
      matchesSalesType &&
      matchesPriceRange
    );
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);

  // Get the current page's NFTs
  const indexOfLastNft = currentPage * itemsPerPage;
  const indexOfFirstNft = indexOfLastNft - itemsPerPage;
  const currentNfts = filteredNfts.slice(indexOfFirstNft, indexOfLastNft);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="h-[44px] rounded-md bg-gray-50 dark:bg-[#0a0e19] px-[13px] block w-full outline-0 cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="0">Category</option>
                  <option value="1">Bird</option>
                  <option value="2">Pool</option>
                  <option value="3">Watermelon</option>
                  <option value="4">Flower</option>
                  <option value="5">Cookies</option>
                </select>
              </div>
              <div>
                <select
                  className="h-[44px] rounded-md bg-gray-50 dark:bg-[#0a0e19] px-[13px] block w-full outline-0 cursor-pointer"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="0">File Type</option>
                  <option value="1">.zip</option>
                  <option value="2">.jpg</option>
                  <option value="3">.png</option>
                  <option value="4">.gif</option>
                  <option value="5">.pdf</option>
                </select>
              </div>
              <div>
                <select
                  className="h-[44px] rounded-md bg-gray-50 dark:bg-[#0a0e19] px-[13px] block w-full outline-0 cursor-pointer"
                  value={salesType}
                  onChange={(e) => setSalesType(e.target.value)}
                >
                  <option value="0">Sales Type</option>
                  <option value="2">Bird</option>
                  <option value="3">Pool</option>
                  <option value="4">Watermelon</option>
                  <option value="5">Flower</option>
                  <option value="6">Cookies</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px] md:gap-[20px] mt-[15px] md:mt-[20px] items-center">
              <div className="md:col-span-2">
                <div
                  className="relative md:-top-[5px] md:pt-[2px] ltr:pl-[50px] rtl:pr-[50px] ltr:md:pl-[71px] rtl:md:pr-[71px]"
                  id="priceRangeSlider"
                >
                  <span className="block font-semibold absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                    Price:
                  </span>
                  <div id="rangeSlider" className="range-slider">
                    <div className="number-group flex items-center justify-between">
                      <input
                        className="number-input md:text-md font-semibold text-gray-900 dark:text-gray-400 dark:bg-[#0c1427] !outline-0 pointer-events-none"
                        type="number"
                        defaultValue={priceRange.min}
                        min="0"
                        max="50"
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: parseInt(e.target.value),
                          })
                        }
                      />
                      <input
                        className="number-input md:text-md font-semibold text-gray-900 dark:text-gray-400 dark:bg-[#0c1427] !outline-0 pointer-events-none text-right rtl:text-left"
                        type="number"
                        defaultValue={priceRange.max}
                        min="0"
                        max="50"
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="range-group relative -mt-[10px] ltr:ml-[32px] rtl:mr-[32px] ltr:mr-[53px] rtl:ml-[53px]">
                      <input
                        className="range-input"
                        defaultValue={priceRange.min}
                        min="1"
                        max="50"
                        step="1"
                        type="range"
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: parseInt(e.target.value),
                          })
                        }
                      />
                      <input
                        className="range-input"
                        defaultValue={priceRange.max}
                        min="1"
                        max="50"
                        step="1"
                        type="range"
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-1 ltr:md:text-right rtl:md:text-left">
                <button
                  type="submit"
                  className="inline-block md:text-md font-medium bg-primary-500 text-white rounded-[7px] py-[6px] px-[25px] md:px-[53px] hover:bg-primary-400 mt-[8px] md:mt-0"
                >
                  Filter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[25px]">
            {currentNfts.map((nft) => (
              <div
                key={nft.id}
                className="nft-card bg-white dark:bg-[#0c1427] p-[10px] rounded-md"
              >
                <div className="relative">
                  <Image
                    src={nft.image}
                    className="rounded-md mb-[12px]"
                    alt="nft-image"
                    width={484}
                    height={344}
                  />
                  <button
                    className="bid-btn absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[15px] md:text-md rounded-[4px] bg-primary-500 text-white font-medium py-[7px] px-[20px] transition-all hover:bg-primary-400 inline-block"
                    type="button"
                  >
                    Place Bid
                  </button>
                </div>
                <div className="flex items-center justify-between border-b border-primary-50 dark:border-[#172036] pb-[10px] mb-[14px]">
                  <div className="flex items-center gap-[6px]">
                    <Image
                      src={nft.authorImage}
                      className="rounded-full w-[27px]"
                      alt="author-image"
                      width={27}
                      height={27}
                    />
                    <div>
                      <span className="block text-xs">NFT ID: {nft.nftId}</span>
                      <Link
                        href={nft.viewLink}
                        className="block font-semibold text-gray-900 dark:text-gray-400 transition-all hover:text-primary-500"
                      >
                        {nft.title}
                      </Link>
                    </div>
                  </div>

                  <Image
                    src="/images/nfts/verified2.svg"
                    alt="verified"
                    width={20}
                    height={20}
                  />
                </div>

                <span className="block text-xs mb-[4px]">
                  Highest Bid:{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-400 ltr:ml-[2px] rtl:mr-[2px]">
                    {nft.highestBid}
                  </span>
                </span>

                <div className="flex items-center justify-between pb-[5px]">
                  <span className="block font-semibold text-primary-800">
                    {nft.currentBid}
                  </span>

                  <span className="block relative text-xs font-semibold ltr:pl-[22px] rtl:pr-[22px]">
                    <i className="ri-heart-fill text-orange-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-lg"></i>
                    <span className="text-gray-900 dark:text-gray-400">
                      {nft.likes}/
                    </span>
                    {nft.totalLikes}
                  </span>
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
              Showing {indexOfFirstNft + 1} to{" "}
              {Math.min(indexOfLastNft, nfts.length)} of {nfts.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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

export default AllNft;
