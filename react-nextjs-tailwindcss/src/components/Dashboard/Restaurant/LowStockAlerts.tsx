"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface StockItem {
  id: string;
  name: string;
  quantity: number;
}

const LowStockAlerts: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Dynamic stock data
  const lowStockItems: StockItem[] = [
    { id: "1", name: "Thai Bean Soup", quantity: 1 },
    { id: "2", name: "Banana Shake", quantity: 3 },
    { id: "3", name: "Chicken Tandoori", quantity: 5 },
    { id: "4", name: "Thai Chicken Masala", quantity: 5 },
    { id: "5", name: "Chicken Club Sandwich", quantity: 6 },
    { id: "6", name: "Shrimp Fried Rice", quantity: 2 },
    { id: "7", name: "Grilled Salmon", quantity: 4 },
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Low Stock Alerts</h5>
          </div>

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

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <tbody className="text-black dark:text-white">
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[11.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 font-semibold">
                      {item.name}
                    </td>
                    <td className="ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[11.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 font-bold text-danger-500">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowStockAlerts;
