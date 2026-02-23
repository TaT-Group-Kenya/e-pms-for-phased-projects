"use client";

import React from "react";
import Image from "next/image";

const Cta: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] text-center rounded-md"
        style={{
          background: "linear-gradient(162deg, #D7B5FD 3.82%, #9947F5 98.54%)",
        }}
      >
        <div className="trezo-card-content md:py-[11px] mx-auto md:max-w-[212px]">
          <h3 className="dark:!text-black !text-lg md:!text-xl !leading-[1.3] !mb-[15px] md:!mb-[30px] !mx-auto !max-w-[185px]">
            <span className="font-normal">Want To Try</span> New Marketing Tool?
          </h3>
          <Image
            src="/images/marketing-tool.png"
            className="mx-auto"
            alt="marketing-tool-image"
            width={212}
            height={184}
          />
          <a
            href="#"
            target="_blank"
            className="mt-[15px] md:mt-[30px] mb-[5px] inline-block rounded-md bg-purple-700 text-white transition-all text-[15px] md:text-md font-medium py-[6px] px-[16.5px] hover:bg-purple-600"
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
};

export default Cta;
