"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  doctor: {
    name: string;
    image: string;
  };
  department: string;
  status: "Confirmed" | "Rescheduled" | "Cancelled" | "Pending";
}

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Simulate fetching data
    const fetchAppointments = () => {
      const data: Appointment[] = [
        {
          id: 1,
          patientName: "John Doe",
          date: "Sep 12, 2024",
          time: "10:30 AM",
          doctor: {
            name: "Dr. Sarah",
            image: "/images/users/user11.jpg",
          },
          department: "Cardiology",
          status: "Confirmed",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          date: "Sep 11, 2024",
          time: "11:00 AM",
          doctor: {
            name: "Dr. Mark",
            image: "/images/users/user32.jpg",
          },
          department: "Pediatrics",
          status: "Rescheduled",
        },
        {
          id: 3,
          patientName: "Robert Clark",
          date: "Sep 10, 2024",
          time: "12:00 PM",
          doctor: {
            name: "Dr. Emily",
            image: "/images/users/user33.jpg",
          },
          department: "Orthopedics",
          status: "Cancelled",
        },
        {
          id: 4,
          patientName: "Linda Green",
          date: "Sep 09, 2024",
          time: "9:30 AM",
          doctor: {
            name: "Dr. Adam",
            image: "/images/users/user34.jpg",
          },
          department: "Dermatology",
          status: "Confirmed",
        },
        {
          id: 5,
          patientName: "Michael White",
          date: "Sep 08, 2024",
          time: "2:00 PM",
          doctor: {
            name: "Dr. Rebecca",
            image: "/images/users/user35.jpg",
          },
          department: "Surgery",
          status: "Pending",
        },
        {
          id: 6,
          patientName: "Michael White",
          date: "Sep 08, 2024",
          time: "2:00 PM",
          doctor: {
            name: "Dr. Rebecca",
            image: "/images/users/user35.jpg",
          },
          department: "Surgery",
          status: "Pending",
        },
        {
          id: 7,
          patientName: "Jane Smith",
          date: "Sep 11, 2024",
          time: "11:00 AM",
          doctor: {
            name: "Dr. Mark",
            image: "/images/users/user32.jpg",
          },
          department: "Pediatrics",
          status: "Rescheduled",
        },
        {
          id: 8,
          patientName: "John Doe",
          date: "Sep 12, 2024",
          time: "10:30 AM",
          doctor: {
            name: "Dr. Sarah",
            image: "/images/users/user11.jpg",
          },
          department: "Cardiology",
          status: "Confirmed",
        },
        {
          id: 9,
          patientName: "Linda Green",
          date: "Sep 09, 2024",
          time: "9:30 AM",
          doctor: {
            name: "Dr. Adam",
            image: "/images/users/user34.jpg",
          },
          department: "Dermatology",
          status: "Confirmed",
        },
        {
          id: 10,
          patientName: "Robert Clark",
          date: "Sep 10, 2024",
          time: "12:00 PM",
          doctor: {
            name: "Dr. Emily",
            image: "/images/users/user33.jpg",
          },
          department: "Orthopedics",
          status: "Cancelled",
        },
      ];
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const statusStyles: Record<Appointment["status"], string> = {
    Confirmed: "bg-success-100 text-success-600",
    Rescheduled: "bg-primary-50 text-primary-500",
    Cancelled: "bg-danger-100 text-danger-500",
    Pending: "bg-purple-100 text-purple-700",
  };

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Patient Appointments</h5>
          </div>
          <div className="trezo-card-subtitle mt-[10px] sm:mt-0">
            <button
              type="button"
              className="rounded-md inline-block transition-all py-[3.5px] px-[17px] border border-gray-100 dark:border-[#172036] hover:border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[26px] rtl:pr-[26px]">
                <i className="ri-calendar-line absolute text-[18px] top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                Oct 01 - Oct 31, 2024
              </span>
            </button>
          </div>
        </div>
        
        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Patient Name
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Date
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Time
                  </th>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Assigned
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Department
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[6px] border-b border-gray-100 dark:border-[#172036]">
                      {appointment.patientName}
                    </td>

                    <td className="font-medium text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[6px] border-b border-gray-100 dark:border-[#172036]">
                      {appointment.date}
                    </td>

                    <td className="font-medium text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[6px] border-b border-gray-100 dark:border-[#172036]">
                      {appointment.time}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[6px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="rounded-full w-[34px]">
                          <Image
                            src={appointment.doctor.image}
                            className="inline-block rounded-full"
                            alt={appointment.doctor.name}
                            width={34}
                            height={34}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {appointment.doctor.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="font-medium text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[6px] border-b border-gray-100 dark:border-[#172036]">
                      {appointment.department}
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[6px] border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block ${
                          statusStyles[appointment.status]
                        } dark:bg-[#15203c] rounded-sm font-medium text-xs`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[9px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {paginatedAppointments.length} of {appointments.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "bg-primary-500 border-primary-500 text-white"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientAppointments;
