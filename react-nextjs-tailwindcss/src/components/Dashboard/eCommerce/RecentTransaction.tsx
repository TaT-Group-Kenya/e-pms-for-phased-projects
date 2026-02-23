"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type Transaction = {
  type: string; // E.g., "Master Card", "Paypal"
  icon: string; // Material icon name
  date: string; // Transaction date and time
  amount: number; // Transaction amount
  isIncome: boolean; // Determines if the amount is income or expense
  bgColorClass: string; // Background color class
  textColorClass: string; // Text color class
};

const transactions: Transaction[] = [
  {
    type: "Master Card",
    icon: "credit_card",
    date: "16 Jun 2024 - 7:12 pm",
    amount: 1520,
    isIncome: true,
    bgColorClass: "bg-primary-100",
    textColorClass: "text-primary-500",
  },
  {
    type: "Paypal",
    icon: "redeem",
    date: "15 Jun 2024 - 1:42 am",
    amount: -2250,
    isIncome: false,
    bgColorClass: "bg-danger-100",
    textColorClass: "text-danger-500",
  },
  {
    type: "Wise",
    icon: "account_balance",
    date: "14 Jun 2024 - 4:21 pm",
    amount: 3560,
    isIncome: true,
    bgColorClass: "bg-purple-100",
    textColorClass: "text-purple-500",
  },
  {
    type: "Payoneer",
    icon: "currency_ruble",
    date: "13 Jun 2024 - 2:42 am",
    amount: 6500,
    isIncome: true,
    bgColorClass: "bg-secondary-100",
    textColorClass: "text-secondary-500",
  },
  {
    type: "Credit Card",
    icon: "credit_score",
    date: "12 Jun 2024 - 3:20 pm",
    amount: -4320,
    isIncome: false,
    bgColorClass: "bg-success-100",
    textColorClass: "text-success-600",
  },
];

const RecentTransaction: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Day");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Transactions</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
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
          <ul>
            {transactions.map((transaction, index) => (
              <li
                key={index}
                className="flex items-center justify-between mb-[15px] md:mb-[18px] lg:mb-[21.5px] last:mb-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-[41px] h-[41px] ltr:mr-[12px] rtl:ml-[12px] ${transaction.bgColorClass} dark:bg-[#15203c] ${transaction.textColorClass} rounded-full flex items-center justify-center`}
                  >
                    <i className="material-symbols-outlined">
                      {transaction.icon}
                    </i>
                  </div>
                  <div>
                    <span className="block text-black dark:text-white text-base md:text-[16px] mb-[3px] md:mb-px font-medium">
                      {transaction.type}
                    </span>
                    <span className="block text-sm">{transaction.date}</span>
                  </div>
                </div>
                <span
                  className={`block ${
                    transaction.isIncome
                      ? "text-success-600"
                      : "text-danger-500"
                  }`}
                >
                  {transaction.isIncome ? "+" : "-"}
                  {Math.abs(transaction.amount).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RecentTransaction;
