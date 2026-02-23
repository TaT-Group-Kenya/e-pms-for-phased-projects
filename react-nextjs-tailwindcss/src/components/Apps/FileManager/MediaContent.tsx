"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const fileData = [
  {
    id: "1",
    fileName: "dashboard_design1",
    icon: "picture_as_pdf",
    owner: "Linda Maddox",
    date: "19 Nov 2024",
    type: ".pdf",
    size: "1.2 GB",
  },
  {
    id: "2",
    fileName: "important_documents",
    icon: "folder_zip",
    owner: "Juanita Lavigne",
    date: "18 Nov 2024",
    type: ".zip",
    size: "2.6 GB",
  },
  {
    id: "3",
    fileName: "product_design",
    icon: "folder",
    owner: "Roy Pope",
    date: "17 Nov 2024",
    type: ".psd",
    size: "3.2 GB",
  },
  {
    id: "4",
    fileName: "dashboard_design2",
    icon: "folder",
    owner: "Cecil Jones",
    date: "16 Nov 2024",
    type: ".fig",
    size: "1 GB",
  },
  {
    id: "5",
    fileName: "media_files",
    icon: "folder",
    owner: "Trudy Venegas",
    date: "15 Nov 2024",
    type: ".jpg",
    size: "1.5 GB",
  },
  {
    id: "6",
    fileName: "graphic_design_file",
    icon: "folder",
    owner: "Sharilyn Goodall",
    date: "14 Nov 2024",
    type: ".png",
    size: "1.6 GB",
  },
  {
    id: "7",
    fileName: "personal_photo",
    icon: "folder",
    owner: "Annie Carver",
    date: "13 Nov 2024",
    type: ".gif",
    size: "1.2 GB",
  },
  {
    id: "8",
    fileName: "audio_file",
    icon: "folder",
    owner: "Winona Etzel",
    date: "12 Nov 2024",
    type: ".mp3",
    size: "1.3 GB",
  },
  {
    id: "9",
    fileName: "graphic_design_file",
    icon: "folder",
    owner: "Sharilyn Goodall",
    date: "14 Nov 2024",
    type: ".png",
    size: "1.6 GB",
  },
  {
    id: "10",
    fileName: "personal_photo",
    icon: "folder",
    owner: "Annie Carver",
    date: "13 Nov 2024",
    type: ".gif",
    size: "1.2 GB",
  },
  {
    id: "11",
    fileName: "audio_file",
    icon: "folder",
    owner: "Winona Etzel",
    date: "12 Nov 2024",
    type: ".mp3",
    size: "1.3 GB",
  },
  {
    id: "12",
    fileName: "dashboard_design1",
    icon: "picture_as_pdf",
    owner: "Linda Maddox",
    date: "19 Nov 2024",
    type: ".pdf",
    size: "1.2 GB",
  },
  {
    id: "13",
    fileName: "important_documents",
    icon: "folder_zip",
    owner: "Juanita Lavigne",
    date: "18 Nov 2024",
    type: ".zip",
    size: "2.6 GB",
  },
  {
    id: "14",
    fileName: "media_files",
    icon: "folder",
    owner: "Trudy Venegas",
    date: "15 Nov 2024",
    type: ".jpg",
    size: "1.5 GB",
  },
  {
    id: "15",
    fileName: "product_design",
    icon: "folder",
    owner: "Roy Pope",
    date: "17 Nov 2024",
    type: ".psd",
    size: "3.2 GB",
  },
  {
    id: "16",
    fileName: "dashboard_design2",
    icon: "folder",
    owner: "Cecil Jones",
    date: "16 Nov 2024",
    type: ".fig",
    size: "1 GB",
  },
];

const MediaContent: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Today");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set items per page
  const totalPages = Math.ceil(fileData.length / itemsPerPage);

  const paginatedData = fileData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Media</h5>
        </div>

        <Menu as="div" className="trezo-card-dropdown relative">
          <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-50">
            <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
              {selectedOption}
              <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
            </span>
          </MenuButton>

          <MenuItems
            transition
            className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            {["Today", "Last Week", "Last Month", "Last Year"].map((option) => (
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
            ))}
          </MenuItems>
        </Menu>
      </div>

      <div className="trezo-card-content">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                {[
                  "File Name",
                  "Owner",
                  "Listed Date",
                  "File Type",
                  "File Size",
                  "Action",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {paginatedData.map((file, index) => (
                <tr key={index}>
                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <a
                      href="#"
                      className="flex items-center font-medium transition-all hover:text-primary-500"
                    >
                      <i
                        className={`material-symbols-outlined !text-2xl text-[#ffb264] mr-[8px]`}
                      >
                        {file.icon}
                      </i>
                      {file.fileName}
                    </a>
                  </td>

                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    {file.owner}
                  </td>

                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    {file.date}
                  </td>

                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    {file.type}
                  </td>

                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    {file.size}
                  </td>

                  <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                    <div className="flex items-center gap-[9px]">
                      <div className="relative group">
                        <button
                          type="button"
                          className="text-primary-500 leading-none"
                        >
                          <i className="material-symbols-outlined !text-md">
                            visibility
                          </i>
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                        </div>
                      </div>

                      <div className="relative group">
                        <button
                          type="button"
                          className="text-gray-500 leading-none"
                        >
                          <i className="material-symbols-outlined !text-md">
                            edit
                          </i>
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                        </div>
                      </div>

                      <div className="relative group">
                        <button
                          type="button"
                          className="text-danger-500 leading-none"
                        >
                          <i className="material-symbols-outlined !text-md">
                            delete
                          </i>
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Delete
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-[20px] py-[12px] md:py-[14px] flex items-center justify-between">
          <p className="!mb-0 !text-sm">
            Showing {paginatedData.length} of {fileData.length} results
          </p>
          <ol className="flex">
            <li className="mx-[2px]">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-[31px] h-[31px] block leading-[29px] text-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined">chevron_left</i>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className="mx-[2px]">
                <button
                  onClick={() => handlePageChange(page)}
                  className={`w-[31px] h-[31px] block leading-[29px] text-center rounded-md border ${
                    currentPage === page
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className="mx-[2px]">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-[31px] h-[31px] block leading-[29px] text-center rounded-md border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white"
              >
                <i className="material-symbols-outlined">chevron_right</i>
              </button>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MediaContent;
