"use client";

import React from "react"; 

const AboutMe: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] pb-[20px] md:pb-[25px] flex items-center justify-between border-b border-gray-100 dark:border-[#172036]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">About Me</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <h6 className="!text-md !mb-[11px] [&:not(:first-child)]:!mt-[20px] md:[&:not(:first-child)]:!mt-[25px]">
            Introduction
          </h6>
          <p>
            Alice Johnson, a visionary UX/UI designer, blends creativity with
            user-centric design principles to craft seamless digital
            experiences. With a passion for innovation and a knack for
            understanding user needs, [Your Name] has become a driving force in
            the ever-evolving landscape of digital design. This 5000-word
            biography aims to delve into Alice journey, from humble beginnings
            to becoming a recognized name in the realm of user experience and
            interface design.
          </p>
          <h6 className="!text-md !mb-[11px] [&:not(:first-child)]:!mt-[20px] md:[&:not(:first-child)]:!mt-[25px]">
            Professional Beginnings
          </h6>
          <p>
            Upon graduating, Alice embarked on their professional journey, eager
            to make an impact in the world of design. They initially gained
            experience working at VivoTech, where they collaborated with
            cross-functional teams to deliver user-centric solutions for various
            clients. This early exposure provided invaluable insights into the
            complexities of design processes and solidified Alice commitment
            to enhancing user experiences.
          </p>
          <h6 className="!text-md !mb-[11px] [&:not(:first-child)]:!mt-[20px] md:[&:not(:first-child)]:!mt-[25px]">
            Expertise in UX/UI Design
          </h6>
          <p>
            Driven by a desire for continuous growth, Alice delved deeper into
            the nuances of UX/UI design, staying abreast of emerging trends,
            technologies, and methodologies. They immersed themselves in user
            research, wireframing, prototyping, and usability testing, refining
            their craft with each project undertaken.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutMe;
