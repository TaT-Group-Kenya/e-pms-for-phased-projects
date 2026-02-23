"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastLogin: string;
  totalSpend: string;
  totalOrders: number;
  status: "Active" | "Deactive";
  image: string;
  viewLink: string;
}

const customersData: Customer[] = [
  {
    id: "#JAN-854",
    name: "Oliver Khan",
    email: "oliver@trezo.com",
    phone: "+1 555-123-4567",
    lastLogin: "10 Oct 2024",
    totalSpend: "$6,855.00",
    totalOrders: 125,
    status: "Active",
    image: "/images/users/user6.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-853",
    name: "Carolyn Barnes",
    email: "carolyn@trezo.com",
    phone: "+1 555-987-6543",
    lastLogin: "11 Sep 2024",
    totalSpend: "$2,800.00",
    totalOrders: 99,
    status: "Deactive",
    image: "/images/users/user7.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-852",
    name: "Sophia Green",
    email: "sophia@trezo.com",
    phone: "+1 555-222-3456",
    lastLogin: "5 Jan 2025",
    totalSpend: "$1,250.00",
    totalOrders: 45,
    status: "Active",
    image: "/images/users/user8.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-851",
    name: "Liam Johnson",
    email: "liam@trezo.com",
    phone: "+1 555-111-7890",
    lastLogin: "12 Dec 2024",
    totalSpend: "$4,300.00",
    totalOrders: 60,
    status: "Active",
    image: "/images/users/user9.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-850",
    name: "Emma Wilson",
    email: "emma@trezo.com",
    phone: "+1 555-333-5678",
    lastLogin: "20 Nov 2024",
    totalSpend: "$3,100.00",
    totalOrders: 82,
    status: "Deactive",
    image: "/images/users/user10.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-849",
    name: "Aiden Taylor",
    email: "aiden@trezo.com",
    phone: "+1 555-444-2345",
    lastLogin: "15 Dec 2024",
    totalSpend: "$2,450.00",
    totalOrders: 70,
    status: "Active",
    image: "/images/users/user11.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-848",
    name: "Mia Martinez",
    email: "mia@trezo.com",
    phone: "+1 555-555-3456",
    lastLogin: "18 Dec 2024",
    totalSpend: "$5,500.00",
    totalOrders: 105,
    status: "Active",
    image: "/images/users/user12.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-847",
    name: "Ethan Harris",
    email: "ethan@trezo.com",
    phone: "+1 555-666-7890",
    lastLogin: "25 Jan 2025",
    totalSpend: "$7,200.00",
    totalOrders: 130,
    status: "Active",
    image: "/images/users/user13.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-846",
    name: "Isabella Lee",
    email: "isabella@trezo.com",
    phone: "+1 555-777-2345",
    lastLogin: "9 Jan 2025",
    totalSpend: "$9,100.00",
    totalOrders: 160,
    status: "Deactive",
    image: "/images/users/user14.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-845",
    name: "Jackson Walker",
    email: "jackson@trezo.com",
    phone: "+1 555-888-4567",
    lastLogin: "12 Jan 2025",
    totalSpend: "$3,000.00",
    totalOrders: 50,
    status: "Active",
    image: "/images/users/user15.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-844",
    name: "Lily King",
    email: "lily@trezo.com",
    phone: "+1 555-999-5678",
    lastLogin: "7 Nov 2024",
    totalSpend: "$6,750.00",
    totalOrders: 120,
    status: "Active",
    image: "/images/users/user16.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-843",
    name: "Lucas Scott",
    email: "lucas@trezo.com",
    phone: "+1 555-123-6789",
    lastLogin: "1 Dec 2024",
    totalSpend: "$4,800.00",
    totalOrders: 85,
    status: "Active",
    image: "/images/users/user17.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-842",
    name: "Charlotte Perez",
    email: "charlotte@trezo.com",
    phone: "+1 555-234-7890",
    lastLogin: "22 Dec 2024",
    totalSpend: "$1,200.00",
    totalOrders: 40,
    status: "Deactive",
    image: "/images/users/user18.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-841",
    name: "James Wright",
    email: "james@trezo.com",
    phone: "+1 555-345-8901",
    lastLogin: "10 Jan 2025",
    totalSpend: "$2,900.00",
    totalOrders: 65,
    status: "Active",
    image: "/images/users/user19.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-840",
    name: "Harper Harris",
    email: "harper@trezo.com",
    phone: "+1 555-456-9012",
    lastLogin: "17 Jan 2025",
    totalSpend: "$1,800.00",
    totalOrders: 55,
    status: "Active",
    image: "/images/users/user20.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-839",
    name: "Sebastian Clark",
    email: "sebastian@trezo.com",
    phone: "+1 555-567-0123",
    lastLogin: "16 Jan 2025",
    totalSpend: "$3,600.00",
    totalOrders: 77,
    status: "Deactive",
    image: "/images/users/user21.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-838",
    name: "Chloe Turner",
    email: "chloe@trezo.com",
    phone: "+1 555-678-1234",
    lastLogin: "2 Jan 2025",
    totalSpend: "$4,100.00",
    totalOrders: 90,
    status: "Active",
    image: "/images/users/user22.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-837",
    name: "Mason Robinson",
    email: "mason@trezo.com",
    phone: "+1 555-789-2345",
    lastLogin: "21 Dec 2024",
    totalSpend: "$5,700.00",
    totalOrders: 110,
    status: "Active",
    image: "/images/users/user23.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-836",
    name: "Amelia Evans",
    email: "amelia@trezo.com",
    phone: "+1 555-890-3456",
    lastLogin: "29 Dec 2024",
    totalSpend: "$8,900.00",
    totalOrders: 140,
    status: "Active",
    image: "/images/users/user24.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
  {
    id: "#JAN-835",
    name: "Benjamin Allen",
    email: "benjamin@trezo.com",
    phone: "+1 555-901-4567",
    lastLogin: "19 Jan 2025",
    totalSpend: "$3,300.00",
    totalOrders: 75,
    status: "Deactive",
    image: "/images/users/user25.jpg",
    viewLink: "/ecommerce/customer-details/",
  },
];

const CustomersTable: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Month");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState(customersData);
  const itemsPerPage = 10;

  // Handle search
  const filteredCustomers = customers.filter((customer) =>
    customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle delete
  const handleDelete = (id: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== id)
    );
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
                placeholder="Search customer here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Last Day", "Last Week", "Last Month", "Last Year"].map(
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
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Customer
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Email
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Phone
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Last Login
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Total Spend
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Total Orders
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="w-[40px] rounded-full">
                          <Image
                            src={customer.image}
                            className="inline-block rounded-full"
                            alt="product-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {customer.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.email}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.phone}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.lastLogin}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.totalSpend}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span className="text-gray-500 dark:text-gray-400">
                        {customer.totalOrders}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          customer.status === "Active"
                            ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                            : "bg-orange-100 dark:bg-[#15203c] text-orange-600"
                        } rounded-sm font-medium text-xs`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center gap-[9px]">
                        <Link
                          href={customer.viewLink}
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
                            edit
                          </i>
                        </button>

                        <button
                          type="button"
                          className="text-danger-500 leading-none custom-tooltip"
                          onClick={() => handleDelete(customer.id)}
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

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {paginatedCustomers.length} of {filteredCustomers.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
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

export default CustomersTable;
