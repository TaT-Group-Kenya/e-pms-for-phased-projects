"use client";

import React, { useState } from "react"; 
import Image from "next/image";

const CampaignDetails: React.FC = () => {
  // State for form inputs
  const [campaignName, setCampaignName] = useState("Christmas Eve");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [campaignGoal, setCampaignGoal] = useState("getMoreVisitors");

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Campaign Name:", campaignName);
    console.log("Selected File:", selectedFile);
    console.log("Campaign Goal:", campaignGoal);
    // Add your form submission logic here
  };

  return (
    <>
      <h3 className="!mb-[20px] md:!mb-[25px] lg:!mb-[35px] !text-gray-900 dark:!text-gray-400 !text-lg">
        Campaign Details
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-[20px] lg:mb-[45px]">
          <label className="mb-[10px] text-gray-500 dark:text-white font-medium block">
            Campaign Name <span className="text-orange-600">*</span>
          </label>
          <input
            type="text"
            className="h-[55px] font-medium md:text-md rounded-[4px] text-gray-900 dark:text-white border border-gray-100 dark:border-[#0a0e19] bg-gray-100 dark:bg-[#0a0e19] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>

        <div className="mb-[20px] lg:mb-[45px]" id="fileUploader">
          <label className="mb-[10px] text-gray-500 dark:text-white font-medium block">
            Company Logo <span className="text-orange-600">*</span>
          </label>
          <div className="relative inline-block pb-[15px] ltr:pr-[15px] rtl:pl-[15px]">
            <div className="bg-gray-100 dark:bg-[#0a0e19] w-[134px] h-[134px] rounded-[4px] text-gray-400 flex items-center justify-center">
              {selectedFile ? (
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Company Logo"
                  className="w-full h-full object-cover rounded-[4px]"
                  width={134}
                  height={134}
                />
              ) : (
                <i className="material-symbols-outlined !text-[42px]">
                  perm_media
                </i>
              )}
            </div>
            <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-[49px] h-[49px] bg-white rounded-full flex items-center justify-center text-primary-500 shadow-xl dark:bg-[#0c1427]">
              <i className="material-symbols-outlined">add</i>
            </div>
            <input
              type="file"
              id="fileInput"
              className="absolute top-0 left-0 right-0 bottom-0 z-[1] opacity-0 cursor-pointer"
              onChange={handleFileChange}
              required
            />
          </div>
          <span className="block mt-[10px] text-gray-400">
            Allowed file types: png, jpg, jpeg. Max size: 1 MB
          </span>
          {selectedFile && (
            <ul id="fileList">
              <li>{selectedFile.name}</li>
            </ul>
          )}
        </div>

        <div className="mb-[20px] lg:mb-[45px]">
          <label className="mb-[20px] text-gray-500 dark:text-white font-semibold block">
            Campaign Goal <span className="text-orange-600">*</span>
          </label>
          {[
            {
              id: "getMoreVisitors",
              label: "Get more visitors",
              description: "Increase impression traffic onto the platform",
            },
            {
              id: "getMoreMessagesOnChat",
              label: "Get more messages on chat",
              description: "Increase community interaction and communication",
            },
            {
              id: "getMoreCalls",
              label: "Get more calls",
              description:
                "Boost telecommunication feedback to provide precise and accurate information",
            },
            {
              id: "getMoreLikes",
              label: "Get more likes",
              description: "Increase positive interactivity on social media platforms",
            },
            {
              id: "leadGeneration",
              label: "Lead generation",
              description: "Collect contact information for potential customers",
            },
          ].map((goal) => (
            <div
              key={goal.id}
              className="form-radio border-b border-primary-50 dark:border-[#172036] pb-[12px] mb-[12px] last:mb-0"
            >
              <label
                htmlFor={goal.id}
                className="cursor-pointer relative block ltr:pl-[45px] rtl:pr-[45px]"
              >
                <input
                  type="radio"
                  name="campaignGoalRadio"
                  className="absolute ltr:left-[2px] rtl:right-[2px] top-1/2 -translate-y-1/2 scale-[2] w-[26px]"
                  id={goal.id}
                  value={goal.id}
                  checked={campaignGoal === goal.id}
                  onChange={() => setCampaignGoal(goal.id)}
                  required
                />
                <span className="block font-medium mb-[2px] text-gray-900 dark:text-gray-400">
                  {goal.label}
                </span>
                <span className="block text-gray-400">{goal.description}</span>
              </label>
            </div>
          ))}
        </div> 
      </form>
    </>
  );
};

export default CampaignDetails;