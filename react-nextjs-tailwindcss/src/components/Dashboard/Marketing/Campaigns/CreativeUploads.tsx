"use client";

import React from "react";
import Image from "next/image";

const CreativeUploads: React.FC = () => {
  return (
    <>
      <form>
        <div className="mb-[20px] lg:mb-[40px]">
          <label className="mb-[17px] text-black dark:text-white text-lg font-bold block">
            Upload Files
          </label>
          <div id="fileUploader2">
            <div className="relative flex items-center overflow-hidden rounded-[4px] py-[34px] px-[30px] bg-gray-100 dark:bg-[#0a0e19] border-[2px] border-dashed border-secondary-400 dark:border-[#172036]">
              <div className="flex items-center gap-[15px]">
                <div className="text-primary-500 text-4xl">
                  <i className="ri-file-upload-line"></i>
                </div>
                <div>
                  <p className="leading-[1.5] text-md mb-[3px]">
                    <strong className="text-black dark:text-white">
                      Click to upload
                    </strong>{" "}
                    you file here
                  </p>
                  <p className="text-xs text-gray-400">
                    Upload upto 12 files, max size each file: 5MB.
                  </p>
                </div>
              </div>
              <input
                type="file"
                id="fileInput2"
                multiple
                className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
              />
            </div>
            <ul id="fileList2"></ul>
          </div>
        </div>

        <div className="mb-[20px] lg:mb-[40px]">
          <label className="mb-[22px] text-black dark:text-white text-lg font-bold block">
            Uploaded Files
          </label>
          <div className="border-b border-primary-50 dark:border-[#172036] pb-[15px] mb-[15px] last:mb-0 flex items-center justify-between">
            <div className="flex items-center gap-[15px]">
              <Image
                src="/images/icons/pdf.png"
                className="w-[36px]"
                alt="pdf"
                width={36}
                height={36}
              />
              <div>
                <span className="block font-medium text-gray-900 dark:text-gray-400">
                  Campaign Requirements
                </span>
                <span className="block mt-[2px] text-gray-400">
                  Increase impression traffic onto the platform
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-block bg-gray-100 dark:bg-black rounded-[7px] text-gray-500 dark:text-gray-400 transition-all hover:bg-primary-500 hover:text-white py-[7px] px-[15px]"
            >
              <span className="flex items-center gap-[5px]">
                Edit
                <i className="ri-pencil-line"></i>
              </span>
            </button>
          </div>

          <div className="border-b border-primary-50 dark:border-[#172036] pb-[15px] mb-[15px] last:mb-0 flex items-center justify-between">
            <div className="flex items-center gap-[15px]">
              <Image
                src="/images/icons/doc.png"
                className="w-[36px]"
                alt="doc"
                width={36}
                height={36}
              />
              <div>
                <span className="block font-medium text-gray-900 dark:text-gray-400">
                  Campaign’s mission and vision
                </span>
                <span className="block mt-[2px] text-gray-400">
                  Increase impression traffic onto the platform
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-block bg-gray-100 dark:bg-black rounded-[7px] text-gray-500 dark:text-gray-400 transition-all hover:bg-primary-500 hover:text-white py-[7px] px-[15px]"
            >
              <span className="flex items-center gap-[5px]">
                Edit
                <i className="ri-pencil-line"></i>
              </span>
            </button>
          </div>

          <div className="border-b border-primary-50 dark:border-[#172036] pb-[15px] mb-[15px] last:mb-0 flex items-center justify-between">
            <div className="flex items-center gap-[15px]">
              <Image
                src="/images/icons/gif.svg"
                className="w-[36px]"
                alt="gif"
                width={36}
                height={36}
              />
              <div>
                <span className="block font-medium text-gray-900 dark:text-gray-400">
                  Campaign Banner
                </span>
                <span className="block mt-[2px] text-gray-400">
                  Increase impression traffic onto the platform
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-block bg-gray-100 dark:bg-black rounded-[7px] text-gray-500 dark:text-gray-400 transition-all hover:bg-primary-500 hover:text-white py-[7px] px-[15px]"
            >
              <span className="flex items-center gap-[5px]">
                Edit
                <i className="ri-pencil-line"></i>
              </span>
            </button>
          </div>

          <div className="border-b border-primary-50 dark:border-[#172036] pb-[15px] mb-[15px] last:mb-0 flex items-center justify-between">
            <div className="flex items-center gap-[15px]">
              <Image
                src="/images/icons/jpg.png"
                className="w-[36px]"
                alt="jpg"
                width={36}
                height={36}
              />
              <div>
                <span className="block font-medium text-gray-900 dark:text-gray-400">
                  Campaign Image
                </span>
                <span className="block mt-[2px] text-gray-400">
                  Increase impression traffic onto the platform
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-block bg-gray-100 dark:bg-black rounded-[7px] text-gray-500 dark:text-gray-400 transition-all hover:bg-primary-500 hover:text-white py-[7px] px-[15px]"
            >
              <span className="flex items-center gap-[5px]">
                Edit
                <i className="ri-pencil-line"></i>
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreativeUploads;
