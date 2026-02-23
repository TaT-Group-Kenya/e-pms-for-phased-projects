"use client";

import React, { useState } from "react"; 

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

const CreateNFTForm: React.FC = () => {
  // State to store uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9), // Generate a unique ID
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Handle file removal
  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  return (
    <>
      <form>
        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-content">
            <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-[25px]">
              <div className="sm:col-span-3 mb-[20px] sm:mb-0">
                <label className="mb-[15px] text-black dark:text-white text-lg font-bold block">
                  Upload Image, Video, Audio, or 3D Model
                </label>

                <div id="fileUploader">
                  <div className="relative flex items-center overflow-hidden rounded-[4px] py-[35px] px-[30px] bg-gray-100 dark:bg-[#0a0e19] border-[2px] border-dashed border-secondary-400 dark:border-[#172036]">
                    <div className="flex items-center gap-[15px]">
                      <div className="text-primary-500 text-4xl">
                        <i className="ri-file-upload-line"></i>
                      </div>
                      <div>
                        <p className="!leading-[1.5] !mb-[3px]">
                          <strong className="text-black dark:text-white">
                            Click to upload
                          </strong>{" "}
                          you file here
                        </p>
                        <p className="text-xs">
                          Upload upto 12 files, max size each file: 5MB.
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                    />
                  </div>
                  
                  {/* Display uploaded files */}
                  <ul id="fileList" className="mt-[20px]">
                    {uploadedFiles.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between p-[10px] bg-gray-50 dark:bg-[#0a0e19] rounded-md mb-[10px]"
                      >
                        <div>
                          <p className="text-black dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="sm:col-span-3 mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-gray-500 dark:text-white font-semibold block">
                  Product Name <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  defaultValue="Christmas Eve"
                />
              </div>

              <div className="sm:col-span-3 mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-gray-500 dark:text-white font-semibold block">
                  Description
                </label>
                <textarea className="h-[140px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"></textarea>
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-gray-500 dark:text-white font-semibold block">
                  Item Price
                </label>
                <input
                  type="text"
                  className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  defaultValue="12.50 ETH"
                />
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-gray-500 dark:text-white font-semibold block">
                  Size
                </label>
                <input
                  type="text"
                  className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  defaultValue="2.50 MB"
                />
              </div>

              <div className="mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-gray-500 dark:text-white font-semibold block">
                  Properties
                </label>
                <input
                  type="text"
                  className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="sm:col-span-3 mb-[20px] sm:mb-0">
                <label className="mb-[10px] text-gray-500 dark:text-white font-semibold block">
                  External Link
                </label>
                <input
                  type="text"
                  className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="sm:col-span-3 mb-[20px] sm:mb-0">
                <div className="flex items-center gap-[20px]">
                  <div className="form-radio flex items-center gap-[8px]">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      name="whoWillSeeMyProfile"
                      id="onlyMe"
                      defaultChecked
                    />
                    <label
                      className="inline-block font-medium text-gray-900 dark:text-gray-400 cursor-pointer"
                      htmlFor="onlyMe"
                    >
                      Put On Sale
                    </label>
                  </div>

                  <div className="form-radio flex items-center gap-[8px]">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      name="whoWillSeeMyProfile"
                      id="myFollowers"
                    />
                    <label
                      className="inline-block font-medium text-gray-900 dark:text-gray-400 cursor-pointer"
                      htmlFor="myFollowers"
                    >
                      Instant Sale Price
                    </label>
                  </div>

                  <div className="form-radio flex items-center gap-[8px]">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      name="whoWillSeeMyProfile"
                      id="everyone"
                    />
                    <label
                      className="inline-block font-medium text-gray-900 dark:text-gray-400 cursor-pointer"
                      htmlFor="everyone"
                    >
                      Unlock One Purchased
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="trezo-card mb-[25px]">
          <div className="trezo-card-content">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
            >
              Cancel
            </button>

            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  add
                </i>
                Create NFT
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateNFTForm;
