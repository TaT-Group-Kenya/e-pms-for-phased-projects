"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  link: string;
  image: string;
  date: string;
  price: string;
  order: number;
  stock: string | number; // "Stock Out" or a number
  amount: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Smart Band",
    link: "/ecommerce/product-details/",
    image: "/images/products/product1.jpg",
    date: "08 Jun 2024",
    price: "$35.00",
    order: 75,
    stock: 750,
    amount: "$2,625",
  },
  {
    id: 2,
    name: "Headphone",
    link: "/ecommerce/product-details/",
    image: "/images/products/product2.jpg",
    date: "07 Jun 2024",
    price: "$49.00",
    order: 25,
    stock: 825,
    amount: "$1,225",
  },
  {
    id: 3,
    name: "iPhone 15 Plus",
    link: "/ecommerce/product-details/",
    image: "/images/products/product3.jpg",
    date: "06 Jun 2024",
    price: "$99.00",
    order: 55,
    stock: "Stock Out",
    amount: "$5,445",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    link: "/ecommerce/product-details/",
    image: "/images/products/product4.jpg",
    date: "05 Jun 2024",
    price: "$59.00",
    order: 40,
    stock: 535,
    amount: "$2,360",
  },
  {
    id: 5,
    name: "Airbuds 2nd Gen",
    link: "/ecommerce/product-details/",
    image: "/images/products/product5.jpg",
    date: "04 Jun 2024",
    price: "$79.00",
    order: 56,
    stock: 460,
    amount: "$4,424",
  },
  {
    id: 6,
    name: "Smart Watch",
    link: "/ecommerce/product-details/",
    image: "/images/products/product6.jpg",
    date: "03 Jun 2024",
    price: "$199.00",
    order: 30,
    stock: 200,
    amount: "$5,970",
  },
  {
    id: 7,
    name: "iPhone 15 Plus",
    link: "/ecommerce/product-details/",
    image: "/images/products/product3.jpg",
    date: "06 Jun 2024",
    price: "$99.00",
    order: 55,
    stock: "Stock Out",
    amount: "$5,445",
  },
  {
    id: 8,
    name: "Headphone",
    link: "/ecommerce/product-details/",
    image: "/images/products/product2.jpg",
    date: "07 Jun 2024",
    price: "$49.00",
    order: 25,
    stock: 825,
    amount: "$1,225",
  },
  {
    id: 9,
    name: "Airbuds 2nd Gen",
    link: "/ecommerce/product-details/",
    image: "/images/products/product5.jpg",
    date: "04 Jun 2024",
    price: "$79.00",
    order: 56,
    stock: 460,
    amount: "$4,424",
  },
  {
    id: 10,
    name: "Bluetooth Speaker",
    link: "/ecommerce/product-details/",
    image: "/images/products/product4.jpg",
    date: "05 Jun 2024",
    price: "$59.00",
    order: 40,
    stock: 535,
    amount: "$2,360",
  },
];

const ITEMS_PER_PAGE = 5;

const TopSellingProducts: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const displayedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Selling Products</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
                    Product
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Price
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Order
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Stock
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tr-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {displayedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      <div className="flex items-center">
                        <div className="rounded-md w-[40px]">
                          <Image
                            src={product.image}
                            className="inline-block rounded-md"
                            alt={`${product.name} image`}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ltr:ml-[12px] rtl:mr-[12px]">
                          <Link
                            href={product.link}
                            className="font-medium inline-block text-[14px] md:text-[15px] transition-all hover:text-primary-500"
                          >
                            {product.name}
                          </Link>
                          <span className="block text-sm text-gray-500 dark:text-gray-400">
                            {product.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      {product.price}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]">
                      {product.order}
                    </td>

                    <td
                      className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ${
                        product.stock === "Stock Out" ? "text-danger-400" : ""
                      }`}
                    >
                      {product.stock}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                      {product.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {displayedProducts.length} of {products.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 space-x-1">
              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li className="inline-block" key={index}>
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default TopSellingProducts;
