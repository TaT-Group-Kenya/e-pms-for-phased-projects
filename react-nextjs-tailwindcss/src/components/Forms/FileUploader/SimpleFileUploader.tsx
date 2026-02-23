"use client";

import React, { useState } from "react";
import Image from "next/image"; 

const SimpleFileUploader: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Simple File Uploader</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div id="fileUploader">
            <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border border-gray-200 dark:border-[#172036]">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Click to upload
                  </strong>
                  <br /> you file here
                </p>
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>

            {/* Image Previews */}
            <div className="mt-[10px] flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-[50px] h-[50px]">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="product-preview"
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleFileUploader;
