"use client";

import React from "react";
import AccountPayablesReportTable from "./AccountPayablesReportTable";

const FinancePayablesPage: React.FC = () => {
  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Company outgoing payments to suppliers and others.
          </p>
        </div>
      </div>

      <AccountPayablesReportTable />
    </>
  );
};

export default FinancePayablesPage;
