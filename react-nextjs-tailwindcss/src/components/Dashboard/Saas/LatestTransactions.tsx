"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Define the type for the table data
interface Transaction {
  id: string;
  client: {
    name: string;
    email: string;
    image: string;
  };
  amount: string;
  plan: string;
  paymentMethod: {
    icon: string;
    name: string;
  };
  status: string;
}

const LatestTransactions: React.FC = () => {
  // State for selected option
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  // State for table data
  const [tableData, setTableData] = useState<Transaction[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Mock data (replace this with an API call or dynamic data source)
  useEffect(() => {
    const mockData: Transaction[] = [
      {
        id: "#001",
        client: {
          name: "Johhna Loren",
          email: "loren123@gmail.com",
          image: "/images/users/user58.jpg",
        },
        amount: "$6240",
        plan: "Pro",
        paymentMethod: {
          icon: "/images/payment-method/paypal.svg",
          name: "Paypal",
        },
        status: "Completed",
      },
      {
        id: "#002",
        client: {
          name: "Skyler White",
          email: "skyqueen@gmail.com",
          image: "/images/users/user53.jpg",
        },
        amount: "$5135",
        plan: "Enterprise",
        paymentMethod: {
          icon: "/images/payment-method/wise.svg",
          name: "Wise",
        },
        status: "Pending",
      },
      {
        id: "#003",
        client: {
          name: "Jonathon Watson",
          email: "jona2134@gmail.com",
          image: "/images/users/user55.jpg",
        },
        amount: "$4321",
        plan: "Startup",
        paymentMethod: {
          icon: "/images/payment-method/bank.svg",
          name: "Bank",
        },
        status: "Failed",
      },
      {
        id: "#004",
        client: {
          name: "Walter White",
          email: "walterwhite@gmail.com",
          image: "/images/users/user54.jpg",
        },
        amount: "$3124",
        plan: "Pro",
        paymentMethod: {
          icon: "/images/payment-method/skrill.svg",
          name: "Skrill",
        },
        status: "Completed",
      },
      {
        id: "#005",
        client: {
          name: "David Carlen",
          email: "davidcarlen@gmail.com",
          image: "/images/users/user40.jpg",
        },
        amount: "$2137",
        plan: "Basic",
        paymentMethod: {
          icon: "/images/payment-method/paypal.svg",
          name: "Paypal",
        },
        status: "Pending",
      },
      {
        id: "#006",
        client: {
          name: "Walter White",
          email: "walterwhite@gmail.com",
          image: "/images/users/user54.jpg",
        },
        amount: "$3124",
        plan: "Pro",
        paymentMethod: {
          icon: "/images/payment-method/skrill.svg",
          name: "Skrill",
        },
        status: "Completed",
      },
      {
        id: "#007",
        client: {
          name: "David Carlen",
          email: "davidcarlen@gmail.com",
          image: "/images/users/user40.jpg",
        },
        amount: "$2137",
        plan: "Basic",
        paymentMethod: {
          icon: "/images/payment-method/paypal.svg",
          name: "Paypal",
        },
        status: "Pending",
      },
      {
        id: "#008",
        client: {
          name: "Skyler White",
          email: "skyqueen@gmail.com",
          image: "/images/users/user53.jpg",
        },
        amount: "$5135",
        plan: "Enterprise",
        paymentMethod: {
          icon: "/images/payment-method/wise.svg",
          name: "Wise",
        },
        status: "Pending",
      },
      {
        id: "#009",
        client: {
          name: "Johhna Loren",
          email: "loren123@gmail.com",
          image: "/images/users/user58.jpg",
        },
        amount: "$6240",
        plan: "Pro",
        paymentMethod: {
          icon: "/images/payment-method/paypal.svg",
          name: "Paypal",
        },
        status: "Completed",
      },
      {
        id: "#010",
        client: {
          name: "Jonathon Watson",
          email: "jona2134@gmail.com",
          image: "/images/users/user55.jpg",
        },
        amount: "$4321",
        plan: "Startup",
        paymentMethod: {
          icon: "/images/payment-method/bank.svg",
          name: "Bank",
        },
        status: "Failed",
      },
    ];
    setTableData(mockData);
  }, []);

  // Handle option selection
  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Pagination logic
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Latest Transactions</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 bg-gray-100 dark:bg-[#0a0e19] py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
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
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    ID
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Client
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Amount
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Subscription Plan
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Payment Method
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[10px] px-[20px] text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentData.map((row) => (
                  <tr key={row.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {row.id}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[40px]">
                          <Image
                            src={row.client.image}
                            className="inline-block rounded-full"
                            alt="user-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <span className="font-semibold inline-block mb-px">
                            {row.client.name}
                          </span>
                          <span className="block text-gray-500 dark:text-gray-400 text-xs">
                            {row.client.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {row.amount}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {row.plan}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[8px] text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Image
                          src={row.paymentMethod.icon}
                          alt={row.paymentMethod.name}
                          width={24}
                          height={24}
                        />
                        {row.paymentMethod.name}
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[9px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span
                        className={`inline-block font-medium text-xs px-[9px] dark:bg-[#15203c] dark:border-[#172036] ${
                          row.status === "Completed"
                            ? "text-success-700 border-success-300 bg-success-100"
                            : row.status === "Pending"
                            ? "text-primary-700 border-primary-300 bg-primary-100"
                            : "text-orange-700 border-orange-300 bg-orange-100"
                        } border rounded-[100px]`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[10px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, tableData.length)}{" "}
              of {tableData.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default LatestTransactions;
