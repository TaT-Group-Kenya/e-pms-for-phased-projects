"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Patient {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  disease: string;
  appointmentDate: string;
  checked?: boolean;
}

const PatientsListTable: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const [allPatients, setAllPatients] = useState<Patient[]>([
    {
      id: "1",
      userId: "#001",
      name: "Johhna Loren",
      avatar: "/images/users/user33.jpg",
      email: "lorenjohna@gmail.com",
      phone: "+1 555-225-4488",
      disease: "Heart Attack",
      appointmentDate: "05 Nov, 2025",
      checked: false,
    },
    {
      id: "2",
      userId: "#002",
      name: "Skyler White",
      avatar: "/images/users/user34.jpg",
      email: "skylerwhite@gmail.com",
      phone: "+1 555-123-4567",
      disease: "HBP",
      appointmentDate: "04 Nov, 2025",
      checked: false,
    },
    {
      id: "3",
      userId: "#003",
      name: "Jonathon Watson",
      avatar: "/images/users/user35.jpg",
      email: "jonathonwatson@gmail.com",
      phone: "+1 555-987-6543",
      disease: "Chest Pain",
      appointmentDate: "03 Nov, 2025",
      checked: false,
    },
    {
      id: "4",
      userId: "#004",
      name: "Walter White",
      avatar: "/images/users/user36.jpg",
      email: "walterwhite@gmail.com",
      phone: "+1 555-456-7890",
      disease: "Breathing Problem",
      appointmentDate: "03 Nov, 2025",
      checked: false,
    },
    {
      id: "5",
      userId: "#005",
      name: "David Carlen",
      avatar: "/images/users/user37.jpg",
      email: "davidcarlen@gmail.com",
      phone: "+1 555-369-7878",
      disease: "Minor Heart Attack",
      appointmentDate: "02 Nov, 2025",
      checked: false,
    },
    {
      id: "6",
      userId: "#006",
      name: "Sarah Johnson",
      avatar: "/images/users/user38.jpg",
      email: "sarahjohnson@gmail.com",
      phone: "+1 555-111-2222",
      disease: "Diabetes",
      appointmentDate: "01 Nov, 2025",
      checked: false,
    },
    {
      id: "7",
      userId: "#007",
      name: "Michael Brown",
      avatar: "/images/users/user39.jpg",
      email: "michaelbrown@gmail.com",
      phone: "+1 555-333-4444",
      disease: "Migraine",
      appointmentDate: "31 Oct, 2025",
      checked: false,
    },
    {
      id: "8",
      userId: "#008",
      name: "Emily Davis",
      avatar: "/images/users/user40.jpg",
      email: "emilydavis@gmail.com",
      phone: "+1 555-555-6666",
      disease: "Allergy",
      appointmentDate: "30 Oct, 2025",
      checked: false,
    },
    {
      id: "9",
      userId: "#009",
      name: "Andrew Scott",
      avatar: "/images/users/user41.jpg",
      email: "andrewscott@gmail.com",
      phone: "+1 555-777-8888",
      disease: "Asthma",
      appointmentDate: "29 Oct, 2025",
      checked: false,
    },
    {
      id: "10",
      userId: "#010",
      name: "Nina Patel",
      avatar: "/images/users/user42.jpg",
      email: "ninapatel@gmail.com",
      phone: "+1 555-999-0000",
      disease: "Thyroid",
      appointmentDate: "28 Oct, 2025",
      checked: false,
    },
    {
      id: "11",
      userId: "#011",
      name: "Jake Sullivan",
      avatar: "/images/users/user43.jpg",
      email: "jakesullivan@gmail.com",
      phone: "+1 555-654-3210",
      disease: "Anemia",
      appointmentDate: "27 Oct, 2025",
      checked: false,
    },
    {
      id: "12",
      userId: "#012",
      name: "Sophia Lee",
      avatar: "/images/users/user44.jpg",
      email: "sophialee@gmail.com",
      phone: "+1 555-432-1098",
      disease: "Arthritis",
      appointmentDate: "26 Oct, 2025",
      checked: false,
    },
    {
      id: "13",
      userId: "#013",
      name: "Liam Miller",
      avatar: "/images/users/user45.jpg",
      email: "liammiller@gmail.com",
      phone: "+1 555-321-6789",
      disease: "Ulcer",
      appointmentDate: "25 Oct, 2025",
      checked: false,
    },
    {
      id: "14",
      userId: "#014",
      name: "Grace Kim",
      avatar: "/images/users/user46.jpg",
      email: "gracekim@gmail.com",
      phone: "+1 555-888-2222",
      disease: "Cough & Cold",
      appointmentDate: "24 Oct, 2025",
      checked: false,
    },
    {
      id: "15",
      userId: "#015",
      name: "Ethan Clark",
      avatar: "/images/users/user47.jpg",
      email: "ethanclark@gmail.com",
      phone: "+1 555-111-3333",
      disease: "Back Pain",
      appointmentDate: "23 Oct, 2025",
      checked: false,
    },
    {
      id: "16",
      userId: "#016",
      name: "Olivia Moore",
      avatar: "/images/users/user48.jpg",
      email: "oliviamoore@gmail.com",
      phone: "+1 555-444-5555",
      disease: "Sinus",
      appointmentDate: "22 Oct, 2025",
      checked: false,
    },
    {
      id: "17",
      userId: "#017",
      name: "Benjamin Lee",
      avatar: "/images/users/user49.jpg",
      email: "benjaminlee@gmail.com",
      phone: "+1 555-666-7777",
      disease: "Depression",
      appointmentDate: "21 Oct, 2025",
      checked: false,
    },
    {
      id: "18",
      userId: "#018",
      name: "Ava Thompson",
      avatar: "/images/users/user50.jpg",
      email: "avathompson@gmail.com",
      phone: "+1 555-888-9999",
      disease: "Insomnia",
      appointmentDate: "20 Oct, 2025",
      checked: false,
    },
    {
      id: "19",
      userId: "#019",
      name: "Lucas Harris",
      avatar: "/images/users/user51.jpg",
      email: "lucasharris@gmail.com",
      phone: "+1 555-777-6666",
      disease: "Cold",
      appointmentDate: "19 Oct, 2025",
      checked: false,
    },
    {
      id: "20",
      userId: "#020",
      name: "Charlotte Walker",
      avatar: "/images/users/user52.jpg",
      email: "charlottewalker@gmail.com",
      phone: "+1 555-555-4444",
      disease: "Flu",
      appointmentDate: "18 Oct, 2025",
      checked: false,
    },
  ]);

  // State management
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(allPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination
  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Search functionality
  useEffect(() => {
    const results = allPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, allPatients]); // Added allPatients to dependencies

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setAllPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === id ? { ...patient, checked: !patient.checked } : patient
      )
    );
    setFilteredPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === id ? { ...patient, checked: !patient.checked } : patient
      )
    );
  };

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAllPatients(prevPatients =>
      prevPatients.map(patient => ({ ...patient, checked: isChecked }))
    );
    setFilteredPatients(prevPatients =>
      prevPatients.map(patient => ({ ...patient, checked: isChecked }))
    );
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
                placeholder="Search here..."
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <Link
              href="/doctor/add-patient"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Patient
              </span>
            </Link>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    <div className="flex items-center gap-[10px]">
                      <div className="form-check relative top-[1.2px]">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={
                            filteredPatients.length > 0 &&
                            filteredPatients.every((p) => p.checked)
                          }
                          onChange={handleSelectAll}
                        />
                      </div>
                      Code
                    </div>
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Patient
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Email
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Phone No.
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Disease
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Appoint. Date
                  </th>
                  <th className="whitespace-nowrap uppercase text-[10px] font-bold tracking-[1px] ltr:text-left rtl:text-right pt-0 pb-[12.5px] px-[20px] text-gray-500 dark:text-gray-400 ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:first:pl-0">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-black dark:text-white">
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          <div className="form-check relative top-[1.2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={patient.checked || false}
                              onChange={() => handleCheckboxChange(patient.id)}
                            />
                          </div>
                          <span className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {patient.userId}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[10px]">
                          <div className="rounded-full w-[35px]">
                            <Image
                              src={patient.avatar}
                              width={35}
                              height={35}
                              className="inline-block rounded-full"
                              alt="user-image"
                            />
                          </div>
                          <span className="font-semibold inline-block">
                            {patient.name}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-primary-500">
                          {patient.email}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.phone}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.disease}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {patient.appointmentDate}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[12.5px] ltr:first:pl-0 rtl:first:pr-0 border-b border-primary-50 dark:border-[#172036] ltr:last:pr-0 rtl:last:pl-0">
                        <div className="flex items-center gap-[9px]">
                          <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>
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
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No patients found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-[12.5px] sm:flex sm:items-center justify-between">
            <p className="!mb-0 !text-xs">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} results
            </p>
            <ol className="mt-[10px] sm:mt-0 flex items-center">
              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                    currentPage === 1
                      ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
                >
                  <span className="opacity-0">0</span>
                  <i className="material-symbols-outlined left-0 right-0 absolute top-1/2 -translate-y-1/2">
                    chevron_left
                  </i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                  >
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md ${
                        currentPage === page
                          ? "border border-primary-500 bg-primary-500 text-white"
                          : "border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${
                    currentPage === totalPages
                      ? "border-gray-200 dark:border-[#172036] text-gray-400 cursor-not-allowed"
                      : "border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  }`}
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
    </>
  );
};

export default PatientsListTable;
