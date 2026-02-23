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
    image: "/images/nfts/nft1.gif",
    authorImage: "/images/nfts/author.gif",
    nftId: "35246",
    title: "Christmas Eve",
    viewLink: "/nft/nft-details",
    highestBid: "9.75 ETH",
    currentBid: "5.50 ETH",
    likes: "9.2/10",
  },
  {
    id: 2,
    image: "/images/nfts/nft2.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35247",
    title: "Rotating Panda",
    viewLink: "/nft/nft-details",
    highestBid: "10.75 ETH",
    currentBid: "12.50 ETH",
    likes: "9.5/10",
  },
  {
    id: 3,
    image: "/images/nfts/nft3.gif",
    authorImage: "/images/nfts/author.gif",
    nftId: "35228",
    title: "Cookies Live",
    viewLink: "/nft/nft-details",
    highestBid: "8.75 ETH",
    currentBid: "9.50 ETH",
    likes: "9.7/10",
  },
  {
    id: 4,
    image: "/images/nfts/nft4.gif",
    authorImage: "/images/nfts/author.gif",
    nftId: "35246",
    title: "World Savior",
    viewLink: "/nft/nft-details",
    highestBid: "9.75 ETH",
    currentBid: "5.50 ETH",
    likes: "9.2/10",
  },
  {
    id: 5,
    image: "/images/nfts/nft4.gif",
    authorImage: "/images/nfts/author.gif",
    nftId: "35246",
    title: "World Savior",
    viewLink: "/nft/nft-details",
    highestBid: "9.75 ETH",
    currentBid: "5.50 ETH",
    likes: "9.2/10",
  },
  {
    id: 6,
    image: "/images/nfts/nft3.gif",
    authorImage: "/images/nfts/author.gif",
    nftId: "35228",
    title: "Cookies Live",
    viewLink: "/nft/nft-details",
    highestBid: "8.75 ETH",
    currentBid: "9.50 ETH",
    likes: "9.7/10",
  },
  {
    id: 7,
    image: "/images/nfts/nft1.gif",
    authorImage: "/images/nfts/author.gif",
    nftId: "35246",
    title: "Christmas Eve",
    viewLink: "/nft/nft-details",
    highestBid: "9.75 ETH",
    currentBid: "5.50 ETH",
    likes: "9.2/10",
  },
  {
    id: 8,
    image: "/images/nfts/nft2.jpg",
    authorImage: "/images/nfts/author.gif",
    nftId: "35247",
    title: "Rotating Panda",
    viewLink: "/nft/nft-details",
    highestBid: "10.75 ETH",
    currentBid: "12.50 ETH",
    likes: "9.5/10",
  },
];

const AllNft: React.FC = () => {
  return (
    <>
      <div
        className="mb-[25px] relative z-[1] pt-[20px] md:pt-[40px] lg:pt-[55px] px-[20px] md:px-[33px] rounded-md"
        id="allNFTSlides"
      >
        <div className="lg:flex justify-between mb-[20px] md:mb-[30px] lg:mb-[50px] lg:px-[7px]">
          <div>
            <h3 className="!text-white !text-xl md:!text-2xl !mb-[5px]">
              Manage Your NFT From One Place
            </h3>
            <p className="text-gray-300">
              The world’s first and largest digital marketplace for discover,
              collect, sell and create your own NFTs.
            </p>
          </div>
          <div>
            <Link
              href="/nft/create-nft"
              className="text-[15px] md:text-md mt-[15px] lg:mt-[3px] rounded-[4px] bg-primary-500 text-white font-medium py-[7px] px-[30px] transition-all hover:bg-primary-400 inline-block"
            >
              Create NFT
            </Link>
          </div>
        </div>

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
            1400: {
              slidesPerView: 4,
            },
          }}
          modules={[Autoplay, Navigation]}
          className="allNFTSlides"
        >
          {nftData.map((nft) => (
            <SwiperSlide key={nft.id}>
              <div className="bg-white dark:bg-[#0c1427] p-[10px] rounded-md">
                <div
                  className="h-[270px] rounded-md bg-center bg-cover bg-no-repeat mb-[12px]"
                  style={{
                    backgroundImage: `url(${nft.image})`,
                  }}
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
                      {nft.likes.split("/")[0]}/
                    </span>
                    {nft.likes.split("/")[1]}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="absolute top-0 left-0 right-0 rounded-md -z-[1] h-[54%]"
          style={{
            background: "linear-gradient(92deg, #23272E 7.31%, #3F5272 97.89%)",
          }}
        ></div>

        <Image
          src="/images/nfts/shape.png"
          className="absolute top-0 ltr:right-0 rtl:left-0 -z-[1]"
          alt="shape"
          width={210}
          height={180}
        />
      </div>
    </>
  );
};

export default AllNft;
