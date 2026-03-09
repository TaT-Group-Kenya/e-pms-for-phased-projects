"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";

type LatestProject = {
  id: number;
  code: string | null;
  name: string;
  customer_name: string | null;
  budget_estimate: number | null;
  currency: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
};

const ITEMS_PER_PAGE = 5;

const mapStatusToClass = (status: string | null | undefined): string => {
  if (!status) return "bg-primary-50 text-primary-500";
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) {
    return "bg-danger-50 text-danger-500";
  }
  if (normalized.includes("draft")) {
    return "bg-purple-50 text-purple-500";
  }
  if (normalized.includes("progress") || normalized.includes("active")) {
    return "bg-warning-50 text-warning-500";
  }
  if (normalized.includes("finish") || normalized.includes("complete")) {
    return "bg-success-50 text-success-500";
  }
  return "bg-primary-50 text-primary-500";
};

const AllProjects: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("This Week");
  const [projects, setProjects] = useState<LatestProject[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "/api/dashboard/latest-projects",
          window.location.origin
        );
        url.searchParams.set("limit", "20");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!response.ok) {
          addToast("Failed to load projects", "error");
          setProjects([]);
          return;
        }

        const body = await response.json();
        const payload: LatestProject[] = (body?.data ?? body) || [];
        setProjects(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading latest projects", error);
        addToast("Error loading projects", "error");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchProjects();

    return () => controller.abort();
  }, [accessToken, addToast]);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE) || 1;

  const displayedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            <h5 className="!mb-0">All Projects</h5>
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

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "Code",
                    "Project Name",
                    "Customer",
                    "Assignees",
                    "Budget",
                    "Start Date",
                    "End Date",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {displayedProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.code || "-"}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <Link
                        href="#"
                        className="inline-block font-medium transition-all text-gray-500 dark:text-gray-400 hover:text-primary-500"
                      >
                        {project.name}
                      </Link>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {project.customer_name || "-"}
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <span className="text-gray-500 dark:text-gray-400">
                          -
                        </span>
                      </div>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.budget_estimate != null
                          ? `${project.currency ?? ""} ${project.budget_estimate.toLocaleString()}`
                          : "-"}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.start_date || "-"}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {project.end_date || "-"}
                      </span>
                    </td>

                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span
                        className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${mapStatusToClass(
                          project.status
                        )}`}
                      >
                        {project.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center px-[20px] py-[15px] text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#172036]"
                    >
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {displayedProjects.length} of {projects.length} results
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
        {loading && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Loading projects...
          </p>
        )}
      </div>
    </>
  );
};

export default AllProjects;
