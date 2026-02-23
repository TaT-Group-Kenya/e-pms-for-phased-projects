"use client";

import React from "react";

const pricingPlans = [
  {
    title: "Standard",
    price: "$89.99",
    description: "For individual user",
    features: [
      "Advanced Dashboard",
      "Task Management",
      "File Storage (5GB)",
      "Email Integration",
      "Mobile App Access",
      "Custom Branding",
    ],
    isPopular: true,
  },
  {
    title: "Premium",
    price: "$119.99",
    description: "For team of 10 users",
    features: [
      "Customizable Dashboard",
      "Task Management",
      "File Storage (Unlimited)",
      "Custom Reporting",
      "24/7 Premium Support",
      "White-label Solution",
    ],
  },
];

const PricingStyle1: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content md:p-[10px] md:max-w-[500px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
                <div className="relative ltr:sm:mr-[45px] rtl:sm:ml-[45px] ltr:sm:border-r rtl:sm:border-l border-gray-100 dark:border-[#172036]">
                  <span className="inline-block text-gray-400 rounded-md py-[6.5px] px-[17.3px] border border-gray-100 dark:border-[#172036]">
                    {plan.title}
                  </span>

                  <div className="font-medium text-black dark:text-white text-4xl mt-[15px] mb-[15px] md:mb-[25px] -tracking-[1px] leading-none">
                    {plan.price}
                  </div>

                  <p className="font-medium">{plan.description}</p>

                  <button
                    type="button"
                    className="inline-block rounded-md font-medium transition-all md:text-md md:mt-[5px] py-[12px] px-[20px] text-white bg-primary-500 hover:bg-primary-400"
                  >
                    <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                      <i className="material-symbols-outlined !text-md absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                        arrow_forward_ios
                      </i>
                      Buy Now
                    </span>
                  </button>

                  {plan.isPopular && (
                    <div className="inline-block rounded-md bg-orange-600 text-white top-0 md:-top-[20px] ltr:right-0 ltr:md:-right-[35px] rtl:left-0 rtl:md:-left-[35px] py-[6px] px-[14px] absolute text-xs -rotate-[10.156deg]">
                      Most Popular
                    </div>
                  )}
                </div>
                
                <ul className="md:ltr:-ml-[25px] md:rtl:-mr-[25px]">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="relative ltr:pl-[30px] ltr:md:pl-[38px] rtl:pr-[30px] rtl:md:pr-[38px] mb-[15px] last:mb-0"
                    >
                      <i className="material-symbols-outlined text-success-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                        check
                      </i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PricingStyle1;
