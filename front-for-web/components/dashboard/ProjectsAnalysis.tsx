"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ProjectsAnalysisSeries = {
  name: string;
  data: number[];
};

type ProjectsAnalysisData = {
  categories: string[];
  series: ProjectsAnalysisSeries[];
};

const ProjectsAnalysis: React.FC = () => {
  const [data, setData] = useState<ProjectsAnalysisData | null>(null);
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
        const url = new URL("/api/dashboard/projects-analysis", window.location.origin);
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
          addToast("Failed to load projects analysis", "error");
          setData(null);
          return;
        }

        const body = await response.json();
        const raw = (body && typeof body === "object" ? (body as any) : null) || null;
        const inner = (raw?.data ?? raw) as any;

        const payload: ProjectsAnalysisData | null = inner
          ? {
              categories:
                inner.categories ?? inner.data?.categories ?? inner.meta?.categories ?? [],
              series:
                inner.series ?? inner.data?.series ?? inner.meta?.series ?? [],
            }
          : null;

        setData(payload);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading projects analysis", error);
        addToast("Error loading projects analysis", "error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  const categories = data?.categories ?? [];

  const series = (data?.series && data.series.length > 0
    ? data.series
    : [
    { name: "Budgets", data: [] },
    { name: "Expenses", data: [] },
    { name: "Revenue", data: [] },
    ]
  ).map((s) => ({
    name: s.name,
    data: s.data.map((v) => {
      const num = typeof v === "number" ? v : Number(v);
      if (Number.isNaN(num)) return 0;
      return Number(num.toFixed(2));
    }),
  }));

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: true,
      },
    },
    colors: ["#605DFF", "#AD63F6", "#3584FC"],
    plotOptions: {
      bar: {
        columnWidth: "60%",
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 4,
      show: true,
      colors: ["transparent"],
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
      tickAmount: 6,
      labels: {
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
    tooltip: {
      y: {
        formatter: function (val) {
          const rounded = Number(val.toFixed(2));
          return `KES ${rounded.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}`;
        },
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

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[500px] flex flex-col">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Projects Analysis</h5>
          </div>
        </div>

        <div className="trezo-card-content flex-1 overflow-y-auto">
          <div className="-mt-[5px] -mb-[20px] ltr:-ml-[12px] rtl:-mr-[12px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={418}
                width={"100%"}
              />
            )}
            {loading && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Loading projects analysis...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsAnalysis;
