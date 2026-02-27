"use client";

import React, { useState, useEffect } from "react";

const RTLMode: React.FC = () => {
  const [dirAttribute, setDirAttribute] = useState<string>("ltr");

  useEffect(() => {
    const storedDirAttribute = localStorage.getItem("dirAttribute");
    if (storedDirAttribute) {
      setDirAttribute(storedDirAttribute);
      document.documentElement.setAttribute("dir", storedDirAttribute);
    }
  }, []);

  const handleButtonClick = () => {
    const newDirAttribute = dirAttribute === "ltr" ? "rtl" : "ltr";
    setDirAttribute(newDirAttribute);
    localStorage.setItem("dirAttribute", newDirAttribute);
    document.documentElement.setAttribute("dir", newDirAttribute);
  };

  return (
    <>
      <button
        type="button"
        className={`rtl-mode-toggle flex items-center text-black dark:text-white font-medium ${
          dirAttribute === "rtl" ? "open" : ""
        }`}
        onClick={handleButtonClick}
      >
        RTL Mode:
        <span className="inline-block relative rounded-full w-[35px] h-[20px] bg-gray-50 dark:bg-[#0a0e19] ltr:ml-[10px] rtl:mr-[10px]">
          <span className="inline-block transition-all absolute h-[12px] w-[12px] bg-black dark:bg-white rounded-full top-1/2 -translate-y-1/2"></span>
        </span>
      </button>
    </>
  );
};

export default RTLMode;
