"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";

const KanbanBoard: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  const todoCards = [
    {
      id: "1",
      title: "Project Requirements",
      description:
        "A brief description of the project, its objectives, and its importance to the organization.",
      users: [
        "/images/users/user6.jpg",
        "/images/users/user7.jpg",
        "/images/users/user8.jpg",
      ],
      daysLeft: 5,
      bgColor: "bg-purple-100",
    },
    {
      id: "2",
      title: "Design Phase",
      description:
        "Work on the initial design mockups and gather feedback from stakeholders.",
      users: ["/images/users/user9.jpg", "/images/users/user10.jpg"],
      daysLeft: 8,
      bgColor: "bg-secondary-100",
    },
    {
      id: "3",
      title: "Development Sprint",
      description:
        "Begin coding the application, starting with the core functionalities.",
      users: ["/images/users/user6.jpg", "/images/users/user11.jpg"],
      daysLeft: 12,
      bgColor: "bg-success-100",
    },
    {
      id: "4",
      title: "Testing and QA",
      description:
        "Test the application for bugs, performance issues, and usability concerns.",
      users: [
        "/images/users/user8.jpg",
        "/images/users/user12.jpg",
        "/images/users/user13.jpg",
      ],
      daysLeft: 7,
      bgColor: "bg-orange-100",
    },
    {
      id: "5",
      title: "Documentation",
      description:
        "Prepare user manuals, developer guides, and API documentation.",
      users: ["/images/users/user10.jpg", "/images/users/user9.jpg"],
      daysLeft: 3,
      bgColor: "bg-primary-100",
    },
  ];

  const doingCards = [
    {
      id: "1",
      title: "React Template",
      description:
        "A brief description of the project, its objectives, and its importance to the organization.",
      users: ["/images/users/user18.jpg", "/images/users/user19.jpg"],
      daysLeft: 5,
      bgColor: "bg-orange-100",
    },
    {
      id: "2",
      title: "API Integration",
      description:
        "Connect the frontend application with the backend APIs to ensure seamless data flow.",
      users: ["/images/users/user20.jpg", "/images/users/user21.jpg"],
      daysLeft: 3,
      bgColor: "bg-purple-100",
    },
    {
      id: "3",
      title: "UI Improvements",
      description:
        "Enhance the user interface based on feedback to improve user experience.",
      users: ["/images/users/user22.jpg"],
      daysLeft: 7,
      bgColor: "bg-danger-100",
    },
    {
      id: "4",
      title: "Bug Fixing",
      description:
        "Identify and resolve bugs discovered during the testing phase to ensure a stable release.",
      users: ["/images/users/user23.jpg", "/images/users/user24.jpg"],
      daysLeft: 2,
      bgColor: "bg-success-100",
    },
  ];

  const doneCards = [
    {
      id: "1",
      title: "Admin Template",
      description:
        "A brief description of the project, its objectives, and its importance to the organization.",
      users: [
        "/images/users/user26.jpg",
        "/images/users/user27.jpg",
        "/images/users/user28.jpg",
      ],
      daysLeft: 5,
      bgColor: "bg-primary-100",
    },
    {
      id: "2",
      title: "Performance Optimization",
      description:
        "Optimized the application for faster load times and reduced server response latency.",
      users: ["/images/users/user29.jpg", "/images/users/user30.jpg"],
      daysLeft: 2,
      bgColor: "bg-purple-100",
    },
    {
      id: "3",
      title: "Testing & QA",
      description:
        "Conducted thorough testing to identify and resolve any issues before deployment.",
      users: ["/images/users/user31.jpg", "/images/users/user32.jpg"],
      daysLeft: 0, // Indicates the task is completed.
      bgColor: "bg-success-100",
    },
  ];

  return (
    <>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
        {/* To Do */}
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">To Do</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              {todoCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} dark:bg-[#15203c] rounded-md mb-[20px] md:mb-[25px] p-[20px] md:p-[25px]`}
                >
                  <div className="flex justify-between items-center mb-[8px] md:mb-[12px]">
                    <span className="text-black dark:text-white block font-semibold">
                      {card.title}
                    </span>
                    <button
                      type="button"
                      className="inline-block transition-all text-black dark:text-white hover:text-primary-500"
                    >
                      <i className="material-symbols-outlined !text-lg">edit</i>
                    </button>
                  </div>
                  <p>{card.description}</p>
                  <div className="flex items-center justify-between md:mt-[20px]">
                    <div className="flex items-center">
                      {card.users.map((user, index) => (
                        <Image
                          key={index}
                          alt="user-image"
                          className="rounded-full w-[34px] h-[34px] border-[2px] border-white dark:border-[#0c1427] ltr:-mr-[10px] rtl:-ml-[10px] ltr:last:mr-0 rtl:last:ml-0"
                          src={user}
                          width={34}
                          height={34}
                        />
                      ))}
                    </div>
                    <span className="block text-secondary-500">
                      {card.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                onClick={() => setOpen(true)}
              >
                <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                    add
                  </i>
                  Add New Card
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Doing */}
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Doing</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              {doingCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} dark:bg-[#15203c] rounded-md mb-[20px] md:mb-[25px] p-[20px] md:p-[25px]`}
                >
                  <div className="flex justify-between items-center mb-[8px] md:mb-[12px]">
                    <span className="text-black dark:text-white block font-semibold">
                      {card.title}
                    </span>
                    <button
                      type="button"
                      className="inline-block transition-all text-black dark:text-white hover:text-primary-500"
                    >
                      <i className="material-symbols-outlined !text-lg">edit</i>
                    </button>
                  </div>
                  <p>{card.description}</p>
                  <div className="flex items-center justify-between md:mt-[20px]">
                    <div className="flex items-center">
                      {card.users.map((user, index) => (
                        <Image
                          key={index}
                          alt="user-image"
                          className="rounded-full w-[34px] h-[34px] border-[2px] border-white dark:border-[#0c1427] ltr:-mr-[10px] rtl:-ml-[10px] ltr:last:mr-0 rtl:last:ml-0"
                          src={user}
                          width={34}
                          height={34}
                        />
                      ))}
                    </div>
                    <span className="block text-secondary-500">
                      {card.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                onClick={() => setOpen(true)}
              >
                <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                    add
                  </i>
                  Add New Card
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Done */}
        <div>
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Done</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              {doneCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} dark:bg-[#15203c] rounded-md mb-[20px] md:mb-[25px] p-[20px] md:p-[25px]`}
                >
                  <div className="flex justify-between items-center mb-[8px] md:mb-[12px]">
                    <span className="text-black dark:text-white block font-semibold">
                      {card.title}
                    </span>
                    <button
                      type="button"
                      className="inline-block transition-all text-black dark:text-white hover:text-primary-500"
                    >
                      <i className="material-symbols-outlined !text-lg">edit</i>
                    </button>
                  </div>
                  <p>{card.description}</p>
                  <div className="flex items-center justify-between md:mt-[20px]">
                    <div className="flex items-center">
                      {card.users.map((user, index) => (
                        <Image
                          key={index}
                          alt="user-image"
                          className="rounded-full w-[34px] h-[34px] border-[2px] border-white dark:border-[#0c1427] ltr:-mr-[10px] rtl:-ml-[10px] ltr:last:mr-0 rtl:last:ml-0"
                          src={user}
                          width={34}
                          height={34}
                        />
                      ))}
                    </div>
                    <span className="block text-secondary-500">
                      {card.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                onClick={() => setOpen(true)}
              >
                <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                    add
                  </i>
                  Add New Card
                </span>
              </button>
            </div>
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
                    <h5 className="!mb-0">Add New Card</h5>
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
                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Card Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. Trezo Dashboard"
                        />
                      </div>

                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Card Description
                        </label>
                        <textarea
                          className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="It makes me feel..."
                        ></textarea>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Team Members
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option>Select</option>
                          <option>Shawn Kennedy</option>
                          <option>Roberto Cruz</option>
                          <option>Juli Johnson</option>
                          <option>Catalina Engles</option>
                          <option>Louis Nagle</option>
                          <option>Michael Marquez</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Deadline Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
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

export default KanbanBoard;
