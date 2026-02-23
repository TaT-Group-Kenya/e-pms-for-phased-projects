"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

const RecentSales: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Dynamic sales data
  const [sales] = useState([
    {
      ref: "#001",
      customer: "Johhna Loren",
      image: "/images/users/user36.jpg",
      grandTotal: 6240,
      paidStatus: "Paid",
      paymentMethod: "Paypal",
      paymentIcon: "/images/payment-method/paypal.svg",
      status: "Completed",
    },
    {
      ref: "#002",
      customer: "Skyler Queen",
      image: "/images/users/user53.jpg",
      grandTotal: 5135,
      paidStatus: "Due",
      paymentMethod: "Wise",
      paymentIcon: "/images/payment-method/wise.svg",
      status: "Pending",
    },
    {
      ref: "#003",
      customer: "Jonathon Watson",
      image: "/images/users/user55.jpg",
      grandTotal: 4321,
      paidStatus: "Paid",
      paymentMethod: "Bank",
      paymentIcon: "/images/payment-method/bank.svg",
      status: "Completed",
    },
    {
      ref: "#004",
      customer: "Walter White",
      image: "/images/users/user54.jpg",
      grandTotal: 3124,
      paidStatus: "Paid",
      paymentMethod: "Paypal",
      paymentIcon: "/images/payment-method/paypal.svg",
      status: "Completed",
    },
    {
      ref: "#005",
      customer: "David Carlen",
      image: "/images/users/user40.jpg",
      grandTotal: 2137,
      paidStatus: "Due",
      paymentMethod: "Skrill",
      paymentIcon: "/images/payment-method/skrill.svg",
      status: "Failed",
    },
    {
      ref: "#006",
      customer: "Emily Brown",
      image: "/images/users/user41.jpg",
      grandTotal: 4420,
      paidStatus: "Paid",
      paymentMethod: "Stripe",
      paymentIcon: "/images/payment-method/stripe.svg",
      status: "Completed",
    },
    {
      ref: "#007",
      customer: "Michael Clarke",
      image: "/images/users/user42.jpg",
      grandTotal: 3899,
      paidStatus: "Due",
      paymentMethod: "Wise",
      paymentIcon: "/images/payment-method/wise.svg",
      status: "Pending",
    },
    {
      ref: "#008",
      customer: "Sarah Connor",
      image: "/images/users/user44.jpg",
      grandTotal: 2745,
      paidStatus: "Paid",
      paymentMethod: "Paypal",
      paymentIcon: "/images/payment-method/paypal.svg",
      status: "Completed",
    },
    {
      ref: "#009",
      customer: "Bruce Wayne",
      image: "/images/users/user45.jpg",
      grandTotal: 10240,
      paidStatus: "Paid",
      paymentMethod: "Bank",
      paymentIcon: "/images/payment-method/bank.svg",
      status: "Completed",
    },
    {
      ref: "#010",
      customer: "Diana Prince",
      image: "/images/users/user46.jpg",
      grandTotal: 3195,
      paidStatus: "Due",
      paymentMethod: "Skrill",
      paymentIcon: "/images/payment-method/skrill.svg",
      status: "Pending",
    },
  ]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);

  // Status styling function
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-success-700 border-success-300 bg-success-100";
      case "Pending":
        return "text-purple-700 border-purple-300 bg-purple-100";
      case "Failed":
        return "text-danger-700 border-danger-300Seven-300 bg-danger-100";
      default:
        return "text-gray border-gray-300 bg-gray-100";
    }
  };

  // Paid status styling
  const getPaidStyles = (paidStatus: string) => {
    return paidStatus === "Paid" ? "text-success-600" : "text-danger-600";
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Sales</h5>
          </div>

          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-[#F5F7F8] bg-[#F5F7F8] dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
              <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                {selectedOption}
                <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
              </span>
            </MenuButton>

            <MenuItems
              transition
              className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {["Weekly", "Monthly", "Yearly"].map((option) => (
                <MenuItem
                  key={option}
                  as="div"
                  className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                    selectedOption === option ? "font-semibold" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Ref
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Customer
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Grand Total
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Paid
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Payment Method
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentSales.map((sale) => (
                  <tr key={sale.ref}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {sale.ref}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[30px]">
                          <Image
                            src={sale.image}
                            className="inline-block rounded-full"
                            alt={`${sale.customer}-image`}
                            width={30}
                            height={30}
                          />
                        </div>
                        <span className="font-semibold inline-block">
                          {sale.customer}
                        </span>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        ${sale.grandTotal.toLocaleString()}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span
                        className={`block text-xs font-semibold ${getPaidStyles(
                          sale.paidStatus
                        )}`}
                      >
                        {sale.paidStatus}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[8px] text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Image
                          src={sale.paymentIcon}
                          alt={sale.paymentMethod}
                          width={20}
                          height={20}
                        />
                        Paypal
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span
                        className={`inline-block text-xs px-[9px] border dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] ${getStatusStyles(
                          sale.status
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[13px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-xs">
              Showing {currentSales.length} of {sales.length} results
            </p>
            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] first:ml-0 last:mr-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className="inline-block mx-[2px] first:ml-0 last:mr-0"
                  >
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border transition-all ${
                        currentPage === page
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li className="inline-block mx-[2px] first:ml-0 last:mr-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_right
                  </i>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentSales;
