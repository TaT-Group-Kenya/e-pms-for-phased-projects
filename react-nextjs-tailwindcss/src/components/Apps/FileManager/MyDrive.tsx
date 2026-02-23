"use client";

import React from "react";

const MyDrive: React.FC = () => {
  // Dynamic folder data
  const folders = [
    {
      id: 1,
      name: "Assets",
      icon: "folder_open",
      color: "primary",
      files: 387,
      size: "4.5 GB",
    },
    {
      id: 2,
      name: "Documents",
      icon: "folder_open",
      color: "orange",
      files: 120,
      size: "2.1 GB",
    },
    {
      id: 3,
      name: "Projects",
      icon: "folder_open",
      color: "success",
      files: 56,
      size: "1.8 GB",
    },
    {
      id: 4,
      name: "Media",
      icon: "folder_open",
      color: "purple",
      files: 245,
      size: "3.7 GB",
    },
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">My Drive</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px]">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={`bg-${folder.color}-50 dark:bg-[#0a0e19] rounded-md py-[22px] px-[20px]`}
              >
                <div className="form-check">
                  <input type="checkbox" className="cursor-pointer" />
                </div>
                <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center">
                  <div
                    className={`leading-none text-${folder.color}-500 ltr:mr-[10px] rtl:ml-[10px]`}
                  >
                    <i className="material-symbols-outlined !text-[45px]">
                      {folder.icon}
                    </i>
                  </div>
                  <h6 className="!mb-0 !text-[15px]">{folder.name}</h6>
                </div>
                <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center justify-between">
                  <div className="block text-black dark:text-white">
                    {folder.files} Files
                  </div>
                  <div className="block text-black dark:text-white">
                    {folder.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyDrive;