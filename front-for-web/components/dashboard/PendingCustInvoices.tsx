"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useToast } from "../../hooks/useToast";
import { useDashboardFilters } from "./DashboardFiltersContext";
import { formatCurrency } from "../../utils/format";

const PendingCustInvoices: React.FC = () => {
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { addToast } = useToast();
  const { range, selectedOption } = useDashboardFilters();

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "/api/dashboard/pending-cust-invoices",
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
          addToast("Failed to load pending customer invoices", "error");
          setData(null);
          return;
        }

        const body = await response.json();
        const payload = body?.data ?? body ?? {};
        setData(
          typeof payload === "object" && !Array.isArray(payload)
            ? payload
            : null
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Error loading pending customer invoices", error);
        addToast("Error loading pending customer invoices", "error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [accessToken, range, addToast]);

  const entries = data ? Object.entries(data) : [];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md h-[250px] flex flex-col">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Pending Customer Invoices</h5>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Filtered by: {selectedOption.label}
          </p>
        </div>
      </div>

      <div className="trezo-card-content flex-1 overflow-y-auto">
        <div
          className={`grid gap-[25px] ${
            entries.length >= 4
              ? "grid-cols-4"
              : entries.length === 3
              ? "grid-cols-4"
              : entries.length === 2
              ? "grid-cols-4"
              : "grid-cols-4"
          }`}
        >
          {entries.map(([currency, amount], index) => {
            const themes = [
              { bg: "bg-primary-50", text: "text-primary-500" },
              { bg: "bg-danger-50", text: "text-danger-500" },
              { bg: "bg-success-50", text: "text-success-500" },
              { bg: "bg-warning-50", text: "text-warning-500" },
            ];
            const theme = themes[index % themes.length];
            return (
            <div
              key={currency}
              className={`${theme.bg} dark:bg-[#15203c] rounded-md py-[22px] px-[20px]`}
            >
              <div className="flex items-center">
                <div className={`${theme.text} leading-none ltr:mr-[10px] rtl:ml-[10px]`}>
                  <i className="material-symbols-outlined !text-5xl">
                    receipt_long
                  </i>
                </div>
                <div>
                  <span className="block">{currency}</span>
                  <h5 className="!mb-0 !text-[20px] mt-[2px]">
                    {formatCurrency(amount, currency)}
                  </h5>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        {entries.length === 0 && !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No pending customer invoices for this period.
          </p>
        )}
        {loading && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Loading pending customer invoices...
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingCustInvoices;
