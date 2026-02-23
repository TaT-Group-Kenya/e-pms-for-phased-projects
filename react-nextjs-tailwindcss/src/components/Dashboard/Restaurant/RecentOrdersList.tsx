"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Order {
  id: string;
  code: string;
  item: {
    name: string;
    image: string;
  };
  quantity: number;
  customer: string;
  location: string;
  deliveryTime: string;
  price: string;
  status: "delivered" | "processing" | "cancelled" | "pending";
}

const RecentOrdersList: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Sample data - replace with API call in real implementation
  const allOrders: Order[] = [
    {
      id: "1",
      code: "#001",
      item: {
        name: "Fish Cutlet",
        image: "/images/restaurant/order1.jpg",
      },
      quantity: 5,
      customer: "Johnna Loren",
      location: "Washington, D.C.",
      deliveryTime: "10:05 AM",
      price: "$35.75",
      status: "delivered",
    },
    {
      id: "2",
      code: "#002",
      item: {
        name: "Pea Creamy Soup",
        image: "/images/restaurant/order2.jpg",
      },
      quantity: 1,
      customer: "Skyler White",
      location: "Los Angeles, CA",
      deliveryTime: "11:15 AM",
      price: "$24.30",
      status: "processing",
    },
    {
      id: "3",
      code: "#003",
      item: {
        name: "Macaroon 02",
        image: "/images/restaurant/order3.jpg",
      },
      quantity: 2,
      customer: "Jonathon Watson",
      location: "New York, NY",
      deliveryTime: "11:30 AM",
      price: "$21.15",
      status: "cancelled",
    },
    {
      id: "4",
      code: "#004",
      item: {
        name: "Healthy Salad Bowl",
        image: "/images/restaurant/order4.jpg",
      },
      quantity: 1,
      customer: "Walter White",
      location: "San Jose, CA",
      deliveryTime: "11:52 AM",
      price: "$12.20",
      status: "delivered",
    },
    {
      id: "5",
      code: "#005",
      item: {
        name: "Macaroon",
        image: "/images/restaurant/order5.jpg",
      },
      quantity: 1,
      customer: "David Carlen",
      location: "Redmond, WA",
      deliveryTime: "12:05 PM",
      price: "$21.50",
      status: "processing",
    },
    {
      id: "6",
      code: "#006",
      item: {
        name: "Chicken Sandwich",
        image: "/images/restaurant/order1.jpg",
      },
      quantity: 3,
      customer: "Emily Brown",
      location: "Miami, FL",
      deliveryTime: "12:30 PM",
      price: "$30.25",
      status: "processing",
    },
    {
      id: "7",
      code: "#007",
      item: {
        name: "Avocado Toast",
        image: "/images/restaurant/order2.jpg",
      },
      quantity: 2,
      customer: "Michael Clarke",
      location: "Austin, TX",
      deliveryTime: "12:45 PM",
      price: "$18.10",
      status: "delivered",
    },
    {
      id: "8",
      code: "#008",
      item: {
        name: "Veggie Delight Wrap",
        image: "/images/restaurant/order3.jpg",
      },
      quantity: 1,
      customer: "Sarah Connor",
      location: "Seattle, WA",
      deliveryTime: "01:00 PM",
      price: "$15.40",
      status: "cancelled",
    },
    {
      id: "9",
      code: "#009",
      item: {
        name: "Grilled Cheese",
        image: "/images/restaurant/order4.jpg",
      },
      quantity: 2,
      customer: "Bruce Wayne",
      location: "Gotham City",
      deliveryTime: "01:20 PM",
      price: "$22.95",
      status: "delivered",
    },
    {
      id: "10",
      code: "#010",
      item: {
        name: "Fruit Parfait",
        image: "/images/restaurant/order5.jpg",
      },
      quantity: 1,
      customer: "Diana Prince",
      location: "Themyscira",
      deliveryTime: "01:45 PM",
      price: "$10.50",
      status: "processing",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);

  // Status styling
  const getStatusStyles = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "text-success-700 border-success-300 bg-success-100";
      case "processing":
        return "text-info-700 border-info-300 bg-info-100";
      case "cancelled":
        return "text-danger-700 border-danger-300 bg-danger-100";
      case "pending":
        return "text-warning-700 border-warning-300 bg-warning-100";
      default:
        return "text-gray border-gray-300 bg-gray-100";
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Orders List</h5>
          </div>

          <div className="trezo-card-subtitle">
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
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Code
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Item
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Quantity
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Customer
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Location
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Delivery Time
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Price
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Status
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[13px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0"></th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {order.code}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-full w-[30px]">
                          <Image
                            src={order.item.image}
                            className="inline-block rounded-full"
                            alt="user-image"
                            width={30}
                            height={30}
                          />
                        </div>
                        <Link
                          href="#"
                          className="font-semibold inline-block transition-all hover:text-primary-500"
                        >
                          {order.item.name}
                        </Link>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {order.quantity}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {order.customer}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {order.location}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {order.deliveryTime}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {order.price}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span
                        className={`inline-block text-xs px-[9px] border capitalize ${getStatusStyles(
                          order.status
                        )} dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[9px]">
                        <button
                          type="button"
                          className="text-primary-500 leading-none custom-tooltip"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>
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

          <div className="pt-[13px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-xs">
              {" "}
              Showing {indexOfFirstOrder + 1}-
              {Math.min(indexOfLastOrder, allOrders.length)} of{" "}
              {allOrders.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  >
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                        currentPage === page
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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

export default RecentOrdersList;
