"use client";

import React from "react";
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

const FeaturedNFTArtworks: React.FC = () => {
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
  ];

  return (
    <>
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Featured NFT Artworks</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Link
              href="/nft/explore-all"
              className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
            >
              Browse All{" "}
              <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[25px]">
            {nfts.slice(0, 8).map((nft) => (
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
    </>
  );
};

export default FeaturedNFTArtworks;
