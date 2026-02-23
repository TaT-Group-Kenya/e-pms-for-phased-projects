"use client";

import React from "react";
import Image from "next/image";

interface Stylist {
  id: number;
  name: string;
  image: string;
  bookings: number;
  rating: number;
}

const TopStylistPerformance: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const stylists: Stylist[] = [
    {
      id: 1,
      name: "Johhna Loren",
      image: "/images/users/user75.jpg",
      bookings: 2032,
      rating: 5.0,
    },
    {
      id: 2,
      name: "Angela Carter",
      image: "/images/users/user76.jpg",
      bookings: 1020,
      rating: 4.5,
    },
    {
      id: 3,
      name: "Skyler White",
      image: "/images/users/user77.jpg",
      bookings: 99,
      rating: 4.0,
    },
    {
      id: 4,
      name: "Jane Ronan",
      image: "/images/users/user78.jpg",
      bookings: 89,
      rating: 3.5,
    },
    {
      id: 5,
      name: "Angel Peril",
      image: "/images/users/user79.jpg",
      bookings: 72,
      rating: 3.0,
    },
  ];

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="ri-star-fill text-orange-500"></i>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="ri-star-half-line text-orange-500"></i>
      );
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="ri-star-line text-orange-500"></i>
      );
    }

    return stars;
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Top Stylist Performance</h5>
        </div>
      </div>
      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <tbody className="text-black dark:text-white">
              {stylists.map((stylist) => (
                <tr key={stylist.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-md w-[40px]">
                        <Image
                          src={stylist.image}
                          width={40}
                          height={40}
                          className="inline-block rounded-md"
                          alt={`${stylist.name} image`}
                        />
                      </div>
                      <div>
                        <span className="font-semibold inline-block mb-px">
                          {stylist.name}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          {stylist.bookings} Total Bookings
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                    <div className="flex items-center justify-end leading-none gap-[2px]">
                      {renderStars(stylist.rating)}
                      <span className="block relative top-px text-xs text-gray-500 dark:text-gray-400 ltr:ml-[2px] rtl:mr-[2px]">
                        {stylist.rating.toFixed(1)}
                      </span>
                    </div>
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

export default TopStylistPerformance;
