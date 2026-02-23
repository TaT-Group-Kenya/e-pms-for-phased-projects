"use client";

import React from "react";
import Image from "next/image";

const cardData = [
  {
    id: "1",
    icon: "/images/icons/txt.png",
    title: "Projects",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "2",
    icon: "/images/icons/pdf.png",
    title: "Documents",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "3",
    icon: "/images/icons/xl4.png",
    title: "Media",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "4",
    icon: "/images/icons/jpg.png",
    title: "Applications",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "5",
    icon: "/images/icons/png.png",
    title: "ET Template",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "6",
    icon: "/images/icons/jpg.png",
    title: "React Template",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "7",
    icon: "/images/icons/txt.png",
    title: "Material UI",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "8",
    icon: "/images/icons/pdf.png",
    title: "WP Themes",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "9",
    icon: "/images/icons/xl4.png",
    title: "Personal Photos",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "10",
    icon: "/images/icons/doc.png",
    title: "Mobile Apps",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "11",
    icon: "/images/icons/png.png",
    title: "Important Files",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "12",
    icon: "/images/icons/jpg.png",
    title: "Angular Template",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "13",
    icon: "/images/icons/jpg.png",
    title: "Applications",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "14",
    icon: "/images/icons/txt.png",
    title: "Projects",
    actions: ["visibility", "edit", "delete"],
  },
  {
    id: "15",
    icon: "/images/icons/xl4.png",
    title: "Media",
    actions: ["visibility", "edit", "delete"],
  },

  {
    id: "16",
    icon: "/images/icons/pdf.png",
    title: "Documents",
    actions: ["visibility", "edit", "delete"],
  },
];

const DocumentsContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md text-center"
        >
          <div className="trezo-card-content">
            <Image
              src={card.icon}
              className="inline-block"
              alt={card.title}
              width={56}
              height={56} 
            />
            <h6 className="!my-[18px] !text-[15px]">{card.title}</h6>
            <div className="flex justify-center items-center gap-[12px]">
              {card.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  type="button"
                  className={`${
                    action === "visibility"
                      ? "text-primary-500"
                      : action === "edit"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-danger-500"
                  } leading-none`}
                >
                  <i className="material-symbols-outlined !text-md">{action}</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsContent;
