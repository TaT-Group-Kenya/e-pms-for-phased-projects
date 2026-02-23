"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <>
      <div className="pt-[60px] md:pt-[80px] lg:pt-[100px] xl:pt-[150px] border-t border-gray-100 dark:border-[#172036]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px]">
            <div className="ltr:xl:-mr-[35px] rtl:xl:-ml-[35px]">
              <Link
                href="/"
                className="inline-block max-w-[132px] mb-[20px] md:mb-[23px]"
              >
                <Image
                  src="/images/logo-big.svg"
                  alt="logo"
                  className="inline-block dark:hidden"
                  width={132}
                  height={53}
                />
                <Image
                  src="/images/white-logo-big.svg"
                  alt="logo"
                  className="hidden dark:inline-block"
                  width={132}
                  height={53}
                />
              </Link>

              <p className="leading-[1.6]">
                With customizable dashboards tailored to your needs, collaborate
                effortlessly with your team and stay ahead with real-time
                updates.
              </p>

              <div className="mt-[20px] md:mt-[35px]">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="inline-block leading-none text-[20px] text-primary-600 transition-all hover:text-primary-500 ltr:mr-[8px] rtl:ml-[8px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <i className="ri-facebook-fill"></i>
                </a>
                <a
                  href="https://x.com/?lang=en"
                  target="_blank"
                  className="inline-block leading-none text-[20px] text-primary-600 transition-all hover:text-primary-500 ltr:mr-[8px] rtl:ml-[8px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <i className="ri-twitter-x-fill"></i>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="inline-block leading-none text-[20px] text-primary-600 transition-all hover:text-primary-500 ltr:mr-[8px] rtl:ml-[8px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <i className="ri-linkedin-fill"></i>
                </a>
                <a
                  href="https://www.dribbble.com/"
                  target="_blank"
                  className="inline-block leading-none text-[20px] text-primary-600 transition-all hover:text-primary-500 ltr:mr-[8px] rtl:ml-[8px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <i className="ri-dribbble-fill"></i>
                </a>
              </div>
            </div>

            <div className="ltr:xl:pl-[142px] rtl:xl:pr-[142px]">
              <h3 className="!leading-[1.2] !text-[16px] md:!text-lg !mb-[18px] !font-semibold">
                Our Products
              </h3>
              <ul>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Trezo Dashboard
                  </Link>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <a
                    href="#"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Tagus Admin
                  </a>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <a
                    href="#"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    eCademy LMS
                  </a>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <a
                    href="#"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Admash Template
                  </a>
                </li>
              </ul>
            </div>

            <div className="ltr:xl:pl-[130px] rtl:xl:pr-[130px]">
              <h3 className="!leading-[1.2] !text-[16px] md:!text-lg !mb-[18px] !font-semibold">
                Quick Links
              </h3>
              <ul>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Home
                  </Link>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/front-page/features/"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Features
                  </Link>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/front-page/team"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Our Team
                  </Link>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/front-page/contact"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="ltr:xl:pl-[80px] rtl:xl:pr-[80px]">
              <h3 className="!leading-[1.2] !text-[16px] md:!text-lg !mb-[18px] !font-semibold">
                Privacy Policy
              </h3>
              <ul>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/settings/terms-conditions/"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <a
                    href="#"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <a
                    href="#"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Notice at Collection
                  </a>
                </li>
                <li className="mb-[10px] last:mb-0">
                  <Link
                    href="/settings/privacy-policy/"
                    className="lg:text-[16px] inline-block text-gray-500 dark:text-gray-400 transition-all hover:text-primary-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-[15px] md:py-[20px] mt-[60px] md:mt-[80px] lg:mt-[100px] bg-white dark:bg-[#0c1427] text-center">
          <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
            <p className="leading-[1.6]">
              © <span className="text-purple-500">Trezo</span> is Proudly Owned
              by{" "}
              <a
                href="https://envytheme.com/"
                target="_blank"
                className="text-primary-500 transition-all hover:underline"
              >
                EnvyTheme
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
