"use client";

import React, { useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const appointments = [
  {
    time: "10:00 AM",
    description: "Appointment With Cardiac Patient",
    user: {
      name: "Jonathon Ronan",
      image: "/images/users/user32.jpg",
    },
    status: "done",
    bgColor: "bg-primary-50",
    textColor: "text-primary-500",
    icon: "/images/icons/done.svg",
  },
  {
    time: "12:00 PM",
    description: "Board Meeting With",
    user: {
      name: "Jessy Pinkman",
      image: "/images/users/user33.jpg",
    },
    status: "done",
    bgColor: "bg-info-50",
    textColor: "text-info-500",
    icon: "/images/icons/done.svg",
  },
  {
    time: "02:00 PM",
    description: "Major Cardiac Surgery of the Patient",
    user: {
      name: "Walter White",
      image: "/images/users/user34.jpg",
    },
    status: "upcoming",
    bgColor: "bg-secondary-50",
    textColor: "text-secondary-500",
    icon: "/images/icons/not-done.svg",
  },
];

const AppointmentsContent: React.FC = () => {
  // Calendar
  const [value, onChange] = useState<Value>(new Date());

  // Modal
  const [open, setOpen] = useState(false);

  // Upload images
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-1">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Today&apos;s Schedule</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              <Calendar
                onChange={onChange}
                value={value}
                className="working-schedule-calendar"
              />
            </div>
          </div>

          <button
            type="button"
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
            onClick={() => setOpen(true)}
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                add
              </i>
              Add A Schedule
            </span>
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
            <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
              <div className="trezo-card-title">
                <h5 className="!mb-0">Today&apos;s Appointments</h5>
              </div>
            </div>
            <div className="trezo-card-content">
              {appointments.map((appt, index) => (
                <div
                  key={index}
                  className={`p-[20px] rounded-md relative z-[1] ${appt.bgColor} dark:bg-[#172036] ltr:ml-[40px] rtl:mr-[40px] mb-[20px] last:mb-0`}
                >
                  <div className="absolute ltr:-left-[40px] rtl:-right-[40px] top-1/2 -translate-y-1/2">
                    <Image
                      src={appt.icon}
                      alt={appt.status}
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-[12px] mb-[7px]">
                        <span className="block text-black dark:text-white font-semibold">
                          {appt.time}
                        </span>
                        {appt.status === "upcoming" && (
                          <>
                            <button
                              className="flex items-center justify-center bg-secondary-500 text-white transition-all rounded-full w-[28px] h-[28px]"
                              type="button"
                            >
                              <i className="ri-notification-2-line"></i>
                            </button>
                            <span className="inline-block text-xs px-[9px] text-secondary-500 font-medium bg-white dark:bg-dark rounded-[100px]">
                              Upcoming
                            </span>
                          </>
                        )}
                      </div>
                      <p className="mb-[12px]">{appt.description}</p>
                      <div className="flex items-center gap-[8px]">
                        <Image
                          src={appt.user.image}
                          alt="user-image"
                          className="rounded-full w-[30px] border border-white dark:border-dark"
                          width={30}
                          height={30}
                        />
                        <span className="block text-[13px] text-black dark:text-white font-semibold">
                          {appt.user.name}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`inline-block py-[6.5px] px-[17px] font-medium transition-all bg-white dark:bg-dark ${appt.textColor} rounded-md hover:${appt.textColor} hover:text-white`}
                      type="button"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="-mt-[20px] absolute ltr:-left-[28px] rtl:-right-[28px] top-0 bottom-0 w-[1px] bg-gray-100 dark:bg-[#172036] -z-[1]"></div>

                  <Image
                    src="/images/icons/vector.png"
                    className="absolute top-0 -z-[1] left-0 right-0 text-center mx-auto dark:opacity-[0.2]"
                    alt="vector"
                    width={124}
                    height={35}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add A Schedule Modal */}
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
                    <h5 className="!mb-0">Add A Schedule</h5>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Select Date
                        </label>
                        <input
                          type="date"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Select Time
                        </label>
                        <input
                          type="time"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Schedule Type
                        </label>
                        <select className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500">
                          <option>Select</option>
                          <option>Appointment with Patient</option>
                          <option>Group Meeting</option>
                          <option>Team Meeting</option>
                          <option>Client Meeting</option>
                          <option>Doctor Meeting</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="Jonathon Ronan"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Set Alarm
                        </label>
                        <input
                          type="text"
                          className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="09:05 AM"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-[10px] text-black dark:text-white font-medium block">
                          Patient Avatar
                        </label>
                        <div id="fileUploader">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[50px] px-[20px] border border-gray-200 dark:border-[#172036]">
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
                              multiple
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
                          Add Schedule
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

export default AppointmentsContent;
