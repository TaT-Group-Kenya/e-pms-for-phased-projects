"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Review {
  id: string;
  reviewer: string;
  email: string;
  avatar: string;
  rating: number;
  reviewText: string;
  productImg: string;
  productName: string;
  viewLink: string;
  date: string;
  time: string;
  status: "Pending" | "Published";
}

const initialReviews: Review[] = [
  {
    id: "#999",
    reviewer: "Olivia Clark",
    email: "olivia@trezo.com",
    avatar: "/images/users/user6.jpg",
    rating: 5,
    reviewText: "Lorem Ipsum is simply dummy text of the printing industry.",
    productImg: "/images/products/product1.jpg",
    productName: "Smart Band",
    viewLink: "/ecommerce/product-details/",
    date: "17 Dec 2024",
    time: "08:30 PM",
    status: "Pending",
  },
  {
    id: "#998",
    reviewer: "Zephyr Zing",
    email: "zephyr@trezo.com",
    avatar: "/images/users/user7.jpg",
    rating: 4.5,
    reviewText:
      "Lorem Ipsum has been the industry's standard dummy text since the 1500s.",
    productImg: "/images/products/product2.jpg",
    productName: "Headphone",
    viewLink: "/ecommerce/product-details/",
    date: "16 Dec 2024",
    time: "10:11 PM",
    status: "Pending",
  },
  {
    id: "#997",
    reviewer: "Nova Nectar",
    email: "nova@trezo.com",
    avatar: "/images/users/user8.jpg",
    rating: 4,
    reviewText:
      "It has survived not only five centuries, but also the leap into electronic typesetting.",
    productImg: "/images/products/product3.jpg",
    productName: "iPhone 15 Plus",
    viewLink: "/ecommerce/product-details/",
    date: "15 Dec 2024",
    time: "11:11 AM",
    status: "Pending",
  },
  {
    id: "#996",
    reviewer: "Isabella Chang",
    email: "isabella@trezo.com",
    avatar: "/images/users/user9.jpg",
    rating: 3.5,
    reviewText:
      "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
    productImg: "/images/products/product4.jpg",
    productName: "Bluetooth Speaker",
    viewLink: "/ecommerce/product-details/",
    date: "14 Dec 2024",
    time: "09:45 AM",
    status: "Pending",
  },
  {
    id: "#995",
    reviewer: "Alina Bennett",
    email: "alina@trezo.com",
    avatar: "/images/users/user10.jpg",
    rating: 5,
    reviewText:
      "It is a long established fact that a reader will be distracted by the readable content of a page.",
    productImg: "/images/products/product5.jpg",
    productName: "Airbuds 2nd Gen",
    viewLink: "/ecommerce/product-details/",
    date: "13 Dec 2024",
    time: "07:15 PM",
    status: "Published",
  },
  {
    id: "#994",
    reviewer: "Liam Harper",
    email: "liam@trezo.com",
    avatar: "/images/users/user11.jpg",
    rating: 4.5,
    reviewText:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    productImg: "/images/products/product6.jpg",
    productName: "Smart Band",
    viewLink: "/ecommerce/product-details/",
    date: "12 Dec 2024",
    time: "05:22 PM",
    status: "Published",
  },
  {
    id: "#993",
    reviewer: "Emma Collins",
    email: "emma@trezo.com",
    avatar: "/images/users/user12.jpg",
    rating: 4,
    reviewText:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.",
    productImg: "/images/products/product7.jpg",
    productName: "Smart Band",
    viewLink: "/ecommerce/product-details/",
    date: "11 Dec 2024",
    time: "02:18 PM",
    status: "Published",
  },
  {
    id: "#992",
    reviewer: "Sophia Martin",
    email: "sophia@trezo.com",
    avatar: "/images/users/user13.jpg",
    rating: 4,
    reviewText:
      "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    productImg: "/images/products/product1.jpg",
    productName: "Smart Band",
    viewLink: "/ecommerce/product-details/",
    date: "10 Dec 2024",
    time: "01:45 PM",
    status: "Published",
  },
  {
    id: "#991",
    reviewer: "James Turner",
    email: "james@trezo.com",
    avatar: "/images/users/user14.jpg",
    rating: 3,
    reviewText:
      "It has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    productImg: "/images/products/product1.jpg",
    productName: "Smart Band",
    viewLink: "/ecommerce/product-details/",
    date: "09 Dec 2024",
    time: "10:05 AM",
    status: "Published",
  },
  {
    id: "#990",
    reviewer: "Benjamin Scott",
    email: "benjamin@trezo.com",
    avatar: "/images/users/user15.jpg",
    rating: 5,
    reviewText:
      "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, making it look like readable English.",
    productImg: "/images/products/product1.jpg",
    productName: "Smart Band",
    viewLink: "/ecommerce/product-details/",
    date: "08 Dec 2024",
    time: "03:25 PM",
    status: "Pending",
  },
];

const ReviewsTable: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const reviewsPerPage = 5;

  // Handle review deletion
  const handleDelete = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  // Filtered Reviews Based on Search
  const filteredReviews = reviews.filter((review) =>
    review.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
        <div className="trezo-card-title">
          <form className="relative sm:w-[265px]">
            <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </label>
            <input
              type="text"
              placeholder="Search review..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
            />
          </form>
        </div>

        <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
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
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Day", "This Week", "This Month", "This Year"].map((option) => (
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
      </div>

      <div className="trezo-card-content">
        {/* Table */}
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white bg-gray-50 dark:bg-[#15203c]">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                  ID
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                  Reviewer
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                  Review
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                  Product
                </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                  Date
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
              {paginatedReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-100 dark:border-[#172036]"
                >
                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    {review.id}
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <div className="flex items-center">
                      <div className="w-[40px] rounded-full">
                        <Image
                          src={review.avatar}
                          alt={review.reviewer}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="ltr:ml-[12px] rtl:mr-[12px]">
                        <span className="font-medium">{review.reviewer}</span>

                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          {review.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <div className="leading-none flex items-center gap-[2px] text-lg text-[#ee8336]">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i
                          key={i}
                          className={`ri-star${
                            i + 1 <= review.rating ? "-fill" : "-line"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <p className="mt-[10px] w-[350px]">{review.reviewText}</p>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <div className="flex items-center">
                      <div className="rounded-md w-[40px]">
                        <Image
                          src={review.productImg}
                          className="inline-block rounded-md"
                          alt={review.productName}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ltr:ml-[12px] rtl:mr-[12px]">
                        <Link
                          href={review.viewLink}
                          className="block font-medium md:text-[15px] transition-all hover:text-primary-500"
                        >
                          {review.productName}
                        </Link>
                      </div>
                    </div>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <span className="block">{review.date}</span>
                    <span className="block">{review.time}</span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <span
                      className={`px-[8px] py-[3px] inline-block rounded-sm font-medium text-xs dark:bg-[#15203c] ${
                        review.status === "Published"
                          ? "bg-danger-50 text-danger-500"
                          : "bg-primary-50 text-primary-500"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <div className="flex items-center gap-[9px]">
                      <button
                        type="button"
                        className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          download_done
                        </i>
                      </button>

                      <button
                        type="button"
                        className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                      >
                        <i className="material-symbols-outlined !text-md">
                          reply
                        </i>
                      </button>

                      <button
                        type="button"
                        className="text-danger-500 leading-none custom-tooltip"
                        onClick={() => handleDelete(review.id)}
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

        {/* Pagination */}
        <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
          <p className="!mb-0 !text-sm">
            Showing {reviewsPerPage} of {reviews.length} reviews
          </p>

          <div className="flex gap-[5px]">
            <button
              className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2 text-[20px !im]">
                chevron_left
              </i>
            </button>

            <button
              className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                chevron_right
              </i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTable;
