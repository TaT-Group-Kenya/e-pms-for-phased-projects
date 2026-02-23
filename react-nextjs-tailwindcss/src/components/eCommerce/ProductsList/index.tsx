"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  date: string;
  category: string;
  viewLink: string;
  image: string;
  price: number;
  stock: number;
  orders: number;
  amount: number;
  rating: number;
  reviews: number;
  status: "Published" | "Draft";
}

const initialProducts: Product[] = [
  {
    id: "#JAN-950",
    name: "Smart Band",
    date: "08 Jun 2024",
    category: "Watch",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product1.jpg",
    price: 35.0,
    stock: 750,
    orders: 75,
    amount: 2625,
    rating: 5,
    reviews: 141,
    status: "Published",
  },
  {
    id: "#JAN-951",
    name: "Headphone",
    date: "09 Jun 2024",
    category: "Electronics",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product2.jpg",
    price: 49.0,
    stock: 825,
    orders: 25,
    amount: 1225,
    rating: 5,
    reviews: 69,
    status: "Draft",
  },
  {
    id: "#JAN-952",
    name: "iPhone 15 Plus",
    date: "10 Jun 2024",
    category: "Apple",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product3.jpg",
    price: 99.0,
    stock: 0,
    orders: 55,
    amount: 5445,
    rating: 5,
    reviews: 99,
    status: "Published",
  },
  {
    id: "#JAN-953",
    name: "Laptop Sleeve",
    date: "11 Jun 2024",
    category: "Accessories",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product4.jpg",
    price: 15.0,
    stock: 1200,
    orders: 220,
    amount: 3300,
    rating: 4,
    reviews: 200,
    status: "Published",
  },
  {
    id: "#JAN-954",
    name: "Wireless Mouse",
    date: "12 Jun 2024",
    category: "Accessories",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product5.jpg",
    price: 25.0,
    stock: 980,
    orders: 150,
    amount: 3750,
    rating: 4.5,
    reviews: 150,
    status: "Published",
  },
  {
    id: "#JAN-955",
    name: "Gaming Keyboard",
    date: "13 Jun 2024",
    category: "Electronics",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product6.jpg",
    price: 75.0,
    stock: 450,
    orders: 200,
    amount: 15000,
    rating: 4.8,
    reviews: 180,
    status: "Published",
  },
  {
    id: "#JAN-956",
    name: "Smartphone Stand",
    date: "14 Jun 2024",
    category: "Accessories",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product7.jpg",
    price: 12.0,
    stock: 600,
    orders: 85,
    amount: 1020,
    rating: 4.2,
    reviews: 67,
    status: "Published",
  },
  {
    id: "#JAN-957",
    name: "Portable Speaker",
    date: "15 Jun 2024",
    category: "Electronics",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product8.jpg",
    price: 55.0,
    stock: 200,
    orders: 300,
    amount: 16500,
    rating: 4.9,
    reviews: 220,
    status: "Published",
  },
  {
    id: "#JAN-958",
    name: "AirPods Pro",
    date: "16 Jun 2024",
    category: "Apple",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product9.jpg",
    price: 199.0,
    stock: 0,
    orders: 120,
    amount: 23880,
    rating: 5,
    reviews: 320,
    status: "Published",
  },
  {
    id: "#JAN-959",
    name: "Smart TV 4K",
    date: "17 Jun 2024",
    category: "Electronics",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product10.jpg",
    price: 499.0,
    stock: 50,
    orders: 30,
    amount: 14970,
    rating: 4.7,
    reviews: 210,
    status: "Draft",
  },
  {
    id: "#JAN-960",
    name: "Smart Light Bulb",
    date: "18 Jun 2024",
    category: "Home",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product11.jpg",
    price: 20.0,
    stock: 800,
    orders: 190,
    amount: 3800,
    rating: 4.6,
    reviews: 190,
    status: "Published",
  },
  {
    id: "#JAN-961",
    name: "Electric Toothbrush",
    date: "19 Jun 2024",
    category: "Personal Care",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product12.jpg",
    price: 40.0,
    stock: 500,
    orders: 130,
    amount: 5200,
    rating: 4.3,
    reviews: 80,
    status: "Published",
  },
  {
    id: "#JAN-962",
    name: "Fitness Tracker",
    date: "20 Jun 2024",
    category: "Health",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product13.jpg",
    price: 28.0,
    stock: 650,
    orders: 95,
    amount: 2660,
    rating: 4.4,
    reviews: 100,
    status: "Published",
  },
  {
    id: "#JAN-963",
    name: "VR Headset",
    date: "21 Jun 2024",
    category: "Electronics",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product14.jpg",
    price: 120.0,
    stock: 75,
    orders: 50,
    amount: 6000,
    rating: 4.8,
    reviews: 130,
    status: "Published",
  },
  {
    id: "#JAN-964",
    name: "Laptop Charger",
    date: "22 Jun 2024",
    category: "Electronics",
    viewLink: "/ecommerce/product-details/",
    image: "/images/products/product15.jpg",
    price: 20.0,
    stock: 300,
    orders: 110,
    amount: 2200,
    rating: 4.7,
    reviews: 75,
    status: "Draft",
  },
];


const ProductsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const productsPerPage = 10;

  // Handle tab switching
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1);
  };

  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((product) => product.id !== id));
  };

  // Filter products based on tab
  const filteredProducts = productsList.filter((product) => {
    if (activeTab === 1) return product.status === "Published";
    if (activeTab === 2) return product.status === "Draft";
    return true;
  });

  // Filter by search query
  const searchedProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(searchedProducts.length / productsPerPage);
  const paginatedProducts = searchedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-tabs products-tabs" id="trezo-tabs">
          {/* Tabs */}
          <ul className="products-list-navs mb-[10px] md:mb-[15px]">
            {["All Products", "Published Products", "Draft Products"].map(
              (label, index) => (
                <li
                  key={index}
                  className="nav-item inline-block mb-[10px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handleTabClick(index)}
                    className={`nav-link block font-semibold transition-all rounded-md py-[10px] px-[22px] bg-gray-50 dark:bg-[#15203c] ${
                      activeTab === index
                        ? "bg-primary-500 text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              )
            )}
          </ul>

          <div className="products-tab-content">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
              <div className="trezo-card-title">
                <form className="relative sm:w-[265px]">
                  <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                    <i className="material-symbols-outlined !text-[20px]">
                      search
                    </i>
                  </label>
                  <input
                    type="text"
                    placeholder="Search product here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                  />
                </form>
              </div>

              <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
                <Link
                  href="/ecommerce/create-product/"
                  className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                  id="add-new-popup-toggle"
                >
                  <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                    <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                      add
                    </i>
                    Add New Product
                  </span>
                </Link>
              </div>
            </div>

            <div className="trezo-card-content">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      {[
                        "ID",
                        "Product",
                        "Category",
                        "Price",
                        "Orders",
                        "Stock",
                        "Amount",
                        "Rating",
                        "Status",
                        "Actions",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {product.id}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex items-center">
                            <div className="rounded-md w-[40px]">
                              <Image
                                src={product.image}
                                alt={product.name}
                                className="inline-block rounded-md"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ltr:ml-[12px] rtl:mr-[12px]">
                              <Link
                                href={product.viewLink}
                                className="font-medium inline-block text-[14px] md:text-[15px] transition-all hover:text-primary-500 mb-px"
                              >
                                {product.name}
                              </Link>
                              <span className="block text-sm text-gray-500 dark:text-gray-400">
                                {product.date}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {product.category}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          ${product.price.toFixed(2)}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {product.orders}
                        </td>

                        <td
                          className={`ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l ${
                            product.stock === 0 ? "text-orange-500" : ""
                          }`}
                        >
                          {product.stock === 0 ? "Out of Stock" : product.stock}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          ${product.amount.toFixed(2)}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {product.rating} ({product.reviews} reviews)
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span
                            className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                              product.status === "Published"
                                ? "bg-primary-50 text-primary-500"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex items-center gap-[9px]">
                            <Link
                              href={product.viewLink}
                              className="text-primary-500 leading-none custom-tooltip"
                              title="View"
                            >
                              <i className="material-symbols-outlined !text-md">
                                visibility
                              </i>
                            </Link>

                            <button
                              type="button"
                              className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                              id="customTooltip"
                              title="Edit"
                            >
                              <i className="material-symbols-outlined !text-md">
                                edit
                              </i>
                            </button>

                            <button
                              type="button"
                              className="text-danger-500 leading-none custom-tooltip"
                              onClick={() => handleDeleteProduct(product.id)}
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
                  Showing {paginatedProducts.length} of{" "}
                  {searchedProducts.length} results
                </p>

                <ol className="mt-[10px] sm:mt-0">
                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    >
                      <span className="opacity-0">0</span>
                      <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                        chevron_left
                      </i>
                    </button>
                  </li>

                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-primary-500 bg-primary-500 text-white">
                      {currentPage}
                    </button>
                  </li>

                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
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
        </div>
      </div>
    </>
  );
};

export default ProductsList;
