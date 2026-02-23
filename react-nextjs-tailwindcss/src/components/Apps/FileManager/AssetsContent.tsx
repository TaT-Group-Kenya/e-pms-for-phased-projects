"use client";

import React from "react";

const AssetsContent: React.FC = () => {
  // Define the data for each card
  const cardsData = [
    {
      id: 1,
      iconColor: "text-primary-500",
      title: "Projects",
      files: "159 Files",
      size: "4.5 GB",
    },
    {
      id: 2,
      iconColor: "text-secondary-500",
      title: "Documents",
      files: "522 Files",
      size: "5.5 GB",
    },
    {
      id: 3,
      iconColor: "text-success-500",
      title: "Media",
      files: "995 Files",
      size: "7.5 GB",
    },
    {
      id: 4,
      iconColor: "text-danger-500",
      title: "Applications",
      files: "39 Files",
      size: "3.8 GB",
    },
    {
      id: 5,
      iconColor: "text-warning-500",
      title: "ET Template",
      files: "75 Files",
      size: "2.2 GB",
    },
    {
      id: 6,
      iconColor: "text-info-500",
      title: "React Template",
      files: "357 Files",
      size: "8.5 GB",
    },
    {
      id: 7,
      iconColor: "text-purple-500",
      title: "Material UI",
      files: "159 Files",
      size: "4.5 GB",
    },
    {
      id: 8,
      iconColor: "text-black dark:text-white",
      title: "WP Themes",
      files: "522 Files",
      size: "5.5 GB",
    },
    {
      id: 9,
      iconColor: "text-danger-500",
      title: "Personal Photos",
      files: "995 Files",
      size: "7.5 GB",
    },
    {
      id: 10,
      iconColor: "text-primary-500",
      title: "Mobile Apps",
      files: "39 Files",
      size: "3.8 GB",
    },
    {
      id: 11,
      iconColor: "text-secondary-500",
      title: "Important Files",
      files: "75 Files",
      size: "2.2 GB",
    },
    {
      id: 12,
      iconColor: "text-warning-500",
      title: "Angular Template",
      files: "357 Files",
      size: "8.5 GB",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
          >
            <div className="trezo-card-content">
              <div className="form-check">
                <input type="checkbox" className="cursor-pointer" />
              </div>
              <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center">
                <div
                  className={`leading-none ${card.iconColor} ltr:mr-[10px] rtl:ml-[10px]`}
                >
                  <i className="material-symbols-outlined !text-[45px]">
                    folder_open
                  </i>
                </div>
                <h6 className="!mb-0 !text-[15px]">{card.title}</h6>
              </div>
              <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center justify-between">
                <div className="block text-sm text-black dark:text-white">
                  {card.files}
                </div>
                <div className="block text-sm text-black dark:text-white">
                  {card.size}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AssetsContent;
