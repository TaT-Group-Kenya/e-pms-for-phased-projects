"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Review {
  id: string;
  reviewer: string;
  email: string;
  avatar: string;
  rating: number;
  reviewText: string;
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
    date: "08 Dec 2024",
    time: "03:25 PM",
    status: "Pending",
  },
];

const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 5;

  // Handle review deletion
  const handleDelete = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex justify-between items-center">
        <h5 className="!mb-0">Manage Reviews</h5>
      </div>

      <div className="trezo-card-content">
        {/* Table */}
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white bg-gray-50 dark:bg-[#15203c]">
              <tr>
                {["ID", "Reviewer", "Review", "Date", "Status", "Action"].map(
                  (header, index) => (
                    <th key={index} className="px-[20px] py-[11px]">
                      {header}
                    </th>
                  )
                )}
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

export default ManageReviews;
