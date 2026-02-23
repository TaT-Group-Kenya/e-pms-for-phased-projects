"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TopPodcasters: React.FC = () => {
  // State to manage the list of podcasters
  const [podcasters] = useState([
    {
      id: 1,
      image: "/images/users/user24.jpg",
      name: "Tom Richards",
      role: "Content Strategist",
      episodes: 95,
      earnings: "$125,000",
      rating: 5, // Full stars
    },
    {
      id: 2,
      image: "/images/users/user25.jpg",
      name: "Amanda Garcia",
      role: "Social Media",
      episodes: 110,
      earnings: "$140,000",
      rating: 4.5, // 4.5 stars
    },
    {
      id: 3,
      image: "/images/users/user26.jpg",
      name: "Lisa Kim",
      role: "Branding Consultant",
      episodes: 85,
      earnings: "$160,000",
      rating: 4, // 4 stars
    },
    {
      id: 4,
      image: "/images/users/user27.jpg",
      name: "Michael Young",
      role: "Data Analytics",
      episodes: 130,
      earnings: "$90,000",
      rating: 3.5, // 3.5 stars
    },
    {
      id: 5,
      image: "/images/users/user28.jpg",
      name: "Ravi Patel",
      role: "SEO & SEM",
      episodes: 75,
      earnings: "$85,000",
      rating: 5, // Full stars
    },
  ]);

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="text-[15px] space-x-1 leading-none text-orange-400">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="ri-star-fill"></i>
        ))}
        {halfStar && <i className="ri-star-half-line"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="ri-star-line"></i>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Top Podcasters</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Link
              href="#"
              className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
            >
              View All{" "}
              <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full without-top-bottom-border">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Name
                  </th>

                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Episodes
                  </th>

                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Earnings
                  </th>

                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[20px] py-[8px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-gray-50 dark:bg-[#15203c] whitespace-nowrap text-gray-500 dark:text-gray-400">
                    Ratings
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {podcasters.map((podcaster, index) => (
                  <tr
                    key={podcaster.id}
                    className={
                      index === 0 || index === podcasters.length - 1
                        ? "no-border"
                        : ""
                    }
                  >
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={podcaster.image}
                            className="inline-block rounded-full"
                            alt="user-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {podcaster.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {podcaster.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {podcaster.episodes}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {podcaster.earnings}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {renderStars(podcaster.rating)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-border:first-child td {
          border-top: none;
        }
        .no-border:last-child td {
          border-bottom: none;
          padding-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default TopPodcasters;
