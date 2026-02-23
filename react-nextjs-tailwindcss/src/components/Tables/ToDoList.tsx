"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

type Task = {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  priority: string;
  status: string;
  statusClass: string; // For styling status badge
};

const initialTasks: Task[] = [
  {
    id: 850,
    title: "Network Infrastructure",
    assignee: "Oliver Clark",
    dueDate: "30 Apr 2024",
    priority: "High",
    status: "Finished",
    statusClass: "bg-primary-50 text-primary-500",
  },
  {
    id: 851,
    title: "Cloud Migration",
    assignee: "Ethan Baker",
    dueDate: "25 Apr 2024",
    priority: "Low",
    status: "Pending",
    statusClass: "bg-warning-50 text-warning-500",
  },
  {
    id: 852,
    title: "Website Revamp",
    assignee: "Sophia Carter",
    dueDate: "20 Apr 2024",
    priority: "Medium",
    status: "In Progress",
    statusClass: "bg-success-50 text-success-500",
  },
  {
    id: 853,
    title: "Mobile Application",
    assignee: "Ava Cooper",
    dueDate: "15 Apr 2024",
    priority: "High",
    status: "Finished",
    statusClass: "bg-primary-50 text-primary-500",
  },
  {
    id: 854,
    title: "System Deployment",
    assignee: "Isabella Evans",
    dueDate: "10 Apr 2024",
    priority: "Low",
    status: "Cancelled",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 855,
    title: "System Deployment",
    assignee: "Isabella Evans",
    dueDate: "10 Apr 2024",
    priority: "Low",
    status: "Cancelled",
    statusClass: "bg-danger-50 text-danger-500",
  },
  {
    id: 856,
    title: "Website Revamp",
    assignee: "Sophia Carter",
    dueDate: "20 Apr 2024",
    priority: "Medium",
    status: "In Progress",
    statusClass: "bg-success-50 text-success-500",
  },
  {
    id: 857,
    title: "Cloud Migration",
    assignee: "Ethan Baker",
    dueDate: "25 Apr 2024",
    priority: "Low",
    status: "Pending",
    statusClass: "bg-warning-50 text-warning-500",
  },
  {
    id: 858,
    title: "Mobile Application",
    assignee: "Ava Cooper",
    dueDate: "15 Apr 2024",
    priority: "High",
    status: "Finished",
    statusClass: "bg-primary-50 text-primary-500",
  },
  {
    id: 859,
    title: "Network Infrastructure",
    assignee: "Oliver Clark",
    dueDate: "30 Apr 2024",
    priority: "High",
    status: "Finished",
    statusClass: "bg-primary-50 text-primary-500",
  },
];

const ITEMS_PER_PAGE = 6;

const ToDoList: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectTask = (id: number) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === displayedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(displayedTasks.map((task) => task.id));
    }
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if ((tasks.length - 1) % ITEMS_PER_PAGE === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">To Do List</h5>
          </div>

          <div className="sm:flex items-center gap-3">
            <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
              <form className="relative sm:w-[265px]">
                <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                  <i className="material-symbols-outlined !text-[20px]">
                    search
                  </i>
                </label>
                <input
                  type="text"
                  placeholder="Search here....."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                />
              </form>
            </div>

            <div className="mt-[15px] sm:mt-0">
              <button
                type="button"
                className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                onClick={() => setOpen(true)}
              >
                <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                    add
                  </i>
                  Add New Task
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    <div className="form-check relative top-[2px]">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={handleSelectAll}
                        checked={
                          displayedTasks.length > 0 &&
                          selectedTasks.length === displayedTasks.length
                        }
                      />
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    ID
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Task Title
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Assigned To
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Due Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Priority
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              
              <tbody className="text-black dark:text-white">
                {displayedTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="form-check relative top-[2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                        />
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        #{task.id}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="block font-medium text-gray-500 dark:text-gray-400">
                        {task.title}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {task.assignee}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {task.dueDate}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {task.priority}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${task.statusClass}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center gap-[9px]">
                        <div className="relative group">
                          <button
                            type="button"
                            className="text-primary-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-gray-500 leading-none"
                          >
                            <i className="material-symbols-outlined !text-md">
                              edit
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            type="button"
                            className="text-danger-500 leading-none"
                            onClick={() => handleDelete(task.id)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>

                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {displayedTasks.length} of {tasks.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0 space-x-1">
              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li className="inline-block" key={index}>
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border dark:border-[#172036] ${
                      currentPage === index + 1
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Add New Task Modal */}
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
                    <h5 className="!mb-0">Add New Task</h5>
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
                          Task Title
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Task title"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Assigned To
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
                          <option>Select</option>
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option>Select</option>
                          <option>In Progress</option>
                          <option>Pending</option>
                          <option>Completed</option>
                          <option>Not Started</option>
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

export default ToDoList;
