"use client";

import React from "react"; 

const SellerOverview: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Seller Overview</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] sm:gap-[25px]">
            <div className="bg-primary-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
              <div className="flex items-center">
                <div className="text-primary-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                  <i className="material-symbols-outlined !text-5xl">
                    settings_account_box
                  </i>
                </div>
                <div>
                  <span className="block">Total Orders</span>
                  <h5 className="!mb-0 !text-[20px] mt-[2px]">7051</h5>
                </div>
              </div>
              <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                <span className="block text-sm">Orders this month</span>
                <span className="inline-block text-sm text-success-700 py-[1px] px-[8.3px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                  +0.75%
                </span>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
              <div className="flex items-center">
                <div className="text-orange-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                  <i className="material-symbols-outlined !text-5xl">
                    settings_timelapse
                  </i>
                </div>
                <div>
                  <span className="block">Total Earnings</span>
                  <h5 className="!mb-0 !text-[20px] mt-[2px]">$23.91k</h5>
                </div>
              </div>
              <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                <span className="block text-sm">Earnings this month</span>
                <span className="inline-block text-sm text-danger-700 py-[1px] px-[8.3px] border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                  -1.25%
                </span>
              </div>
            </div>

            <div className="bg-success-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
              <div className="flex items-center">
                <div className="text-success-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                  <i className="material-symbols-outlined !text-5xl">
                    assignment_return
                  </i>
                </div>
                <div>
                  <span className="block">Total Refunds</span>
                  <h5 className="!mb-0 !text-[20px] mt-[2px]">178</h5>
                </div>
              </div>
              <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                <span className="block text-sm">Refunds this month</span>
                <span className="inline-block text-sm text-success-700 py-[1px] px-[8.3px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                  +4.75%
                </span>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
              <div className="flex items-center">
                <div className="text-purple-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                  <i className="material-symbols-outlined !text-5xl">
                    discover_tune
                  </i>
                </div>
                <div>
                  <span className="block">Conversion Rate</span>
                  <h5 className="!mb-0 !text-[20px] mt-[2px]">12.21%</h5>
                </div>
              </div>
              <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                <span className="block text-sm">
                  Conversion rate this month
                </span>
                <span className="inline-block text-sm text-success-700 py-[1px] px-[8.3px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                  +1.11%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerOverview;
