"use client";

import React from "react";
import Image from "next/image";

const UpgradePlan: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card py-[20px] md:py-[18.5px] px-[20px] md:px-[25px] rounded-md mb-[25px]"
        style={{
          background: "linear-gradient(90deg, #4936F5 0%, #4737D6 100%)",
        }}
      >
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-[15px]">
            <div className="text-center ltr:sm:text-left rtl:sm:text-right">
              <h3 className=" !text-white !font-semibold !max-w-[250px] !leading-[1.5] !text-lg md:!text-[20px] !mb-0">
                Upgrade Plan To Manage 20K+ Patients
              </h3>
            </div>
            <div className="text-center ltr:sm:text-right rtl:sm:text-left">
              <Image
                src="/images/users.png"
                className="inline-block"
                alt="users-image"
                width={175}
                height={76}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradePlan;
