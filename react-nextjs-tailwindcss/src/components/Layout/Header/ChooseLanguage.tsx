"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Language = {
  name: string;
  code: string;
  flag: string;
};

const languages: Language[] = [
  { name: "English", code: "en", flag: "/images/flags/usa.svg" },
  { name: "French", code: "fr", flag: "/images/flags/france.svg" },
  { name: "German", code: "de", flag: "/images/flags/germany.svg" },
  { name: "Portuguese", code: "pt", flag: "/images/flags/portugal.svg" },
  { name: "Spanish", code: "es", flag: "/images/flags/spain.svg" },
];

const ChooseLanguage: React.FC = () => {
  const handleLanguageChange = (code: string) => {
    console.log(`Selected language: ${code}`);
    // Add logic here to update the app's language state
  };

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
    <div
      className="relative language-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleDropdownToggle}
        className={`leading-none pr-[12px] inline-block transition-all relative top-[2px] hover:text-primary-500 ${
          active ? "active" : ""
        }`}
      >
        <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">
          translate
        </i>
        <i className="ri-arrow-down-s-line text-[15px] absolute -right-[3px] top-1/2 -translate-y-1/2 -mt-[2px]"></i>
      </button>

      {active && (
        <div className="language-menu-dropdown bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none pt-[13px] md:pt-[14px] absolute mt-[18px] md:mt-[21px] w-[200px] md:w-[240px] z-[1] top-full ltr:left-0 ltr:md:left-auto ltr:lg:right-0 rtl:right-0 rtl:md:right-auto rtl:lg:left-0 rounded-md">
          <span className="block text-black dark:text-white font-semibold px-[20px] pb-[14px] text-sm md:text-[15px]">
            Choose Language
          </span>

          <ul>
            {languages.map((language) => (
              <li
                key={language.code}
                className="border-t border-dashed border-gray-100 dark:border-[#172036]"
              >
                <button
                  type="button"
                  className="text-black dark:text-white px-[20px] py-[12px] d-block w-full font-medium"
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <div className="flex items-center">
                    <Image
                      src={language.flag}
                      className="ltr:mr-[10px] rtl:ml-[10px]"
                      alt={language.name}
                      width={30}
                      height={30}
                    />
                    {language.name}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChooseLanguage;
