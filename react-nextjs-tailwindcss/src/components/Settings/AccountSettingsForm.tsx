"use client";

import { useState } from "react";
import Image from "next/image"; 

const AccountSettingsForm: React.FC = () => {
  // Upload image
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
      <form>
        <h5 className="!text-lg !mb-[6px]">Profile</h5>
        <p className="mb-[20px] md:mb-[25px]">
          Update your photo and personal details here.
        </p>

        <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              First Name
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="Olivia"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Last Name
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="John"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Email Address
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="olivia@trezo.com"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Phone Number
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="+1 444 555 6699"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Address
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="84 S. Arrowhead Court Branford"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Country
            </label>
            <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
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

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Date Of Birth
            </label>
            <input
              type="date"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="1987-01-08"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Gender
            </label>
            <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
              <option value="0">Select</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Custom</option>
            </select>
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Your Skills
            </label>
            <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
              <option value="0">Select</option>
              <option value="1">Leadership</option>
              <option value="2">Project Management</option>
              <option value="3">Data Analysis</option>
              <option value="4">Teamwork</option>
              <option value="5">Web Development</option>
            </select>
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Your Profession
            </label>
            <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
              <option value="0">Select</option>
              <option value="1">Financial Manager</option>
              <option value="2">IT Manager</option>
              <option value="3">Software Developer</option>
              <option value="4">Physician Assistant</option>
              <option value="5">Data Scientist</option>
            </select>
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Company Name
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="Trezo Admin"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Company Website
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="http://website.com/"
            />
          </div>

          <div className="sm:col-span-2 mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Add Your Bio
            </label>
            <textarea
              className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="It makes me feel..."
            ></textarea>
          </div>
        </div>

        <h5 className="!text-lg !mb-[6px] !mt-[20px] md:!mt-[25px]">Profile</h5>
        <p className="mb-[20px] md:mb-[25px]">
          This will be displayed on your profile.
        </p>

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

        <h5 className="!text-lg !mb-[20px] !mt-[20px] md:!mt-[25px]">
          Socials Profile
        </h5>
        <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Facebook
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="https://www.facebook.com/"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              X
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="https://x.com/"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              LinkedIn
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="https://www.linkedin.com/"
            />
          </div>

          <div className="mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              YouTube
            </label>
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              defaultValue="https://www.youtube.com/"
            />
          </div>
        </div>

        <div className="mt-[20px] md:mt-[25px]">
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
                check
              </i>
              Update Profile
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default AccountSettingsForm;
