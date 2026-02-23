"use client";

import React from "react";
 
const Stats: React.FC = () => {
  const statsData = [
    {
      title: "Total Income",
      value: "$531,200",
      icon: "attach_money",
      trend: "increase",
      trendValue: "+35.5%",
    },
    {
      title: "Total Expenses",
      value: "$251,952",
      icon: "account_balance_wallet",
      trend: "decrease",
      trendValue: "-28.5%",
    },
    {
      title: "Accounts Receivable",
      value: "$15,990",
      icon: "money_bag",
      trend: "decrease",
      trendValue: "-5.8%",
    },
    {
      title: "Account Payable",
      value: "$14,580",
      icon: "payments",
      trend: "increase",
      trendValue: "+10.1%",
    },
  ];
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-[25px] gap-[25px] mb-[25px]">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content">
              <div className="flex justify-between">
                <div>
                  <span className="block">{stat.title}</span>
                  <h5 className="!mb-0 !mt-[3px] !text-[20px]">{stat.value}</h5>
                </div>
                <div
                  className={`w-[55px] lg:w-[60px] h-[55px] lg:h-[60px] flex items-center justify-center rounded-full ${
                    stat.trend === "increase"
                      ? "text-success-600 bg-success-50"
                      : "text-danger-600 bg-danger-50"
                  } dark:bg-[#0a0e19]`}
                >
                  <i className="material-symbols-outlined">{stat.icon}</i>
                </div>
              </div>
              <div className="mt-[15px] md:mt-[20px] flex items-center gap-[10px]">
                <span
                  className={`inline-block px-[8.5px] dark:bg-[#15203c] dark:border-[#15203c] ${
                    stat.trend === "increase"
                      ? "text-success-700 border border-success-300 bg-success-100"
                      : "text-danger-700 border border-danger-300 bg-danger-100"
                  } rounded-[100px] text-xs`}
                >
                  {stat.trendValue}
                </span>
                <span className="block text-xs">Last 30 days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Stats;