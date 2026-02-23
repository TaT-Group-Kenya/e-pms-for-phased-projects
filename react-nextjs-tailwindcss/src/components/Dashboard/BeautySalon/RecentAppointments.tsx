"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Calendar from "react-calendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Appointment {
  id: number;
  time: string;
  service: string;
  status: "Done" | "Upcoming";
  client: {
    name: string;
    image: string;
  };
  staff: {
    name: string;
    image: string;
  };
  cardColor: "primary" | "purple";
}

const RecentAppointments: React.FC = () => {
  // currentDate
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString(undefined, options));
  }, []);

  // Calendar
  const [value, onChange] = useState<Value>(new Date());

  // Sample appointment data
  const appointments: Appointment[] = [
    {
      id: 1,
      time: "10:00 AM",
      service: "Pedicure Treatment",
      status: "Done",
      client: {
        name: "Jonathon Ronan",
        image: "/images/users/user36.jpg",
      },
      staff: {
        name: "Zinia Andy",
        image: "/images/users/user37.jpg",
      },
      cardColor: "primary",
    },
    {
      id: 2,
      time: "11:00 AM",
      service: "Facial Treatment",
      status: "Upcoming",
      client: {
        name: "Angela Carter",
        image: "/images/users/user38.jpg",
      },
      staff: {
        name: "Skyler White",
        image: "/images/users/user40.jpg",
      },
      cardColor: "purple",
    },
    {
      id: 3,
      time: "10:00 AM",
      service: "Pedicure Treatment",
      status: "Upcoming",
      client: {
        name: "Jonathon Ronan",
        image: "/images/users/user36.jpg",
      },
      staff: {
        name: "Zinia Andy",
        image: "/images/users/user37.jpg",
      },
      cardColor: "primary",
    },
    {
      id: 4,
      time: "11:00 AM",
      service: "Facial Treatment",
      status: "Upcoming",
      client: {
        name: "Angela Carter",
        image: "/images/users/user38.jpg",
      },
      staff: {
        name: "Skyler White",
        image: "/images/users/user40.jpg",
      },
      cardColor: "purple",
    },
  ];

  // Get styling based on appointment status
  const getStatusStyle = (status: string) => {
    return status === "Done"
      ? "border-success-300 text-success-700 bg-success-100"
      : "border-danger-300 text-danger-700 bg-danger-100";
  };

  // Get card styling based on color
  const getCardStyle = (color: string) => {
    return {
      bg: `bg-${color}-100 dark:bg-[#172036]`,
      text: `text-${color}-500`,
    };
  };

  // Get icon based on status
  const getStatusIcon = (status: string) => {
    return status === "Done" ? "done.svg" : "not-done.svg";
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Appointments</h5>
          </div>

          <div className="trezo-card-subtitle mt-[12px] sm:mt-0">
            <div className="inline-block py-[6.5px] px-[19px] bg-[#f5f7f8] dark:bg-[#0a0e19] rounded-md">
              <span className="inline-block relative ltr:pr-[22px] rtl:pl-[22px]">
                <span>{currentDate}</span>
                <i className="ri-calendar-2-line absolute text-lg top-1/2 -translate-y-1/2 ltr:-right-[3px] rtl:-left-[3px]"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
            <div>
              <Calendar
                onChange={onChange}
                value={value}
                className="working-schedule-calendar"
              />
            </div>

            <div className="schedule-list h-[293px] overflow-y-scroll ltr:-mr-[20px] ltr:md:-mr-[25px] rtl:-ml-[20px] rtl:md:-ml-[25px] ltr:pr-[20px] ltr:md:pr-[25px] rtl:pl-[20px] rtl:md:pl-[25px]">
              {appointments.map((appointment) => {
                const statusStyle = getStatusStyle(appointment.status);
                const cardStyle = getCardStyle(appointment.cardColor);
                const statusIcon = getStatusIcon(appointment.status);

                return (
                  <div
                    key={appointment.id}
                    className={`p-[20px] rounded-md relative z-[1] ${cardStyle.bg} ltr:ml-[34px] rtl:mr-[34px] mb-[20px] last:mb-0`}
                  >
                    <div className="absolute ltr:-left-[34px] rtl:-right-[34px] top-1/2 -translate-y-1/2">
                      <Image
                        src={`/images/icons/${statusIcon}`}
                        alt={appointment.status.toLowerCase()}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <span className="block text-black dark:text-white font-medium">
                          {appointment.time}
                        </span>
                        <span
                          className={`block ${cardStyle.text} font-semibold mt-[4px]`}
                        >
                          {appointment.service}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-block text-xs rounded-[30px] px-[10px] border ${statusStyle} dark:border-dark dark:bg-dark`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-[15px] sm:flex lg:block xl:flex justify-between">
                      <div className="flex items-center gap-[8px]">
                        <Image
                          src={appointment.client.image}
                          alt="client"
                          className="rounded-full w-[35px] border border-white dark:border-black"
                          width={35}
                          height={35}
                        />
                        <div>
                          <span className="block text-xs">Client</span>
                          <span className="-mt-[2px] block text-[13px] font-semibold text-black dark:text-white">
                            {appointment.client.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px] mt-[15px] sm:mt-0 lg:mt-[15px] xl:mt-0">
                        <Image
                          src={appointment.staff.image}
                          alt="staff"
                          className="rounded-full w-[35px] border border-white dark:border-black"
                          width={35}
                          height={35}
                        />
                        <div>
                          <span className="block text-xs">Served by</span>
                          <span className="-mt-[2px] block text-[13px] font-semibold text-black dark:text-white">
                            {appointment.staff.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="-mt-[20px] absolute ltr:-left-[22px] rtl:-right-[22px] top-0 bottom-0 w-[1px] bg-gray-100 dark:bg-[#172036] -z-[1]"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentAppointments;
