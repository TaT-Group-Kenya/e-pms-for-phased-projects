"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Define the structure of the API response
interface NewCustomersResponse {
  newCustomersCount: number;
  customerImages: string[];
  additionalCustomersCount: number;
}

// Sample API response structure (you would fetch this from an actual API)
const fetchNewCustomers = (): Promise<NewCustomersResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        newCustomersCount: 4712,
        customerImages: [
          "/images/users/user36.jpg",
          "/images/users/user37.jpg",
          "/images/users/user38.jpg",
          "/images/users/user39.jpg",
          "/images/users/user40.jpg",
        ],
        additionalCustomersCount: 59,
      });
    }, 1000); // Simulate an API call with a delay of 1 second
  });
};

const NewCustomersThisMonth: React.FC = () => {
  const [newCustomersCount, setNewCustomersCount] = useState<number>(0);
  const [customerImages, setCustomerImages] = useState<string[]>([]);
  const [additionalCustomersCount, setAdditionalCustomersCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNewCustomers();
      setNewCustomersCount(data.newCustomersCount);
      setCustomerImages(data.customerImages);
      setAdditionalCustomersCount(data.additionalCustomersCount);
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        className="md:col-span-2 lg:col-span-1 trezo-card relative p-[20px] md:p-[25px] rounded-md"
        style={{
          background: "linear-gradient(73deg, #23272E 0%, #343A46 100%)",
        }}
      >
        <div className="trezo-card-content">
          <span className="block mb-[4px] text-gray-400">
            New customers this month
          </span>

          <h3 className="!mb-[20px] !text-[20px] !text-white">
            {newCustomersCount}
          </h3>

          <span className="block text-gray-400 mb-[10px]">Join Today</span>

          <div className="flex items-center">
            {customerImages.slice(0, 5).map((imgSrc, index) => (
              <Image
                key={index}
                src={imgSrc}
                className="rounded-full w-[40px] border border-white ltr:-mr-[10px] rtl:-ml-[10px] ltr:last:mr-0 rtl:last:ml-0"
                alt="user-image"
                width={40}
                height={40}
              />
            ))}

            <div className="flex items-center justify-center bg-orange-400 border border-white w-[40px] h-[40px] rounded-full text-white font-semibold ltr:-mr-[10px] rtl:-ml-[10px] ltr:last:mr-0 rtl:last:ml-0">
              {additionalCustomersCount}
            </div>
          </div>
        </div>

        <Image
          src="/images/icons/4dot3.svg"
          className="absolute bottom-0 ltr:right-0 rtl:left-0 rtl:-scale-x-100"
          alt="4dot"
          width={60}
          height={60}
        />
      </div>
    </>
  );
};

export default NewCustomersThisMonth;