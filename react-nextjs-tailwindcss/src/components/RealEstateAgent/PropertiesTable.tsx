"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  code: string;
  type: string;
  name: string;
  image: string;
  address: string;
  views: number;
  date: string;
  status: "Active" | "Inactive";
  viewLink: string;
}

const PropertiesTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Sample data
  const initialProperties: Property[] = [
    {
      id: "1",
      code: "TRZ-32",
      type: "Luxury Apartment",
      name: "The Golden Haven",
      image: "/images/properties/property15.jpg",
      address: "123 Sunshine Boulevard, Vancouver, BC",
      views: 1450,
      date: "12 Nov, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "2",
      code: "TRZ-35",
      type: "High-End Villa",
      name: "The Golden Haven",
      image: "/images/properties/property16.jpg",
      address: "456 Whispering Pines Lane, Toronto, ON",
      views: 1890,
      date: "10 Nov, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "3",
      code: "TRZ-36",
      type: "Beachfront House",
      name: "The Golden Haven",
      image: "/images/properties/property17.jpg",
      address: "789 Northern Lights Drive, Calgary, AB",
      views: 1320,
      date: "08 Nov, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "4",
      code: "TRZ-37",
      type: "Mountain Cabin",
      name: "The Golden Haven",
      image: "/images/properties/property18.jpg",
      address: "234 Seaside Avenue, Halifax, NS",
      views: 1124,
      date: "10 Nov, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "5",
      code: "TRZ-38",
      type: "City Condo",
      name: "Urban Heights",
      image: "/images/properties/property19.jpg",
      address: "567 Downtown Street, Montreal, QC",
      views: 980,
      date: "05 Nov, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "6",
      code: "TRZ-39",
      type: "Countryside Villa",
      name: "Rural Retreat",
      image: "/images/properties/property20.jpg",
      address: "890 Meadow Lane, Ottawa, ON",
      views: 750,
      date: "03 Nov, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "7",
      code: "TRZ-40",
      type: "Loft Studio",
      name: "Skyline Views",
      image: "/images/properties/property21.jpg",
      address: "100 Highrise Avenue, Vancouver, BC",
      views: 1100,
      date: "02 Nov, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "8",
      code: "TRZ-41",
      type: "Modern Bungalow",
      name: "Peaceful Place",
      image: "/images/properties/property22.jpg",
      address: "321 Tranquil Road, Regina, SK",
      views: 1340,
      date: "01 Nov, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "9",
      code: "TRZ-42",
      type: "Lakehouse",
      name: "Crystal Waters",
      image: "/images/properties/property23.jpg",
      address: "400 Lakeside Blvd, Winnipeg, MB",
      views: 1402,
      date: "31 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "10",
      code: "TRZ-43",
      type: "Penthouse Suite",
      name: "Summit Heights",
      image: "/images/properties/property24.jpg",
      address: "777 Penthouse Lane, Edmonton, AB",
      views: 2200,
      date: "30 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "11",
      code: "TRZ-44",
      type: "Suburban Duplex",
      name: "The Duplex Hub",
      image: "/images/properties/property15.jpg",
      address: "145 Suburb Street, Brampton, ON",
      views: 980,
      date: "29 Oct, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "12",
      code: "TRZ-45",
      type: "Townhouse",
      name: "Maple Row",
      image: "/images/properties/property16.jpg",
      address: "600 Maple Street, Markham, ON",
      views: 890,
      date: "28 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "13",
      code: "TRZ-46",
      type: "Eco Lodge",
      name: "Green Escape",
      image: "/images/properties/property17.jpg",
      address: "987 Forest Way, Yellowknife, NT",
      views: 580,
      date: "27 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "14",
      code: "TRZ-47",
      type: "Studio Apartment",
      name: "Compact Bliss",
      image: "/images/properties/property18.jpg",
      address: "333 Tiny House Blvd, Saskatoon, SK",
      views: 1020,
      date: "26 Oct, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "15",
      code: "TRZ-48",
      type: "Ski Chalet",
      name: "Snowy Peaks",
      image: "/images/properties/property19.jpg",
      address: "432 Snow Street, Banff, AB",
      views: 1780,
      date: "25 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "16",
      code: "TRZ-49",
      type: "Farmhouse",
      name: "Country Comfort",
      image: "/images/properties/property20.jpg",
      address: "210 Harvest Lane, Red Deer, AB",
      views: 960,
      date: "24 Oct, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "17",
      code: "TRZ-50",
      type: "Historic Mansion",
      name: "Heritage Hall",
      image: "/images/properties/property21.jpg",
      address: "112 Vintage Road, Quebec City, QC",
      views: 2050,
      date: "23 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "18",
      code: "TRZ-51",
      type: "Seaside Cottage",
      name: "Breeze Bay",
      image: "/images/properties/property22.jpg",
      address: "9 Bayview Drive, Charlottetown, PE",
      views: 1420,
      date: "22 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "19",
      code: "TRZ-52",
      type: "Riverside Retreat",
      name: "The Flow",
      image: "/images/properties/property23.jpg",
      address: "78 Riverbend Lane, Fredericton, NB",
      views: 880,
      date: "21 Oct, 25",
      status: "Inactive",
      viewLink: "/real-estate-agent/property-details",
    },
    {
      id: "20",
      code: "TRZ-53",
      type: "Urban Loft",
      name: "Lofty Heights",
      image: "/images/properties/property24.jpg",
      address: "222 Central Ave, St. John's, NL",
      views: 1200,
      date: "20 Oct, 25",
      status: "Active",
      viewLink: "/real-estate-agent/property-details",
    },
  ];

  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Handle property selection
  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Handle select all/none for current page
  const toggleSelectAll = () => {
    if (selectedProperties.length === currentProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(currentProperties.map((property) => property.id));
    }
  };

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle property deletion
  const deleteProperty = (propertyId: string) => {
    setProperties(properties.filter((property) => property.id !== propertyId));
    // Also remove from selected properties if present
    setSelectedProperties(selectedProperties.filter((id) => id !== propertyId));
  };

  // Handle multiple property deletion
  const deleteSelectedProperties = () => {
    setProperties(
      properties.filter((property) => !selectedProperties.includes(property.id))
    );
    setSelectedProperties([]);
    // Reset to first page if current page becomes empty
    if (
      currentProperties.length === selectedProperties.length &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "text-success-600 border-success-600 bg-success-100";
      case "Inactive":
        return "text-danger-600 border-danger-600 bg-danger-100";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search here....."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0 flex items-center gap-3">
            {selectedProperties.length > 0 && (
              <button
                type="button"
                className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-danger-500 border border-danger-500 hover:bg-danger-500 hover:text-white"
                onClick={deleteSelectedProperties}
              >
                <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                    delete
                  </i>
                  Delete Selected
                </span>
              </button>
            )}
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Property
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    <div className="flex items-center gap-[10px]">
                      <div className="form-check relative top-[2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={
                            selectedProperties.length > 0 &&
                            selectedProperties.length ===
                              currentProperties.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </div>
                      Code
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Property Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Address
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Views
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Date
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tr-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentProperties.length > 0 ? (
                  currentProperties.map((property) => (
                    <tr key={property.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[10px]">
                          <div className="form-check relative top-[2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedProperties.includes(property.id)}
                              onChange={() =>
                                togglePropertySelection(property.id)
                              }
                            />
                          </div>
                          {property.code}
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[13px]">
                          <div className="rounded-md w-[60px]">
                            <Image
                              src={property.image}
                              width={60}
                              height={60}
                              className="inline-block rounded-md"
                              alt="property-image"
                            />
                          </div>
                          <div>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              {property.type}
                            </span>
                            <Link
                              href={property.viewLink}
                              className="font-medium inline-block text-[14px] md:text-[15px] transition-all hover:text-primary-500 mt-[3px]"
                            >
                              {property.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {property.address}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {property.views.toLocaleString()}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {property.date}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <span
                          className={`inline-block text-xs font-medium px-[8px] border rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c] ${getStatusStyle(
                            property.status
                          )}`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[9px]">
                          <Link
                            href={property.viewLink}
                            className="text-primary-500 leading-none custom-tooltip"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </Link>
                          <button
                            type="button"
                            className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                          >
                            <i className="material-symbols-outlined !text-md">
                              edit
                            </i>
                          </button>
                          <button
                            type="button"
                            className="text-danger-500 leading-none custom-tooltip"
                            onClick={() => deleteProperty(property.id)}
                          >
                            <i className="material-symbols-outlined !text-md">
                              delete
                            </i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l"
                    >
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[15px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              Showing {indexOfFirstProperty + 1} to{" "}
              {Math.min(indexOfLastProperty, filteredProperties.length)} of{" "}
              {filteredProperties.length} results
            </p>
            <ol className="mt-[10px] sm:mt-0">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <li
                    key={number}
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  >
                    <button
                      type="button"
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                        currentPage === number
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  </li>
                )
              )}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  type="button"
                  className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

      {/* Add New Property Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[550px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0">Add New Task</h5>
                  </div>
                  <div className="trezo-card-subtitle">
                    <button
                      type="button"
                      className="text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="trezo-card-content">
                  <form>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Task Title
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Task title"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Assigned To
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option>Select</option>
                          <option>Shawn Kennedy</option>
                          <option>Roberto Cruz</option>
                          <option>Juli Johnson</option>
                          <option>Catalina Engles</option>
                          <option>Louis Nagle</option>
                          <option>Michael Marquez</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Due Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Priority
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option>Select</option>
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option>Select</option>
                          <option>In Progress</option>
                          <option>Pending</option>
                          <option>Completed</option>
                          <option>Not Started</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-[20px] md:mt-[25px] ltr:text-right rtl:text-left">
                      <button
                        type="button"
                        className="rounded-md inline-block transition-all font-medium ltr:mr-[15px] rtl:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400"
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <i className="material-symbols-outlined !text-[20px] absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            add
                          </i>
                          Create
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PropertiesTable;
