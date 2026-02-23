"use client";

import React from "react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-[10px]">
        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/settings/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/settings/" ? "bg-primary-500 text-white" : ""
            }`}
          >
            Account Settings
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/settings/change-password/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/settings/change-password/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Change Password
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/settings/connections"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/settings/connections/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Connections
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/settings/privacy-policy/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/settings/privacy-policy/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Privacy Policy
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/settings/terms-conditions/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/settings/terms-conditions/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Terms & Conditions
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Nav;
