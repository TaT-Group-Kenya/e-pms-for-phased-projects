"use client";

import React, { useState } from "react";
import Image from "next/image";

const PopupGallery: React.FC = () => {
  // Dynamic gallery data
  const images = [
    { src: "/images/gallery/gallery1.jpg", alt: "gallery-image-1" },
    { src: "/images/gallery/gallery2.jpg", alt: "gallery-image-2" },
    { src: "/images/gallery/gallery3.jpg", alt: "gallery-image-3" },
    { src: "/images/gallery/gallery4.jpg", alt: "gallery-image-4" },
    { src: "/images/gallery/gallery5.jpg", alt: "gallery-image-5" },
    { src: "/images/gallery/gallery6.jpg", alt: "gallery-image-6" },
    { src: "/images/gallery/gallery7.jpg", alt: "gallery-image-7" },
    { src: "/images/gallery/gallery8.jpg", alt: "gallery-image-8" },
  ];

  // State to manage modal visibility
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Open modal
  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Navigate to next image
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev! + 1) % images.length);
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Popup Gallery</h5>
          </div>
        </div>

        {/* Image Grid */}
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[25px]">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openModal(index)}
                className="focus:outline-none"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="rounded-md cursor-pointer hover:opacity-80 transition-all duration-300"
                  width={760}
                  height={760}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {selectedImage !== null && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative flex items-center">
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute ltr:left-3 rtl:right-3 w-[30px] h-[30px] text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
            >
              ❮
            </button>

            {/* Image */}
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="rounded-md max-w-[90vw] max-h-[90vh]"
              width={800}
              height={800}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            />

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute ltr:right-3 rtl:left-3 w-[30px] h-[30px] text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
            >
              ❯
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 ltr:right-4 rtl:left-4 w-[30px] h-[30px] text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default PopupGallery;
