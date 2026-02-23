"use client";

import React from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  feedback: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Jason Lee",
    role: "Physician Assistant",
    image: "/images/users/user9.jpg",
    rating: 5,
    feedback:
      "Statistics is the science of using data to make decisions. This is relevant in almost all fields of work and there are many opportunities for employment.",
  },
  {
    name: "Ashley Davis",
    role: "Data Scientist",
    image: "/images/users/user10.jpg",
    rating: 4.5,
    feedback:
      "Statistics is the science of using data to make decisions. This is relevant in almost all fields of work and there are many opportunities for employment.",
  },
  {
    name: "Alex Rocky",
    role: "Marketing Manager",
    image: "/images/users/user11.jpg",
    rating: 4,
    feedback:
      "Statistics is the science of using data to make decisions. This is relevant in almost all fields of work and there are many opportunities for employment.",
  },
];

const TestimonialsStyle2: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Testimonials Style - 2</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="text-center bg-[#f5f7f8] dark:bg-[#15203c] rounded-md p-[20px] md:p-[25px]"
              >
                <Image
                  src={testimonial.image}
                  width={100}
                  height={100}
                  alt={testimonial.name}
                  className="inline-block rounded-full"
                />
                <h5 className="!mt-[15px] !mb-[7px]">{testimonial.name}</h5>

                <span className="block">{testimonial.role}</span>

                <div className="leading-none text-[#fe7a36] my-[15px] text-md flex items-center justify-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, starIndex) => {
                    const isHalfStar =
                      testimonial.rating - starIndex >= 0.5 &&
                      testimonial.rating - starIndex < 1;
                    return (
                      <i
                        key={starIndex}
                        className={`${
                          testimonial.rating > starIndex
                            ? isHalfStar
                              ? "ri-star-half-line"
                              : "ri-star-fill"
                            : "ri-star-line"
                        }`}
                      ></i>
                    );
                  })}
                </div>

                <p>{testimonial.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsStyle2;
