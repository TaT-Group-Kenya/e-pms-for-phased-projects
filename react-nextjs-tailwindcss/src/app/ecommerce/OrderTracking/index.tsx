"use client";

import React from "react";

const OrderTracking: React.FC = () => {
  return (
    <>
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Order ID #2435679</h5>
              </div>

              <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
                <h5 className="!mb-0">Tracking ID #1004216609</h5>
              </div>
            </div>

            <div className="trezo-card-content">
              <span className="block mb-[10px] last:mb-0">
                IBAN: EST6049283742809
              </span>

              <span className="block mb-[10px] last:mb-0">
                Date: 26 Mar 2024
              </span>

              <div className="my-[25px] md:my-[45px] md:flex z-[1] relative justify-between">
                <span className="block absolute bottom-0 md:bottom-auto ltr:left-[25px] ltr:md:left-0 ltr:md:right-0 rtl:right-[25px] rtl:md:right-0 rtl:md:left-0 top-[25px] -z-[1] border-t border-dashed border-primary-500 ltr:border-l ltr:md:border-l-0 rtl:border-l rtl:md:border-l-0"></span>
                <div>
                  <div className="rounded-full text-center font-semibold text-black dark:text-white w-[50px] h-[50px] leading-[48px] bg-white dark:bg-[#0c1427] border border-dashed border-primary-500">
                    01
                  </div>
                  <span className="block text-md mt-[17px] font-semibold text-black dark:text-white ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    Order Placed
                  </span>
                  <span className="block mb-[15px] md:mb-0 mt-[7px] ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    22 Mar 2024 - 11:35AM
                  </span>
                </div>

                <div>
                  <div className="rounded-full text-center font-semibold text-black dark:text-white w-[50px] h-[50px] leading-[48px] bg-white dark:bg-[#0c1427] border border-dashed border-primary-500">
                    02
                  </div>
                  <span className="block text-md mt-[17px] font-semibold text-black dark:text-white ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    Packed
                  </span>
                  <span className="block mb-[15px] md:mb-0 mt-[7px] ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    23 Mar 2024 - 10:35AM
                  </span>
                </div>

                <div>
                  <div className="rounded-full text-center font-semibold text-black dark:text-white w-[50px] h-[50px] leading-[48px] bg-white dark:bg-[#0c1427] border border-dashed border-primary-500">
                    03
                  </div>
                  <span className="block text-md mt-[17px] font-semibold text-black dark:text-white ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    Shipped
                  </span>
                  <span className="block mb-[15px] md:mb-0 mt-[7px] ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    24 Mar 2024 - 3:45PM
                  </span>
                </div>

                <div>
                  <div className="rounded-full text-center font-semibold text-white w-[50px] h-[50px] leading-[48px] bg-primary-500 border border-dashed border-primary-500">
                    04
                  </div>
                  <span className="block text-md mt-[17px] font-semibold text-black dark:text-white ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    Delivered
                  </span>
                  <span className="block mb-[15px] md:mb-0 mt-[7px] ltr:pl-[45px] rtl:pr-[45px] md:!p-0">
                    25 Mar 2024 - 2:21PM
                  </span>
                </div>
              </div>

              <span className="block font-semibold text-black dark:text-white mb-[10px] last:mb-0">
                View Details:
              </span>

              <span className="block mb-[10px] last:mb-0">
                25 Mar 2024 - 2:21PM:{" "}
                <span className="text-black dark:text-white">
                  Your order delivered.
                </span>
              </span>

              <span className="block mb-[10px] last:mb-0">
                24 Mar 2024 - 3:45PM:{" "}
                <span className="text-black dark:text-white">
                  Your order shipped.
                </span>
              </span>

              <span className="block mb-[10px] last:mb-0">
                23 Mar 2024 - 10:35AM:{" "}
                <span className="text-black dark:text-white">
                  Your order is on the way for deliver.
                </span>
              </span>

              <span className="block mb-[10px] last:mb-0">
                22 Mar 2024 - 11:35AM:{" "}
                <span className="text-black dark:text-white">
                  Your order is now on warehouse. It’s being ready for shipped.
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Order Summary</h5>
              </div>
            </div>

            <div className="trezo-card-content">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                        Description
                      </th>
                      <th className="font-medium ltr:text-right rtl:text-left px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap first:rounded-tl-md">
                        Price
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="text-black dark:text-white">
                    <tr>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Grand Total :
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        $1,105.00
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Discount :
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        -$105.00
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Tax :
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        $75.00
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Subtotal :
                      </td>
                      <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        $1,000.00
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Shipping Charge :
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        $80.00
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Coupon Charge :
                      </td>
                      <td className="text-gray-500 dark:text-gray-400 ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        $20.00
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        Total :
                      </td>
                      <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        $900.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;
