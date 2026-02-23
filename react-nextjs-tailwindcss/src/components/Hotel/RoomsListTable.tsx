"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

interface Room {
  id: string;
  code: string;
  name: string;
  hotel: string;
  image: string;
  bedType: string;
  floor: string;
  facilities: string[];
  rate: string;
  status: "Available" | "Not Available";
  viewLink: string;
}

// Sample data
const initialRooms: Room[] = [
  {
    id: "1",
    code: "TRZ-32",
    name: "Serenity Suite",
    hotel: "Elysian Grand",
    image: "/images/rooms/room1.jpg",
    bedType: "Double Bed",
    floor: "G-02",
    facilities: [
      "High-speed Wi-Fi",
      "Comfortable bedding and pillows",
      "Temperature control (AC/heating)",
    ],
    rate: "$157/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "2",
    code: "TRZ-35",
    name: "Cozy Book Nook",
    hotel: "Celestial Haven",
    image: "/images/rooms/room2.jpg",
    bedType: "Single Bed",
    floor: "G-01",
    facilities: [
      "High-speed Wi-Fi",
      "Comfortable bedding and pillows",
      "Temperature control (AC/heating)",
    ],
    rate: "$146/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "3",
    code: "TRZ-37",
    name: "Vintage Studio",
    hotel: "The Aurelia",
    image: "/images/rooms/room4.jpg",
    bedType: "Double Bed",
    floor: "L1-17",
    facilities: [
      "High-speed Wi-Fi",
      "Comfortable bedding and pillows",
      "Temperature control (AC/heating)",
    ],
    rate: "$159/night",
    status: "Not Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "4",
    code: "TRZ-40",
    name: "Ocean Breeze",
    hotel: "Wavefront Inn",
    image: "/images/rooms/room3.jpg",
    bedType: "King Bed",
    floor: "L2-01",
    facilities: ["Balcony", "Mini bar", "Wi-Fi"],
    rate: "$189/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "5",
    code: "TRZ-42",
    name: "Mountain View Retreat",
    hotel: "Highlands Resort",
    image: "/images/rooms/room5.jpg",
    bedType: "Queen Bed",
    floor: "L3-04",
    facilities: ["Mountain view", "Fireplace", "Wi-Fi"],
    rate: "$205/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "6",
    code: "TRZ-45",
    name: "Urban Loft",
    hotel: "Cityscape Hotel",
    image: "/images/rooms/room6.jpg",
    bedType: "Double Bed",
    floor: "L4-10",
    facilities: ["Kitchenette", "Smart TV", "Wi-Fi"],
    rate: "$172/night",
    status: "Not Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "7",
    code: "TRZ-48",
    name: "Royal Chamber",
    hotel: "Palace View",
    image: "/images/rooms/room7.jpg",
    bedType: "King Bed",
    floor: "L5-01",
    facilities: ["Jacuzzi", "Room Service", "Wi-Fi"],
    rate: "$299/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "8",
    code: "TRZ-50",
    name: "Garden Escape",
    hotel: "Flora Inn",
    image: "/images/rooms/room8.jpg",
    bedType: "Queen Bed",
    floor: "G-03",
    facilities: ["Garden Access", "Wi-Fi", "Mini fridge"],
    rate: "$165/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "9",
    code: "TRZ-52",
    name: "Sunset Deluxe",
    hotel: "Sunrise Bay",
    image: "/images/rooms/room9.jpg",
    bedType: "Double Bed",
    floor: "L2-15",
    facilities: ["Sea View", "Mini bar", "Wi-Fi"],
    rate: "$210/night",
    status: "Not Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "10",
    code: "TRZ-55",
    name: "Business Executive",
    hotel: "Metropolitan Suites",
    image: "/images/rooms/room1.jpg",
    bedType: "Single Bed",
    floor: "L1-05",
    facilities: ["Workspace", "Wi-Fi", "Coffee Machine"],
    rate: "$188/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "11",
    code: "TRZ-58",
    name: "Lakeview Room",
    hotel: "Tranquil Waters",
    image: "/images/rooms/room2.jpg",
    bedType: "Queen Bed",
    floor: "L2-02",
    facilities: ["Lake View", "Balcony", "Wi-Fi"],
    rate: "$175/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "12",
    code: "TRZ-60",
    name: "Minimalist Nest",
    hotel: "Nova Stay",
    image: "/images/rooms/room3.jpg",
    bedType: "Single Bed",
    floor: "L3-08",
    facilities: ["Desk", "Smart Lighting", "Wi-Fi"],
    rate: "$130/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "13",
    code: "TRZ-61",
    name: "Boho Studio",
    hotel: "The Nomad",
    image: "/images/rooms/room4.jpg",
    bedType: "Double Bed",
    floor: "L3-10",
    facilities: ["Wi-Fi", "Decorative Lighting", "Sound System"],
    rate: "$158/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "14",
    code: "TRZ-63",
    name: "Luxury King Suite",
    hotel: "Imperial Heights",
    image: "/images/rooms/room5.jpg",
    bedType: "King Bed",
    floor: "L6-01",
    facilities: ["Butler Service", "Spa Access", "Wi-Fi"],
    rate: "$330/night",
    status: "Not Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "15",
    code: "TRZ-66",
    name: "Heritage Corner",
    hotel: "Old Town Inn",
    image: "/images/rooms/room6.jpg",
    bedType: "Double Bed",
    floor: "G-04",
    facilities: ["Wi-Fi", "Historic Decor", "Reading Nook"],
    rate: "$149/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "16",
    code: "TRZ-68",
    name: "Artist Den",
    hotel: "Canvas Suites",
    image: "/images/rooms/room7.jpg",
    bedType: "Queen Bed",
    floor: "L4-03",
    facilities: ["Wi-Fi", "Easel & Canvas", "Ambient Lighting"],
    rate: "$167/night",
    status: "Not Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "17",
    code: "TRZ-70",
    name: "Corporate Comfort",
    hotel: "BizLodge",
    image: "/images/rooms/room8.jpg",
    bedType: "Single Bed",
    floor: "L2-07",
    facilities: ["Wi-Fi", "Printer", "Conference Call Kit"],
    rate: "$190/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "18",
    code: "TRZ-72",
    name: "Family Haven",
    hotel: "Horizon Stay",
    image: "/images/rooms/room9.jpg",
    bedType: "King + Bunk Beds",
    floor: "L1-12",
    facilities: ["TV", "Wi-Fi", "Kid’s Play Corner"],
    rate: "$220/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "19",
    code: "TRZ-74",
    name: "Nature Bliss",
    hotel: "Green Valley Resort",
    image: "/images/rooms/room1.jpg",
    bedType: "Queen Bed",
    floor: "L1-09",
    facilities: ["Terrace", "Eco-friendly Amenities", "Wi-Fi"],
    rate: "$174/night",
    status: "Not Available",
    viewLink: "/hotel/room-details/",
  },
  {
    id: "20",
    code: "TRZ-76",
    name: "Skyline View",
    hotel: "Zenith Towers",
    image: "/images/rooms/room2.jpg",
    bedType: "Double Bed",
    floor: "L8-01",
    facilities: ["Panoramic Windows", "Wi-Fi", "Soundproofing"],
    rate: "$240/night",
    status: "Available",
    viewLink: "/hotel/room-details/",
  },
];

const RoomsListTable: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Table
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  useEffect(() => {
    if (searchTerm === "") {
      setRooms(initialRooms);
    } else {
      const filtered = initialRooms.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.bedType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.floor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRooms(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm]); // ✅ Now no need for initialRooms in the dependency array

  // Handle room selection
  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Handle select all/none
  const toggleSelectAll = () => {
    if (selectedRooms.length === currentRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(currentRooms.map((room) => room.id));
    }
  };

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                Add New Room
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
                            selectedRooms.length > 0 &&
                            selectedRooms.length === currentRooms.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </div>
                      Code
                    </div>
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Room Name
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Bed Type
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Floor
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Facilities
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Rate
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tr-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                    Status
                  </th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tr-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"></th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {currentRooms.length > 0 ? (
                  currentRooms.map((room) => (
                    <tr key={room.id}>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[10px]">
                          <div className="form-check relative top-[2px]">
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={selectedRooms.includes(room.id)}
                              onChange={() => toggleRoomSelection(room.id)}
                            />
                          </div>
                          {room.code}
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[13px]">
                          <div className="rounded-md w-[60px]">
                            <Image
                              src={room.image}
                              width={60}
                              height={60}
                              className="inline-block rounded-md"
                              alt="room-image"
                            />
                          </div>
                          <div>
                            <Link
                              href={room.viewLink}
                              className="font-medium inline-block text-[14px] md:text-[15px] transition-all hover:text-primary-500 mb-[2px]"
                            >
                              {room.name}
                            </Link>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              {room.hotel}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {room.bedType}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {room.floor}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <p className="w-[300px] whitespace-normal text-gray-500 dark:text-gray-400">
                          {room.facilities.join(", ")}
                        </p>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        {room.rate}
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <span
                          className={`inline-block text-xs font-medium px-[8px] ${
                            room.status === "Available"
                              ? "text-success-600 border-success-600 bg-success-100"
                              : "text-danger-600 border-danger-600 bg-danger-100"
                          } border rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c]`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                        <div className="flex items-center gap-[9px]">
                          <Link
                            href={room.viewLink}
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
                      className="text-center whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036]"
                    >
                      No rooms found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-[20px] py-[12px] md:py-[15px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
            <p className="!mb-0 text-sm">
              Showing {indexOfFirstRoom + 1} to{" "}
              {Math.min(indexOfLastRoom, rooms.length)} of {rooms.length}{" "}
              results
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

      {/* Add New Room Modal */}
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
                    <h5 className="!mb-0">Add New Room</h5>
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
                          placeholder="TRZ-32"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Room Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Golden Sun Room"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Level
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="L2-24"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Rate
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="157/night"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Facilities
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="High-speed Wi-Fi, Comfortable bedding and pillows, Temperature control (AC/heating)"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Status
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option value="0">Select</option>
                          <option value="1">Available</option>
                          <option value="2">Not Available</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Upload Room Images
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

export default RoomsListTable;
