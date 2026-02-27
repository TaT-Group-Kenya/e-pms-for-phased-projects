"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarMenuProps {
  toggleActive: () => void;
}

const getAccordionIndexFromPathname = (pathname: string | null): number | null => {
  // Handle null or empty pathname
  if (!pathname) return null;
  
  // Map routes to accordion indices based on the path prefix
  if (pathname.startsWith("/project")) return 0;
  if (pathname.startsWith("/customer")) return 1;
  if (pathname.startsWith("/company")) return 2;
  if (pathname.startsWith("/quotation")) return 4;
  if (pathname.startsWith("/orders")) return 5;
  if (pathname.startsWith("/invoices")) return 6;
  if (pathname.startsWith("/finance")) return 7;
  if (pathname.startsWith("/users")) return 8;
  if (pathname.startsWith("/doctor")) return 9;
  if (pathname.startsWith("/settings")) return 10;
  return null;
};

const isSameEntityPage = (target: string, pathname: string | null): boolean => {
  if (!pathname) return false;
  
  // Check for exact match
  if (target === pathname) return true;
  
  // Check for /{string}/{id} pattern where id is numeric
  const match = pathname.match(/^\/[^/]+\/(\d+)$/);
  return !!match;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleActive }) => {
  const pathname = usePathname();

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  // Update openIndex when pathname changes to keep accordion open
  React.useEffect(() => {
    const accordionIndex = getAccordionIndexFromPathname(pathname);
    if (accordionIndex !== null) {
      setOpenIndex(accordionIndex);
    }
  }, [pathname]);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="sidebar-area bg-white dark:bg-[#0c1427] fixed z-[7] top-0 h-screen transition-all rounded-r-md">
        <div className="logo bg-white dark:bg-[#0c1427] border-b border-gray-100 dark:border-[#172036] px-[25px] pt-[19px] pb-[15px] absolute z-[2] right-0 top-0 left-0">
          <Link
            href="/dashboard/ecommerce/"
            className="transition-none relative flex items-center outline-none"
          >
            <Image
              src="/logo-ls.png"
              alt="logo-icon"
              width={100}
              height={26}
            />
            {/* <span className="font-bold text-black dark:text-white relative ltr:ml-[8px] rtl:mr-[8px] top-px text-xl">
              e-PMS
            </span> */}
          </Link>

          <button
            type="button"
            className="burger-menu inline-block absolute z-[3] top-[24px] ltr:right-[25px] rtl:left-[25px] transition-all hover:text-primary-500"
            onClick={toggleActive}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>

        <div className="pt-[89px] px-[22px] pb-[20px] h-screen overflow-y-scroll sidebar-custom-scrollbar">
          <div className="accordion">

            <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs [&:not(:first-child)]:mt-[22px]">
              Navigation
            </span>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 0 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(0)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  description
                </i>
                <span className="title leading-none">Projects</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 0 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/project/project-list"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/project/project-list", pathname)
                            ? "active"
                            : ""
                        }`}
                      >
                        Projects
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/project/create-project"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/project/create-project"
                            ? "active"
                            : ""
                        }`}
                      >
                        Add Project
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/project/report"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/project/report"
                            ? "active"
                            : ""
                        }`}
                      >
                        Reports
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/project/category"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/project/category"
                            ? "active"
                            : ""
                        }`}
                      >
                        Categories
                      </Link>
                    </li>
                  
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 1 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(1)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  family_group
                </i>
                <span className="title leading-none">Customers</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 1 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/customer/customer-list"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage('/customer/customer-list', pathname) ? "active" : ""
                        }`}
                      >
                        Customers
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/customer/create-customer"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/customer/create-customer"
                            ? "active"
                            : ""
                        }`}
                      >
                        Add Customer
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/customer/report"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/customer/report"
                            ? "active"
                            : ""
                        }`}
                      >
                        Reports
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 2 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(2)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  corporate_fare
                </i>
                <span className="title leading-none">Companies</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 2 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/company/company-list"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage('/company/company-list', pathname) ? "active" : ""
                        }`}
                      >
                        Companies
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/company/create-company"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/company/create-company"
                            ? "active"
                            : ""
                        }`}
                      >
                        Add Company
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/company/report"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/company/report"
                            ? "active"
                            : ""
                        }`}
                      >
                        Reports
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 4 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(4)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  request_quote
                </i>
                <span className="title leading-none">Quotations</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 4 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/quotation/quotation-list"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/quotation/quotation-list", pathname)
                            ? "active"
                            : ""
                        }`}
                      >
                        Quotations
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/quotation/create-quotation"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/quotation/create-quotation"
                            ? "active"
                            : ""
                        }`}
                      >
                        Create Quotation
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/quotation/report"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/quotation/report"
                            ? "active"
                            : ""
                        }`}
                      >
                        Reports
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 5 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(5)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  receipt_long
                </i>
                <span className="title leading-none">Orders</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 5 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/orders/order-list"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/orders/order-list", pathname) ? "active" : ""
                        }`}
                      >
                        Orders
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 6 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(6)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  content_paste
                </i>
                <span className="title leading-none">Customer Invoices</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 6 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/cust-invoices/invoice-list"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/cust-invoices/invoice-list", pathname) ? "active" : ""
                        }`}
                      >
                        Customer Invoices
                      </Link>
                    </li>
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/cust/credit-notes"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/cust/credit-notes", pathname) ? "active" : ""
                        }`}
                      >
                        Customer Credit Notes
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 7 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(7)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  domain
                </i>
                <span className="title leading-none">Company Invoices</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 7 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/company/invoices"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/company/invoices", pathname) ? "active" : ""
                        }`}
                      >
                        Company Invoices
                      </Link>
                    </li>
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/company/credit-notes"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          isSameEntityPage("/company/credit-notes", pathname) ? "active" : ""
                        }`}
                      >
                        Company Credit Notes
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 8 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(8)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  calculate
                </i>
                <span className="title leading-none">Finance</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 7 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/finance/wallet/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/finance/wallet/" ? "active" : ""
                        }`}
                      >
                        Accounts
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/finance/transactions/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/finance/transactions/" ? "active" : ""
                        }`}
                      >
                        Payments
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/finance/transactions/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/finance/transactions/" ? "active" : ""
                        }`}
                      >
                        Transaction Log
                      </Link>
                    </li>

                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 8 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(8)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  person
                </i>
                <span className="title leading-none">Users</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 8 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/users/users-list/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/users/users-list" ? "active" : ""
                        }`}
                      >
                        Users Management
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>


            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 9 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(9)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  dashboard_customize
                </i>
                <span className="title leading-none">System Setup</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 9 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/departments"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/departments" ? "active" : ""
                        }`}
                      >
                        Departments
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/configurations"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/configurations" ? "active" : ""
                        }`}
                      >
                        Configurations
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/account-types"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/account-types" ? "active" : ""
                        }`}
                      >
                        Account Types
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/account-groups"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/account-groups"
                            ? "active"
                            : ""
                        }`}
                      >
                        Account Groups
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/currencies"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/currencies" ? "active" : ""
                        }`}
                      >
                        Currencies
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/countries"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/countries" ? "active" : ""
                        }`}
                      >
                        Countries
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/taxes"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/taxes"
                            ? "active"
                            : ""
                        }`}
                      >
                        Taxes
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/setup/languages"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/setup/languages"
                            ? "active"
                            : ""
                        }`}
                      >
                        Languages
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs [&:not(:first-child)]:mt-[22px]">
              Others
            </span>


            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <button
                className={`accordion-button toggle flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  openIndex === 9 ? "open" : ""
                }`}
                type="button"
                onClick={() => toggleAccordion(9)}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  settings
                </i>
                <span className="title leading-none">Settings</span>
              </button>

              <div
                className={`accordion-collapse ${
                  openIndex === 9 ? "open" : "hidden"
                }`}
              >
                <div className="pt-[4px]">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/settings/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/settings/" ? "active" : ""
                        }`}
                      >
                        Account Settings
                      </Link>
                    </li>

                    <li className="sidemenu-item mb-[4px] last:mb-0">
                      <Link
                        href="/settings/change-password/"
                        className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium text-gray-500 dark:text-gray-400 py-[9px] ltr:pl-[38px] ltr:pr-[30px] rtl:pr-[38px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
                          pathname === "/settings/change-password/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Change Password
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item rounded-md text-black dark:text-white mb-[5px] whitespace-nowrap">
              <Link
                href="/"
                className={`accordion-button flex items-center transition-all py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] rounded-md font-medium w-full relative hover:bg-gray-50 text-left dark:hover:bg-[#15203c] ${
                  pathname === "/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined transition-all text-gray-500 dark:text-gray-400 ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
                  logout
                </i>
                <span className="title leading-none">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
