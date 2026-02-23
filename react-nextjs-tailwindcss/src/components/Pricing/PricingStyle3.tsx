"use client";

import React from "react";
import Image from "next/image";

// Define pricing plans dynamically
const pricingPlans = [
  {
    name: "Basic",
    price: "$29",
    description: "For individual user",
    features: [
      "Basic Dashboard",
      "Task Management",
      "File Storage (5GB)",
      "Basic Reporting",
      "Email Integration",
      "Basic Support",
    ],
    isPopular: false,
  },
  {
    name: "Standard",
    price: "$49",
    description: "For team of 10 users",
    features: [
      "Advanced Dashboard",
      "Task Management",
      "File Storage (10GB)",
      "Advanced Reporting",
      "Email Integration",
      "Priority Support",
    ],
    isPopular: true,
  },
  {
    name: "Premium",
    price: "$79",
    description: "For team of 15 users",
    features: [
      "Customizable Dashboard",
      "Task Management",
      "File Storage (Unlimited)",
      "Custom Reporting",
      "Email Integration",
      "24/7 Premium Support",
    ],
    isPopular: false,
  },
];

const PricingStyle3: React.FC = () => {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Pricing Style - 3</h5>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md text-center">
        <div className="trezo-card-content py-[25px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px]">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="md:px-[25px] relative">
                <span className="inline-block text-gray-400 rounded-md py-[6.5px] px-[17.3px] border border-gray-100 dark:border-[#172036]">
                  {plan.name}
                </span>

                <div className="leading-none text-4xl text-black dark:text-white my-[15px] md:my-[17px] font-medium -tracking-[1px]">
                  {plan.price}
                  <span className="text-md text-gray-500 dark:text-gray-400 font-normal tracking-normal">
                    / per month
                  </span>
                </div>

                <p className="font-medium">{plan.description}</p>

                <button
                  type="button"
                  className="block w-full rounded-md font-medium transition-all md:text-md mt-[20px] md:mt-[20px] py-[12px] px-[20px] text-white bg-primary-500 hover:bg-primary-400"
                >
                  <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                    <i className="material-symbols-outlined !text-md absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                      arrow_forward_ios
                    </i>
                    Buy Now
                  </span>
                </button>

                <ul className="mt-[20px] md:mt-[28px] ltr:text-left rtl:text-right">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="relative ltr:pl-[30px] ltr:md:pl-[38px] rtl:pr-[30px] rtl:md:pr-[38px] mb-[15px] last:mb-0"
                    >
                      <i className="material-symbols-outlined text-success-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                        check
                      </i>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Show "Popular" badge for Standard Plan */}
                {plan.isPopular && (
                  <div className="absolute -top-[9px] ltr:-right-[17px] rtl:-left-[17px]">
                    <Image
                      src="/images/icons/star-popular.svg"
                      alt="popular-image"
                      width={80}
                      height={80}
                    />
                  </div>
                )} 
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingStyle3;
