"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const LogoutContent: React.FC = () => {
  return (
    <>
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/logout.jpg"
                alt="logout-image"
                className="rounded-[25px]"
                width={646}
                height={804}
              />
            </div>

            <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2">
              <Image
                src="/images/logo-big.svg"
                alt="logo"
                className="inline-block dark:hidden"
                width={142}
                height={38}
              />
              <Image
                src="/images/white-logo-big.svg"
                alt="logo"
                className="hidden dark:inline-block"
                width={142}
                height={38}
              />

              <div className="my-[17px] md:my-[25px]">
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[10px]">
                  Welcome back to Trezo!
                </h1>
                <p className="font-medium leading-[1.5] lg:text-md text-[#445164] dark:text-gray-400">
                  You Are Logged out
                </p>
              </div>

              <div className="flex items-center mb-[20px]">
                <Image
                  src="/images/admin.png"
                  alt="admin-image"
                  className="rounded-full w-[50px] border-[2px] ltr:mr-[13px] rtl:ml-[13px] border-primary-200"
                  width={50}
                  height={50}
                />
                <span className="font-semibold text-black dark:text-white block">
                  Olivia John
                </span>
              </div>

              <Link
                href="/authentication/sign-in"
                className="md:text-md block w-full text-center transition-all rounded-md font-medium py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">autorenew</i>
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutContent;
