"use client";

import React from "react";
import RecentOrders from "./RecentOrders";
import OrderSummary from "./OrderSummary";

const OrderDetailsContent: React.FC = () => {
  return (
    <>
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <div className="trezo-card bg-primary-500 mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[5px] md:mb-[25px] sm:flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0 !text-white">Tracking ID: 000346798254</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <div className="relative z-[1] sm:flex items-center justify-between">
                <span className="absolute left-0 right-0 top-[25px] -z-[1] border-t border-dashed border-white hidden md:inline-block"></span>

                <div className="inline-block md:block ltr:mr-[25px] rtl:ml-[25px] md:ltr:mr-0 md:rtl:ml-0 mt-[15px] md:mt-0">
                  <div className="rounded-full bg-primary-500 text-center text-white font-semibold w-[50px] h-[50px] leading-[48px] border border-dashed border-white">
                    01
                  </div>
                  <span className="block text-white font-semibold mt-[13px]">
                    Order Placed
                  </span>
                </div>

                <div className="inline-block md:block ltr:mr-[25px] rtl:ml-[25px] md:ltr:mr-0 md:rtl:ml-0 mt-[15px] md:mt-0">
                  <div className="rounded-full bg-primary-500 text-center text-white font-semibold w-[50px] h-[50px] leading-[48px] border border-dashed border-white">
                    02
                  </div>
                  <span className="block text-white font-semibold mt-[13px]">
                    Packed
                  </span>
                </div>

                <div className="inline-block md:block ltr:mr-[25px] rtl:ml-[25px] md:ltr:mr-0 md:rtl:ml-0 mt-[15px] md:mt-0">
                  <div className="rounded-full bg-info-400 text-center text-white font-semibold w-[50px] h-[50px] leading-[48px] border border-dashed border-white">
                    03
                  </div>
                  <span className="block text-white font-semibold mt-[13px]">
                    Shipped
                  </span>
                </div>

                <div className="inline-block md:block ltr:mr-[25px] rtl:ml-[25px] md:ltr:mr-0 md:rtl:ml-0 mt-[15px] md:mt-0">
                  <div className="rounded-full bg-primary-500 text-center text-white font-semibold w-[50px] h-[50px] leading-[48px] border border-dashed border-white ltr:ml-auto rtl:mr-auto">
                    04
                  </div>
                  <span className="block text-white font-semibold mt-[13px]">
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RecentOrders */}
          <RecentOrders />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Billing Details</h5>
            </div>
          </div>

          <div className="trezo-card-content">
            <ul>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Name: {' '}
                </span>
                Gary Fraser
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Email: {' '}
                </span>
                example@trezo.com
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Phone: {' '}
                </span>
                +1 444 333 5566
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Address:
                </span>
                715 Maple St, Hamletville, England
              </li>
            </ul>
          </div>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Shipping Details</h5>
            </div>
          </div>

          <div className="trezo-card-content">
            <ul>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Shipping Date: {' '}
                </span>
                25 Nov 2024 10:30 AM
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Email: {' '}
                </span>
                example@trezo.com
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Phone: {' '}
                </span>
                +1 444 333 5566
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Address: {' '}
                </span>
                789 Pine St, Villageton, England
              </li>
            </ul>
          </div>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Delivery Details</h5>
            </div>
          </div>

          <div className="trezo-card-content">
            <ul>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  XYZ Delivery
                </span>
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Order ID: {' '}
                </span>
                XXXXXX1004
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Payment Method: {' '}
                </span>
                Master Card
              </li>
              <li className="mb-[12px] last:mb-0">
                <span className="text-black dark:text-white font-medium">
                  Email: {' '}
                </span>
                example@trezo.com
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsContent;
