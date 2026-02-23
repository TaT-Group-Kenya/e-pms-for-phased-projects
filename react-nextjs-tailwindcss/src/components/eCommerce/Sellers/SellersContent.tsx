"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const initialSellers = [
  {
    id: 1,
    image: "/images/sellers/seller1.png",
    name: "Ava Turner",
    email: "turner@trezo.com",
    lastSaleDate: "25 Nov 2024",
    itemStock: 50,
    walletBalance: "$9,999.50",
    revenue: "$5,999.50",
    store: "TechMaster Store",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 2,
    image: "/images/sellers/seller2.png",
    name: "Ethan Parker",
    email: "ethan@trezo.com",
    lastSaleDate: "01 Nov 2024",
    itemStock: 39,
    walletBalance: "$6,756.50",
    revenue: "$4,645.50",
    store: "RisionTech Outlet",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 3,
    image: "/images/sellers/seller3.png",
    name: "Isabella Lee",
    email: "isabella@trezo.com",
    lastSaleDate: "30 Sep 2024",
    itemStock: 75,
    walletBalance: "$5,550.00",
    revenue: "$4,350.50",
    store: "ComfotLiving",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 4,
    image: "/images/sellers/seller4.png",
    name: "John Doe",
    email: "john@trezo.com",
    lastSaleDate: "15 Dec 2024",
    itemStock: 45,
    walletBalance: "$7,500.00",
    revenue: "$3,500.00",
    store: "TechWorld",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 5,
    image: "/images/sellers/seller5.png",
    name: "Lily Roberts",
    email: "lily@trezo.com",
    lastSaleDate: "12 Oct 2024",
    itemStock: 60,
    walletBalance: "$8,500.00",
    revenue: "$6,200.00",
    store: "Roberts Electronics",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 6,
    image: "/images/sellers/seller6.png",
    name: "Mason Evans",
    email: "mason@trezo.com",
    lastSaleDate: "22 Nov 2024",
    itemStock: 72,
    walletBalance: "$10,200.50",
    revenue: "$7,800.75",
    store: "Mason's Shop",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 7,
    image: "/images/sellers/seller7.png",
    name: "Sophia Bennett",
    email: "sophia@trezo.com",
    lastSaleDate: "09 Dec 2024",
    itemStock: 90,
    walletBalance: "$11,100.00",
    revenue: "$9,800.00",
    store: "Sophia's Marketplace",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 8,
    image: "/images/sellers/seller8.png",
    name: "Lucas Mitchell",
    email: "lucas@trezo.com",
    lastSaleDate: "05 Jan 2025",
    itemStock: 30,
    walletBalance: "$4,500.00",
    revenue: "$2,750.00",
    store: "Mitchell's Tech",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 9,
    image: "/images/sellers/seller9.png",
    name: "Charlotte Carter",
    email: "charlotte@trezo.com",
    lastSaleDate: "18 Dec 2024",
    itemStock: 55,
    walletBalance: "$7,800.00",
    revenue: "$6,300.00",
    store: "Carter's Goods",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 10,
    image: "/images/sellers/seller10.png",
    name: "Aiden Brooks",
    email: "aiden@trezo.com",
    lastSaleDate: "14 Jan 2025",
    itemStock: 40,
    walletBalance: "$5,600.00",
    revenue: "$4,100.00",
    store: "Brooks Tech",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 11,
    image: "/images/sellers/seller11.png",
    name: "Ella Martin",
    email: "ella@trezo.com",
    lastSaleDate: "11 Oct 2024",
    itemStock: 65,
    walletBalance: "$6,700.00",
    revenue: "$5,500.00",
    store: "Ella's Fashion",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 12,
    image: "/images/sellers/seller12.png",
    name: "James Harris",
    email: "james@trezo.com",
    lastSaleDate: "21 Dec 2024",
    itemStock: 80,
    walletBalance: "$9,300.00",
    revenue: "$6,800.00",
    store: "James' Electronics",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 13,
    image: "/images/sellers/seller1.png",
    name: "Amelia Clark",
    email: "amelia@trezo.com",
    lastSaleDate: "23 Nov 2024",
    itemStock: 50,
    walletBalance: "$7,200.00",
    revenue: "$4,600.00",
    store: "Amelia's Boutique",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 14,
    image: "/images/sellers/seller2.png",
    name: "Benjamin Scott",
    email: "benjamin@trezo.com",
    lastSaleDate: "02 Dec 2024",
    itemStock: 60,
    walletBalance: "$8,000.00",
    revenue: "$6,000.00",
    store: "Scott's Store",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 15,
    image: "/images/sellers/seller3.png",
    name: "Harper White",
    email: "harper@trezo.com",
    lastSaleDate: "16 Jan 2025",
    itemStock: 25,
    walletBalance: "$3,400.00",
    revenue: "$2,000.00",
    store: "Harper's Shop",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 16,
    image: "/images/sellers/seller4.png",
    name: "Jackson Young",
    email: "jackson@trezo.com",
    lastSaleDate: "19 Nov 2024",
    itemStock: 85,
    walletBalance: "$10,700.00",
    revenue: "$8,500.00",
    store: "Jackson's Market",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 17,
    image: "/images/sellers/seller5.png",
    name: "Grace Adams",
    email: "grace@trezo.com",
    lastSaleDate: "07 Dec 2024",
    itemStock: 20,
    walletBalance: "$2,800.00",
    revenue: "$1,900.00",
    store: "Grace's Goods",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 18,
    image: "/images/sellers/seller6.png",
    name: "Oliver King",
    email: "oliver@trezo.com",
    lastSaleDate: "08 Nov 2024",
    itemStock: 30,
    walletBalance: "$4,200.00",
    revenue: "$3,100.00",
    store: "King's Tech",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 19,
    image: "/images/sellers/seller7.png",
    name: "Zoe Martinez",
    email: "zoe@trezo.com",
    lastSaleDate: "30 Dec 2024",
    itemStock: 60,
    walletBalance: "$7,300.00",
    revenue: "$5,900.00",
    store: "Martinez Fashion",
    viewLink: "/ecommerce/seller-details/",
  },
  {
    id: 20,
    image: "/images/sellers/seller8.png",
    name: "Sebastian Lee",
    email: "sebastian@trezo.com",
    lastSaleDate: "03 Jan 2025",
    itemStock: 100,
    walletBalance: "$12,500.00",
    revenue: "$10,000.00",
    store: "Lee's Electronics",
    viewLink: "/ecommerce/seller-details/",
  },
];

const SellersContent: React.FC = () => {
  const [sellers, setSellers] = useState(initialSellers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filter sellers based on search query
  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSellers = filteredSellers.length;

  // Calculate current sellers based on pagination
  const indexOfLastSeller = currentPage * itemsPerPage;
  const indexOfFirstSeller = indexOfLastSeller - itemsPerPage;
  const currentSellers = filteredSellers.slice(
    indexOfFirstSeller,
    indexOfLastSeller
  );

  const totalPages = Math.ceil(totalSellers / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle delete seller
  const handleDelete = (id: number) => {
    setSellers((prevSellers) =>
      prevSellers.filter((seller) => seller.id !== id)
    );
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search seller here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/ecommerce/create-seller"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              id="add-new-popup-toggle"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Seller
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        {currentSellers.map((seller) => (
          <div
            key={seller.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={seller.image}
                    alt={seller.name}
                    width={50}
                    height={50}
                  />
                  <div className="ltr:ml-[15px] rtl:mr-[15px]">
                    <Link
                      href={seller.viewLink}
                      className="text-md inline-block mb-[2px] font-medium transition-all text-black dark:text-white hover:text-primary-500"
                    >
                      {seller.name}
                    </Link>
                    <span className="block">{seller.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-[9px]">
                  <div className="relative group">
                    <Link
                      href={seller.viewLink}
                      className="text-primary-500 leading-none"
                    >
                      <i className="material-symbols-outlined !text-md">
                        visibility
                      </i>
                    </Link>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                    </div>
                  </div>

                  <div className="relative group">
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-400 leading-none"
                    >
                      <i className="material-symbols-outlined !text-md">edit</i>
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                    </div>
                  </div>

                  <div className="relative group">
                    <button
                      type="button"
                      className="text-danger-500 leading-none"
                      onClick={() => handleDelete(seller.id)}
                    >
                      <i className="material-symbols-outlined !text-md">
                        delete
                      </i>
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Delete
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="mt-[20px]">
                <li className="text-black dark:text-white mb-[10px] last:mb-0">
                  <span className="text-gray-500 dark:text-gray-400">
                    Last Sale Date: {' '}
                  </span>
                  {seller.lastSaleDate}
                </li>
                <li className="text-black dark:text-white mb-[10px] last:mb-0">
                  <span className="text-gray-500 dark:text-gray-400">
                    Item Stock: {' '}
                  </span>
                  {seller.itemStock}
                </li>
                <li className="text-black dark:text-white mb-[10px] last:mb-0">
                  <span className="text-gray-500 dark:text-gray-400">
                    Wallet Balance: {' '}
                  </span>
                  {seller.walletBalance}
                </li>
                <li className="text-black dark:text-white mb-[10px] last:mb-0">
                  <span className="text-gray-500 dark:text-gray-400">
                    Revenue: {' '}
                  </span>
                  {seller.revenue}
                </li>
                <li className="text-black dark:text-white mb-[10px] last:mb-0">
                  <span className="text-gray-500 dark:text-gray-400">
                    Store: {' '}
                  </span>
                  {seller.store}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex sm:items-center justify-between">
            <p className="!mb-0">
              Showing {indexOfFirstSeller + 1} -{" "}
              {Math.min(indexOfLastSeller, totalSellers)} of {totalSellers}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handlePrevPage}
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
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={handleNextPage}
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

export default SellersContent;
