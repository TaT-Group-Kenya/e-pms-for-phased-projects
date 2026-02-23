"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface Ticket {
  id: string;
  title: string;
  viewLink: string;
  requester: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Finished" | "Cancelled";
}

const AllTickets: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Table
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Number of items per page

  useEffect(() => {
    // Simulate an API call (replace this with an actual API call)
    setTimeout(() => {
      setTickets([
        {
          id: "#JAN-854",
          title: "Network Infrastructure",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Walter Frazier",
          assignedTo: "Oliver Clark",
          createdDate: "20 Apr 2024",
          dueDate: "30 Apr 2024",
          priority: "High",
          status: "Finished",
        },
        {
          id: "#JAN-853",
          title: "Cloud Migration",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Kimberly Anderson",
          assignedTo: "Ethan Baker",
          createdDate: "21 Apr 2024",
          dueDate: "25 Apr 2024",
          priority: "Low",
          status: "Pending",
        },
        {
          id: "#DEC-852",
          title: "Website Revamp",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Roscoe Guerrero",
          assignedTo: "Sophia Carter",
          createdDate: "17 Apr 2024",
          dueDate: "20 Apr 2024",
          priority: "Medium",
          status: "In Progress",
        },
        {
          id: "#DEC-851",
          title: "Mobile Application",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Robert Stewart",
          assignedTo: "Ava Cooper",
          createdDate: "10 Apr 2024",
          dueDate: "15 Apr 2024",
          priority: "High",
          status: "Finished",
        },
        {
          id: "#DEC-850",
          title: "System Deployment",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Dustin Fritch",
          assignedTo: "Isabella Evans",
          createdDate: "05 Apr 2024",
          dueDate: "10 Apr 2024",
          priority: "Low",
          status: "Cancelled",
        },
        {
          id: "#FEB-849",
          title: "Server Maintenance",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Liam Johnson",
          assignedTo: "Ethan Wright",
          createdDate: "22 Feb 2024",
          dueDate: "28 Feb 2024",
          priority: "High",
          status: "Pending",
        },
        {
          id: "#FEB-848",
          title: "Database Optimization",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Noah Peterson",
          assignedTo: "Benjamin Carter",
          createdDate: "19 Feb 2024",
          dueDate: "24 Feb 2024",
          priority: "Medium",
          status: "In Progress",
        },
        {
          id: "#MAR-847",
          title: "Email System Migration",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Emma Davis",
          assignedTo: "Sophia Hall",
          createdDate: "10 Mar 2024",
          dueDate: "15 Mar 2024",
          priority: "Low",
          status: "Finished",
        },
        {
          id: "#MAR-846",
          title: "Firewall Configuration",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Olivia Brown",
          assignedTo: "Daniel Evans",
          createdDate: "05 Mar 2024",
          dueDate: "10 Mar 2024",
          priority: "High",
          status: "Pending",
        },
        {
          id: "#APR-845",
          title: "API Security Testing",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Mason Wilson",
          assignedTo: "Ava Turner",
          createdDate: "01 Apr 2024",
          dueDate: "07 Apr 2024",
          priority: "Medium",
          status: "In Progress",
        },
        {
          id: "#APR-844",
          title: "Website Load Testing",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Lucas Miller",
          assignedTo: "Olivia Clark",
          createdDate: "15 Apr 2024",
          dueDate: "20 Apr 2024",
          priority: "Low",
          status: "Finished",
        },
        {
          id: "#MAY-843",
          title: "ERP System Upgrade",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Isabella Martinez",
          assignedTo: "Jack Thompson",
          createdDate: "10 May 2024",
          dueDate: "18 May 2024",
          priority: "High",
          status: "Pending",
        },
        {
          id: "#MAY-842",
          title: "Mobile App Testing",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Ethan Robinson",
          assignedTo: "Lily Parker",
          createdDate: "12 May 2024",
          dueDate: "17 May 2024",
          priority: "Medium",
          status: "In Progress",
        },
        {
          id: "#JUN-841",
          title: "E-commerce Platform Scaling",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Charlotte Brooks",
          assignedTo: "Isaac Phillips",
          createdDate: "05 Jun 2024",
          dueDate: "12 Jun 2024",
          priority: "Low",
          status: "Finished",
        },
        {
          id: "#JUN-840",
          title: "Cloud Cost Optimization",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Alexander Harris",
          assignedTo: "Henry Mitchell",
          createdDate: "08 Jun 2024",
          dueDate: "14 Jun 2024",
          priority: "High",
          status: "Pending",
        },
        {
          id: "#JUL-839",
          title: "Cybersecurity Audit",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Emily Rivera",
          assignedTo: "Grace Foster",
          createdDate: "22 Jul 2024",
          dueDate: "28 Jul 2024",
          priority: "Medium",
          status: "In Progress",
        },
        {
          id: "#JUL-838",
          title: "AI Chatbot Implementation",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Owen Bennett",
          assignedTo: "Elijah Murphy",
          createdDate: "19 Jul 2024",
          dueDate: "25 Jul 2024",
          priority: "Low",
          status: "Finished",
        },
        {
          id: "#AUG-837",
          title: "Data Backup and Recovery",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Scarlett Henderson",
          assignedTo: "Natalie Hughes",
          createdDate: "10 Aug 2024",
          dueDate: "18 Aug 2024",
          priority: "High",
          status: "Pending",
        },
        {
          id: "#AUG-836",
          title: "CRM System Integration",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Jacob Simmons",
          assignedTo: "Sophia Hall",
          createdDate: "12 Aug 2024",
          dueDate: "20 Aug 2024",
          priority: "Medium",
          status: "In Progress",
        },
        {
          id: "#SEP-835",
          title: "Blockchain Implementation",
          viewLink: "/helpdesk/ticket-details/",
          requester: "Lucas Morgan",
          assignedTo: "Mia Adams",
          createdDate: "05 Sep 2024",
          dueDate: "15 Sep 2024",
          priority: "Low",
          status: "Finished",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate the current tickets to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(tickets.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">All Tickets</h5>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Ticket
              </span>
            </button>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Loading tickets...
              </p>
            ) : (
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      ID
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Ticket Title
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Requester
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Assigned To
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Created Date
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Due Date
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Priority
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Status
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {currentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {ticket.id}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <Link
                          href={ticket.viewLink}
                          className="font-medium text-gray-500 dark:text-gray-400 transition-all hover:text-primary-500"
                        >
                          {ticket.title}
                        </Link>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {ticket.requester}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {ticket.assignedTo}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {ticket.createdDate}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {ticket.dueDate}
                      </td>

                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {ticket.priority}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <span
                          className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${
                            ticket.status === "Finished"
                              ? "bg-primary-50 text-primary-500"
                              : ticket.status === "Pending"
                              ? "bg-warning-50 text-warning-500"
                              : ticket.status === "In Progress"
                              ? "bg-success-50 text-success-500"
                              : "bg-danger-50 text-danger-500"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
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
            )}
          </div>

          <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, tickets.length)} of {tickets.length}{" "}
              results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px]">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from(
                { length: Math.ceil(tickets.length / itemsPerPage) },
                (_, i) => (
                  <li key={i + 1} className="inline-block mx-[2px]">
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                        currentPage === i + 1
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}

              <li className="inline-block mx-[2px]">
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(tickets.length / itemsPerPage)
                  }
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

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[550px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0">Add New Ticket</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content">
                  <form>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Title
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. Network Infrastructure"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Requester
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. Olivia Smith"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Assigned To
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Shawn Kennedy</option>
                          <option value="2">Roberto Cruz</option>
                          <option value="3">Juli Johnson</option>
                          <option value="4">Catalina Engles</option>
                          <option value="5">Louis Nagle</option>
                          <option value="6">Michael Marquez</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Due Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Priority
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">High</option>
                          <option value="2">Medium</option>
                          <option value="3">Low</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">In Progress</option>
                          <option value="2">Pending</option>
                          <option value="3">Completed</option>
                          <option value="4">Not Started</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-[20px] md:mt-[25px] ltr:text-right rtl:text-left">
                      <button
                        type="button"
                        className="rounded-md inline-block transition-all font-medium ltr:mr-[15px] rtl:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400"
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            add
                          </i>
                          Create
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AllTickets;
