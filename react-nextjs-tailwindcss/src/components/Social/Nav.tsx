"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-[25px] text-center">
        <li className="inline-block mx-[3px]">
          <Link
            href="/social/profile/"
            className={`block py-[8.5px] px-[15px] font-medium rounded-md border hover:bg-primary-500 hover:text-white  ${
              pathname === "/social/profile/"
                ? "bg-primary-500 text-white border-primary-500"
                : ""
            }`}
          >
            Timeline
          </Link>
        </li>

        <li className="inline-block mx-[3px]">
          <Link
            href="/social/about/"
            className={`block py-[8.5px] px-[15px] font-medium rounded-md border hover:bg-primary-500 hover:text-white  ${
              pathname === "/social/about/"
                ? "bg-primary-500 text-white border-primary-500"
                : ""
            }`}
          >
            About
          </Link>
        </li>

        <li className="inline-block mx-[3px]">
          <Link
            href="/social/activity/"
            className={`block py-[8.5px] px-[15px] font-medium rounded-md border hover:bg-primary-500 hover:text-white  ${
              pathname === "/social/activity/"
                ? "bg-primary-500 text-white border-primary-500"
                : ""
            }`}
          >
            Activity
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Nav;
