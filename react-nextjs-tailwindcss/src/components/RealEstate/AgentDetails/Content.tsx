"use client";

import React from "react";
import PropertyStatus from "./PropertyStatus";
import ClientTestimonials from "./ClientTestimonials";

const Content: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <h3 className="!text-md md:!text-lg !mb-[12px]">About Harold Cook</h3>
          <p>
            With over a decade of experience in the real estate market, Harold
            Cook has built a reputation for his in-depth knowledge of
            residential and commercial properties. His commitment to client
            satisfaction, combined with an extensive network, ensures a smooth
            and efficient process, whether buying or selling.
          </p>
          <p>
            
            Harold’s approach focuses on understanding each client’s unique
            needs and goals, providing tailored advice and insights. His market
            expertise and negotiation skills consistently deliver the best
            outcomes, helping clients make informed real estate decisions.
          </p>

          <PropertyStatus />

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Specialization
          </h3>

          <ul>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Expert in City A and surrounding neighborhoods
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Proficient in handling first-time homebuyers, seasoned investors,
              and luxury clients
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Strong understanding of local market trends and pricing strategies
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Provides comprehensive property assessments and personalized
              marketing plans
            </li>
          </ul>

          <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[12px]">
            Recent Achievements
          </h3>
          <ul>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Closed over $10 million in sales in 2023
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Top Agent Award at Prime Realty for 3 consecutive years
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              Successfully negotiated deals for 20+ residential and commercial
              properties in the past year
            </li>
            <li className="relative ltr:pl-[17px] rtl:pr-[17px] mb-[10px] last:mb-0">
              <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary-500 mt-px"></span>
              5-star client satisfaction rating
            </li>
          </ul>

          {/* ClientTestimonials */}
          <ClientTestimonials />
        </div>
      </div>
    </>
  );
};

export default Content;
