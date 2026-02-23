"use client";

import React from "react"; 

const InfoWindowMap: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Info Window</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1rQt1Hl5N5hmUTaW5Gei3gsAii1o&ehbc=2E312F"
            className="w-full border-0 h-[400px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default InfoWindowMap;
