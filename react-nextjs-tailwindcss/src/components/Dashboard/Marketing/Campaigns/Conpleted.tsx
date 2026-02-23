"use client";

import React from "react";
import Image from "next/image";

const Conpleted: React.FC = () => {
  return (
    <>
      <div className="text-center pb-[20px]">
        <Image
          src="/images/created.png"
          className="inline-block"
          alt="created-image"
          width={308}
          height={308}
        />

        <h3 className="!text-gray-900 dark:!text-gray-400 !text-xl !mt-[25px] !mb-[12px]">
          Campaign Created!
        </h3>

        <p className="mx-auto max-w-[455px]">
          You will receive an email with with the summary of your newly created
          campaign!
        </p>

        <div className="mt-[28px] flex items-center justify-center gap-[20px]">
          <button
            type="button"
            className="inline-block md:text-md font-medium bg-gray-600 text-white rounded-[7px] py-[8px] px-[19px] transition-all hover:bg-gray-500"
          >
            <span className="flex items-center gap-[5px]">
              Create New Campaign
              <i className="ri-arrow-left-line"></i>
            </span>
          </button>
          
          <button
            type="button"
            className="inline-block md:text-md font-medium bg-primary-500 text-white rounded-[7px] py-[8px] px-[19px] transition-all hover:bg-primary-400"
          >
            <span className="flex items-center gap-[5px]">
              View Campaign
              <i className="ri-arrow-right-line"></i>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Conpleted;
