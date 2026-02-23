"use client";

import React from "react";
import Image from "next/image";

const images = [
  "/images/gallery/gallery1.jpg",
  "/images/gallery/gallery2.jpg",
  "/images/gallery/gallery3.jpg",
  "/images/gallery/gallery4.jpg",
  "/images/gallery/gallery5.jpg",
  "/images/gallery/gallery6.jpg",
];

const GalleryStyle1: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Gallery Style - 1</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[25px]">
            {images.map((src, index) => (
              <div key={index} className="rounded-md">
                <Image
                  src={src}
                  alt={`gallery-image-${index + 1}`}
                  className="rounded-md"
                  width={760}
                  height={760}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryStyle1;
