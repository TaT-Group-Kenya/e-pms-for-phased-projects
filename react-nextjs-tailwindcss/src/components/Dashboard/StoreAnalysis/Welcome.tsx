"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] rounded-md !pb-0"
        style={{
          background: "linear-gradient(104deg, #361E7D 2.4%, #403CFF 112.33%)",
        }}
      >
        <div className="trezo-card-content 2xl:px-[15px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
            <div className="lg:col-span-2">
              <div className="md:pt-[20px] text-center ltr:md:text-left rtl:md:text-right">
                <span className="block text-primary-200 font-medium mb-[4px]">
                  Hello Olivia ✋
                </span>
                <h1 className="!text-white !text-2xl !mb-0 !font-normal">
                  Welcome To Trezo –{" "}
                  <strong className="font-black">Your Store</strong>
                </h1>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="text-center ltr:md:text-right rtl:md:text-left">
                <Image
                  src="/images/store.png"
                  className="inline-block"
                  alt="image"
                  width={208}
                  height={144}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
