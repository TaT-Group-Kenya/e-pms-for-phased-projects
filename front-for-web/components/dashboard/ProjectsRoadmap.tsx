"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type RoadmapItem = {
  id: number;
  name: string;
  progress: number;
};

const ProjectsRoadmap: React.FC = () => {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChartLoaded, setChartLoaded] = useState(false);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();
  const { range } = useDashboardFilters();

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/dashboard/projects-roadmap", window.location.origin);
        url.searchParams.set("range", range);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (!response.ok) {
          addToast("Failed to load projects roadmap", "error");
          setItems([]);
          return;
        }

        const body = await response.json();
        const data: RoadmapItem[] = (body?.data ?? body) || [];
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading projects roadmap", error);
        addToast("Error loading projects roadmap", "error");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  const series = [
    {
      name: "Projects",
      data: items.map((item) => item.progress ?? 0),
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#3584FC"],
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: items.map((item) => item.name ?? ""),
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Projects Roadmap</h5>
          </div>
        </div>

        <div className="trezo-card-content flex-1 overflow-y-auto">
          <div className="-mt-[26px] -mb-[25px] ltr:-ml-[10px] rtl:-mr-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={342}
                width={"100%"}
              />
            )}
            {loading && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Loading roadmap...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsRoadmap;
