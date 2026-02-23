"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface Guest {
  id: string;
  code: string;
  name: string;
  image: string;
  checkIn: string;
  checkOut: string;
  room: string;
  totalBill: string;
  paymentStatus: "Completed" | "Pending" | "Failed";
}

const GuestsListTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Sample data
  const initialGuests: Guest[] = [
    {
      id: "1",
      code: "#001",
      name: "Joanna Watson",
      image: "/images/users/user1.jpg",
      checkIn: "Nov 01, 25 - 09:42 AM",
      checkOut: "Nov 03, 25 - 09:42 AM",
      room: "G0-12",
      totalBill: "$166.00",
      paymentStatus: "Completed",
    },
    {
      id: "2",
      code: "#002",
      name: "Orion Vale",
      image: "/images/users/user2.jpg",
      checkIn: "Nov 02, 25 - 10:08 AM",
      checkOut: "Nov 05, 25 - 10:08 AM",
      room: "L1-15",
      totalBill: "$158.50",
      paymentStatus: "Pending",
    },
    {
      id: "3",
      code: "#003",
      name: "Seraphina Nyx",
      image: "/images/users/user3.jpg",
      checkIn: "Nov 03, 25 - 11:12 AM",
      checkOut: "Nov 07, 25 - 11:12 AM",
      room: "L2-27",
      totalBill: "$250.50",
      paymentStatus: "Failed",
    },
    {
      id: "4",
      code: "#004",
      name: "Michael Brown",
      image: "/images/users/user4.jpg",
      checkIn: "Nov 04, 25 - 12:30 PM",
      checkOut: "Nov 06, 25 - 12:30 PM",
      room: "G0-15",
      totalBill: "$175.00",
      paymentStatus: "Completed",
    },
    {
      id: "5",
      code: "#005",
      name: "Emily Davis",
      image: "/images/users/user5.jpg",
      checkIn: "Nov 05, 25 - 01:45 PM",
      checkOut: "Nov 08, 25 - 01:45 PM",
      room: "L1-18",
      totalBill: "$210.00",
      paymentStatus: "Pending",
    },
    {
      id: "6",
      code: "#006",
      name: "David Wilson",
      image: "/images/users/user6.jpg",
      checkIn: "Nov 06, 25 - 02:15 PM",
      checkOut: "Nov 09, 25 - 02:15 PM",
      room: "L2-22",
      totalBill: "$195.50",
      paymentStatus: "Completed",
    },
    {
      id: "7",
      code: "#007",
      name: "Sophia Turner",
      image: "/images/users/user7.jpg",
      checkIn: "Nov 07, 25 - 03:00 PM",
      checkOut: "Nov 10, 25 - 03:00 PM",
      room: "L3-30",
      totalBill: "$215.00",
      paymentStatus: "Completed",
    },
    {
      id: "8",
      code: "#008",
      name: "Liam Harris",
      image: "/images/users/user8.jpg",
      checkIn: "Nov 08, 25 - 04:10 PM",
      checkOut: "Nov 11, 25 - 04:10 PM",
      room: "G1-05",
      totalBill: "$189.99",
      paymentStatus: "Pending",
    },
    {
      id: "9",
      code: "#009",
      name: "Ava Martin",
      image: "/images/users/user9.jpg",
      checkIn: "Nov 09, 25 - 05:20 PM",
      checkOut: "Nov 12, 25 - 05:20 PM",
      room: "L2-09",
      totalBill: "$205.75",
      paymentStatus: "Completed",
    },
    {
      id: "10",
      code: "#010",
      name: "Noah Anderson",
      image: "/images/users/user10.jpg",
      checkIn: "Nov 10, 25 - 06:00 PM",
      checkOut: "Nov 13, 25 - 06:00 PM",
      room: "G2-01",
      totalBill: "$180.20",
      paymentStatus: "Failed",
    },
    {
      id: "11",
      code: "#011",
      name: "Chloe Moore",
      image: "/images/users/user11.jpg",
      checkIn: "Nov 11, 25 - 08:30 AM",
      checkOut: "Nov 14, 25 - 08:30 AM",
      room: "L1-10",
      totalBill: "$160.00",
      paymentStatus: "Completed",
    },
    {
      id: "12",
      code: "#012",
      name: "Ethan Lee",
      image: "/images/users/user12.jpg",
      checkIn: "Nov 12, 25 - 09:45 AM",
      checkOut: "Nov 15, 25 - 09:45 AM",
      room: "L3-03",
      totalBill: "$225.00",
      paymentStatus: "Pending",
    },
    {
      id: "13",
      code: "#013",
      name: "Grace Allen",
      image: "/images/users/user13.jpg",
      checkIn: "Nov 13, 25 - 10:00 AM",
      checkOut: "Nov 16, 25 - 10:00 AM",
      room: "L2-12",
      totalBill: "$190.00",
      paymentStatus: "Completed",
    },
    {
      id: "14",
      code: "#014",
      name: "Lucas Scott",
      image: "/images/users/user14.jpg",
      checkIn: "Nov 14, 25 - 11:30 AM",
      checkOut: "Nov 17, 25 - 11:30 AM",
      room: "L3-21",
      totalBill: "$230.00",
      paymentStatus: "Pending",
    },
    {
      id: "15",
      code: "#015",
      name: "Isabella King",
      image: "/images/users/user15.jpg",
      checkIn: "Nov 15, 25 - 12:00 PM",
      checkOut: "Nov 18, 25 - 12:00 PM",
      room: "G0-10",
      totalBill: "$245.00",
      paymentStatus: "Completed",
    },
    {
      id: "16",
      code: "#016",
      name: "Mason Green",
      image: "/images/users/user16.jpg",
      checkIn: "Nov 16, 25 - 01:15 PM",
      checkOut: "Nov 19, 25 - 01:15 PM",
      room: "L1-01",
      totalBill: "$188.00",
      paymentStatus: "Completed",
    },
    {
      id: "17",
      code: "#017",
      name: "Mia Baker",
      image: "/images/users/user17.jpg",
      checkIn: "Nov 17, 25 - 02:30 PM",
      checkOut: "Nov 20, 25 - 02:30 PM",
      room: "L2-08",
      totalBill: "$210.00",
      paymentStatus: "Pending",
    },
    {
      id: "18",
      code: "#018",
      name: "Logan Hill",
      image: "/images/users/user18.jpg",
      checkIn: "Nov 18, 25 - 03:45 PM",
      checkOut: "Nov 21, 25 - 03:45 PM",
      room: "G1-11",
      totalBill: "$198.00",
      paymentStatus: "Completed",
    },
    {
      id: "19",
      code: "#019",
      name: "Ella Reed",
      image: "/images/users/user19.jpg",
      checkIn: "Nov 19, 25 - 04:00 PM",
      checkOut: "Nov 22, 25 - 04:00 PM",
      room: "L3-14",
      totalBill: "$176.00",
      paymentStatus: "Failed",
    },
    {
      id: "20",
      code: "#020",
      name: "Henry Adams",
      image: "/images/users/user20.jpg",
      checkIn: "Nov 20, 25 - 05:20 PM",
      checkOut: "Nov 23, 25 - 05:20 PM",
      room: "L1-06",
      totalBill: "$200.00",
      paymentStatus: "Completed",
    },
  ];

  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 10;

  // Filter guests based on search term
  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest
  );
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  // Handle guest selection
  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    );
  };

  // Handle select all/none for current page
  const toggleSelectAll = () => {
    if (selectedGuests.length === currentGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(currentGuests.map((guest) => guest.id));
    }
  };

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle guest deletion
  const deleteGuest = (guestId: string) => {
    setGuests(guests.filter((guest) => guest.id !== guestId));
    // Also remove from selected guests if present
    setSelectedGuests(selectedGuests.filter((id) => id !== guestId));
  };

  // Handle multiple guest deletion
  const deleteSelectedGuests = () => {
    setGuests(guests.filter((guest) => !selectedGuests.includes(guest.id)));
    setSelectedGuests([]);
    // Reset to first page if current page becomes empty
    if (currentGuests.length === selectedGuests.length && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get payment status styling
  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-success-600 border-success-600 bg-success-100";
      case "Pending":
        return "text-warning-600 border-warning-600 bg-warning-50";
      case "Failed":
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
                placeholder="Search here..."
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
            {selectedGuests.length > 0 && (
              <button
                type="button"
                className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-danger-500 border border-danger-500 hover:bg-danger-500 hover:text-white"
                onClick={deleteSelectedGuests}
              >
                <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                  <i className="material-symbols-outlined !text-[20px] absolute ltr:-left-[3px] rtl:-right-[3px] top-1/2 -translate-y-1/2">
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
                Add New Guest
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
                            selectedGuests.length > 0 &&
                            selectedGuests.length === currentGuests.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </div>
                      Code
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Guest Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Check In
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Check Out
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Room
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Total Bill
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tr-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Payment Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tr-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentGuests.length > 0 ? (
                  currentGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[10px]">
                          <div className="form-check relative top-[2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedGuests.includes(guest.id)}
                              onChange={() => toggleGuestSelection(guest.id)}
                            />
                          </div>
                          {guest.code}
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[12px]">
                          <Image
                            src={guest.image}
                            width={40}
                            height={40}
                            className="inline-block rounded-full"
                            alt="user-image"
                          />
                          <span className="block font-semibold">
                            {guest.name}
                          </span>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {guest.checkIn}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {guest.checkOut}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {guest.room}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {guest.totalBill}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <span
                          className={`inline-block text-xs font-medium px-[8px] border rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c] ${getPaymentStatusStyle(
                            guest.paymentStatus
                          )}`}
                        >
                          {guest.paymentStatus}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[9px]">
                          <button
                            type="button"
                            className="text-primary-500 leading-none custom-tooltip"
                            id="customTooltip"
                            data-text="View"
                          >
                            <i className="material-symbols-outlined !text-md">
                              visibility
                            </i>
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                            id="customTooltip"
                            data-text="Edit"
                          >
                            <i className="material-symbols-outlined !text-md">
                              edit
                            </i>
                          </button>
                          <button
                            type="button"
                            className="text-danger-500 leading-none custom-tooltip"
                            id="customTooltip"
                            data-text="Delete"
                            onClick={() => deleteGuest(guest.id)}
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
                      colSpan={8}
                      className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l"
                    >
                      No guests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[15px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              Showing {indexOfFirstGuest + 1} to{" "}
              {Math.min(indexOfLastGuest, filteredGuests.length)} of{" "}
              {filteredGuests.length} results
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

      {/* Add New Guest Modal */}
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
                    <h5 className="!mb-0">Add New Guest</h5>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-[20px] md:gap-[25px]">
                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Code
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="#001"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Guest Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Check In
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Check Out
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Room
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="G0-12"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Total Bill
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="$250.00"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Payment Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Completed</option>
                          <option value="2">Pending</option>
                          <option value="3">Failed</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Avatar
                        </label>
                        <div id="fileUploader">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[48px] px-[20px] border border-gray-200 dark:border-[#172036]">
                            <div className="flex items-center justify-center">
                              <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                                <i className="ri-upload-2-line"></i>
                              </div>
                              <p className="!leading-[1.5]">
                                <strong className="text-black dark:text-white">
                                  Click to upload
                                </strong>
                                <br /> you file here
                              </p>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              multiple
                              className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                            />
                          </div>
                          <ul id="fileList"></ul>
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

export default GuestsListTable;
