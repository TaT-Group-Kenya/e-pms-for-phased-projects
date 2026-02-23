"use client";

import React from "react";
import Image from "next/image";

const Profile: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center gap-[17px] mb-[20px] md:mb-[25px]">
            <Image
              src="/images/nfts/creator-author.jpg"
              className="rounded-full w-[65px]"
              alt="creator-author"
              width={65}
              height={65}
            />
            <div>
              <h3 className="!text-lg md:!text-xl !mb-[4px]">Angela Carter</h3>
              <span className="block text-xs">ID: 35246</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-[20px] md:mb-[25px]">
            <div className="flex items-center gap-[14px]">
              <Image
                src="/images/icons/schedule.svg"
                alt="schedule"
                width={28}
                height={28}
              />
              <div>
                <span className="block text-xs">Joined Since</span>
                <span className="block text-black dark:text-white font-semibold">
                  23 June 2024
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-block rounded-[7px] py-[6px] px-[17px] font-medium md:text-md bg-primary-500 text-white transition-all hover:bg-primary-400"
            >
              Follow
            </button>
          </div>

          <div className="py-[20px] md:py-[25px] px-[20px] md:px-[30px] bg-gray-50 dark:bg-[#0a0e19] flex items-center justify-between gap-[15px] rounded-md text-center">
            <div>
              <span className="block text-xs">Total NFT</span>
              <span className="block font-semibold text-primary-800">156</span>
            </div>
            <div>
              <span className="block text-xs">Total Earned</span>
              <span className="block font-semibold text-gray-900 dark:text-gray-400">
                1234ETH
              </span>
            </div>
            <div>
              <span className="block text-xs">Auction</span>
              <span className="block font-semibold text-gray-900 dark:text-gray-400">
                45
              </span>
            </div>
          </div>

          <h3 className="!text-lg !mt-[20px] md:!mt-[25px] !mb-[10px]">
            Description
          </h3>
          <p>
            This NFT captures the essence of boundless potential, symbolized by
            a surreal landscape where the sky meets the earth in a dazzling
            fusion of colors. The intricate design features flowing lines that
            blend together, representing the limitless paths we can take in
            life.
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
