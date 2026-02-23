"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  viewLink: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Apple MacBook Pro 16.2" with M3 Pro Chip',
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product6.jpg",
    price: 3479,
    oldPrice: 3599,
    rating: 5,
  },
  {
    id: 2,
    name: "SAMSUNG Galaxy Tab A9+ Tablet 11”",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product7.jpg",
    price: 549,
    oldPrice: 649,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Apple iPhone 15 Pro Max (512 GB)",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product8.jpg",
    price: 1479,
    oldPrice: 1599,
    rating: 4,
  },
  {
    id: 4,
    name: "Gildan Men's Crew T-Shirts, Multipack",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product9.jpg",
    price: 79,
    oldPrice: 89,
    rating: 3.5,
  },
  {
    id: 5,
    name: "Skechers Men's Summits High Range",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product10.jpg",
    price: 849,
    oldPrice: 999,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Amazfit GTR 3 Smart Watch for Men",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product11.jpg",
    price: 49,
    oldPrice: 69,
    rating: 3,
  },
  {
    id: 7,
    name: "SOJOS Small Round Polarized Sunglasses",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product12.jpg",
    price: 39,
    oldPrice: 49,
    rating: 4.5,
  },
  {
    id: 8,
    name: "Nautical Clock Ship Table Clock Brass Desk",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product13.jpg",
    price: 25,
    oldPrice: 39,
    rating: 5,
  },
  {
    id: 9,
    name: "Carhartt, Durable, Adjustable Crossbody Bag",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product14.jpg",
    price: 149,
    oldPrice: 299,
    rating: 4,
  },
];

const ProductsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get paginated products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-medium">Filter</h5>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0 sm:flex items-center gap-[20px]">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>

            <div className="trezo-card-dropdown relative mt-[15px] sm:mt-0">
              <button
                type="button"
                className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]"
                id="dropdownToggleBtn"
              >
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  Default Sorting
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </button>

              <ul className="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none">
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Default Sorting
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Price Low to High
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Price High to Low
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Top Sales
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black"
                  >
                    Newest Arrivals
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="md:mb-[10px] lg:mb-[17px]">
            <div className="relative">
              <span className="block ltr:right-0 rtl:left-0 bottom-0 w-[65px] h-[65px] absolute ltr:rounded-tl-md rtl:rounded-tr-md bg-white dark:bg-[#0c1427]"></span>

              <Link href={product.viewLink} className="block rounded-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={700}
                  height={700}
                  className="rounded-md"
                />
              </Link>

              <button
                className="rounded-md transition-all z-[1] inline-block absolute ltr:right-0 rtl:left-0 bottom-0 w-[60px] h-[60px] leading-[72px] bg-primary-500 text-white hover:bg-primary-400"
                type="button"
              >
                <i className="material-symbols-outlined">shopping_cart</i>
              </button>
            </div>

            <div className="mt-[19px]">
              <h6 className="!text-md !font-normal">
                <Link
                  href={product.viewLink}
                  className="transition-all hover:text-primary-500"
                >
                  {product.name}
                </Link>
              </h6>

              <div className="flex items-center justify-between mt-[12px] md:mt-[20px] lg:mt-[28px]">
                <div className="flex items-center">
                  <span className="block font-bold text-black dark:text-white text-[20px]">
                    ${product.price}
                  </span>

                  <span className="block text-md text-gray-400 ltr:ml-[7px] rtl:mr-[7px] line-through">
                    ${product.oldPrice}
                  </span>
                </div>

                <div className="leading-none text-orange-400 flex items-center gap-[2px]">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`ri-star${
                        product.rating >= index + 1
                          ? "-fill"
                          : product.rating > index
                          ? "-half-fill"
                          : "-line"
                      }`}
                    ></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              {" "}
              Showing{" "}
              {Math.min(
                (currentPage - 1) * productsPerPage + 1,
                filteredProducts.length
              )}
              -
              {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
              of {filteredProducts.length} results
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
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white"
                        : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
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

export default ProductsGrid;
