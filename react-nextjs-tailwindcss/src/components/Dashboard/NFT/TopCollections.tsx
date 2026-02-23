"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

interface Collection {
  id: number;
  authorImage: string;
  verifiedImage: string;
  title: string;
  itemsCount: number;
  collectionImage: string;
  name: string;
  username: string;
  detailsLink: string;
}

const collections: Collection[] = [
  {
    id: 1,
    authorImage: "/images/nfts/author.gif",
    verifiedImage: "/images/nfts/verified.svg",
    title: "Christmas Eve",
    itemsCount: 3250,
    collectionImage: "/images/nfts/top-collection.gif",
    name: "Man Walking",
    username: "queensland",
    detailsLink: "/nft/nft-details/",
  },
  {
    id: 2,
    authorImage: "/images/nfts/author.gif",
    verifiedImage: "/images/nfts/verified.svg",
    title: "New Year",
    itemsCount: 2800,
    collectionImage: "/images/nfts/top-collection.gif",
    name: "Woman Running",
    username: "sydney",
    detailsLink: "/nft/nft-details/",
  },
  // Add more collections as needed
];

const TopCollections: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Collections</h5>
          </div>
        </div>

        <div
          className="trezo-card-content relative md:border-t md:border-b border-primary-50 dark:border-[#172036] md:py-[20px]"
          id="topCollectionsSlides"
        >
          <Swiper
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            modules={[Autoplay, Pagination]}
          >
            {collections.map((collection) => (
              <SwiperSlide key={collection.id}>
                <div className="flex items-center gap-[12px] mb-[22px]">
                  <div className="relative ltr:pr-[7px] rtl:pl-[7px]">
                    <Image
                      src={collection.authorImage}
                      className="rounded-full w-[50px]"
                      alt="author-image"
                      width={50}
                      height={50}
                    />
                    <Image
                      src={collection.verifiedImage}
                      className="absolute ltr:right-0 rtl:left-0 bottom-0"
                      alt="verified"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-black dark:text-white inline-block mb-[3px]">
                      {collection.title}
                    </span>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs">
                      {collection.itemsCount} Items
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-[15px]">
                  <div className="w-[100px] md:w-[120px] rounded-md shrink">
                    <Image
                      src={collection.collectionImage}
                      alt="top-collection-image"
                      className="rounded-md"
                      width={120}
                      height={120}
                    />
                  </div>
                  <div className="grow-0">
                    <div className="font-semibold text-black dark:text-white text-md md:text-lg mb-[4px]">
                      {collection.name}
                    </div>
                    <span className="block text-sm">
                      @{collection.username}
                    </span>
                  </div>
                </div>

                <Link
                  href={collection.detailsLink}
                  className="inline-block font-medium rounded-md mt-[22px] px-[13px] py-[6px] text-primary-500 border border-primary-500 transition-all hover:bg-primary-500 hover:text-white"
                >
                  <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                    <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                      add
                    </i>
                    View Details
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default TopCollections;
