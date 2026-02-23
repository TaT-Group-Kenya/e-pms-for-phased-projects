"use client";

import React from "react"; 

const AdditionalInformation: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Additional Information</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <ul>
            <li className="mb-[12.5px] last:mb-0">
              Phone:
              <span className="text-black dark:text-white font-medium">
                +1 444 266 5599
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Address:
              <span className="text-black dark:text-white font-medium">
                84 S. Arrowhead Court Branford
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Orders:
              <span className="text-black dark:text-white font-medium">
                696
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Products:
              <span className="text-black dark:text-white font-medium">
                9240
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Events:
              <span className="text-black dark:text-white font-medium">5</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdditionalInformation;
