"use client";

import React, { useEffect, useState } from "react";
import TotalProjects from "./TotalProjects";
import ActiveProjects from "./ActiveProjects";
import FinishedProjects from "./FinishedProjects";
import DeletedProjects from "./DeletedProjects";
import { useAppSelector } from "../../../store/hooks";
import { useToast } from "../../../hooks/useToast";
import { useDashboardFilters } from "../DashboardFiltersContext";

type CountWithDelta = {
  current: number;
  previous: number | null;
  delta_percentage: number | null;
};

type ProjectsOverviewResponse = {
  total_projects: CountWithDelta;
  active_projects: CountWithDelta;
  finished_projects: CountWithDelta;
  deleted_projects: CountWithDelta;
};

const ProjectsOverview: React.FC = () => {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();
  const [data, setData] = useState<ProjectsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { range, selectedOption } = useDashboardFilters();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      if (!accessToken) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard/projects-overview?range=${encodeURIComponent(range)}`,
          {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        }
        );

        if (controller.signal.aborted) return;

        if (!response.ok) {
          addToast("Failed to load projects overview", "error");
          return;
        }

        const body = await response.json();
        setData(body?.data ?? body);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading projects overview", error);
        addToast("Error loading projects overview", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [accessToken, addToast, range]);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Projects Overview</h5>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Filtered by: {selectedOption.label}
            </p>
          </div>
        </div>

        <div className="trezo-card-content flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
            <div>
              <TotalProjects value={data?.total_projects} />
            </div>

            <div>
              <ActiveProjects value={data?.active_projects} />
            </div>

            <div>
              <FinishedProjects value={data?.finished_projects} />
            </div>

            <div>
              <DeletedProjects value={data?.deleted_projects} />
            </div>
          </div>
          {loading && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Loading overview...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsOverview;
