"use client";

import React, { useState } from "react";
import AccountReceivablesReportTable from "./AccountReceivablesReportTable";
import AccountPayablesReportTable from "./AccountPayablesReportTable";

const FinancePaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"customer" | "company">("customer");

  return (
    <>
      <div className="trezo-card-header bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="flex-1 min-w-0">
          <div className="trezo-tabs mb-[10px] md:mb-[12px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036]">
              <li className="nav-item inline-block ltr:mr-[40px] rtl:ml-[40px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("customer")}
                  className={`nav-link flex items-center gap-[8px] pb-[10px] transition-all relative font-medium ${
                    activeTab === "customer"
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">assured_workload</i>
                  Account Receivables
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[40px] rtl:ml-[40px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("company")}
                  className={`nav-link flex items-center gap-[8px] pb-[10px] transition-all relative font-medium ${
                    activeTab === "company"
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[7px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">paid</i>
                  Account Payables
                </button>
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-[10px]">
            { activeTab === "customer"
              ? "Customer receipts generated from customer payments."
              : "Company outgoing payments to suppliers and others."
            }
          </p>
        </div>

      
      </div>

      {activeTab === "customer" ? (
        <AccountReceivablesReportTable />
      ) : (
        <AccountPayablesReportTable />
      )}
    </>
  );
};

export default FinancePaymentsPage;
