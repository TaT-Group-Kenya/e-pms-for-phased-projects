"use client";

import React from "react";
import Image from "next/image";

const Appointments: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content flex justify-between">
          <div>
            <span className="block">Appointments</span>
            <h2 className="!text-xl md:!text-2xl !font-black !mt-[5px] !mb-[8px]">
              32
            </h2>
            <span className="inline-block text-xs rounded-[30px] px-[10px] border border-orange-300 text-danger-500 bg-orange-100 dark:border-[#15203c] dark:bg-[#15203c]">
              -0.04%
            </span>
          </div>
          <div className="mt-[5px]">
            <Image
              src="/images/icons/add-event.svg"
              alt="add-event"
              width={46}
              height={46}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;
