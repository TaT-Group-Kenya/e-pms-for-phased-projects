"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

// Dynamic invoices data
const invoices = [
  {
    id: "#JAN-158",
    customer: "Marcia Baker",
    email: "marcia@trezo.com",
    date: "10 Nov 2024",
    total: "$5,000",
    quantity: 6,
    walletBalance: "$2,000",
    imageUrl: "/images/users/user6.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-325",
    customer: "Carolyn Barnes",
    email: "barnes@trezo.com",
    date: "11 Nov 2024",
    total: "$8,750",
    quantity: 10,
    walletBalance: "$4,500",
    imageUrl: "/images/users/user7.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-286",
    customer: "Donna Miller",
    email: "donna@trezo.com",
    date: "12 Nov 2024",
    total: "$3,200",
    quantity: 6,
    walletBalance: "$1,550",
    imageUrl: "/images/users/user8.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-001",
    customer: "John Doe",
    email: "john@doe.com",
    date: "15 Nov 2024",
    total: "$1,200",
    quantity: 2,
    walletBalance: "$600",
    imageUrl: "/images/users/user1.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-002",
    customer: "Alice Smith",
    email: "alice@smith.com",
    date: "16 Nov 2024",
    total: "$2,500",
    quantity: 3,
    walletBalance: "$1,200",
    imageUrl: "/images/users/user2.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-003",
    customer: "Bob Johnson",
    email: "bob@johnson.com",
    date: "17 Nov 2024",
    total: "$6,700",
    quantity: 8,
    walletBalance: "$3,400",
    imageUrl: "/images/users/user3.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-004",
    customer: "Charlie Brown",
    email: "charlie@brown.com",
    date: "18 Nov 2024",
    total: "$4,300",
    quantity: 5,
    walletBalance: "$2,150",
    imageUrl: "/images/users/user4.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-005",
    customer: "David Wilson",
    email: "david@wilson.com",
    date: "19 Nov 2024",
    total: "$2,800",
    quantity: 4,
    walletBalance: "$1,400",
    imageUrl: "/images/users/user5.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-006",
    customer: "Emma Harris",
    email: "emma@harris.com",
    date: "20 Nov 2024",
    total: "$7,100",
    quantity: 9,
    walletBalance: "$3,550",
    imageUrl: "/images/users/user6.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-007",
    customer: "Frank Clark",
    email: "frank@clark.com",
    date: "21 Nov 2024",
    total: "$3,400",
    quantity: 7,
    walletBalance: "$1,700",
    imageUrl: "/images/users/user7.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-008",
    customer: "Grace Martinez",
    email: "grace@martinez.com",
    date: "22 Nov 2024",
    total: "$9,000",
    quantity: 10,
    walletBalance: "$4,500",
    imageUrl: "/images/users/user8.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-009",
    customer: "Henry Garcia",
    email: "henry@garcia.com",
    date: "23 Nov 2024",
    total: "$5,500",
    quantity: 6,
    walletBalance: "$2,750",
    imageUrl: "/images/users/user1.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-010",
    customer: "Isabella Lee",
    email: "isabella@lee.com",
    date: "24 Nov 2024",
    total: "$8,300",
    quantity: 8,
    walletBalance: "$4,150",
    imageUrl: "/images/users/user2.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-011",
    customer: "James Taylor",
    email: "james@taylor.com",
    date: "25 Nov 2024",
    total: "$3,900",
    quantity: 5,
    walletBalance: "$1,950",
    imageUrl: "/images/users/user3.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-012",
    customer: "Katherine Scott",
    email: "katherine@scott.com",
    date: "26 Nov 2024",
    total: "$2,000",
    quantity: 4,
    walletBalance: "$1,000",
    imageUrl: "/images/users/user4.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-013",
    customer: "Louis Jackson",
    email: "louis@jackson.com",
    date: "27 Nov 2024",
    total: "$4,500",
    quantity: 6,
    walletBalance: "$2,250",
    imageUrl: "/images/users/user5.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-014",
    customer: "Monica King",
    email: "monica@king.com",
    date: "28 Nov 2024",
    total: "$6,000",
    quantity: 7,
    walletBalance: "$3,000",
    imageUrl: "/images/users/user6.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-015",
    customer: "Nathan Adams",
    email: "nathan@adams.com",
    date: "29 Nov 2024",
    total: "$7,500",
    quantity: 8,
    walletBalance: "$3,750",
    imageUrl: "/images/users/user7.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-016",
    customer: "Olivia Mitchell",
    email: "olivia@mitchell.com",
    date: "30 Nov 2024",
    total: "$5,100",
    quantity: 6,
    walletBalance: "$2,550",
    imageUrl: "/images/users/user8.jpg",
    viewLink: "/invoices/invoice-details/",
  },
  {
    id: "#JAN-017",
    customer: "Peter Robinson",
    email: "peter@robinson.com",
    date: "1 Dec 2024",
    total: "$2,700",
    quantity: 4,
    walletBalance: "$1,350",
    imageUrl: "/images/users/user1.jpg",
    viewLink: "/invoices/invoice-details/",
  },
];

const InvoicesTable: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Search
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of invoices per page

  // Filter invoices based on the search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination based on filtered invoices
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search invoice here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="rezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
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
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Invoice ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Customer
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Issued Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Total
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Quantity
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Wallet Balance
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedInvoices.map((invoice, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {invoice.id}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={invoice.imageUrl}
                            alt={invoice.customer}
                            className="inline-block rounded-full"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {invoice.customer}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {invoice.email}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {invoice.date}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {invoice.total}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {invoice.quantity}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {invoice.walletBalance}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center gap-[9px]">
                        <Link
                          href={invoice.viewLink}
                          className="text-primary-500 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </Link>
                        <button
                          type="button"
                          className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            print
                          </i>
                        </button>
                        <button
                          type="button"
                          className="text-danger-500 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            delete
                          </i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, invoices.length)}{" "}
              of {invoices.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 flex">
              <li className="inline-block mx-[2px]">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, pageIndex) => (
                <li key={pageIndex} className="inline-block mx-[2px]">
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === pageIndex + 1
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036]"
                    } transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500`}
                    onClick={() => handlePageChange(pageIndex + 1)}
                  >
                    {pageIndex + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px]">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
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

export default InvoicesTable;
