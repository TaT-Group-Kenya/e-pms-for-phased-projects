"use client";

import React from "react";
import Image from "next/image";

const data = [
  {
    id: "1",
    image: "/images/icons/png.png",
    title: "ET Template",
    files: "159 Files",
    size: "4.5 GB",
  },
  {
    id: "2",
    image: "/images/icons/jpg.png",
    title: "React Template",
    files: "522 Files",
    size: "5.5 GB",
  },
  {
    id: "3",
    image: "/images/icons/txt.png",
    title: "Material UI",
    files: "995 Files",
    size: "7.5 GB",
  },
  {
    id: "4",
    image: "/images/icons/pdf.png",
    title: "WP Themes",
    files: "39 Files",
    size: "3.8 GB",
  },
  {
    id: "4",
    image: "/images/icons/xl4.png",
    title: "Personal Photos",
    files: "75 Files",
    size: "2.2 GB",
  },
  {
    id: "5",
    image: "/images/icons/doc.png",
    title: "Mobile Apps",
    files: "357 Files",
    size: "8.5 GB",
  },
  {
    id: "6",
    image: "/images/icons/png.png",
    title: "Important Files",
    files: "159 Files",
    size: "4.5 GB",
  },
  {
    id: "7",
    image: "/images/icons/jpg.png",
    title: "Angular Template",
    files: "522 Files",
    size: "5.5 GB",
  },
  {
    id: "8",
    image: "/images/icons/txt.png",
    title: "Projects",
    files: "995 Files",
    size: "7.5 GB",
  },
  {
    id: "9",
    image: "/images/icons/pdf.png",
    title: "Documents",
    files: "39 Files",
    size: "3.8 GB",
  },
  {
    id: "10",
    image: "/images/icons/xl4.png",
    title: "Media",
    files: "75 Files",
    size: "2.2 GB",
  },
  {
    id: "11",
    image: "/images/icons/jpg.png",
    title: "Applications",
    files: "357 Files",
    size: "8.5 GB",
  },
];

const ProjectsContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
      {data.map((item, index) => (
        <div
          key={index}
          className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
        >
          <div className="trezo-card-content">
            <div className="form-check">
              <input type="checkbox" className="cursor-pointer" />
            </div>
            <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center">
              <div className="leading-none ltr:mr-[12px] rtl:ml-[12px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={56}
                  height={56}
                />
              </div>
              <h6 className="!mb-0 !text-[15px]">{item.title}</h6>
            </div>
            <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center justify-between">
              <div className="block text-sm text-black dark:text-white">
                {item.files}
              </div>
              <div className="block text-sm text-black dark:text-white">
                {item.size}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsContent;
