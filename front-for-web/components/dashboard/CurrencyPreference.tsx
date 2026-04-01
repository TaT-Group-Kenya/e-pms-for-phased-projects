"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CurrencyPreference: React.FC = () => {
  const [data, setData] = useState<Record<string, number> | null>(null);
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
        const url = new URL(
          "/api/dashboard/currency-preference",
          window.location.origin
        );
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
          addToast("Failed to load currency preference", "error");
          setData(null);
          return;
        }

        const body = await response.json();
        const payload: Record<string, number> = body?.data ?? body ?? {};
        setData(typeof payload === "object" && !Array.isArray(payload) ? payload : null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading currency preference", error);
        addToast("Error loading currency preference", "error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  const labels = data ? Object.keys(data) : [];
  const series = data ? Object.values(data) : [];

  const COLORS = ["#3584FC", "#FE7A36", "#37D80A", "#64748B", "#A855F7", "#EF4444", "#14B8A6", "#F59E0B"];

  const options: ApexOptions = {
    labels,
    colors: COLORS.slice(0, labels.length),
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
            <h5 className="!mb-0">Currency Preference</h5>
          </div>
        </div>

        <div className="trezo-card-content flex-1 overflow-y-auto">
          {isChartLoaded && series.length > 0 && (
            <Chart
              options={options}
              series={series}
              type="pie"
              height={376}
              width={"100%"}
            />
          )}
          {series.length === 0 && !loading && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No invoice data for this period.
            </p>
          )}
          {loading && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Loading currency preference...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CurrencyPreference;
