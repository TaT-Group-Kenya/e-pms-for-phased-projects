"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EmployeeSalary: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const data = [70, 60, 80, 100, 70, 40, 80];
  const middleIndex = Math.floor(data.length / 2);

  const series = [
    {
      name: "Employee Salary",
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: data.map((_, index) =>
      index === middleIndex ? "#9135E8" : "#E9D5FF"
    ),
    plotOptions: {
      bar: {
        columnWidth: "22px",
        borderRadius: 4,
        distributed: true,
        horizontal: false,
      },
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
      tickAmount: 5,
      labels: {
        formatter: (val) => {
          return "$" + val + "K";
        },
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val + "k";
        },
      },
    },
    legend: {
      show: false,
      position: "top",
      fontSize: "12px",
      horizontalAlign: "left",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "square",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Employee Salary</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center justify-center bg-primary-100 dark:bg-[#15203c] rounded-[4px] w-[42px] h-[42px]">
              <Image
                src="/images/icons/total-payroll.svg"
                alt="total-payroll"
                width={26}
                height={26}
              />
            </div>
            <div>
              <span className="block">Total Payroll</span>
              <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                $450,000
              </h5>
            </div>
          </div>

          <div className="xl:mt-[5px] xl:mb-[10px] w-full">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={283}
                width={"100%"}
              />
            )}
          </div>

          <div className="sm:flex items-center gap-[20px] 2xl:gap-[30px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center bg-success-100 dark:bg-[#15203c] rounded-[4px] w-[42px] h-[42px]">
                <Image
                  src="/images/icons/salary-paid.svg"
                  alt="salary-paid"
                  width={26}
                  height={26}
                />
              </div>
              <div>
                <span className="block">Salary Paid</span>
                <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                  $395k
                </h5>
              </div>
            </div>
            <div className="flex items-center gap-[12px] mt-[15px] sm:mt-0">
              <div className="flex items-center justify-center bg-orange-100 dark:bg-[#15203c] rounded-[4px] w-[42px] h-[42px]">
                <Image
                  src="/images/icons/salary-pending.svg"
                  alt="salary-pending"
                  width={26}
                  height={26}
                />
              </div>
              <div>
                <span className="block">Salary Pending</span>
                <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                  $60k
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeSalary;
