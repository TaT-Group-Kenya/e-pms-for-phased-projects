"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";

type RecentUpdate = {
  id: number;
  project_id?: number | null;
  project_name: string;
  phase_name?: string | null;
  comment?: string | null;
  percentage_complete?: number | null;
  updated_at: string;
};

const ITEMS_PER_PAGE = 4;

const MyTasks: React.FC = () => {
  const [updates, setUpdates] = useState<RecentUpdate[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchUpdates = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "/api/dashboard/recent-progress-updates",
          window.location.origin
        );
        url.searchParams.set("limit", "10");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!response.ok) {
          addToast("Failed to load recent updates", "error");
          setUpdates([]);
          return;
        }

        const body = await response.json();
        const payload: RecentUpdate[] = (body?.data ?? body) || [];
        setUpdates(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading recent updates", error);
        addToast("Error loading recent updates", "error");
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchUpdates();

    return () => controller.abort();
  }, [accessToken, addToast]);

  const totalPages = Math.ceil(updates.length / ITEMS_PER_PAGE) || 1;

  const displayedUpdates = updates.slice(
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
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Updates</h5>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px] flex-1 overflow-y-auto">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Project
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Phase
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Comment
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Progress
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {displayedUpdates.map((update) => (
                  <tr key={update.id}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {update.project_name}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {update.phase_name || "-"}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] max-w-[220px] truncate">
                      {update.comment || "-"}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      {typeof update.percentage_complete === "number"
                        ? `${update.percentage_complete}%`
                        : "-"}
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-500 dark:text-gray-400">
                        {update.updated_at}
                      </span>
                    </td>
                  </tr>
                ))}
                {updates.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center px-[20px] py-[15px] text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#172036]"
                    >
                      No recent updates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-sm">
              Showing {displayedUpdates.length} of {updates.length} results
            </p>

            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
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

              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  key={i}
                >
                  <button
                    className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] ${
                      currentPage === i + 1
                        ? "bg-primary-500 text-white"
                        : "hover:bg-primary-500 hover:text-white"
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
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
            Loading recent updates...
          </p>
        )}
      </div>
    </>
  );
};

export default MyTasks;
