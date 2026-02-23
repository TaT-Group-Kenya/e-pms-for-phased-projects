"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  viewLink: string;
};

type Category = {
  id: number;
  name: string;
  icon: string;
  products: Product[];
};

const Categories: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of products per page

  // Sample data for categories and products
  const categories: Category[] = [
    {
      id: 0,
      name: "All",
      icon: "/images/icons/container.svg",

      products: [
        {
          id: 1,
          name: "Apple iPhone 16",
          image: "/images/products/product16.jpg",
          category: "Smartphones",
          price: 799,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 2,
          name: "Levi's 501",
          image: "/images/products/product18.jpg",
          category: "Pants",
          price: 89,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 3,
          name: "Maybelline Lash",
          image: "/images/products/product15.jpg",
          category: "Makeup",
          price: 29,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 4,
          name: "Quaker Oats",
          image: "/images/products/product19.jpg",
          category: "Breakfast",
          price: 99,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 5,
          name: "Fitbit Charge",
          image: "/images/products/product20.jpg",
          category: "Wearables",
          price: 179,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 6,
          name: "Adidas Women",
          image: "/images/products/product17.jpg",
          category: "Outerwear",
          price: 85,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 7,
          name: "Galaxy Tab",
          image: "/images/products/product21.jpg",
          category: "Tablets",
          price: 649,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 8,
          name: "H&M Basic",
          image: "/images/products/product22.jpg",
          category: "T-Shirts",
          price: 20,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 9,
          name: "L'Oréal Paris",
          image: "/images/products/product23.jpg",
          category: "Makeup",
          price: 69,
          viewLink: "/ecommerce/product-details/",
        },
      ],
    },
    {
      id: 1,
      name: "Electronics",
      icon: "/images/icons/data.svg",
      products: [
        {
          id: 1,
          name: "Maybelline Lash",
          image: "/images/products/product15.jpg",
          category: "Makeup",
          price: 29,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 2,
          name: "Apple iPhone 16",
          image: "/images/products/product16.jpg",
          category: "Smartphones",
          price: 799,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 3,
          name: "Levi's 501",
          image: "/images/products/product18.jpg",
          category: "Pants",
          price: 89,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 4,
          name: "Quaker Oats",
          image: "/images/products/product19.jpg",
          category: "Breakfast",
          price: 99,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 5,
          name: "Adidas Women",
          image: "/images/products/product17.jpg",
          category: "Outerwear",
          price: 85,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 6,
          name: "Fitbit Charge",
          image: "/images/products/product20.jpg",
          category: "Wearables",
          price: 179,
          viewLink: "/ecommerce/product-details/",
        },
      ],
    },
    {
      id: 2,
      name: "Clothing",
      icon: "/images/icons/clothing.svg",
      products: [
        {
          id: 1,
          name: "Apple iPhone 16",
          image: "/images/products/product16.jpg",
          category: "Smartphones",
          price: 799,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 2,
          name: "Maybelline Lash",
          image: "/images/products/product15.jpg",
          category: "Makeup",
          price: 29,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 3,
          name: "Adidas Women",
          image: "/images/products/product17.jpg",
          category: "Outerwear",
          price: 85,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 4,
          name: "Fitbit Charge",
          image: "/images/products/product20.jpg",
          category: "Wearables",
          price: 179,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 5,
          name: "Levi's 501",
          image: "/images/products/product18.jpg",
          category: "Pants",
          price: 89,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 6,
          name: "Quaker Oats",
          image: "/images/products/product19.jpg",
          category: "Breakfast",
          price: 99,
          viewLink: "/ecommerce/product-details/",
        },
      ],
    },
    {
      id: 3,
      name: "Beauty",
      icon: "/images/icons/face.svg",
      products: [
        {
          id: 1,
          name: "Fitbit Charge",
          image: "/images/products/product20.jpg",
          category: "Wearables",
          price: 179,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 2,
          name: "Apple iPhone 16",
          image: "/images/products/product16.jpg",
          category: "Smartphones",
          price: 799,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 3,
          name: "Quaker Oats",
          image: "/images/products/product19.jpg",
          category: "Breakfast",
          price: 99,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 4,
          name: "Maybelline Lash",
          image: "/images/products/product15.jpg",
          category: "Makeup",
          price: 29,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 5,
          name: "Adidas Women",
          image: "/images/products/product17.jpg",
          category: "Outerwear",
          price: 85,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 6,
          name: "Levi's 501",
          image: "/images/products/product18.jpg",
          category: "Pants",
          price: 89,
          viewLink: "/ecommerce/product-details/",
        },
      ],
    },
    {
      id: 4,
      name: "Foods",
      icon: "/images/icons/food.svg",
      products: [
        {
          id: 1,
          name: "Quaker Oats",
          image: "/images/products/product19.jpg",
          category: "Breakfast",
          price: 99,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 2,
          name: "Maybelline Lash",
          image: "/images/products/product15.jpg",
          category: "Makeup",
          price: 29,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 3,
          name: "Fitbit Charge",
          image: "/images/products/product20.jpg",
          category: "Wearables",
          price: 179,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 4,
          name: "Apple iPhone 16",
          image: "/images/products/product16.jpg",
          category: "Smartphones",
          price: 799,
          viewLink: "/ecommerce/product-details/",
        },
        {
          id: 5,
          name: "Quaker Oats",
          image: "/images/products/product19.jpg",
          category: "Breakfast",
          price: 99,
          viewLink: "/ecommerce/product-details/",
        },
      ],
    },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1); // Reset to the first page when switching tabs
  };

  // Get the current category's products
  const currentCategory = categories[activeTab];
  const totalPages = Math.ceil(currentCategory.products.length / itemsPerPage);

  // Get the products for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = currentCategory.products.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Hide pagination if there are 2 or fewer items
  const showPagination = currentCategory.products.length > itemsPerPage;

  return (
    <div className="trezo-card mb-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0 !text-md md:!text-[20px] !font-medium">
            Categories
          </h5>
        </div>
      </div>

      <div className="trezo-card-content">
        <div className="trezo-tabs">
          {/* Dynamically render tabs */}
          <ul className="categories-navs mb-[10px]">
            {categories.map((category, index) => (
              <li
                key={category.id}
                className="nav-item inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0"
              >
                <button
                  type="button"
                  onClick={() => handleTabClick(index)}
                  className={`nav-link py-[16px] px-[22px] rounded-md text-black dark:text-white transition-all border-[2px] border-gray-100 dark:border-[#172036] ${
                    activeTab === index ? "active" : ""
                  }`}
                >
                  <Image
                    src={category.icon}
                    className="inline-block"
                    alt={category.name}
                    width={40}
                    height={40}
                  />
                  <div className="block font-medium text-md mt-[12px] mb-[2px]">
                    {category.name}
                  </div>
                  <div className="relative text-gray-500 dark:text-gray-400 font-medium">
                    <span className="text-xs left-0 right-0 top-1/2 -translate-y-1/2 absolute transition-all">
                      {category.products.length}
                    </span>
                    <span className="text-xs transition-all">
                      {category.products.length} Products
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Dynamically render products for the active tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-[25px]">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="p-[15px] md:p-[20px] bg-white dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#172036]"
              >
                <Link href={product.viewLink} className="block rounded-md">
                  <Image
                    src={product.image}
                    className="rounded-md"
                    alt={product.name}
                    width={570}
                    height={400}
                  />
                </Link>
                <div className="mt-[18px]">
                  <h4 className="!font-medium !text-lg md:!text-[20px] !mb-[4px]">
                    <Link
                      href={product.viewLink}
                      className="transition-all hover:text-primary-500"
                    >
                      {product.name}
                    </Link>
                  </h4>

                  <span className="block">{product.category}</span>

                  <div className="mt-[12px] flex items-center justify-between">
                    <span className="block leading-none text-success-600 font-medium text-lg md:text-xl">
                      ${product.price}
                    </span>
                    <button
                      type="button"
                      className="flex items-center justify-center w-[34px] h-[34px] rounded-sm text-primary-500 bg-primary-100 dark:bg-dark transition-all hover:text-white hover:bg-primary-500"
                    >
                      <i className="material-symbols-outlined">shopping_cart</i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {showPagination && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] border border-gray-100 dark:border-[#172036] p-[20px] md:p-[25px] mt-[25px] rounded-md">
              <div className="trezo-card-content">
                <div className="sm:flex sm:items-center justify-between">
                  <p className="!mb-0">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, currentCategory.products.length)}{" "}
                    of {currentCategory.products.length} results
                  </p>

                  <ol className="mt-[10px] sm:mt-0 flex items-center gap-[5px]">
                    <li>
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                          chevron_left
                        </i>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li key={page}>
                          <button
                            onClick={() => goToPage(page)}
                            className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
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
                    <li>
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
