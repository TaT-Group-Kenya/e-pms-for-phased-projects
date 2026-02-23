"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// Customer Data Interface
interface Customer {
  id: string;
  name: string;
  location: string;
  joinDate: string;
  phone: string;
  email: string;
  type: string;
  imageUrl: string;
}

// Example Customer Data (Dynamic)
const initialCustomers: Customer[] = [
  {
    id: "#TRE0015",
    name: "Sarah Johnson",
    location: "74 Grim Avenue, San Diego",
    joinDate: "30 Apr 2024",
    phone: "(123) 456-7890",
    email: "sarah@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user1.jpg",
  },
  {
    id: "#TRE0099",
    name: "Michael Smith",
    location: "9 Paul Wayne, Haggerty Road",
    joinDate: "29 Apr 2024",
    phone: "(987) 654-3210",
    email: "smith@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user2.jpg",
  },
  {
    id: "#TRE0072",
    name: "Olivia Brown",
    location: "456 Elm Street, Chicago",
    joinDate: "25 Apr 2024",
    phone: "(312) 789-1234",
    email: "olivia@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user3.jpg",
  },
  {
    id: "#TRE0051",
    name: "Daniel Wilson",
    location: "30 Sunset Blvd, Los Angeles",
    joinDate: "22 Apr 2024",
    phone: "(424) 567-2345",
    email: "daniel@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user4.jpg",
  },
  {
    id: "#TRE0040",
    name: "Jessica Adams",
    location: "789 Maple Drive, New York",
    joinDate: "18 Apr 2024",
    phone: "(212) 345-6789",
    email: "jessica@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user5.jpg",
  },
  {
    id: "#TRE0028",
    name: "William Carter",
    location: "102 Pine Street, Houston",
    joinDate: "15 Apr 2024",
    phone: "(713) 678-9012",
    email: "william@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user6.jpg",
  },
  {
    id: "#TRE0033",
    name: "Sophia Martinez",
    location: "555 Ocean Drive, Miami",
    joinDate: "10 Apr 2024",
    phone: "(305) 789-4567",
    email: "sophia@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user7.jpg",
  },
  {
    id: "#TRE0087",
    name: "James Anderson",
    location: "67 Broadway Street, Boston",
    joinDate: "5 Apr 2024",
    phone: "(617) 234-5678",
    email: "james@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user8.jpg",
  },
  {
    id: "#TRE0065",
    name: "Emma Thompson",
    location: "48 Main Street, Dallas",
    joinDate: "1 Apr 2024",
    phone: "(469) 789-0123",
    email: "emma@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user9.jpg",
  },
  {
    id: "#TRE0011",
    name: "Alexander King",
    location: "21 High Street, Seattle",
    joinDate: "28 Mar 2024",
    phone: "(206) 456-7890",
    email: "alexander@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user10.jpg",
  },
  {
    id: "#TRE0023",
    name: "Mia Roberts",
    location: "88 Sunset Avenue, San Francisco",
    joinDate: "20 Mar 2024",
    phone: "(415) 987-6543",
    email: "mia@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user11.jpg",
  },
  {
    id: "#TRE0019",
    name: "Benjamin White",
    location: "120 Pearl Street, Denver",
    joinDate: "15 Mar 2024",
    phone: "(303) 654-7890",
    email: "benjamin@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user12.jpg",
  },
  {
    id: "#TRE0091",
    name: "Ella Collins",
    location: "66 Central Park West, New York",
    joinDate: "10 Mar 2024",
    phone: "(646) 234-5678",
    email: "ella@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user13.jpg",
  },
  {
    id: "#TRE0077",
    name: "Henry Scott",
    location: "777 Wall Street, Chicago",
    joinDate: "5 Mar 2024",
    phone: "(312) 789-2345",
    email: "henry@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user14.jpg",
  },
  {
    id: "#TRE0042",
    name: "Sophia Walker",
    location: "888 Hollywood Blvd, Los Angeles",
    joinDate: "1 Mar 2024",
    phone: "(323) 678-1234",
    email: "sophiaw@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user15.jpg",
  },
  {
    id: "#TRE0038",
    name: "Lucas Harris",
    location: "55 Silicon Valley Drive, San Jose",
    joinDate: "25 Feb 2024",
    phone: "(408) 234-5678",
    email: "lucas@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user16.jpg",
  },
  {
    id: "#TRE0068",
    name: "Charlotte Lewis",
    location: "23 Liberty Avenue, Philadelphia",
    joinDate: "20 Feb 2024",
    phone: "(215) 789-6543",
    email: "charlotte@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user17.jpg",
  },
  {
    id: "#TRE0055",
    name: "Noah Mitchell",
    location: "89 Times Square, New York",
    joinDate: "15 Feb 2024",
    phone: "(917) 345-6789",
    email: "noah@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user18.jpg",
  },
  {
    id: "#TRE0025",
    name: "Liam Johnson",
    location: "90 Rodeo Drive, Beverly Hills",
    joinDate: "10 Feb 2024",
    phone: "(310) 678-9012",
    email: "liam@trezo.com",
    type: "Buyer",
    imageUrl: "/images/users/user19.jpg",
  },
  {
    id: "#TRE0010",
    name: "Ava Robinson",
    location: "72 Bourbon Street, New Orleans",
    joinDate: "5 Feb 2024",
    phone: "(504) 789-1234",
    email: "ava@trezo.com",
    type: "Seller",
    imageUrl: "/images/users/user20.jpg",
  },
];

const CustomersTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Upload Images
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Table
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete a customer row
  const handleDelete = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  // Filtered Customers Based on Search Query
  const filteredCustomers = customers.filter((customer) =>
    [
      customer.name,
      customer.email,
      customer.phone,
      customer.location,
      customer.type,
    ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                placeholder="Search customer here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Customer
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  {[
                    "Customer ID",
                    "Customer Name",
                    "Location",
                    "Join Date",
                    "Phone Number",
                    "Email Address",
                    "Customer Type",
                    "Action",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer, index) => (
                    <tr key={index}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center gap-[15px]">
                          <div className="form-check relative top-[1.5px]">
                            <input type="checkbox" className="cursor-pointer" />
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {customer.id}
                          </span>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center">
                          <div className="rounded-md w-[40px]">
                            <Image
                              src={customer.imageUrl}
                              className="inline-block rounded-md"
                              alt="product-image"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ltr:ml-[12px] rtl:mr-[12px]">
                            <span className="block font-medium">
                              {customer.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.location}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.joinDate}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        {customer.phone}
                      </td>

                      <td className="text-primary-500 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        {customer.email}
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-500 dark:text-gray-400">
                          {customer.type}
                        </span>
                      </td>

                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[17px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                        <div className="flex items-center gap-[9px]">
                          <div className="relative group">
                            <button
                              type="button"
                              className="text-primary-500 leading-none"
                            >
                              <i className="material-symbols-outlined !text-md">
                                visibility
                              </i>
                            </button>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              View
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                            </div>
                          </div>

                          <div className="relative group">
                            <button
                              type="button"
                              className="text-gray-500 leading-none"
                            >
                              <i className="material-symbols-outlined !text-md">
                                edit
                              </i>
                            </button>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Edit
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                            </div>
                          </div>

                          <div className="relative group">
                            <button
                              type="button"
                              className="text-danger-500 leading-none"
                              onClick={() => handleDelete(customer.id)}
                            >
                              <i className="material-symbols-outlined !text-md">
                                delete
                              </i>
                            </button>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Delete
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-[20px] md:px-[25px] pt-[12px] md:pt-[14px] sm:flex sm:items-center justify-between">
              <p className="!mb-0 !text-sm">Showing 8 of 36 results</p>

              <ol className="mt-[10px] sm:mt-0">
                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
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
                    key={index}
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  >
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 ${
                        currentPage === index + 1
                          ? "bg-primary-500 text-white border-primary-500"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
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
          )}
        </div>
      </div>

      {/* Modal */}
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
                    <h5 className="!mb-0">Add New Customer</h5>
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
                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter name"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Customer Email
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Customer Number
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter number"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter phone"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Customer Type
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value={0}>Select</option>
                          <option value={1}>Buyer</option>
                          <option value={2}>Seller</option>
                          <option value={3}>Commercial</option>
                          <option value={4}>Investor</option>
                          <option value={5}>Industrial</option>
                        </select>
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Joining Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Customer Address
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Enter address"
                        />
                      </div>

                      <div className="mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Country
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Switzerland</option>
                          <option value="2">New Zealand</option>
                          <option value="3">Germany</option>
                          <option value="4">United States</option>
                          <option value="5">Japan</option>
                          <option value="6">Netherlands</option>
                          <option value="7">Sweden</option>
                          <option value="8">Canada</option>
                          <option value="9">United Kingdom</option>
                          <option value="10">Australia</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 mb-[20px] sm:mb-0">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Add Customer Photo
                        </label>
                        <div id="fileUploader">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[48px] px-[20px] border border-gray-200 dark:border-[#172036]">
                            <div className="flex items-center justify-center">
                              <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                                <i className="ri-upload-2-line"></i>
                              </div>
                              <p className="leading-[1.5]">
                                <strong className="text-black dark:text-white">
                                  Click to upload
                                </strong>
                                <br /> you file here
                              </p>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              accept="image/*"
                              className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                              onChange={handleFileChange}
                            />
                          </div>

                          {/* Image Previews */}
                          <div className="mt-[10px] flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                              <div
                                key={index}
                                className="relative w-[50px] h-[50px]"
                              >
                                <Image
                                  src={URL.createObjectURL(image)}
                                  alt="product-preview"
                                  width={50}
                                  height={50}
                                  className="rounded-md"
                                />
                                <button
                                  type="button"
                                  className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
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

export default CustomersTable;
