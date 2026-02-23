"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Define the Order type
type Order = {
  orderId: string;
  customer: string;
  customerImage: string;
  items: number;
  created: string;
  total: string;
  vendor: string;
  status: string;
  viewLink: string;
};

const OrdersTable: React.FC = () => {
  // Initialize state for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: "#JAN-2345",
      customer: "Sarah Johnson",
      customerImage: "/images/users/user1.jpg",
      items: 120,
      created: "12 Jun 2024",
      total: "$10,490",
      vendor: "Dennis Matthews",
      status: "Shipped",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-1323",
      customer: "Michael Smith",
      customerImage: "/images/users/user2.jpg",
      items: 62,
      created: "11 Jun 2024",
      total: "$6,575",
      vendor: "Kathryn Turner",
      status: "Confirmed",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#DEC-1234",
      customer: "Emily Brown",
      customerImage: "/images/users/user3.jpg",
      items: 49,
      created: "10 Jun 2024",
      total: "$12,870",
      vendor: "John Valdez",
      status: "Pending",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#DEC-1098",
      customer: "Ashley Davis",
      customerImage: "/images/users/user5.jpg",
      items: 82,
      created: "08 Jun 2024",
      total: "$4,680",
      vendor: "Susan Rader",
      status: "Rejected",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2346",
      customer: "John Doe",
      customerImage: "/images/users/user4.jpg",
      items: 25,
      created: "07 Jun 2024",
      total: "$3,250",
      vendor: "George Williams",
      status: "Shipped",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2347",
      customer: "Jessica Adams",
      customerImage: "/images/users/user6.jpg",
      items: 75,
      created: "06 Jun 2024",
      total: "$5,300",
      vendor: "Daniel Cook",
      status: "Confirmed",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2348",
      customer: "Olivia Martin",
      customerImage: "/images/users/user7.jpg",
      items: 90,
      created: "05 Jun 2024",
      total: "$8,240",
      vendor: "Michael White",
      status: "Pending",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2349",
      customer: "Ethan Lee",
      customerImage: "/images/users/user8.jpg",
      items: 150,
      created: "04 Jun 2024",
      total: "$15,500",
      vendor: "Paul Green",
      status: "Shipped",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2350",
      customer: "Sophia Turner",
      customerImage: "/images/users/user9.jpg",
      items: 60,
      created: "03 Jun 2024",
      total: "$6,000",
      vendor: "Alice Harris",
      status: "Confirmed",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2351",
      customer: "Liam Jackson",
      customerImage: "/images/users/user10.jpg",
      items: 80,
      created: "02 Jun 2024",
      total: "$7,120",
      vendor: "Robert Clark",
      status: "Pending",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2352",
      customer: "Ava Walker",
      customerImage: "/images/users/user11.jpg",
      items: 110,
      created: "01 Jun 2024",
      total: "$9,800",
      vendor: "Steven Lewis",
      status: "Shipped",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2353",
      customer: "Isabella Hall",
      customerImage: "/images/users/user12.jpg",
      items: 35,
      created: "31 May 2024",
      total: "$2,850",
      vendor: "William Nelson",
      status: "Confirmed",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2354",
      customer: "Lucas Young",
      customerImage: "/images/users/user13.jpg",
      items: 140,
      created: "30 May 2024",
      total: "$12,300",
      vendor: "David King",
      status: "Pending",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2355",
      customer: "Mason Scott",
      customerImage: "/images/users/user14.jpg",
      items: 200,
      created: "29 May 2024",
      total: "$19,500",
      vendor: "Thomas Adams",
      status: "Shipped",
      viewLink: "/ecommerce/order-details/",
    },
    {
      orderId: "#JAN-2356",
      customer: "Charlotte Perez",
      customerImage: "/images/users/user15.jpg",
      items: 160,
      created: "28 May 2024",
      total: "$14,800",
      vendor: "Mary Moore",
      status: "Confirmed",
      viewLink: "/ecommerce/order-details/",
    },
  ]);

  // State for search query and filtered orders
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Number of orders per page

  // Filter orders based on search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = orders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.vendor.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page when search is changed
  };

  // Handle pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get orders for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (orderId: string) => {
    const updatedOrders = orders.filter((order) => order.orderId !== orderId);
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders); // Update filtered orders as well if the search filter is active
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
                placeholder="Search order here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/ecommerce/create-order/"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Order
              </span>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Order ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Customer
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Items
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Created
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Total
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                    Vendor
                  </th>
                  <th className="font-medium text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tr-md">
                    Status
                  </th>
                  <th className="font-medium text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tr-md">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.orderId}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="rounded-md w-[40px]">
                          <Image
                            src={order.customerImage}
                            className="inline-block rounded-md"
                            alt="product-image"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <span className="block font-medium">
                            {order.customer}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.items}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.created}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.total}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {order.vendor}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                          order.status === "Shipped"
                            ? "bg-success-100 text-success-600"
                            : order.status === "Confirmed"
                            ? "bg-primary-50 text-primary-500"
                            : order.status === "Pending"
                            ? "bg-warning-50 text-warning-500"
                            : "bg-danger-100 text-danger-500"
                        } rounded-sm font-medium text-xs`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center gap-[9px]">
                        <Link
                          href={order.viewLink}
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
                          onClick={() => handleDelete(order.orderId)}
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
              Showing {startIndex + 1} to {startIndex + currentOrders.length} of{" "}
              {filteredOrders.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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

export default OrdersTable;
