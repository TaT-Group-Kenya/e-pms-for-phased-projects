"use client";

import React, { useState } from "react";

const IconTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Icon Tabs</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="trezo-tabs" id="trezo-tabs">
            <ul className="navs mb-[20px] border-b border-gray-100 dark:border-[#172036]">
              <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(0)}
                  className={`nav-link flex items-center gap-[4px] pb-[8px] transition-all relative font-medium ${
                    activeTab === 0 ? "active" : ""
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">home</i>
                  Tab 1
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(1)}
                  className={`nav-link flex items-center gap-[4px] pb-[8px] transition-all relative font-medium ${
                    activeTab === 1 ? "active" : ""
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">home</i>
                  Tab 2
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px]">
                <button
                  type="button"
                  onClick={() => handleTabClick(2)}
                  className={`nav-link flex items-center gap-[4px] pb-[8px] transition-all relative font-medium ${
                    activeTab === 2 ? "active" : ""
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">home</i>
                  Tab 3
                </button>
              </li>
            </ul>

            <div>
              {activeTab === 0 && (
                <div>
                  <p>Tab 1 - Hello World!</p>
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  <p>Tab 2 - Hello World!</p>
                </div>
              )}

              {activeTab === 2 && (
                <div>
                  <p>Tab 3 - Hello World!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IconTabs;
