"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Teacher {
  name: string;
  email: string;
  subject: string;
  image: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    // Simulated API call to fetch teachers data
    const fetchTeachers = () => {
      const data: Teacher[] = [
        {
          name: "Sarah W.",
          email: "sarah@trezo.com",
          subject: "Mathematics",
          image: "/images/users/user53.jpg",
        },
        {
          name: "Michael T.",
          email: "michael@trezo.com",
          subject: "English",
          image: "/images/users/user54.jpg",
        },
        {
          name: "Emily J.",
          email: "emily@trezo.com",
          subject: "History",
          image: "/images/users/user55.jpg",
        },
        {
          name: "David A.",
          email: "david@trezo.com",
          subject: "Art",
          image: "/images/users/user56.jpg",
        },
        {
          name: "Jessica M.",
          email: "jessica@trezo.com",
          subject: "Music",
          image: "/images/users/user57.jpg",
        },
      ];
      setTeachers(data);
    };

    fetchTeachers();
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Teachers</h5>
          </div>
          <div className="trezo-card-subtitle">
            <button
              type="button"
              className="inline-block relative ltr:pr-[13px] rtl:pl-[13px] leading-none transition-all hover:text-primary-500"
            >
              View All{" "}
              <i className="ri-arrow-right-s-line absolute top-1/2 -translate-y-1/2 ltr:-right-[8px] rtl:-left-[8px] text-[23px] -mt-px"></i>
            </button>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full without-border">
              <thead>
                <tr>
                  <th className="font-normal border-t border-gray-50 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap ltr:last:text-right rtl:last:text-left">
                    Name
                  </th>
                  <th className="font-normal border-t border-gray-50 dark:border-[#172036] ltr:text-left rtl:text-right px-[20px] py-[10px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 whitespace-nowrap ltr:last:text-right rtl:last:text-left">
                    Subject
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {teachers.slice(0, 5).map((teacher, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-50 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={teacher.image}
                            className="inline-block rounded-full"
                            alt={teacher.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-medium inline-block mb-px">
                            {teacher.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {teacher.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-50 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      {teacher.subject}
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

export default Teachers;
