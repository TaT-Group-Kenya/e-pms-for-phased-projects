"use client";

import React from "react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  timeAgo: string;
  rating: number; // Rating out of 5
  comment: string;
  imageUrl: string;
}

// Example testimonial data
const testimonials: TestimonialCardProps[] = [
  {
    name: "Irene George",
    timeAgo: "15m ago",
    rating: 5,
    comment:
      "Great service! Found exactly what I needed for my property, and the process was smooth and hassle-free.",
    imageUrl: "/images/users/user65.jpg",
  },
  {
    name: "Jose Grafton",
    timeAgo: "22m ago",
    rating: 4.5,
    comment:
      "Impressed with the timely responses and professional approach. Highly recommend for anyone seeking real estate solutions!",
    imageUrl: "/images/users/user64.jpg",
  },
  {
    name: "Paula McClelland",
    timeAgo: "30m ago",
    rating: 4,
    comment:
      "The entire process was seamless, and I couldn't be happier with the results. Excellent customer service throughout!",
    imageUrl: "/images/users/user63.jpg",
  },
  {
    name: "Virgil Martin",
    timeAgo: "49m ago",
    rating: 5,
    comment:
      "Highly satisfied with the attention to detail and prompt support. They made everything easy and stress-free!",
    imageUrl: "/images/users/user62.jpg",
  },
];

const ClientTestimonials: React.FC = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="ri-star-fill text-orange-500"></i>);
      } else if (i - 0.5 === rating) {
        stars.push(
          <i key={i} className="ri-star-half-fill text-orange-500"></i>
        );
      } else {
        stars.push(<i key={i} className="ri-star-line text-orange-500"></i>);
      }
    }
    return stars;
  };

  return (
    <>
      <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[18px]">
        Client Testimonials
      </h3>

      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="border-b border-primary-50 dark:border-[#172036] mb-[15px] pb-[15px] last:border-b-0 last:pb-0 last:mb-0"
        >
          <div className="flex items-center justify-between mb-[12px]">
            <div className="flex items-center gap-[12px]">
              <Image
                src={testimonial.imageUrl}
                className="w-[45px] rounded-full"
                alt="user-image"
                width={45}
                height={45}
              />
              <div>
                <span className="block sm:text-[15px] text-black dark:text-white font-semibold">
                  {testimonial.name}
                </span>
                <span className="block">{testimonial.timeAgo}</span>
              </div>
            </div>
            <div className="flex items-center gap-[3px]">
              {renderStars(testimonial.rating)}
            </div>
          </div>
          <p className="md:max-w-[550px]">{testimonial.comment}</p>
        </div>
      ))}
    </>
  );
};

export default ClientTestimonials;
