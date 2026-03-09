"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SeriesItem = {
  name: string;
  data: number[];
};

type ProgressOverviewResponse = {
  categories: string[];
  series: SeriesItem[];
};

const ProjectsProgress: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [isChartLoaded, setChartLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

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
        const response = await fetch(
          `/api/dashboard/projects-progress-overview?range=${encodeURIComponent(
            range
          )}`,
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
          addToast("Failed to load projects progress", "error");
          setCategories([]);
          setSeries([]);
          return;
        }

        const body: ProgressOverviewResponse | { data: ProgressOverviewResponse } =
          await response.json();
        const payload = (body as any).data ?? body;

        setCategories(payload.categories || []);
        setSeries(payload.series || []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading projects progress", error);
        addToast("Error loading projects progress", "error");
        setCategories([]);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [accessToken, addToast, range]);

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#605DFF", "#FE7A36", "#AD63F6", "#D71C00"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      shape: ["circle", "square", "circle", "square"],
      hover: {
        size: 5,
      },
    },
    xaxis: {
      categories,
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
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
      tickAmount: 5,
      max: 100,
      min: 0,
      labels: {
        formatter: (val) => {
          return val + "%";
        },
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "12px",
      horizontalAlign: "left",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "circle",
      },
    },
  };

  const hasData = series.some((s) => s.data.some((value) => value > 0));

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Projects Progress</h5>
          </div>
        </div>

        <div className="trezo-card-content flex-1 overflow-y-auto">
          <div className="mt-[8px] -mb-[20px] ltr:-ml-[13px] rtl:-mr-[13px]">
            {isChartLoaded && hasData && (
              <Chart
                options={options}
                series={series}
                type="line"
                height={322}
                width={"100%"}
              />
            )}
            {isChartLoaded && !loading && !hasData && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                No projects found for the selected period.
              </p>
            )}
            {loading && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Loading projects progress...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsProgress;
