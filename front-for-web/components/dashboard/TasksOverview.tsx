"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type QuotationsOverview = {
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
};

const TasksOverview: React.FC = () => {
  const [data, setData] = useState<QuotationsOverview | null>(null);
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
        const url = new URL("/api/dashboard/quotations-overview", window.location.origin);
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
          addToast("Failed to load quotations overview", "error");
          setData(null);
          return;
        }

        const body = await response.json();
        const payload: QuotationsOverview = (body?.data ?? body) || null;
        setData(payload);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading quotations overview", error);
        addToast("Error loading quotations overview", "error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  const series = [
    data?.draft ?? 0,
    data?.sent ?? 0,
    data?.approved ?? 0,
    data?.rejected ?? 0,
  ];

  const options: ApexOptions = {
    labels: ["Draft", "Sent", "Approved", "Rejected"],
    colors: ["#64748B", "#3584FC", "#37D80A", "#FD5812"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    stroke: {
      width: 1,
      show: true,
      colors: ["#ffffff"],
    },
    legend: {
      show: true,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 7,
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
            <h5 className="!mb-0">Quotations Overview</h5>
          </div>
        </div>

        <div className="trezo-card-content flex-1 overflow-y-auto">
          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="pie"
              height={376}
              width={"100%"}
            />
          )}
          {loading && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Loading quotations overview...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TasksOverview;
