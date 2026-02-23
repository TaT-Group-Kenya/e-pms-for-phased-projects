"use client";

import React from "react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";

// Define the data structure for the WorldMap
interface CountryCode {
  country: string;
  value: number;
}

// Define the data structure for the list of countries
interface CountryData {
  flag: string;
  name: string;
  percentage: number;
}

// Data for the WorldMap
const mapData: CountryCode[] = [
  { country: "us", value: 85 }, // United States
  { country: "de", value: 75 }, // Germany
  { country: "br", value: 40 }, // Brazil
  { country: "ca", value: 10 }, // Canada
  { country: "pt", value: 5 }, // Portugal
  { country: "es", value: 15 }, // Spain
  { country: "fr", value: 25 }, // France
  { country: "au", value: 55 }, // Australia
];

// Data for the list of countries
const countriesData: CountryData[] = [
  { flag: "/images/flags/usa.svg", name: "USA", percentage: 85 },
  { flag: "/images/flags/germany.svg", name: "Germany", percentage: 75 },
  { flag: "/images/flags/brazil.svg", name: "Brazil", percentage: 40 },
  { flag: "/images/flags/canada.svg", name: "Canada", percentage: 10 },
  { flag: "/images/flags/portugal.svg", name: "Portugal", percentage: 5 },
  { flag: "/images/flags/spain.svg", name: "Spain", percentage: 15 },
  { flag: "/images/flags/france.svg", name: "France", percentage: 25 },
  { flag: "/images/flags/australia.svg", name: "Australia", percentage: 55 },
];

const ShipmentToTopCountriesAroundTheWorld: React.FC = () => {
  return (
    <div
      className="trezo-card mb-[25px] p-[20px] md:p-[25px] text-center rounded-md"
      style={{
        background: "linear-gradient(180deg, #757DFF 0%, #605DFF 100%)",
      }}
    >
      <div className="trezo-card-content">
        <h5 className="!text-white !mb-[5px] !mx-auto !max-w-[250px] !leading-[1.5]">
          Shipment to top countries around the world
        </h5>

        {/* WorldMap Visualization */}
        <div className="flex items-center justify-center min-h-[180px] mb-[8px]">
          <WorldMap
            backgroundColor="transparent"
            color="white"
            valueSuffix="%"
            size="sm"
            data={mapData}
          />
        </div>

        {/* List of Countries */}
        <div className="max-w-[310px] mx-auto w-full">
          <div className="grid grid-cols-2 gap-[12px]">
            {countriesData.map((country, index) => (
              <div key={index} className="flex items-center gap-[8px]">
                <Image
                  src={country.flag}
                  alt={`${country.name} flag`}
                  width={16}
                  height={12}
                  className="inline-block"
                />
                <span className="block text-white font-medium text-sm">
                  {country.name} {country.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentToTopCountriesAroundTheWorld;
