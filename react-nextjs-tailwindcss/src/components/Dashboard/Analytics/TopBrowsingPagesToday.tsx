"use client";

import React, { useState, useEffect } from "react";

interface PageData {
  id: number;
  url: string;
  source: string;
  avgTime: string;
  pageViews: number;
  bounceRate: string;
}

const TopBrowsingPagesToday: React.FC = () => {
  const [pageData, setPageData] = useState<PageData[]>([]);
  const [filteredData, setFilteredData] = useState<PageData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of rows per page

  // Simulate fetching data
  useEffect(() => {
    const fetchData = () => {
      const data: PageData[] = [
        {
          id: 1,
          url: "/dashboard-overview",
          source: "Organic",
          avgTime: "3m 45s",
          pageViews: 350,
          bounceRate: "30.5%",
        },
        {
          id: 2,
          url: "/custom-reports/generate",
          source: "Paid",
          avgTime: "7m 00s",
          pageViews: 400,
          bounceRate: "24.9%",
        },
        {
          id: 3,
          url: "/export-data",
          source: "Direct",
          avgTime: "2m 30s",
          pageViews: 125,
          bounceRate: "50.0%",
        },
        {
          id: 4,
          url: "/realtime-users",
          source: "Referral",
          avgTime: "3m 00s",
          pageViews: 190,
          bounceRate: "40.2%",
        },
        {
          id: 5,
          url: "/account-preferences",
          source: "Organic",
          avgTime: "2m 50s",
          pageViews: 180,
          bounceRate: "42.1%",
        },
        {
          id: 6,
          url: "/apis-and-reports",
          source: "Paid",
          avgTime: "4m 15s",
          pageViews: 320,
          bounceRate: "28.7%",
        },
        {
          id: 7,
          url: "/analytics-dashboard",
          source: "Organic",
          avgTime: "5m 10s",
          pageViews: 250,
          bounceRate: "33.0%",
        },
        {
          id: 8,
          url: "/settings",
          source: "Referral",
          avgTime: "3m 20s",
          pageViews: 150,
          bounceRate: "38.2%",
        },
        {
          id: 9,
          url: "/user-profile",
          source: "Direct",
          avgTime: "4m 45s",
          pageViews: 275,
          bounceRate: "29.0%",
        },
        {
          id: 10,
          url: "/export-data",
          source: "Direct",
          avgTime: "2m 30s",
          pageViews: 125,
          bounceRate: "50.0%",
        },
        {
          id: 11,
          url: "/custom-reports/generate",
          source: "Paid",
          avgTime: "7m 00s",
          pageViews: 400,
          bounceRate: "24.9%",
        },
        {
          id: 12,
          url: "/dashboard-overview",
          source: "Organic",
          avgTime: "3m 45s",
          pageViews: 350,
          bounceRate: "30.5%",
        },
      ];
      setPageData(data);
      setFilteredData(data);
    };

    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = pageData.filter(
      (item) =>
        item.url.toLowerCase().includes(value) ||
        item.source.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page on search
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Top Browsing Pages Today</h5>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here....."
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Page URL
                  </th>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Source
                  </th>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Avg Time
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Page Views
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Bounce Rate (%)
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {getCurrentPageData().map((item) => (
                  <tr key={item.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[9px] border-b border-gray-100 dark:border-[#172036]">
                      <a
                        href={item.url}
                        className="inline-block text-secondary-500 transition-all hover:text-secondary-400"
                        target="_blank"
                      >
                        {item.url}
                      </a>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[9px] border-b border-gray-100 dark:border-[#172036]">
                      {item.source}
                    </td>

                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[9px] border-b border-gray-100 dark:border-[#172036]">
                      {item.avgTime}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[9px] border-b border-gray-100 dark:border-[#172036]">
                      {item.pageViews}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[9px] border-b border-gray-100 dark:border-[#172036]">
                      {item.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-[10px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {getCurrentPageData().length} of {pageData.length} results
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

export default TopBrowsingPagesToday;
