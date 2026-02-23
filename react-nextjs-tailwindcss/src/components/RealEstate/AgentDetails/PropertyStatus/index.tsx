"use client";

import React from "react";
import PropertiesForSale from "./PropertiesForSale";
import PropertiesForRent from "./PropertiesForRent";

const PropertyStatus: React.FC = () => {
  return (
    <>
      <h3 className="!text-md md:!text-lg !mt-[20px] md:!mt-[25px] lg:!mt-[30px] !mb-[15px]">
        Property Status
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mb-[25px]">
        <PropertiesForSale />

        <PropertiesForRent />
      </div>
    </>
  );
};

export default PropertyStatus;
