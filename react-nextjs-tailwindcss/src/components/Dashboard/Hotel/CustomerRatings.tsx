"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Rating {
  id: string;
  userId: string;
  customerName: string;
  avatar: string;
  rating: number;
  title: string;
  review: string;
  date: string;
}

const CustomerRatings: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Sample data - in a real app, this would come from an API
  const allRatings: Rating[] = [
    {
      id: "1",
      userId: "#001",
      customerName: "Joanna Watson",
      avatar: "/images/users/user58.jpg",
      rating: 5.0,
      title: "Amazing Ambiance and Delicious Food!",
      review:
        "Trezo was a fantastic dining experience. The ambiance is warm and inviting, perfect for a date night or celebration. I ordered the truffle pasta, which was rich and perfectly seasoned. The service was impeccable, and the staff made us feel like family. Highly recommend!",
      date: "13 Nov, 25",
    },
    {
      id: "2",
      userId: "#002",
      customerName: "Jenelia Anderson",
      avatar: "/images/users/user59.jpg",
      rating: 4.9,
      title: "Best Brunch Spot in Town",
      review:
        "Visited Trezo for brunch with friends, and it exceeded our expectations. The avocado toast was fresh, and their mimosas were spot-on. Our server was attentive without being intrusive. Definitely coming back!",
      date: "14 Nov, 25",
    },
    {
      id: "3",
      userId: "#003",
      customerName: "Michael Johnson",
      avatar: "/images/users/user60.jpg",
      rating: 4.5,
      title: "Great Service, Good Food",
      review:
        "The steak was cooked perfectly to my liking. Service was excellent with timely check-ins. The atmosphere was lively but not too loud. Would recommend for business dinners.",
      date: "15 Nov, 25",
    },
    {
      id: "4",
      userId: "#004",
      customerName: "Sarah Williams",
      avatar: "/images/users/user61.jpg",
      rating: 5.0,
      title: "Perfect Anniversary Dinner",
      review:
        "Trezo made our anniversary special. They gave us a complimentary dessert with a candle. The wine pairing suggestion was excellent. Every dish was beautifully presented.",
      date: "16 Nov, 25",
    },
    {
      id: "5",
      userId: "#005",
      customerName: "David Brown",
      avatar: "/images/users/user62.jpg",
      rating: 4.0,
      title: "Good but pricey",
      review:
        "Food quality is excellent but portions are small for the price. The cocktails are creative and well-made. Would come back for special occasions.",
      date: "17 Nov, 25",
    },
    {
      id: "6",
      userId: "#006",
      customerName: "Emily Davis",
      avatar: "/images/users/user63.jpg",
      rating: 4.7,
      title: "Lovely outdoor seating",
      review:
        "The garden area is beautiful in the evening. The seafood pasta was delicious. Service was a bit slow but friendly. Great place for a romantic evening.",
      date: "18 Nov, 25",
    },
    {
      id: "7",
      userId: "#007",
      customerName: "Robert Wilson",
      avatar: "/images/users/user64.jpg",
      rating: 3.5,
      title: "Decent experience",
      review:
        "Food was good but not exceptional. The noise level was high making conversation difficult. Might try again during lunch hours.",
      date: "19 Nov, 25",
    },
    {
      id: "8",
      userId: "#008",
      customerName: "Jennifer Taylor",
      avatar: "/images/users/user65.jpg",
      rating: 5.0,
      title: "Exceptional from start to finish",
      review:
        "Every aspect of our meal was perfect. The chef came out to check on us. The sommelier's wine recommendation was spot on. Worth every penny.",
      date: "20 Nov, 25",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate pagination
  const totalItems = allRatings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRatings = allRatings.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="ri-star-fill text-orange-500"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="ri-star-half-fill text-orange-500"></i>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="ri-star-line text-orange-500"></i>
      );
    }

    return (
      <div className="flex items-center leading-none gap-[2px]">
        {stars}
        <span className="block relative top-px text-xs text-gray-500 dark:text-gray-400 ltr:ml-[2px] rtl:mr-[2px] font-semibold">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Customer Ratings</h5>
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
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  User ID
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Customer Name
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Ratings
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Reviews
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                  Date
                </th>
                <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[11px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0"></th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {currentRatings.map((rating) => (
                <tr key={rating.id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {rating.userId}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                    <div className="flex items-center gap-[10px]">
                      <div className="rounded-full w-[30px] h-[30px] overflow-hidden">
                        <Image
                          src={rating.avatar}
                          className="w-full h-full object-cover"
                          alt="user-image"
                          width={30}
                          height={30}
                        />
                      </div>
                      <span className="font-semibold inline-block">
                        {rating.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                    {renderStars(rating.rating)}
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                    <div className="whitespace-normal w-[620px]">
                      <span className="block text-xs mb-[5px] font-semibold text-gray-600 dark:text-gray-400">
                        {rating.title}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {rating.review}
                      </p>
                    </div>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                    <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {rating.date}
                    </span>
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
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
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} results
          </p>
          <ol className="mt-[10px] sm:mt-0 flex items-center">
            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === 1
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}
              >
                <span className="opacity-0">0</span>
                <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                  chevron_left
                </i>
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
              >
                <button
                  onClick={() => handlePageChange(page)}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                    currentPage === page
                      ? "border border-primary-500 bg-primary-500 text-white"
                      : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                  currentPage === totalPages
                    ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                    : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
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
  );
};

export default CustomerRatings;
