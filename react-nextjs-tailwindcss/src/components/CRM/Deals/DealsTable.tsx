"use client";

import React, { useState } from "react";

interface Deal {
  id: string;
  companyName: string;
  contactPerson: string;
  amount: string;
  stage: string;
  probability: string;
  createdAt: string;
  closeDate: string;
}

const DealsTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "#854",
      companyName: "Tech Solutions",
      contactPerson: "Shawn Kennedy",
      amount: "$25,000.00",
      stage: "Proposal",
      probability: "80%",
      createdAt: "08 Nov 2024 10:30 AM",
      closeDate: "15 Nov 2024",
    },
    {
      id: "#853",
      companyName: "Acma Industries",
      contactPerson: "Roberto Cruz",
      amount: "$15,000.00",
      stage: "Presentation",
      probability: "50%",
      createdAt: "09 Nov 2024 02:15 PM",
      closeDate: "14 Nov 2024",
    },
    {
      id: "#852",
      companyName: "Synergy Ltd",
      contactPerson: "Juli Johnson",
      amount: "$30,000.00",
      stage: "Negotiation",
      probability: "75%",
      createdAt: "10 Nov 2024 09:45 AM",
      closeDate: "13 Nov 2024",
    },
    {
      id: "#851",
      companyName: "Tech Enterprises",
      contactPerson: "Catalina Engles",
      amount: "$20,000.00",
      stage: "Discovery",
      probability: "90%",
      createdAt: "11 Nov 2024 03:45 PM",
      closeDate: "12 Nov 2024",
    },
    {
      id: "#850",
      companyName: "Synetic Solutions",
      contactPerson: "Louis Nagle",
      amount: "$40,000.00",
      stage: "Contract Sent",
      probability: "60%",
      createdAt: "12 Nov 2024 01:00 PM",
      closeDate: "13 Nov 2024",
    },
    {
      id: "#849",
      companyName: "Fintech Ltd",
      contactPerson: "Sophia Brown",
      amount: "$22,500.00",
      stage: "Negotiation",
      probability: "70%",
      createdAt: "10 Nov 2024 05:30 PM",
      closeDate: "18 Nov 2024",
    },
    {
      id: "#848",
      companyName: "E-Commerce Hub",
      contactPerson: "Mia Adams",
      amount: "$19,800.00",
      stage: "Proposal",
      probability: "85%",
      createdAt: "14 Nov 2024 08:00 AM",
      closeDate: "20 Nov 2024",
    },
    {
      id: "#847",
      companyName: "AI Solutions",
      contactPerson: "Noah Lee",
      amount: "$29,000.00",
      stage: "Presentation",
      probability: "55%",
      createdAt: "15 Nov 2024 02:45 PM",
      closeDate: "22 Nov 2024",
    },
    {
      id: "#846",
      companyName: "Marketing Experts",
      contactPerson: "Liam King",
      amount: "$18,500.00",
      stage: "Negotiation",
      probability: "75%",
      createdAt: "16 Nov 2024 11:15 AM",
      closeDate: "25 Nov 2024",
    },
    {
      id: "#845",
      companyName: "Retail Inc.",
      contactPerson: "Emma Davis",
      amount: "$33,000.00",
      stage: "Contract Sent",
      probability: "65%",
      createdAt: "17 Nov 2024 04:30 PM",
      closeDate: "26 Nov 2024",
    },
    {
      id: "#844",
      companyName: "Cloud Innovations",
      contactPerson: "Ethan Carter",
      amount: "$27,000.00",
      stage: "Proposal",
      probability: "78%",
      createdAt: "18 Nov 2024 09:20 AM",
      closeDate: "27 Nov 2024",
    },
    {
      id: "#843",
      companyName: "Logistics Pro",
      contactPerson: "Olivia Martinez",
      amount: "$16,500.00",
      stage: "Negotiation",
      probability: "68%",
      createdAt: "19 Nov 2024 02:50 PM",
      closeDate: "28 Nov 2024",
    },
    {
      id: "#842",
      companyName: "SolarTech",
      contactPerson: "Mason White",
      amount: "$34,500.00",
      stage: "Presentation",
      probability: "72%",
      createdAt: "20 Nov 2024 11:10 AM",
      closeDate: "29 Nov 2024",
    },
    {
      id: "#841",
      companyName: "Green Solutions",
      contactPerson: "Sophia Green",
      amount: "$21,000.00",
      stage: "Contract Sent",
      probability: "55%",
      createdAt: "21 Nov 2024 01:30 PM",
      closeDate: "30 Nov 2024",
    },
    {
      id: "#840",
      companyName: "Blockchain Systems",
      contactPerson: "Daniel Scott",
      amount: "$45,000.00",
      stage: "Proposal",
      probability: "88%",
      createdAt: "22 Nov 2024 04:45 PM",
      closeDate: "01 Dec 2024",
    },
    {
      id: "#839",
      companyName: "Crypto Innovations",
      contactPerson: "Emma Johnson",
      amount: "$32,000.00",
      stage: "Presentation",
      probability: "61%",
      createdAt: "23 Nov 2024 06:30 AM",
      closeDate: "02 Dec 2024",
    },
    {
      id: "#838",
      companyName: "AI & Robotics",
      contactPerson: "James Wilson",
      amount: "$37,000.00",
      stage: "Negotiation",
      probability: "80%",
      createdAt: "24 Nov 2024 08:00 AM",
      closeDate: "03 Dec 2024",
    },
    {
      id: "#837",
      companyName: "FinTech Innovations",
      contactPerson: "Lucas Brown",
      amount: "$24,500.00",
      stage: "Contract Sent",
      probability: "70%",
      createdAt: "25 Nov 2024 05:15 PM",
      closeDate: "04 Dec 2024",
    },
    {
      id: "#836",
      companyName: "E-Learning Hub",
      contactPerson: "Ava Williams",
      amount: "$28,000.00",
      stage: "Proposal",
      probability: "82%",
      createdAt: "26 Nov 2024 10:45 AM",
      closeDate: "05 Dec 2024",
    },
    {
      id: "#835",
      companyName: "Healthcare AI",
      contactPerson: "Michael Thompson",
      amount: "$39,500.00",
      stage: "Presentation",
      probability: "77%",
      createdAt: "27 Nov 2024 12:30 PM",
      closeDate: "06 Dec 2024",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle search
  const filteredDeals = deals.filter((deal) =>
    Object.values(deal).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle pagination
  const indexOfLastDeal = currentPage * itemsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - itemsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);

  // Handle page change
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Handle delete deal
  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter((deal) => deal.id !== id));
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search deal here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              id="add-new-popup-toggle"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Deal
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    <div className="form-check relative top-[2px]">
                      <input type="checkbox" className="cursor-pointer" />
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Company Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Contact Person
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Amount
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Stage
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Probability
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Created At
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Close Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentDeals.length > 0 ? (
                  currentDeals.map((deal) => (
                    <tr key={deal.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="form-check relative top-[2px]">
                          <input type="checkbox" className="cursor-pointer" />
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {deal.id}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        {deal.companyName}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        {deal.contactPerson}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {deal.amount}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {deal.stage}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {deal.probability}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {deal.createdAt}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {deal.closeDate}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap p-[20px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
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
                            onClick={() => handleDeleteDeal(deal.id)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      No deals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {indexOfFirstDeal + 1} to {indexOfLastDeal} of{" "}
              {filteredDeals.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                >
                  <button
                    onClick={() => handlePageClick(index + 1)}
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                      currentPage === index + 1
                        ? "bg-primary-500 text-white border-primary-500"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

export default DealsTable;
