"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Creator {
  id: number;
  name: string;
  image: string;
  profileImage: string;
  items: number;
  isFollowed: boolean;
}

const TopCreators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulated API call (replace with actual API fetch)
    setTimeout(() => {
      setCreators([
        {
          id: 1,
          name: "Hunny Bunny",
          image: "/images/nfts/creator1.jpg",
          profileImage: "/images/nfts/user.gif",
          items: 3204,
          isFollowed: false,
        },
        {
          id: 2,
          name: "Aristocrat",
          image: "/images/nfts/creator2.jpg",
          profileImage: "/images/nfts/user.gif",
          items: 5301,
          isFollowed: false,
        },
        {
          id: 3,
          name: "Hooman Robotic",
          image: "/images/nfts/creator3.jpg",
          profileImage: "/images/nfts/user.gif",
          items: 4213,
          isFollowed: true,
        },
        {
          id: 4,
          name: "Colorful Life",
          image: "/images/nfts/creator4.jpg",
          profileImage: "/images/nfts/user.gif",
          items: 2314,
          isFollowed: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFollow = (id: number) => {
    setCreators((prevCreators) =>
      prevCreators.map((creator) =>
        creator.id === id
          ? { ...creator, isFollowed: !creator.isFollowed }
          : creator
      )
    );
  };

  return (
    <>
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Creators</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Link
              href="/nft/creators"
              className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
            >
              Browse All{" "}
              <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading creators...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[25px]">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="bg-white dark:bg-[#0c1427] p-[10px] rounded-md"
                >
                  <Image
                    src={creator.image}
                    className="rounded-md"
                    alt="creator-image"
                    width={484}
                    height={252}
                  />

                  <div className="text-center -mt-[34px]">
                    <div className="relative mb-[15px] inline-block">
                      <Image
                        src={creator.profileImage}
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

                    <span className="block text-xs">
                      ITEMS: {creator.items}
                    </span>

                    <div className="h-[1px] bg-primary-50 dark:bg-[#172036] my-[15px]"></div>

                    <button
                      type="button"
                      className={`inline-block rounded-[7px] py-[6px] px-[17px] font-medium md:text-md transition-all ${
                        creator.isFollowed
                          ? "bg-gray-400 text-white hover:bg-gray-500"
                          : "bg-primary-500 text-white hover:bg-primary-400"
                      }`}
                      onClick={() => toggleFollow(creator.id)}
                    >
                      {creator.isFollowed ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopCreators;
