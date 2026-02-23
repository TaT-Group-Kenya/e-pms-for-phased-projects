"use client";

import React, { useEffect, useState } from "react";
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
  duration: number; // Countdown in seconds
  sold: number;
  available: number;
}

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
    duration: 9900, // 2h 45m
    sold: 130,
    available: 123,
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
    duration: 8700, // 2h 25m
    sold: 80,
    available: 95,
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
    duration: 7200, // 2h
    sold: 60,
    available: 140,
  },
  {
    id: "4",
    image: "/images/nfts/featured4.jpg",
    title: "Pixel Dreams",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35229",
    highestBid: "11.25 ETH",
    currentBid: "6.80 ETH",
    likes: "9.3",
    totalLikes: "10",
    duration: 8400, // 2h 20m
    sold: 50,
    available: 160,
  },
  {
    id: "5",
    image: "/images/nfts/featured5.jpg",
    title: "Abstract Lights",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35230",
    highestBid: "13.00 ETH",
    currentBid: "7.25 ETH",
    likes: "9.8",
    totalLikes: "10",
    duration: 10800, // 3h
    sold: 90,
    available: 110,
  },
  {
    id: "6",
    image: "/images/nfts/featured6.gif",
    title: "The Neon Future",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35231",
    highestBid: "14.50 ETH",
    currentBid: "9.00 ETH",
    likes: "9.6",
    totalLikes: "10",
    duration: 9600, // 2h 40m
    sold: 75,
    available: 125,
  },
  {
    id: "7",
    image: "/images/nfts/featured7.jpg",
    title: "Mystic Galaxy",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35232",
    highestBid: "15.75 ETH",
    currentBid: "10.50 ETH",
    likes: "9.9",
    totalLikes: "10",
    duration: 7800, // 2h 10m
    sold: 65,
    available: 135,
  },
  {
    id: "8",
    image: "/images/nfts/featured8.jpg",
    title: "Cyberpunk City",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35233",
    highestBid: "16.25 ETH",
    currentBid: "11.00 ETH",
    likes: "9.4",
    totalLikes: "10",
    duration: 8700, // 2h 25m
    sold: 95,
    available: 105,
  },
  {
    id: "9",
    image: "/images/nfts/featured1.jpg",
    title: "Crystal Reflections",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35234",
    highestBid: "12.80 ETH",
    currentBid: "7.80 ETH",
    likes: "9.2",
    totalLikes: "10",
    duration: 6600, // 1h 50m
    sold: 85,
    available: 115,
  },
  {
    id: "10",
    image: "/images/nfts/featured2.jpg",
    title: "Golden Hour",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35235",
    highestBid: "10.25 ETH",
    currentBid: "6.20 ETH",
    likes: "9.0",
    totalLikes: "10",
    duration: 7200, // 2h
    sold: 110,
    available: 90,
  },
  {
    id: "11",
    image: "/images/nfts/featured3.jpg",
    title: "Luminous Shadows",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35236",
    highestBid: "11.50 ETH",
    currentBid: "7.00 ETH",
    likes: "9.5",
    totalLikes: "10",
    duration: 5400, // 1h 30m
    sold: 120,
    available: 80,
  },
  {
    id: "12",
    image: "/images/nfts/featured4.jpg",
    title: "Retro Vibes",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35237",
    highestBid: "9.00 ETH",
    currentBid: "5.75 ETH",
    likes: "8.9",
    totalLikes: "10",
    duration: 8100, // 2h 15m
    sold: 100,
    available: 100,
  },
  {
    id: "13",
    image: "/images/nfts/featured5.jpg",
    title: "Digital Mirage",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35238",
    highestBid: "13.25 ETH",
    currentBid: "8.40 ETH",
    likes: "9.7",
    totalLikes: "10",
    duration: 6300, // 1h 45m
    sold: 55,
    available: 145,
  },
  {
    id: "14",
    image: "/images/nfts/featured6.gif",
    title: "Futuristic Flares",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35239",
    highestBid: "14.00 ETH",
    currentBid: "9.20 ETH",
    likes: "9.3",
    totalLikes: "10",
    duration: 9000, // 2h 30m
    sold: 140,
    available: 60,
  },
  {
    id: "15",
    image: "/images/nfts/featured7.jpg",
    title: "Midnight Sparks",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35240",
    highestBid: "12.90 ETH",
    currentBid: "8.00 ETH",
    likes: "9.6",
    totalLikes: "10",
    duration: 10200, // 2h 50m
    sold: 125,
    available: 75,
  },
  {
    id: "16",
    image: "/images/nfts/featured8.jpg",
    title: "Lost in Space",
    viewLink: "/nft/nft-details",
    authorImage: "/images/nfts/author.gif",
    nftId: "35241",
    highestBid: "15.50 ETH",
    currentBid: "11.20 ETH",
    likes: "9.8",
    totalLikes: "10",
    duration: 7800, // 2h 10m
    sold: 70,
    available: 130,
  }
];

const CountdownTimer: React.FC<{ initialTime: number }> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}h ${m
      .toString()
      .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <span className="active-auctions-timer block text-xs font-semibold text-gray-900 dark:text-gray-400">
      {formatTime(timeLeft)}
    </span>
  );
};

const LiveAuctionContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = nfts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(nfts.length / itemsPerPage);

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
        <div className="trezo-card-header md:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Live Auction</h5>
          </div>

          <div className="trezo-card-subtitle sm:flex items-center sm:gap-[25px] lg:gap-[35px] sm:mt-[15px] md:mt-0">
            <button
              className="text-primary-500 text-xs uppercase inline-block font-semibold transition-all mt-[12px] sm:mt-0 ltr:mr-[12px] rtl:ml-[12px] ltr:sm:mr-0 rtl:sm:ml-0"
              type="button"
            >
              ALL ITEMS (12)
            </button>

            <button
              className="text-gray-500 dark:text-gray-400 text-xs uppercase inline-block font-medium transition-all hover:text-primary-500 mt-[12px] sm:mt-0 ltr:mr-[12px] rtl:ml-[12px] ltr:sm:mr-0 rtl:sm:ml-0"
              type="button"
            >
              UP TO 15%(05)
            </button>

            <button
              className="text-gray-500 dark:text-gray-400 text-xs uppercase inline-block font-medium transition-all hover:text-primary-500 mt-[12px] sm:mt-0 ltr:mr-[12px] rtl:ml-[12px] ltr:sm:mr-0 rtl:sm:ml-0"
              type="button"
            >
              UP TO 30%(07)
            </button>

            <button
              className="text-gray-500 dark:text-gray-400 text-xs uppercase inline-block font-medium transition-all hover:text-primary-500 mt-[12px] sm:mt-0 ltr:mr-[12px] rtl:ml-[12px] ltr:sm:mr-0 rtl:sm:ml-0"
              type="button"
            >
              UP TO 50%(05)
            </button>
          </div>
        </div>
      </div>

      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[25px]">
            {currentItems.map((nft) => (
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

                  <div className="absolute left-[10px] right-[10px] bottom-[10px] text-center z-[1] p-[10px]">
                    <CountdownTimer initialTime={nft.duration} />

                    <div className="absolute left-0 right-0 top-0 bottom-0 -z-[1] bg-white opacity-[.80] backdrop-blur-[12px] dark:bg-dark"></div>
                  </div>
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

                <div className="flex items-center justify-between">
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

                <div className="mt-[20px] flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                    style={{
                      width: `${
                        (nft.sold / (nft.sold + nft.available)) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between py-[6px]">
                  <span className="block text-xs">Sold: {nft.sold}</span>
                  <span className="block text-xs">
                    Available: {nft.available}
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
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, nfts.length)} of {nfts.length} results
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

export default LiveAuctionContent;
