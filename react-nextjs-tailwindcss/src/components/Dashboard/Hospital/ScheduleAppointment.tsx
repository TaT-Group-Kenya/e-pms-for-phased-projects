"use client";

import React from "react";
import Image from "next/image";

const ScheduleAppointment: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-purple-700 mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content text-center">
          <h3 className="!text-[20px] md:!text-xl !mb-[9px] !text-white !font-semibold">
            Schedule Appointment
          </h3>

          <p className="mx-auto max-w-[275px] leading-[1.6] mb-[25px] text-white">
            Quickly schedule an appointment for a patient with any available
            doctor.
          </p>

          <Image
            src="/images/doctor.png"
            alt="doctor-image"
            className="d-block mx-auto"
            width={175}
            height={187}
          />

          <a
            href="#"
            className="inline-block bg-primary-500 text-white rounded-md md:text-md mt-[25px] py-[6px] px-[17px] font-medium transition-all hover:bg-primary-600"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </>
  );
};

export default ScheduleAppointment;
