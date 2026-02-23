"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface KeywordData {
  id: number;
  dimension: string;
  impressions: { value: number; trend: "up" | "down" };
  clicks: { value: number; trend: "up" | "down" };
}

const ClicksImpressionsByKeywords: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>(
    "Oct 01 - Oct 31, 2024"
  );

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items to display per page

  // Fetching data
  useEffect(() => {
    const fetchData = () => {
      const data: KeywordData[] = [
        {
          id: 1,
          dimension: "data metrics",
          impressions: { value: 949, trend: "up" },
          clicks: { value: 656, trend: "down" },
        },
        {
          id: 2,
          dimension: "sales metrics",
          impressions: { value: 842, trend: "down" },
          clicks: { value: 420, trend: "up" },
        },
        {
          id: 3,
          dimension: "analytics dashboard",
          impressions: { value: 640, trend: "up" },
          clicks: { value: 534, trend: "down" },
        },
        {
          id: 4,
          dimension: "saas metrics",
          impressions: { value: 865, trend: "up" },
          clicks: { value: 560, trend: "down" },
        },
        {
          id: 5,
          dimension: "hubspot analytics",
          impressions: { value: 535, trend: "down" },
          clicks: { value: 328, trend: "up" },
        },
        {
          id: 6,
          dimension: "smart goals",
          impressions: { value: 756, trend: "up" },
          clicks: { value: 235, trend: "down" },
        },
        {
          id: 7,
          dimension: "google analytics",
          impressions: { value: 578, trend: "up" },
          clicks: { value: 456, trend: "down" },
        },
        {
          id: 8,
          dimension: "trezo dashboard",
          impressions: { value: 660, trend: "up" },
          clicks: { value: 478, trend: "down" },
        },
        {
          id: 9,
          dimension: "social analytics",
          impressions: { value: 720, trend: "up" },
          clicks: { value: 512, trend: "up" },
        },
        {
          id: 10,
          dimension: "campaign tracker",
          impressions: { value: 615, trend: "down" },
          clicks: { value: 290, trend: "down" },
        },
        {
          id: 11,
          dimension: "saas metrics",
          impressions: { value: 865, trend: "up" },
          clicks: { value: 560, trend: "down" },
        },
        {
          id: 12,
          dimension: "analytics dashboard",
          impressions: { value: 640, trend: "up" },
          clicks: { value: 534, trend: "down" },
        },
        {
          id: 13,
          dimension: "data metrics",
          impressions: { value: 949, trend: "up" },
          clicks: { value: 656, trend: "down" },
        },
        {
          id: 14,
          dimension: "smart goals",
          impressions: { value: 756, trend: "up" },
          clicks: { value: 235, trend: "down" },
        },
        {
          id: 15,
          dimension: "sales metrics",
          impressions: { value: 842, trend: "down" },
          clicks: { value: 420, trend: "up" },
        },
        {
          id: 16,
          dimension: "hubspot analytics",
          impressions: { value: 535, trend: "down" },
          clicks: { value: 328, trend: "up" },
        },
      ];
      setKeywordData(data);
    };

    fetchData();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(keywordData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return keywordData.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Clicks/Impressions by Keywords</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {[
                  "Sep 01 - Sep 30, 2024",
                  "Aug 01 - Aug 31, 2024",
                  "Jul 01 - Jul 31, 2024",
                ].map((option) => (
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
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    #
                  </th>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Dimension
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Impressions
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {getCurrentPageData().map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {item.id}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {item.dimension}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="inline-block relative ltr:pl-[28px] rtl:pr-[28px]">
                        <i
                          className={`material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 ${
                            item.impressions.trend === "up"
                              ? "text-success-600"
                              : "text-danger-500"
                          } top-1/2 -translate-y-1/2`}
                        >
                          {item.impressions.trend === "up"
                            ? "trending_up"
                            : "trending_down"}
                        </i>
                        {item.impressions.value}
                      </span>
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="inline-block relative ltr:pl-[28px] rtl:pr-[28px]">
                        <i
                          className={`material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 ${
                            item.clicks.trend === "up"
                              ? "text-success-600"
                              : "text-danger-500"
                          } top-1/2 -translate-y-1/2`}
                        >
                          {item.clicks.trend === "up"
                            ? "trending_up"
                            : "trending_down"}
                        </i>
                        {item.clicks.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[9px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {getCurrentPageData().length} of {keywordData.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border hover:bg-primary-500 hover:text-white hover:border-primary-500 dark:border-[#172036] ${
                      currentPage === i + 1
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default ClicksImpressionsByKeywords;
