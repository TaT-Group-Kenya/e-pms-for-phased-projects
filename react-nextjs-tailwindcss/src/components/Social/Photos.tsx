"use client";

import React from "react";
import Image from "next/image";

const Photos: React.FC = () => {
  // Array of images with src and alt properties
  const images = [
    { id: "1", src: "/images/products/product6.jpg", alt: "photo-image 1" },
    { id: "2", src: "/images/products/product7.jpg", alt: "photo-image 2" },
    { id: "3", src: "/images/products/product8.jpg", alt: "photo-image 3" },
    { id: "4", src: "/images/products/product9.jpg", alt: "photo-image 4" },
    { id: "5", src: "/images/products/product10.jpg", alt: "photo-image 5" },
    { id: "6", src: "/images/products/product11.jpg", alt: "photo-image 6" },
    { id: "7", src: "/images/products/product12.jpg", alt: "photo-image 7" },
    { id: "8", src: "/images/products/product13.jpg", alt: "photo-image 8" },
    { id: "9", src: "/images/products/product14.jpg", alt: "photo-image 9" },
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Photos</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="grid grid-cols-3 gap-[10px]">
            {/* Dynamically render images from the array */}
            {images.map((image, index) => (
              <a href="#" key={index} className="block rounded-md">
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="rounded-md"
                  width={700}
                  height={700}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Photos;
