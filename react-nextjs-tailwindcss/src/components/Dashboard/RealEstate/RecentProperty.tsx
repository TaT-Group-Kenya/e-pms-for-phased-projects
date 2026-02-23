"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Define the structure of a property
interface Property {
  id: number;
  price: string;
  location: string;
  imageUrl: string;
  beds: number;
  baths: number;
  sqft: number;
  viewLink: string;
}

// Sample API call simulation to fetch property data
const fetchPropertyData = (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          price: "$18,000",
          location: "35 Prince Consort Road",
          imageUrl: "/images/properties/property1.jpg",
          beds: 6,
          baths: 5,
          sqft: 1800,
          viewLink: "real-estate/property-details",
        },
        {
          id: 2,
          price: "$220,000",
          location: "58 Gateway Road Portland",
          imageUrl: "/images/properties/property2.jpg",
          beds: 8,
          baths: 6,
          sqft: 2000,
          viewLink: "real-estate/property-details",
        },
        {
          id: 3,
          price: "$350,000",
          location: "18 Chemin Challet",
          imageUrl: "/images/properties/property3.jpg",
          beds: 8,
          baths: 7,
          sqft: 2200,
          viewLink: "real-estate/property-details",
        },
      ]);
    }, 1000); // Simulate a delay for fetching data
  });
};

const RecentProperty: React.FC = () => {
  const [propertyData, setPropertyData] = useState<Property[]>([]);

  useEffect(() => {
    // Fetch property data on component mount
    const loadPropertyData = async () => {
      const data = await fetchPropertyData();
      setPropertyData(data);
    };

    loadPropertyData();
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[15px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Recent Property</h5>
          </div>
        </div>

        <div className="trezo-card-content" id="recentPropertiesSlides">
          <Swiper
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            modules={[Autoplay, Pagination]}
          >
            {propertyData.map((property) => (
              <SwiperSlide key={property.id}>
                <div
                  className="rounded-[5px] h-[112px] bg-cover bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${property.imageUrl})`,
                  }}
                ></div>

                <div className="flex items-center justify-between mb-[8px] mt-[15px]">
                  <h3 className="!text-lg !mb-0 !text-orange-500">
                    {property.price}
                  </h3>

                  <Link
                    href={property.viewLink}
                    className="inline-block font-medium text-primary-500 transition-all hover:text-primary-400 hover:underline"
                  >
                    View More
                  </Link>
                </div>

                <span className="block relative pt-px ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined text-primary-500 absolute ltr:-left-[2px] rtl:-right-[2px] top-1/2 -translate-y-1/2 !text-[19px]">
                    location_on
                  </i>
                  {property.location}
                </span>

                <ul className="mt-[10px]">
                  <li className="relative inline-block ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                      bed
                    </i>
                    {property.beds}Bed
                  </li>

                  <li className="relative inline-block ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                      bathtub
                    </i>
                    {property.baths}Bath
                  </li>

                  <li className="relative inline-block ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                      square_foot
                    </i>
                    {property.sqft}sqft
                  </li>
                </ul>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default RecentProperty;