"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroBanner: React.FC = () => {
  return (
    <>
      <div className="pt-[125px] md:pt-[145px] lg:pt-[185px]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
          <div className="text-center mx-auto xl:max-w-[935px] mb-[30px] md:mb-[45px] lg:mb-[60px]">
            <h1 className="!text-[32px] md:!text-[40px] lg:!text-[50px] xl:!text-[60px] !mb-[13px] md:!mb-[22px] lg:!mb-[25px] xl:!mb-[30px] -tracking-[.5px] md:-tracking-[1px] xl:-tracking-[1.5px] !leading-[1.2]">
              Insights On-the-Go: Access Your Dashboard Anywhere, Anytime
            </h1>

            <p className="mx-auto leading-[1.6] md:text-[15px] lg:text-[16px] xl:text-[18px] md:max-w-[600px] lg:max-w-[650px] xl:max-w-[740px] xl:tracking-[.2px]">
              Our intuitive interface transforms complex data into actionable
              insights, empowering you to make informed decisions with
              confidence.
            </p>

            <Link
              href="/"
              className="inline-block lg:text-[15px] xl:text-[16px] mt-[5px] md:mt-[12px] lg:mt-[20px] xl:mt-[25px] py-[12px] px-[17px] bg-primary-600 text-white rounded-md transition-all font-medium hover:bg-primary-500"
            >
              <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[29px] rtl:md:pr-[29px]">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px] md:!text-[24px]">
                  person
                </i>
                Get started - It is free
              </span>
            </Link>
          </div>

          <div className="text-center">
            <Image
              src="/images/front-pages/dashboard.png"
              className="inline-block"
              alt="dashboard-image"
              width={848}
              height={585}
            />
          </div>

          <div className="absolute -z-[1] ltr:-right-[30px] rtl:-left-[30px] bottom-[50px] blur-[150px]">
            <Image
              src="/images/front-pages/shape3.png"
              alt="shape3"
              width={685}
              height={685}
            />
          </div>
          <div className="absolute -z-[1] ltr:left-[25px] rtl:right-[25px] -top-[210px] blur-[125px]">
            <Image
              src="/images/front-pages/shape2.png"
              alt="shape3"
              width={437}
              height={453}
            />
          </div>
          <div className="absolute -z-[1] ltr:right-[260px] rtl:left-[260px] -top-[125px] blur-[75px]">
            <Image
              src="/images/front-pages/shape4.png"
              alt="shape3"
              width={170}
              height={170}
            />
          </div>
          <div className="absolute -z-[1] ltr:-left-[50px] rtl:-right-[50px] bottom-0 blur-[75px]">
            <Image
              src="/images/front-pages/shape5.png"
              alt="shape3"
              width={658}
              height={656}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
