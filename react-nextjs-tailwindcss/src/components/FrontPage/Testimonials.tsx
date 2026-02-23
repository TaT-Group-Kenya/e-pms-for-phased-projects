"use client";

import React from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  feedback: string;
  image: string;
  rating: number;
}

const testimonialsData: Testimonial[] = [
  {
    name: "Sarah Thompson",
    role: "Data Analyst",
    feedback:
      "Trezo Dashboard Template has transformed how we manage our data. Its intuitive design and customizable features have streamlined our analytics process, enabling us to make informed decisions faster than ever before.",
    image: "/images/front-pages/user1.jpg",
    rating: 5,
  },
  {
    name: "John Smith",
    role: "Software Engineer",
    feedback:
      "As a developer, I appreciate the flexibility and robustness of Trezo Dashboard. It offers a wide range of features that cater to our diverse needs, and its clean codebase has made customization a breeze. Highly recommended!",
    image: "/images/front-pages/user2.jpg",
    rating: 4.5,
  },
  {
    name: "Alex Rodriguez",
    role: "Marketing Director",
    feedback:
      "Trezo Dashboard has been a lifesaver for our organization. It's helped us streamline our reporting processes and communicate insights effectively across departments. The time saved has allowed us to focus more on strategic initiatives.",
    image: "/images/front-pages/user3.jpg",
    rating: 4,
  },
  {
    name: "Kevin Brown",
    role: "Project Manager",
    feedback:
      "I can't recommend the Trezo Template enough. It's helped us gain a deeper understanding of our business metrics and identify areas for improvement. The responsive support team is a bonus, always ready to assist whenever needed.",
    image: "/images/front-pages/user4.jpg",
    rating: 3.5,
  },
  {
    name: "Olivia Adams",
    role: "Marketing Coordinator",
    feedback:
      "Using Trezo Dashboard Template has been a game-changer for our team. The ability to customize widgets to suit our specific needs has allowed us to gain deeper insights into our performance metrics and drive business growth.",
    image: "/images/front-pages/user5.jpg",
    rating: 5,
  },
  {
    name: "Daniel Lee",
    role: "Co-founder, StartupX",
    feedback:
      "As a startup, we needed a dashboard solution that was both powerful and cost-effective. Trezo Dashboard Template checked all the boxes for us. It's helped us stay agile and competitive in a fast-paced market.",
    image: "/images/front-pages/user3.jpg",
    rating: 3,
  },
];

const Testimonials: React.FC = () => {
  return (
    <>
      <div className="relative z-[1] pb-[60px] md:pb-[80px] lg:pb-[100px] xl:pb-[150px]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          <div className="mx-auto text-center md:max-w-[650px] lg:max-w-[810px] xl:max-w-[785px] mb-[35px] md:mb-[50px] lg:mb-[65px] xl:mb-[90px]">
            <div className="inline-block relative mt-[10px] mb-[20px]">
              <span className="absolute top-[4.5px] w-[5px] h-[5px] ltr:-left-[3.6px] rtl:-right-[3.6px] bg-purple-600 -rotate-[6.536deg]"></span>
              <span className="absolute -top-[9.5px] w-[5px] h-[5px] ltr:right-0 rtl:left-0 bg-purple-600 -rotate-[6.536deg]"></span>
              <span className="inline-block relative text-purple-600 border border-purple-600 py-[5.5px] px-[17.2px] -rotate-[6.536deg]">
                Testimonials
                <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-left-[3.5px] rtl:-right-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
                <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-right-[3.5px] rtl:-left-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
              </span>
            </div>
            <h2 className="!mb-0 !text-[24px] md:!text-[28px] lg:!text-[34px] xl:!text-[36px] -tracking-[.5px] md:-tracking-[.6px] lg:-tracking-[.8px] xl:-tracking-[1px] !leading-[1.2]">
              Inspiring Feedback: What Users Love About Trezo Dashboard
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px]">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0c1427] p-[20px] md:p-[30px] xl:p-[40px] rounded-[7px]"
              >
                <div className="leading-none mb-[12px] md:mb-[20px] text-[16px] md:text-[19px] text-[#fe7a36] flex items-center gap-[4px]">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`ri-star${
                        i < Math.floor(testimonial.rating)
                          ? "-fill"
                          : i < testimonial.rating
                          ? "-half-fill"
                          : "-line"
                      }`}
                    ></i>
                  ))}
                </div>

                <p className="text-[14px] md:text-[16px] font-medium leading-[1.6]">
                  {testimonial.feedback}
                </p>

                <div className="flex items-center mt-[15px] md:mt-[20px] gap-[12px] md:gap-[15px]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-full"
                    width={50}
                    height={50}
                  />
                  <div>
                    <h5 className="!text-[15px] md:!text-[16px] !mb-[3px] !font-semibold">
                      {testimonial.name}
                    </h5>
                    <span className="block">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
