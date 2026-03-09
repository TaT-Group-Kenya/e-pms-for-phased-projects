"use client";

import React from "react";

type CountWithDelta = {
  current: number;
  previous: number | null;
  delta_percentage: number | null;
};

type DeletedProjectsProps = {
  value?: CountWithDelta;
};

const DeletedProjects: React.FC<DeletedProjectsProps> = ({ value }) => {
  const current = value?.current ?? 0;
  const delta = value?.delta_percentage ?? null;
  const hasDelta = delta !== null && delta !== undefined;
  const isPositive = (delta ?? 0) >= 0;

  return (
    <>
      <div className="bg-purple-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
        <div className="flex items-center">
          <div className="text-purple-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
            <i className="material-symbols-outlined !text-5xl">delete</i>
          </div>
          <div>
            <span className="block">Deleted Projects</span>
            <h5 className="!mb-0 !text-[20px] mt-[2px]">{current}</h5>
          </div>
        </div>
        <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
          <span className="block text-sm">Vs previous period</span>
          <span
            className={`inline-block text-sm py-[1px] px-[8.3px] border rounded-xl dark:bg-[#15203c] dark:border-[#172036] ${
              isPositive
                ? "text-success-700 border-success-300 bg-success-100"
                : "text-danger-700 border-danger-300 bg-danger-100"
            }`}
          >
            {hasDelta ? `${isPositive ? "+" : ""}${(delta ?? 0).toFixed(1)}%` : "-"}
          </span>
        </div>
      </div>
    </>
  );
};

export default DeletedProjects;
