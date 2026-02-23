"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Michael Johnson",
    role: "CEO",
    image: "/images/front-pages/team1.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/?lang=en",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Emily Davis",
    role: "Project Manager",
    image: "/images/front-pages/team2.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/?lang=en",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Daniel Lee",
    role: "Sales Team Lead",
    image: "/images/front-pages/team3.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/?lang=en",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Olivia John",
    role: "Frontend Lead",
    image: "/images/front-pages/team4.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/?lang=en",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "James Anderson",
    role: "Backend Engineer",
    image: "/images/front-pages/team1.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/?lang=en",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Sophia Wilson",
    role: "UX Designer",
    image: "/images/front-pages/team2.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://x.com/?lang=en",
      linkedin: "https://www.linkedin.com/",
    },
  },
];

const OurTeam: React.FC = () => {
  return (
    <>
      <div className="container 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
        <div className="md:max-w-[500px] lg:max-w-[630px] mb-[35px] md:mb-[50px] lg:mb-[65px] xl:mb-[90px]">
          <div className="inline-block relative mt-[10px] mb-[20px]">
            <span className="absolute top-[4.5px] w-[5px] h-[5px] ltr:-left-[3.6px] rtl:-right-[3.6px] bg-purple-600 -rotate-[6.536deg]"></span>
            <span className="absolute -top-[9.5px] w-[5px] h-[5px] ltr:right-0 rtl:left-0 bg-purple-600 -rotate-[6.536deg]"></span>
            <span className="inline-block relative text-purple-600 border border-purple-600 py-[5.5px] px-[17.2px] -rotate-[6.536deg]">
              Our Team
              <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-left-[3.5px] rtl:-right-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
              <span className="absolute -bottom-[2.5px] w-[5px] h-[5px] ltr:-right-[3.5px] rtl:-left-[3.5px] bg-purple-600 -rotate-[6.536deg]"></span>
            </span>
          </div>
          <h2 className="!mb-0 !text-[24px] md:!text-[28px] lg:!text-[34px] xl:!text-[36px] -tracking-[.5px] md:-tracking-[.6px] lg:-tracking-[.8px] xl:-tracking-[1px] !leading-[1.2]">
            Introducing Our Exceptional Team. Meet the Minds Driving Our Success
          </h2>
        </div>

        <div className="relative" id="frontPageTeamSlides">
          <Swiper
            navigation={true}
            spaceBetween={25}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            breakpoints={{
              "0": {
                slidesPerView: 1,
              },
              "576": {
                slidesPerView: 2,
              },
              "992": {
                slidesPerView: 3,
              },
            }}
            modules={[Autoplay, Navigation]}
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="mb-px pt-[15px] px-[15px] pb-[12px] rounded-[7px] bg-white/[.26] dark:bg-black/[.54] border border-white/[.24] dark:border-black/[.24] backdrop-blur-[3.5999999046325684px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="rounded-[7px]"
                    width={570}
                    height={570}
                  />
                </div>
                
                <div className="p-[20px] md:p-[25px] lg:p-[30px] rounded-[7px] flex items-center justify-between bg-white/[.26] dark:bg-black/[.54] border border-white/[.24] dark:border-black/[.24] backdrop-blur-[3.5999999046325684px]">
                  <div>
                    <h3 className="!font-semibold !mb-[5px] !text-[16px] md:!text-lg !leading-[1.2]">
                      {member.name}
                    </h3>
                    <span className="block">{member.role}</span>
                  </div>

                  <div className="flex items-center gap-[8px]">
                    {member.socials.facebook && (
                      <a
                        href={member.socials.facebook}
                        className="inline-block leading-none text-[17px] md:text-[20px] transition-all text-primary-600 hover:text-primary-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="ri-facebook-fill"></i>
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a
                        href={member.socials.twitter}
                        className="inline-block leading-none text-[17px] md:text-[20px] transition-all text-primary-600 hover:text-primary-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="ri-twitter-x-fill"></i>
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        className="inline-block leading-none text-[17px] md:text-[20px] transition-all text-primary-600 hover:text-primary-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="ri-linkedin-fill"></i>
                      </a>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="ltr:left-[90px] rtl:right-[90px] -z-[1] bottom-[15px] absolute blur-[150px]">
          <Image
            src="/images/front-pages/shape1.png"
            alt="shape1"
            width={530}
            height={530}
          />
        </div>
        <div className="ltr:-right-[15px] rtl:-left-[15px] -z-[1] -bottom-[130px] absolute blur-[125px]">
          <Image
            src="/images/front-pages/shape1.png"
            alt="shape1"
            width={530}
            height={530}
          />
        </div>
      </div>
    </>
  );
};

export default OurTeam;
