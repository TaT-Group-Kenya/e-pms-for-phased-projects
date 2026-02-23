"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  updatedAt: string;
  status: "solved" | "pending" | "in-progress" | "rejected";
}

const Tickets: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Tickets data
  const tickets: Ticket[] = [
    {
      id: "1",
      ticketNumber: "#3242",
      title: "Order delayed for 5 mins",
      updatedAt: "10 Nov, 2025",
      status: "solved",
    },
    {
      id: "2",
      ticketNumber: "#3243",
      title: "Provided rotten Burger",
      updatedAt: "10 Nov, 2025",
      status: "pending",
    },
    {
      id: "3",
      ticketNumber: "#3244",
      title: "Too much salt in pizza",
      updatedAt: "10 Nov, 2025",
      status: "solved",
    },
    {
      id: "4",
      ticketNumber: "#3245",
      title: "Order delayed for 5 mins",
      updatedAt: "10 Nov, 2025",
      status: "solved",
    },
    {
      id: "5",
      ticketNumber: "#3246",
      title: "Delivery man misbehaved",
      updatedAt: "10 Nov, 2025",
      status: "pending",
    },
    {
      id: "6",
      ticketNumber: "#3247",
      title: "App doesn't work",
      updatedAt: "10 Nov, 2025",
      status: "solved",
    },
    {
      id: "7",
      ticketNumber: "#3248",
      title: "Too much salt in pizza",
      updatedAt: "10 Nov, 2025",
      status: "solved",
    },
    {
      id: "8",
      ticketNumber: "#3249",
      title: "Food delivered cold",
      updatedAt: "10 Nov, 2025",
      status: "pending",
    },
    {
      id: "9",
      ticketNumber: "#3250",
      title: "Wrong item received",
      updatedAt: "10 Nov, 2025",
      status: "solved",
    },
    {
      id: "10",
      ticketNumber: "#3251",
      title: "Promo code not working",
      updatedAt: "10 Nov, 2025",
      status: "pending",
    },
  ];

  // Get status styles
  const getStatusStyles = (status: Ticket["status"]) => {
    switch (status) {
      case "solved":
        return {
          text: "text-success-700",
          border: "border-success-300",
          bg: "bg-success-100 dark:bg-[#15203c]",
        };
      case "pending":
        return {
          text: "text-purple-700",
          border: "border-purple-300",
          bg: "bg-purple-100 dark:bg-[#15203c]",
        };
      case "in-progress":
        return {
          text: "text-warning-700",
          border: "border-warning-300",
          bg: "bg-warning-100 dark:bg-[#15203c]",
        };
      case "rejected":
        return {
          text: "text-danger-700",
          border: "border-danger-300",
          bg: "bg-danger-100 dark:bg-[#15203c]",
        };
      default:
        return {
          text: "text-gray-700",
          border: "border-gray-300",
          bg: "bg-gray-100 dark:bg-[#15203c]",
        };
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Tickets</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[25px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
              </MenuButton>

              <MenuItems className="transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ">
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
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <tbody className="text-black dark:text-white">
                {tickets.slice(0, 8).map((ticket) => {
                  const statusStyles = getStatusStyles(ticket.status);
                  return (
                    <tr key={ticket.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                        <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {ticket.ticketNumber}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                        <span className="block -mt-px mb-[3px] text-base font-semibold">
                          {ticket.title}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          Updated on: {ticket.updatedAt}
                        </span>
                      </td>

                      <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 align-top">
                        <span
                          className={`inline-block text-xs px-[9px] border dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] capitalize ${statusStyles.text} ${statusStyles.border} ${statusStyles.bg}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tickets;
