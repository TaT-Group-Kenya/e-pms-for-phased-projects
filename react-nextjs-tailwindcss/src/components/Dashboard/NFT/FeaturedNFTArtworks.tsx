"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// NFT data
const nftData = [
  {
    id: 1,
    image: "/images/nfts/featured1.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35246",
    title: "Christmas Eve",
    highestBid: "9.75 ETH",
    currentBid: "5.50 ETH",
    likes: "9.2/10",
    viewLink: "/nft/nft-details",
  },
  {
    id: 2,
    image: "/images/nfts/featured2.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35247",
    title: "Humming Bird",
    highestBid: "10.75 ETH",
    currentBid: "12.50 ETH",
    likes: "9.5/10",
    viewLink: "/nft/nft-details",
  },
  {
    id: 3,
    image: "/images/nfts/featured3.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35228",
    title: "Naughty Pool",
    highestBid: "8.75 ETH",
    currentBid: "9.50 ETH",
    likes: "9.7/10",
    viewLink: "/nft/nft-details",
  },
  {
    id: 4,
    image: "/images/nfts/featured3.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35228",
    title: "Naughty Pool",
    highestBid: "8.75 ETH",
    currentBid: "9.50 ETH",
    likes: "9.7/10",
    viewLink: "/nft/nft-details",
  },
  {
    id: 5,
    image: "/images/nfts/featured2.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35247",
    title: "Humming Bird",
    highestBid: "10.75 ETH",
    currentBid: "12.50 ETH",
    likes: "9.5/10",
    viewLink: "/nft/nft-details",
  },
  {
    id: 6,
    image: "/images/nfts/featured1.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35246",
    title: "Christmas Eve",
    highestBid: "9.75 ETH",
    currentBid: "5.50 ETH",
    likes: "9.2/10",
    viewLink: "/nft/nft-details",
  },
];

const FeaturedNFTArtworks: React.FC = () => {
  return (
    <div className="trezo-card" id="featuredNftArtworksSlides">
      <div className="trezo-card-header mb-[20px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Featured NFT Artworks</h5>
        </div>
      </div>

      <div className="trezo-card-content">
        <Swiper
          spaceBetween={15}
          navigation={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
          }}
          modules={[Autoplay, Navigation]}
          className="allNFTSlides"
        >
          {nftData.map((nft) => (
            <SwiperSlide key={nft.id}>
              <div className="bg-white dark:bg-[#0c1427] p-[10px] rounded-md">
                <div
                  className="h-[172px] rounded-md bg-center bg-cover bg-no-repeat mb-[12px]"
                  style={{ backgroundImage: `url(${nft.image})` }}
                ></div>

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
                      {nft.likes}
                    </span>
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedNFTArtworks;
