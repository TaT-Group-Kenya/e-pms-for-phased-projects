"use client";

import React from "react";

const Headings: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Headings</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="relative">
            <h1>
              Example heading
              <span className="bg-primary-500 text-white rounded-md py-[.35em] px-[.65em] inline-block font-normal">
                New
              </span>
            </h1>
            <h2>
              Example heading
              <span className="bg-primary-500 text-white rounded-md py-[.35em] px-[.65em] inline-block font-normal">
                New
              </span>
            </h2>
            <h3>
              Example heading
              <span className="bg-primary-500 text-white rounded-md py-[.35em] px-[.65em] inline-block font-normal">
                New
              </span>
            </h3>
            <h4>
              Example heading
              <span className="bg-primary-500 text-white rounded-md py-[.35em] px-[.65em] inline-block font-normal">
                New
              </span>
            </h4>
            <h5>
              Example heading
              <span className="bg-primary-500 text-white rounded-md py-[.35em] px-[.65em] inline-block font-normal">
                New
              </span>
            </h5>
            <h6>
              Example heading
              <span className="bg-primary-500 text-white rounded-md py-[.35em] px-[.65em] inline-block font-normal">
                New
              </span>
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default Headings;
