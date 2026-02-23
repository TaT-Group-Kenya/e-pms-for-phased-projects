"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

type Course = {
  id: number;
  title: string;
  image: string;
  price: string;
  sections: number;
  lectures: number;
  duration: string;
  viewLink: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Basic Python",
    image: "/images/courses/course1.jpg",
    price: "$35.99",
    sections: 10,
    lectures: 45,
    duration: "25h 50m",
    viewLink: "/lms/course-details/",
  },
  {
    id: 2,
    title: "HTML Developer",
    image: "/images/courses/course2.jpg",
    price: "$49.99",
    sections: 12,
    lectures: 54,
    duration: "35h 40m",
    viewLink: "/lms/course-details/",
  },
  {
    id: 3,
    title: "Basic Angular",
    image: "/images/courses/course3.jpg",
    price: "$55.99",
    sections: 12,
    lectures: 48,
    duration: "29h 30m",
    viewLink: "/lms/course-details/",
  },
];

const OurTopCourses: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-secondary-500 mb-[25px] p-[20px] md:p-[25px] rounded-md relative overflow-hidden z-[2]">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-white">Our Top Courses</h5>
          </div>
        </div>

        <div className="trezo-card-content relative" id="ourTopCoursesSlides">
          <Swiper
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            modules={[Autoplay, Pagination]}
          >
            {courses.map((course) => (
              <SwiperSlide key={course.id}>
                <div className="flex items-center">
                  <div className="w-[120px] rounded-md shrink">
                    <Image
                      src={course.image}
                      alt={course.title}
                      className="rounded-md"
                      width={520}
                      height={520}
                    />
                  </div>
                  <div className="grow-0 ltr:ml-[15px] rtl:mr-[15px]">
                    <span className="block text-white">{course.title}</span>
                    <div className="font-semibold text-white text-[20px] mt-[3px]">
                      {course.price}
                    </div>
                  </div>
                </div>

                <div className="mt-[10px]">
                  <span className="block font-semibold text-white text-md mb-[2px]">
                    Course content
                  </span>

                  <ul className="text-white">
                    <li className="inline-block relative ltr:mr-[13px] rtl:ml-[13px] ltr:last:mr-0 last:rtl:ml-0">
                      <span className="top-1/2 -translate-y-1/2 absolute w-[4px] h-[4px] ltr:-right-[11px] rtl:-left-[11px] mt-px rounded-full bg-white"></span>
                      {course.sections} sections
                    </li>
                    <li className="inline-block relative ltr:mr-[13px] rtl:ml-[13px] ltr:last:mr-0 last:rtl:ml-0">
                      <span className="top-1/2 -translate-y-1/2 absolute w-[4px] h-[4px] ltr:-right-[11px] rtl:-left-[11px] mt-px rounded-full bg-white"></span>
                      {course.lectures} lectures
                    </li>
                    <li className="inline-block relative ltr:mr-[13px] rtl:ml-[13px] ltr:last:mr-0 last:rtl:ml-0">
                      {course.duration}
                    </li>
                  </ul>

                  <div className="ltr:text-right rtl:text-left">
                    <Link
                      href={course.viewLink}
                      className="inline-block rounded-md mt-[18px] px-[13px] py-[6px] text-white border border-white transition-all hover:bg-white hover:text-black"
                    >
                      <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                        <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                          add
                        </i>
                        View Details
                      </span>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="absolute -top-[80px] -z-[1] ltr:-right-[80px] rtl:-left-[80px] w-[169px] h-[169px] rounded-full bg-secondary-600"></div>
        <div className="absolute -top-[75px] -z-[2] ltr:-right-[75px] rtl:-left-[75px] w-[169px] h-[169px] rounded-full bg-secondary-400"></div>
      </div>
    </>
  );
};

export default OurTopCourses;
