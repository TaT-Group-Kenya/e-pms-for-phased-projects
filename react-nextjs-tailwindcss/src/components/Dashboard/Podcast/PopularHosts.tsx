"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Host = {
  id: number;
  name: string;
  image: string;
  role: string;
  hostedCount: number;
  isFollowing: boolean;
};

const PopularHosts: React.FC = () => {
  // Sample data for hosts
  const [hosts, setHosts] = useState<Host[]>([
    {
      id: 1,
      name: "Sarah W.",
      image: "/images/users/user54.jpg",
      role: "Marketing",
      hostedCount: 25,
      isFollowing: false,
    },
    {
      id: 2,
      name: "Tom R.",
      image: "/images/users/user53.jpg",
      role: "Blogging",
      hostedCount: 30,
      isFollowing: false,
    },
    {
      id: 3,
      name: "Amanda G.",
      image: "/images/users/user55.jpg",
      role: "Branding",
      hostedCount: 28,
      isFollowing: true,
    },
    {
      id: 4,
      name: "Lisa Kim",
      image: "/images/users/user41.jpg",
      role: "Storytelling",
      hostedCount: 20,
      isFollowing: false,
    },
    {
      id: 5,
      name: "David C.",
      image: "/images/users/user43.jpg",
      role: "Social Media",
      hostedCount: 18,
      isFollowing: false,
    },
  ]);

  // Toggle follow/unfollow for a host
  const toggleFollow = (id: number) => {
    setHosts((prevHosts) =>
      prevHosts.map((host) =>
        host.id === id ? { ...host, isFollowing: !host.isFollowing } : host
      )
    );
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[30px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0 !font-semibold">Popular Hosts</h5>
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
        <div className="table-responsive overflow-x-auto -mt-[9px]">
          <table className="w-full without-top-bottom-border">
            <tbody className="text-black dark:text-white">
              {hosts.map((host, index) => (
                <tr
                  key={host.id}
                  className={
                    index === 0 || index === hosts.length - 1 ? "no-border" : ""
                  }
                >
                  <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[40px]">
                        <Image
                          src={host.image}
                          className="inline-block rounded-full"
                          alt="user-image"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className="font-medium inline-block mb-px">
                          {host.name}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs">
                          {host.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="font-medium inline-block mb-px">
                      {host.hostedCount}
                    </span>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs">
                      Hosted
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right ltr:last:text-right rtl:last:text-left whitespace-nowrap px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] md:ltr:last:pr-[25px] md:rtl:last:pl-[25px] border-b border-gray-100 dark:border-[#172036]">
                    <button
                      type="button"
                      onClick={() => toggleFollow(host.id)}
                      className={`inline-block rounded-md py-[3.5px] px-[9.5px] ${
                        host.isFollowing
                          ? "text-white bg-primary-500"
                          : "text-primary-500 bg-primary-50 dark:bg-dark"
                      } transition-all hover:bg-primary-500 hover:text-white`}
                    >
                      {host.isFollowing ? "Following" : "Follow"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .no-border:first-child td {
          border-top: none;
          padding-top: 0;
        }
        .no-border:last-child td {
          border-bottom: none;
          padding-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default PopularHosts;
