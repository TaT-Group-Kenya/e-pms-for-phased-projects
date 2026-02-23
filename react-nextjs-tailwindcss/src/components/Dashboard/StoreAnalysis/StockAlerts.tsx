"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const StockAlerts: React.FC = () => {
  // Dynamic stock data
  const [stocks] = useState([
    {
      code: "#3421",
      product: "ZenX Laptop",
      image: "/images/stock-alerts/stock1.jpg",
      store: "Store 01",
      quantity: 5,
      alertQuantity: 10,
    },
    {
      code: "#3429",
      product: "Mackbook Pro",
      image: "/images/stock-alerts/stock2.jpg",
      store: "Store 02",
      quantity: 3,
      alertQuantity: 15,
    },
    {
      code: "#3425",
      product: "Smart Pencil",
      image: "/images/stock-alerts/stock3.jpg",
      store: "Store 01",
      quantity: 2,
      alertQuantity: 7,
    },
    {
      code: "#3424",
      product: "Banner Mockup",
      image: "/images/stock-alerts/stock4.jpg",
      store: "Store 02",
      quantity: 4,
      alertQuantity: 12,
    },
    {
      code: "#3422",
      product: "Clay Camera",
      image: "/images/stock-alerts/stock5.jpg",
      store: "Store 01",
      quantity: 3,
      alertQuantity: 10,
    },
    {
      code: "#3430",
      product: "Noise Headphones",
      image: "/images/stock-alerts/stock6.jpg",
      store: "Store 03",
      quantity: 1,
      alertQuantity: 5,
    },
    {
      code: "#3431",
      product: "Wireless Mouse",
      image: "/images/stock-alerts/stock1.jpg",
      store: "Store 02",
      quantity: 6,
      alertQuantity: 10,
    },
    {
      code: "#3432",
      product: "4K Monitor",
      image: "/images/stock-alerts/stock2.jpg",
      store: "Store 01",
      quantity: 7,
      alertQuantity: 14,
    },
    {
      code: "#3433",
      product: "Ergonomic Chair",
      image: "/images/stock-alerts/stock3.jpg",
      store: "Store 03",
      quantity: 2,
      alertQuantity: 8,
    },
    {
      code: "#3434",
      product: "Portable SSD",
      image: "/images/stock-alerts/stock4.jpg",
      store: "Store 02",
      quantity: 3,
      alertQuantity: 9,
    },
  ]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(stocks.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstItem, indexOfLastItem);

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
            <h5 className="!mb-0">Stock Alerts</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Code
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Product
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Store
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Quantity
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Alert Quantity
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0"></th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentStocks.map((stock) => (
                  <tr key={stock.code}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {stock.code}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <div className="flex items-center gap-[10px]">
                        <div className="rounded-md w-[29px]">
                          <Image
                            src={stock.image}
                            alt={`${stock.product}-image`}
                            className="rounded-md"
                            width={29}
                            height={29}
                          />
                        </div>
                        <Link
                          href="/ecommerce/product-details/"
                          className="font-semibold inline-block text-black dark:text-white transition-all hover:text-primary-500"
                        >
                          {stock.product}
                        </Link>
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {stock.store}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {stock.quantity}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                      <span className="inline-block text-xs px-[9px] text-danger-700 border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
                        {stock.alertQuantity}
                      </span>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
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

          <div className="pt-[11px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-xs">
              Showing {currentStocks.length} of {stocks.length} results
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

export default StockAlerts;
