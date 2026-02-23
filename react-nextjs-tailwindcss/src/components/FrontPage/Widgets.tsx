"use client";

import React from "react";
import Image from "next/image";

interface Widget {
  title: string;
  description: string;
}

const widgetsData: Widget[] = [
  {
    title: "Tailored Display",
    description:
      "Easily arrange, resize, and configure widgets to showcase the data most relevant to your workflow.",
  },
  {
    title: "Personalized Insights",
    description:
      "Customize widget content and visualization options to match your specific preferences and priorities.",
  },
  {
    title: "Flexibility and Versatility",
    description:
      "Adapt widgets to evolving business needs by adjusting layouts, styles, and data sources with ease.",
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate widgets seamlessly with other dashboard components and external systems for a cohesive user experience.",
  },
];

const Widgets: React.FC = () => {
  return (
    <>
      <div className="pb-[60px] md:pb-[80px] lg:pb-[100px] xl:pb-[150px]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="relative">
              <div className="md:max-w-[600px] lg:max-w-[400px] xl:max-w-[510px] p-[15px] md:p-[25px] xl:py-[27px] xl:px-[34px] rounded-[7px] bg-white/[.54] dark:bg-black/[.54] border border-white/[.10] dark:border-black/[.10] backdrop-blur-[5.400000095367432px]">
                <Image
                  src="/images/front-pages/order-summary.png"
                  className="inline-block"
                  alt="order-summary-image"
                  width={440}
                  height={536}
                />
              </div>
              <div className="absolute ltr:right-0 rtl:left-0 ltr:lg:right-[30px] rtl:lg:left-[30px] max-w-[120px] md:max-w-[200px] lg:max-w-[219px] -mt-[15px] md:-mt-[17px] rounded-[4.294px] top-1/2 -translate-y-1/2 drop-shadow-xl">
                <Image
                  src="/images/front-pages/courses-sales.jpg"
                  className="inline-block rounded-[4.294px]"
                  alt="courses-sales-image"
                  width={219}
                  height={195}
                />
              </div>
            </div>

            <div>
              <h2 className="!leading-[1.2] !text-[24px] md:!text-[28px] lg:!text-[34px] xl:!text-[36px] !mb-[15px] !-tracking-[.5px] md:!-tracking-[.6px] lg:!-tracking-[.8px] xl:!-tracking-[1px]">
                Tailor Your Dashboard: Unleash the Power of Customizable Widgets
              </h2>

              <ul className="ltr:xl:pl-[18px] rtl:xl:pr-[18px] mt-[25px] md:mt-[30px] lg:mt-[35px] xl:mt-[65px]">
                {widgetsData.map((widget, index) => (
                  <li
                    key={index}
                    className="relative ltr:pl-[25px] rtl:pr-[25px] ltr:md:pl-[28px] rtl:md:pr-[28px] ltr:lg:pl-[30px] rtl:lg:pr-[30px] mb-[25px] xl:mb-[32px] last:mb-0"
                  >
                    <i className="material-symbols-outlined absolute text-primary-600 !text-[17px] md:!text-[18px] lg:!text-[20px] ltr:left-0 rtl:right-0 top-0">
                      done_outline
                    </i>
                    <h3 className="!text-[15px] md:!text-[16px] lg:!text-[17px] xl:!text-lg !mb-[8px] md:!mb-[10px] !font-semibold !leading-[1.2]">
                      {widget.title}
                    </h3>
                    <p className="leading-[1.6] md:max-w-[458px]">
                      {widget.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="absolute -top-[60px] ltr:left-[65px] rtl:right-[65px] -z-[1] blur-[150px]">
            <Image
              src="/images/front-pages/shape1.png"
              alt="shape1"
              width={530}
              height={530}
            />
          </div>
          <div className="absolute -bottom-[30px] ltr:right-[20px] rtl:left-[20px] -z-[1] blur-[125px]">
            <Image
              src="/images/front-pages/shape2.png"
              alt="shape1"
              width={447}
              height={453}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Widgets;
