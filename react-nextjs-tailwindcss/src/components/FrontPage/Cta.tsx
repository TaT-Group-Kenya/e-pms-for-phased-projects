"use client";

import React from "react";
import Image from "next/image";

const Cta: React.FC = () => {
  return (
    <>
      <div className="py-[60px] md:py-[80px] lg:py-[100px] xl:py-[150px]">
        <div className="container md:max-w-[960px] 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
          <div className="text-center mx-auto md:max-w-[680px] lg:max-w-[830px]">
            <h2 className="!text-[28px] md:!text-[36px] lg:!text-[45px] xl:!text-[48px] !mb-[13px] md:!mb-[20px] lg:!mb-[25px] xl:!mb-[35px] -tracking-[.5px] md:-tracking-[.8px] lg:-tracking-[1.2px] xl:-tracking-[1.5px] !leading-[1.2]">
              Unlock a world of possibilities with Trezo Dashboard.
            </h2>

            <p className="mx-auto leading-[1.6] md:max-w-[650px] lg:max-w-[680px] xl:max-w-[740px] md:text-[15px] lg:text-[16px] xl:text-[18px] xl:tracking-[.2px]">
              Experience the difference with Trezo Dashboard. Sign up for a free
              trial today and see how our intuitive platform can revolutionize
              your data analysis process.
            </p>

            <a
              href="#"
              className="inline-block lg:text-[15px] xl:text-[16px] mt-[5px] md:mt-[10px] lg:mt-[20px] xl:mt-[30px] py-[12px] px-[17px] bg-purple-600 text-white rounded-md transition-all font-medium hover:bg-purple-500"
            >
              <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[29px] rtl:md:pr-[29px]">
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px] md:!text-[24px]">
                  person
                </i>
                Get started - It is free
              </span>
            </a>
          </div>

          <div className="absolute ltr:left-[10px] rtl:right-[10px] -top-[200px] -z-[1] blur-[150px]">
            <Image
              src="/images/front-pages/shape1.png"
              alt="shape1"
              width={530}
              height={530}
            />
          </div>
          <div className="absolute ltr:right-[25px] rtl:left-[25px] top-[150px] -z-[1] blur-[125px] hidden md:block">
            <Image
              src="/images/front-pages/shape2.png"
              alt="shape1"
              width={530}
              height={530}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cta;
