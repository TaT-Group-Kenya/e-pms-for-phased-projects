"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type DashboardRangeValue =
  | "this_day"
  | "this_week"
  | "this_month"
  | "this_year"
  | "last_7_days"
  | "last_6_months";

export type DashboardRangeOption = {
  label: string;
  value: DashboardRangeValue;
};

export const DASHBOARD_RANGE_OPTIONS: DashboardRangeOption[] = [
  { label: "This Day", value: "this_day" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 6 Months", value: "last_6_months" },
];

type DashboardFiltersContextValue = {
  range: DashboardRangeValue;
  setRange: (value: DashboardRangeValue) => void;
  selectedOption: DashboardRangeOption;
};

const DashboardFiltersContext = createContext<DashboardFiltersContextValue | undefined>(
  undefined
);

export const DashboardFiltersProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [range, setRange] = useState<DashboardRangeValue>("last_6_months");

  const selectedOption = useMemo(() => {
    return (
      DASHBOARD_RANGE_OPTIONS.find((opt) => opt.value === range) ||
      DASHBOARD_RANGE_OPTIONS[0]
    );
  }, [range]);

  const value = useMemo(
    () => ({ range, setRange, selectedOption }),
    [range, selectedOption]
  );

  return (
    <DashboardFiltersContext.Provider value={value}>
      {children}
    </DashboardFiltersContext.Provider>
  );
};

export const useDashboardFilters = (): DashboardFiltersContextValue => {
  const ctx = useContext(DashboardFiltersContext);
  if (!ctx) {
    throw new Error(
      "useDashboardFilters must be used within a DashboardFiltersProvider"
    );
  }
  return ctx;
};
