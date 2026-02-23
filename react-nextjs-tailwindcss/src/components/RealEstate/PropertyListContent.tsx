"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const properties = [
  {
    id: 1,
    city: "New York",
    image: "/images/properties/property1.jpg",
    price: "$18,000",
    status: "Sale",
    address: "35 Prince Consort Road",
    bedrooms: 6,
    bathrooms: 5,
    area: "1800sqft",
    owner: {
      name: "Harold Cook",
      image: "/images/users/user1.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 2,
    city: "London",
    image: "/images/properties/property2.jpg",
    price: "$220,000",
    status: "Rent",
    address: "58 Gateway Road Portland",
    bedrooms: 8,
    bathrooms: 6,
    area: "2000sqft",
    owner: {
      name: "Debra Sisk",
      image: "/images/users/user2.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 3,
    city: "France",
    image: "/images/properties/property3.jpg",
    price: "$350,000",
    status: "Sold",
    address: "18 Chemin Challet",
    bedrooms: 8,
    bathrooms: 7,
    area: "2200sqft",
    owner: {
      name: "Herbert Rojas",
      image: "/images/users/user3.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 4,
    city: "Toronto",
    image: "/images/properties/property4.jpg",
    price: "$500,000",
    status: "Sale",
    address: "78 King Street",
    bedrooms: 5,
    bathrooms: 4,
    area: "2500sqft",
    owner: {
      name: "Alice Cooper",
      image: "/images/users/user4.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 5,
    city: "Dubai",
    image: "/images/properties/property5.jpg",
    price: "$750,000",
    status: "Rent",
    address: "99 Sheikh Zayed Road",
    bedrooms: 7,
    bathrooms: 6,
    area: "3500sqft",
    owner: {
      name: "Mohammed Al-Farsi",
      image: "/images/users/user5.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 6,
    city: "Berlin",
    image: "/images/properties/property6.jpg",
    price: "$280,000",
    status: "Sale",
    address: "12 Alexanderplatz",
    bedrooms: 3,
    bathrooms: 2,
    area: "1200sqft",
    owner: {
      name: "Hans Mueller",
      image: "/images/users/user6.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 7,
    city: "Sydney",
    image: "/images/properties/property7.jpg",
    price: "$600,000",
    status: "Sold",
    address: "45 Bondi Beach Road",
    bedrooms: 4,
    bathrooms: 3,
    area: "2000sqft",
    owner: {
      name: "Olivia Parker",
      image: "/images/users/user7.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 8,
    city: "Singapore",
    image: "/images/properties/property8.jpg",
    price: "$900,000",
    status: "Rent",
    address: "22 Orchard Road",
    bedrooms: 6,
    bathrooms: 5,
    area: "3000sqft",
    owner: {
      name: "Jason Tan",
      image: "/images/users/user8.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 9,
    city: "Madrid",
    image: "/images/properties/property9.jpg",
    price: "$400,000",
    status: "Sale",
    address: "30 Gran Via",
    bedrooms: 5,
    bathrooms: 4,
    area: "1800sqft",
    owner: {
      name: "Carlos Rodriguez",
      image: "/images/users/user9.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 10,
    city: "Los Angeles",
    image: "/images/properties/property10.jpg",
    price: "$1,200,000",
    status: "Sale",
    address: "789 Sunset Boulevard",
    bedrooms: 9,
    bathrooms: 7,
    area: "5000sqft",
    owner: {
      name: "Emma Wilson",
      image: "/images/users/user10.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 11,
    city: "Tokyo",
    image: "/images/properties/property11.jpg",
    price: "$850,000",
    status: "Sold",
    address: "55 Shibuya Crossing",
    bedrooms: 5,
    bathrooms: 4,
    area: "2700sqft",
    owner: {
      name: "Hiroshi Nakamura",
      image: "/images/users/user11.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
  {
    id: 12,
    city: "Moscow",
    image: "/images/properties/property12.jpg",
    price: "$650,000",
    status: "Rent",
    address: "10 Red Square",
    bedrooms: 6,
    bathrooms: 5,
    area: "3200sqft",
    owner: {
      name: "Dmitry Petrov",
      image: "/images/users/user12.jpg",
      role: "Owner",
    },
    viewLink: "/real-estate/property-details/",
  },
];

const PropertyListContent: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search property here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/real-estate/add-property/"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add Property
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
        {currentProperties.length > 0 ? (
          currentProperties.map((property) => (
            <div
              key={property.id}
              className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
            >
              <div className="trezo-card-header mb-[20px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">{property.city}</h5>
                </div>

                <div className="trezo-card-subtitle">
                  <Menu as="div" className="trezo-card-dropdown relative">
                    <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                      <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                        <i className="ri-more-fill"></i>
                      </span>
                    </MenuButton>

                    <MenuItems
                      transition
                      className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {["View", "Edit", "Delete"].map((option) => (
                        <MenuItem
                          key={option}
                          as="div"
                          className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                            selectedOption === option ? "font-semibold" : ""
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>

              <div className="trezo-card-content">
                <Link href={property.viewLink} className="block rounded-[5px]">
                  <Image
                    src={property.image}
                    className="inline-block rounded-[5px]"
                    alt="property-image"
                    width={620}
                    height={300}
                  />
                </Link>

                <div className="flex items-center justify-between mb-[9px] mt-[20px]">
                  <h3 className="!text-lg !mb-0 !text-orange-500">
                    {property.price}
                  </h3>
                  <span
                    className={`inline-block rounded-[4px] text-xs py-px px-[9px] ${
                      property.status === "Sale"
                        ? "bg-success-100 text-success-600"
                        : property.status === "Rent"
                        ? "bg-secondary-100 text-secondary-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <span className="block relative pt-px ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined text-primary-500 absolute ltr:-left-[2px] rtl:-right-[2px] top-1/2 -translate-y-1/2 !text-[19px]">
                    location_on
                  </i>
                  {property.address}
                </span>

                <ul className="mt-[17px] py-[10px] border-y border-primary-50 dark:border-[#172036]">
                  <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                      bed
                    </i>
                    {property.bedrooms}Bed
                  </li>
                  <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                      bathtub
                    </i>
                    {property.bathrooms}Bath
                  </li>
                  <li className="inline-block relative ltr:pl-[24px] rtl:pr-[24px] ltr:mr-[20px] rtl:ml-[20px] ltr:last:mr-0 rtl:last:ml-0">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-primary-500 !text-[18px]">
                      square_foot
                    </i>
                    {property.area}
                  </li>
                </ul>

                <div className="mt-[20px] flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <Image
                      src={property.owner.image}
                      className="rounded-full w-[40px]"
                      alt="user-image"
                      width={40}
                      height={40}
                    />
                    <div>
                      <span className="sm:text-[15px] md:text-md block font-semibold text-black dark:text-white">
                        {property.owner.name}
                      </span>
                      <span className="block">{property.owner.role}</span>
                    </div>
                  </div>

                  <Link
                    href={property.viewLink}
                    className="inline-block font-medium sm:text-[15px] md:text-md text-primary-500 transition-all hover:text-primary-400 hover:underline"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            <div className="sm:flex sm:items-center justify-between">
              <p className="!mb-0">
                Showing {currentProperties.length} of{" "}
                {filteredProperties.length} results
              </p>

              <ol className="mt-[10px] sm:mt-0">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_left
                    </i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index + 1}
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-"
                  >
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                        currentPage === index + 1
                          ? "bg-primary-500 text-white"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  >
                    <span className="opacity-0">0</span>
                    <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                      chevron_right
                    </i>
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyListContent;
