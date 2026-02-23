"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// Define a type for the table data
interface TableRow {
  id: number;
  name: string;
  username: string;
  amount: string;
  image: string;
}

const HistoryOfBids: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  // State to hold the table data
  const [tableData, setTableData] = useState<TableRow[]>([]);

  // Simulate fetching data (e.g., from an API)
  useEffect(() => {
    // Mock data (replace this with an API call or dynamic data source)
    const mockData: TableRow[] = [
      {
        id: 1,
        name: "Johhna Loren",
        username: "@queensland",
        amount: "624 ETH",
        image: "/images/users/user6.jpg",
      },
      {
        id: 2,
        name: "Zara Loren",
        username: "@queensland",
        amount: "121.1 ETH",
        image: "/images/users/user7.jpg",
      },
      {
        id: 3,
        name: "Walter White",
        username: "@queensland",
        amount: "24.78 ETH",
        image: "/images/users/user8.jpg",
      },
      {
        id: 4,
        name: "Viktor James",
        username: "@queensland",
        amount: "72.8 ETH",
        image: "/images/users/user9.jpg",
      },
      {
        id: 5,
        name: "Zinia Loren",
        username: "@queensland",
        amount: "986 ETH",
        image: "/images/users/user10.jpg",
      },
      {
        id: 6,
        name: "John Carter",
        username: "@queensland",
        amount: "123.1 ETH",
        image: "/images/users/user11.jpg",
      },
    ];

    // Replace this with an actual API call
    setTableData(mockData);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">History Of Bids</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
          <div className="table-responsive overflow-auto h-[333px] ltr:-mr-[20px] ltr:md:-mr-[25px] rtl:-ml-[20px] rtl:md:-ml-[25px] ltr:pr-[20px] ltr:md:pr-[25px] rtl:pl-[20px] rtl:md:pl-[25px]">
            <div className="table-responsive overflow-auto h-[333px] ltr:-mr-[20px] ltr:md:-mr-[25px] rtl:-ml-[20px] rtl:md:-ml-[25px] ltr:pr-[20px] ltr:md:pr-[25px] rtl:pl-[20px] rtl:md:pl-[25px]">
              <table className="w-full">
                <tbody className="text-black dark:text-white">
                  {tableData.map((row) => (
                    <tr key={row.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                        <div className="flex items-center gap-[10px]">
                          <div className="rounded-full w-[40px]">
                            <Image
                              src={row.image}
                              className="inline-block rounded-full"
                              alt="user-image"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div>
                            <span className="font-semibold inline-block mb-px">
                              {row.name}
                            </span>
                            <span className="block text-gray-500 dark:text-gray-400 text-xs">
                              {row.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[10px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0 ltr:last:text-right rtl:last:text-left">
                        <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {row.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryOfBids;