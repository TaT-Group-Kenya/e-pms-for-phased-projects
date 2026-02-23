"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TopSellingProducts: React.FC = () => {
  // Dynamic product data
  const [products] = useState([
    {
      id: 1,
      name: "Tablet PC",
      image: "/images/stock-alerts/stock1.jpg",
      viewLink: "/ecommerce/product-details/",
      unitsSold: 2032,
      rating: 5.0,
    },
    {
      id: 2,
      name: "Laptop",
      image: "/images/stock-alerts/stock2.jpg",
      viewLink: "/ecommerce/product-details/",
      unitsSold: 1020,
      rating: 4.5,
    },
    {
      id: 3,
      name: "QCY Airpod",
      image: "/images/stock-alerts/stock3.jpg",
      viewLink: "/ecommerce/product-details/",
      unitsSold: 99,
      rating: 4.0,
    },
    {
      id: 4,
      name: "Zenbook X",
      image: "/images/stock-alerts/stock4.jpg",
      viewLink: "/ecommerce/product-details/",
      unitsSold: 89,
      rating: 3.5,
    },
    {
      id: 5,
      name: "Clay Camera",
      image: "/images/stock-alerts/stock5.jpg",
      viewLink: "/ecommerce/product-details/",
      unitsSold: 72,
      rating: 3.0,
    },
    {
      id: 6,
      name: "Laptop Mockup",
      image: "/images/stock-alerts/stock6.jpg",
      viewLink: "/ecommerce/product-details/",
      unitsSold: 72,
      rating: 2.5,
    },
  ]);

  // Function to render star ratings dynamically
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center justify-end leading-none gap-[2px]">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <i
              key={`full-${index}`}
              className="ri-star-fill text-orange-500"
            ></i>
          ))}
        {hasHalfStar && <i className="ri-star-half-line text-orange-500"></i>}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <i
              key={`empty-${index}`}
              className="ri-star-line text-orange-500"
            ></i>
          ))}
        <span className="block relative top-px text-xs text-gray-500 dark:text-gray-400 ltr:ml-[2px] rtl:mr-[2px]">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Top Selling Products</h5>
        </div>
      </div>
      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <tbody className="text-black dark:text-white">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11.5px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0 last:text-right">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-md w-[40px]">
                        <Image
                          src={product.image}
                          className="inline-block rounded-md"
                          alt={`${product.name}-image`}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <Link
                          href={product.viewLink}
                          className="font-semibold inline-block mb-px hover:text-primary-500 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          <span className="font-semibold">
                            {product.unitsSold}
                          </span>{" "}
                          sold
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-left whitespace-nowrap px-[20px] py-[11.5px] first:pl-0 border-b border-primary-50 dark:border-[#172036] last:pr-0 last:text-right">
                    {renderStars(product.rating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
