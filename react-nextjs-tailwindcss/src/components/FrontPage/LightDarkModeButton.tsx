"use client";

import React, { useState, useEffect } from "react";

const LightDarkModeButton: React.FC = () => {
  // Light/Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve the user's preference from local storage
    const storedPreference = localStorage.getItem("theme");
    if (storedPreference === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Update the user's preference in local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Update the class on the <html> element to apply the selected mode
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      if (isDarkMode) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  return (
    <>
      <button
        type="button"
        className="light-dark-toggle leading-none inline-block transition-all text-[#fe7a36] fixed top-1/2 -translate-y-1/2 ltr:left-[20px] rtl:right-[20px] ltr:md:left-[25px] rtl:md:right-[25px] z-[9999]"
        onClick={handleToggle}
      >
        <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">
          light_mode
        </i>
      </button>
    </>
  );
};

export default LightDarkModeButton;
