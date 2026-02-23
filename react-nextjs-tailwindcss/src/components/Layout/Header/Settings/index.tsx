"use client";

import React, { useState, useEffect, useRef } from "react";
import RTLMode from "./RTLMode";

export default function Settings() {
  const [active, setActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  const handleDropdownToggle = () => {
    setActive((prevState) => !prevState);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActive(false); // Close the dropdown if clicked outside
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className="relative settings-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
        ref={dropdownRef} // Attach the ref to the dropdown container
      >
        <button
          type="button"
          onClick={handleDropdownToggle}
          className={`leading-none inline-block transition-all relative top-[2px] hover:text-primary-500 ${
            active ? "active" : ""
          }`}
        >
          <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
            settings
          </i>
        </button>

        {active && ( // Conditionally render the dropdown based on the `active` state
          <div className="settings-menu-dropdown bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none p-[20px] absolute mt-[17px] md:mt-[20px] w-[195px] z-[1] top-full ltr:right-0 rtl:left-0 rounded-md">
            <RTLMode />
          </div>
        )}
      </div>
    </>
  );
}