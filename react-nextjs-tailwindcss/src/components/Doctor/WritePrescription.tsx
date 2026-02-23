"use client";

import React, { useState } from "react";
import Image from "next/image";

const WritePrescription: React.FC = () => {
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
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="sm:flex justify-between">
            <div>
              <h4 className="!mb-[7px] !text-[20px] !font-semibold">
                Dr. Walter White
              </h4>
              <span className="block md:text-md mt-[5px]">
                MBBS, MD, MS (Reg No: 321456)
              </span>
              <span className="block md:text-md mt-[5px] text-black dark:text-white">
                Mobile No: +321 4567 5643
              </span>
            </div>

            <div className="mt-[20px] sm:mt-0">
              <Image
                src="/images/logo.svg"
                alt="logo"
                className="mb-[10px] dark:hidden"
                width={100}
                height={26}
              />
              <Image
                src="/images/white-logo.svg"
                alt="logo"
                className="mb-[10px] hidden dark:block"
                width={100}
                height={26}
              />
              <span className="block md:text-md mt-[5px]">
                S. Arrowhead Court Branford9
              </span>
              <span className="block md:text-md mt-[5px]">+1 444 266 5599</span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-[#172036] -mx-[20px] md:-mx-[25px] my-[20px] md:my-[23px]"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
            <div className="sm:col-span-2">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Select Date
              </label>
              <input
                type="date"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient ID
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter Patient ID"
              />
            </div>

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient First Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter First Name"
              />
            </div>

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient Last Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Patient Address
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter Address"
              />
            </div>

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Temperature (Farenhite)
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter Temperature"
              />
            </div>

            <div>
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Blood Pressure
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter Blood Pressure"
              />
            </div>
          </div>

          <div className="my-[20px] md:my-[25px] -mx-[20px] md:-mx-[25px]">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Medicine Name
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Dosage
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                    <th className="text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-[1] align-middle text-base font-normal ltr:text-left rtl:text-right py-[14px] px-[20px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-t border-b border-gray-100 dark:border-[#15203c]">
                      Duration
                      <div className="absolute top-0 left-0 right-0 bottom-0 -z-[1] bg-gray-50 dark:bg-[#15203c] my-[4px]"></div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-b border-gray-100 dark:border-[#15203c]">
                      <input
                        type="text"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-[200px] md:w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        placeholder="Enter Medicine Name"
                      />
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-b border-gray-100 dark:border-[#15203c]">
                      <input
                        type="text"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-[200px] md:w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 mb-[10px] last:mb-0"
                        placeholder="Morning: 01 Tablet"
                      />
                      <input
                        type="text"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-[200px] md:w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 mb-[10px] last:mb-0"
                        placeholder="Night: 01 Tablet"
                      />
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-b border-gray-100 dark:border-[#15203c]">
                      <input
                        type="text"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-[200px] md:w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 mb-[10px] last:mb-0"
                        placeholder="Enter Total Days"
                      />
                      <input
                        type="text"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-[200px] md:w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 mb-[10px] last:mb-0"
                        placeholder="Enter Total Tablets"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-b border-gray-100 dark:border-[#15203c]">
                      <button
                        className="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400"
                        type="button"
                      >
                        + Add More Medicine
                      </button>
                    </td>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-b border-gray-100 dark:border-[#15203c]"></td>
                    <td className="ltr:text-left rtl:text-right align-top whitespace-nowrap px-[20px] py-[18px] ltr:first:pl-[20px] rtl:first:pr-[20px] ltr:md:first:pl-[25px] rtl:md:first:pr-[25px] border-b border-gray-100 dark:border-[#15203c]"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[25px]">
            <div className="sm:col-span-2">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Advice
              </label>
              <textarea
                className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="It makes me feel..."
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Upload Signature
              </label>
              <div id="fileUploader">
                <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
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
                    <div key={index} className="relative w-[50px] h-[50px]">
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

          <div className="mt-[20px] md:mt-[25px] text-center md:text-right">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400 mx-[8px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
            >
              Cancel
            </button>

            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 mx-[8px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  add
                </i>
                Create Prescription
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WritePrescription;
