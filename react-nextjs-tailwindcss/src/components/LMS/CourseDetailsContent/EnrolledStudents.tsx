"use client";

import React from "react";
import Image from "next/image";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const initialStudents: Student[] = [
  {
    id: "#A-1217",
    name: "Olivia Clark",
    email: "olivia@trezo.com",
    avatar: "/images/users/user13.jpg",
  },
  {
    id: "#A-1364",
    name: "Ava Turner",
    email: "ava@trezo.com",
    avatar: "/images/users/user16.jpg",
  },
  {
    id: "#A-2951",
    name: "Lucas Morgan",
    email: "lucas@trezo.com",
    avatar: "/images/users/user17.jpg",
  },
  {
    id: "#A-7342",
    name: "Isabella Cooper",
    email: "isabella@trezo.com",
    avatar: "/images/users/user18.jpg",
  },
  {
    id: "#A-8593",
    name: "Ethan Wright",
    email: "ethan@trezo.com",
    avatar: "/images/users/user19.jpg",
  },
  {
    id: "#A-9274",
    name: "Sophia Hall",
    email: "sophia@trezo.com",
    avatar: "/images/users/user20.jpg",
  },
  {
    id: "#A-1023",
    name: "Benjamin Carter",
    email: "benjamin@trezo.com",
    avatar: "/images/users/user21.jpg",
  },
  {
    id: "#A-3847",
    name: "Mia Adams",
    email: "mia@trezo.com",
    avatar: "/images/users/user22.jpg",
  },
  {
    id: "#A-5621",
    name: "Daniel Evans",
    email: "daniel@trezo.com",
    avatar: "/images/users/user23.jpg",
  },
  {
    id: "#A-6789",
    name: "Charlotte Brooks",
    email: "charlotte@trezo.com",
    avatar: "/images/users/user24.jpg",
  },
];


const EnrolledStudents: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Enrolled Students</h5>
          </div>
        </div>
        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-auto h-[426px]">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {initialStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <Image
                          src={student.avatar}
                          className="inline-block rounded-full w-[44px]"
                          alt="product-image"
                          width={44}
                          height={44}
                        />
                        <span className="font-medium inline-block ltr:ml-[12px] rtl:mr-[12px]">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {student.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrolledStudents;
